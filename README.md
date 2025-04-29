# JobForce.AI

*A Large-Language-Model career assistant for automated résumé optimization and personalized job matching*

------

## Abstract

The contemporary job-seeking pipeline is fragmented: applicants must iteratively refine résumés, sift through heterogeneous job boards, and manually align their skills with evolving market demands. **JobForce.AI** addresses this inefficiency by coupling large-language-model (LLM) rewriting with semantic similarity search. A user uploads a résumé (PDF/Word) and selects a target career track. The system (i) parses and structures the résumé, (ii) retrieves prototypical job descriptions (JDs) from a curated GitHub corpus, (iii) invokes an LLM to rewrite the résumé toward market-aligned keywords, and (iv) embeds the optimized résumé to retrieve the top-*k* (default *k* = 10) real-time postings that satisfy user filters (location, on-site/remote, internship/full-time, date-posted). The result is an end-to-end assistant that simultaneously upgrades résumé quality and surfaces actionable job opportunities.

## Problem Statement

Manual résumé tailoring and ad-hoc job discovery impose cognitive overhead and yield sub-optimal search outcomes. Applicants struggle to

- translate domain experience into recruiter-friendly language,
- keep pace with dynamic keyword requirements, and
- efficiently shortlist positions aligned with personal constraints.

JobForce.AI leverages LLMs, vector embeddings, and a modular multi-agent architecture to automate résumé enhancement and evidence-based job recommendation, thereby improving both **effectiveness** (content quality) and **efficiency** (search latency).

## System Overview

```
user_upload                jd_database                 live_jobs
     │                           │                         │
┌────▼──────┐          ┌─────────▼────────┐     ┌──────────▼─────────┐
│ ResumePDF │──parse──▶│  JD Retrieval    │     │  Job Scraper+DB    │
└───────────┘          │  (keyword+vec)   │     └────────────────────┘
        │              └─────────┬────────┘                │
        │                         │                         │
        │          ┌──────────────▼───────────────┐         │
        │          │ LLM Resume Rewriter (ChatGPT)│         │
        │          └──────────────┬───────────────┘         │
        │                         │                         │
        │                ┌────────▼────────┐                │
        └────────embed──▶│  Vector DB (Pinecone)│──sim-search▶ Top-k Jobs
                         └──────────────────────┘
```

| Module                   | Functionality                                        | Key Techniques                                  |
| ------------------------ | ---------------------------------------------------- | ----------------------------------------------- |
| **Parsing**              | PDF/Word → structured JSON                           | `pdfplumber`, regex, spaCy NER                  |
| **JD Retrieval**         | Filter JDs by track; rank via hybrid keyword + SBERT | FAISS, cosine similarity                        |
| **LLM Rewriter**         | Align résumé with JD-specific competencies           | GPT-4o / open-source LLM via prompt-engineering |
| **Embedding & Matching** | Embed rewritten résumé and scraped postings          | OpenAI `text-embedding-3-small`                 |
| **Recommendation**       | Top-10 postings after user filters                   | Pinecone ANN search                             |

## Installation TODO

```bash
git clone https://github.com/<org>/JobForce.AI.git
cd JobForce.AI
python -m venv .venv && source .venv/bin/activate   # or use conda
pip install -r requirements.txt
export OPENAI_API_KEY="..."                         # required for LLM & embedding
```

### Optional services

- **Pinecone** (vector DB) – set `PINECONE_API_KEY`
- **PostgreSQL / Supabase** – for JD & job-posting metadata
- **Docker** – `docker compose up` spins up the full stack (LLM API calls mocked for testing)

## Quick-Start Demo TODO

```bash
python scripts/demo.py \
    --resume_path sample_data/resume.pdf \
    --track "Software Engineer" \
    --location "San Francisco, CA" \
    --remote_only false \
    --top_k 10
```

The script returns

1. `resume_optimized.md` – the rewritten résumé
2. `recommendations.csv` – top-*k* job links + similarity scores

## Dataset

- **GitHub JD Corpus** – ~3 k curated job-description JSONs spanning SDE, Data Science, Finance, Product, UX
- **Live Job Feed** – continuous web-scraping (Indeed, LinkedIn, Lever) with daily refresh

## Evaluation Protocol

| Aspect             | Metric                               | Method                      |
| ------------------ | ------------------------------------ | --------------------------- |
| Résumé quality     | Keyword coverage; LLM-based rubric   | TF-IDF, GPT-4 judge         |
| Matching stability | Consistency (same résumé → same *k*) | Repeated trials, Jaccard@10 |
| Latency            | Module-level wall-clock (ms)         | Python `time.perf_counter`  |

## Roadmap

| Milestone                      | Target Date    | Status     |
| ------------------------------ | -------------- | ---------- |
| Data cleaning / JD DB          | **2025-03-31** | ✅ Complete |
| LLM résumé rewrite MVP         | **2025-04-07** | ✅          |
| Real-time scraper + filters    | **2025-04-14** | ✅          |
| Embedding-based matcher        | **2025-04-21** | ✅          |
| End-to-end integration & UI    | **2025-05-05** | ⏳          |
| Final evaluation + paper draft | **2025-05-15** | ⏳          |

## Repository Structure

```
JobForce.AI/
├── data/                 # sample résumés, JDs
├── jobforce/             
│   ├── parsing/          # PDF → JSON
│   ├── retrieval/        # JD search
│   ├── rewriting/        # LLM interface
│   ├── embedding/        # OpenAI & FAISS helpers
│   └── matching/         # ranking + filters
├── scripts/              # CLI demos, evaluation
├── notebooks/            # exploratory analyses
└── docs/                 # architecture, prompts, API schema
```

## Reproducing Results

1. Place your résumés in `data/resumes/` and run `python scripts/batch_rewrite.py`.
2. Start the job-scraper cron (`scripts/scraper.py --daily`).
3. Execute `python scripts/evaluate.py --config configs/eval.yaml`.

## Citation

If this repository contributes to your research, please cite:

```bibtex
@misc{jobforce2025,
  title   = {JobForce.AI: LLM-powered Résumé Optimization and Job Matching},
  author  = {You, Yiya and Dou, Kairan and Li, Cindy and Zhang, Bruce},
  year    = {2025},
  url     = {https://github.com/<org>/JobForce.AI}
}
```

## Contributors

| Name            | Major Contributions                                          |
| --------------- | ------------------------------------------------------------ |
| **Yiya You**    | Benchmark curation; LLM prompt design; API integration       |
| **Cindy Li**    | Résumé parsing engine; evaluation scripts; model selection   |
| **Kairan Dou**  | Semantic matching framework; cloud deployment; RAG explanations |
| **Bruce Zhang** | System architecture; project vision; user workflow design    |

## License

This project is released under the MIT License. See `LICENSE` for details.

## Acknowledgements

We thank the Berkeley **Advanced LLM Agents** MOOC faculty for guidance and the open-source communities behind **OpenAI**, **LangChain**, **FAISS**, and **Pinecone**.

------

*“Transforming fragmented job search into a data-driven, AI-assisted science.”*
