from __future__ import annotations

"""Agent 2 – Resume Integration & Compression  (v2)

Changes vs original ✧
─────────────────────────────────────────────────
1. **Input**: accepts a single resume JSON *resume.json* that follows the schema
   you provided.  Only `workExperience` and `projectExperience` sections are
   considered.
2. **JD count**: still exactly 5.  We generate 5 tailored resumes by selecting
   different bullets for every JD.
3. **No text alteration**: compression is **disabled** – every selected bullet
   is copied verbatim, so the word‑count of each bullet equals the original.
4. **CLI**: `--resume_file` replaces the previous *resumes_file* list.  A helper
   function builds an experience dict once and re‑uses it for all 5 JDs.
   (You can still call the old API if you pass a list.)

Run example
───────────
$ python agent2_integrator_v2.py \
       --jd_file jd_file.json \
       --resume_file resume.json \
       --out_dir ./resumes
"""

import json
import logging
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

import faiss                       # type: ignore
import markdown2                   # type: ignore
import numpy as np
from sentence_transformers import SentenceTransformer  # type: ignore

# PDF generation intentionally disabled – we only write Markdown files.

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
LOGGER = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────────────────────
# Helpers to extract bullets from resume.json
# ──────────────────────────────────────────────────────────────────────────────

def _clean_ws(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def _bullet_from_experience(raw: dict) -> str:
    """Convert a raw experience dict into a one‑line bullet."""
    parts: List[str] = []
    for field in ("projectName", "position", "department", "city"):
        val = _clean_ws(raw.get(field, ""))
        if val:
            parts.append(val)
    desc = _clean_ws(raw.get("description", ""))
    if desc:
        parts.append(desc)
    return " – ".join(parts) if parts else "N/A"


def extract_experiences(resume_json: dict) -> Dict[str, str]:
    """Return {exp_id: text} from *workExperience* + *projectExperience*."""
    exp_dict: Dict[str, str] = {}

    for i, item in enumerate(resume_json.get("workExperience", []), 1):
        exp_dict[f"Work_{i}"] = _bullet_from_experience(item)

    for i, item in enumerate(resume_json.get("projectExperience", []), 1):
        exp_dict[f"Project_{i}"] = _bullet_from_experience(item)

    return exp_dict


# ──────────────────────────────────────────────────────────────────────────────
# Integrator (largely same as v1 but with compression toggle)
# ──────────────────────────────────────────────────────────────────────────────

class Agent2Integrator:
    """End‑to‑end integration pipeline (v2)."""

    DEFAULT_SECTION_WEIGHTS = {
        "Work": 1.4,
        "Project": 1.2,
    }

    def __init__(
        self,
        emb_model: str = "all-MiniLM-L6-v2",
        faiss_dim: int = 384,
        max_words_page: int = 450,
        min_exps: int = 1,
        section_weights: Dict[str, float] | None = None,
        compress: bool = False,  # ✧ NEW: disable bullet compression
        pdf_root: Path | str = "./resumes",
    ) -> None:
        self.encoder = SentenceTransformer(emb_model)
        self.max_words_page = max_words_page
        self.min_exps = min_exps
        self.section_weights = section_weights or self.DEFAULT_SECTION_WEIGHTS
        self.compress = compress
        self.pdf_root = Path(pdf_root)
        self.pdf_root.mkdir(parents=True, exist_ok=True)

        self.index = faiss.IndexFlatIP(faiss_dim)

    # ────────────────────────────────────────────────────────────────────
    # Low‑level utils
    # ────────────────────────────────────────────────────────────────────

    def _embed(self, texts: List[str]) -> np.ndarray:
        vecs = self.encoder.encode(texts, convert_to_numpy=True, show_progress_bar=False)
        faiss.normalize_L2(vecs)
        return vecs

    def _clean(self, text: str) -> str:
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip().lower()

    # ────────────────────────────────────────────────────────────────────
    # Scoring & selection
    # ────────────────────────────────────────────────────────────────────

    def score_experiences(self, jd: str, exps: Dict[str, str]) -> Dict[str, float]:
        jd_vec = self._embed([self._clean(jd)])[0]
        ids, texts = zip(*exps.items()) if exps else ([], [])
        vecs = self._embed([self._clean(t) for t in texts]) if texts else np.empty((0, len(jd_vec)))

        raw_scores = (vecs @ jd_vec).tolist()
        weighted: Dict[str, float] = {}
        for eid, s in zip(ids, raw_scores):
            section = eid.split("_")[0]  # Work / Project
            weighted[eid] = s * self.section_weights.get(section, 1.0)
        return weighted

    def _word_count(self, txt: str) -> int:
        return len(txt.split())

    def select(self, scores: Dict[str, float], exps: Dict[str, str]) -> List[str]:
        """Return list of bullet texts (order by score)."""
        ordered = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
        chosen: List[str] = []
        total = 0
        for eid, _ in ordered:
            bullet = exps[eid]
            wc = self._word_count(bullet)
            if total + wc <= self.max_words_page or len(chosen) < self.min_exps:
                chosen.append(bullet)
                total += wc
            if total >= self.max_words_page:
                break
        if len(chosen) < self.min_exps:
            for eid, _ in ordered[len(chosen):]:
                chosen.append(exps[eid])
                if len(chosen) >= self.min_exps:
                    break
        return chosen

    # ────────────────────────────────────────────────────────────────────
    # Layout & MD export
    # ────────────────────────────────────────────────────────────────────

    def assemble_md(self, header: str, bullets: List[str]) -> str:
        lines = [f"# {header}", ""]
        lines += [f"• {b}" for b in bullets]
        return "\n".join(lines)

    def export_md(self, md_text: str, out_path: Path) -> None:
        with open(out_path.with_suffix(".md"), "w", encoding="utf-8") as f:
            f.write(md_text)

    # ────────────────────────────────────────────────────────────────────
    # Public API
    # ────────────────────────────────────────────────────────────────────

    def run_from_resume(
        self,
        jd_list: List[str],
        resume_json: dict,
        header: str | None = None,
    ) -> Dict[int, Path]:
        """Main entry: single resume + 5 JDs ➜ 5 Markdown files."""
        assert len(jd_list) == 5, "Expect exactly 5 job descriptions."
        exp_dict = extract_experiences(resume_json)

        header = header or "Your Name – Resume"
        today_dir = self.pdf_root / datetime.now().strftime("%Y%m%d")
        today_dir.mkdir(parents=True, exist_ok=True)

        results: Dict[int, Path] = {}
        for idx, jd in enumerate(jd_list, 1):
            LOGGER.info("Scoring for JD %d", idx)
            scores = self.score_experiences(jd, exp_dict)
            bullets = self.select(scores, exp_dict)
            md = self.assemble_md(header, bullets)
            out_path = today_dir / f"resume_job{idx}"
            self.export_md(md, out_path)
            results[idx] = out_path.with_suffix(".md")
        return results


# ──────────────────────────────────────────────────────────────────────────────
# CLI helper
# ──────────────────────────────────────────────────────────────────────────────

def _load_json(path: str | Path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main() -> None:
    import argparse

    p = argparse.ArgumentParser(description="Agent 2 Integrator v2 CLI")
    p.add_argument("--jd_file", required=True, help="JSON list of 5 job descriptions")
    p.add_argument("--resume_file", required=True, help="Single resume JSON file")
    p.add_argument("--out_dir", default="./resumes", help="Root output dir")
    args = p.parse_args()

    jd_list = _load_json(args.jd_file)
    resume_json = _load_json(args.resume_file)

    integrator = Agent2Integrator(pdf_root=args.out_dir, compress=False)
    md_paths = integrator.run_from_resume(jd_list, resume_json)

    for idx, pth in md_paths.items():
        LOGGER.info("JD %d → %s", idx, pth)


if __name__ == "__main__":
    # Hard‑coded paths for quick test (comment out if using CLI)
    # jd_list = _load_json("jd_file.json")
    # resume_json = _load_json("resume.json")
    # integrator = Agent2Integrator(pdf_root="./resumes", compress=False)
    # integrator.run_from_resume(jd_list, resume_json)

    main()
