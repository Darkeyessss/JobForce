from openai import OpenAI
import json
import os
client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key="sk-j4Onrjz2uvj3hryKCHj7gdHEI0zAKioiCAwUQoLmPJQ2n3MI",
    base_url="https://api.chatanywhere.org/v1"
)
def gpt_api(messages: list):
    """为提供的对话消息创建新的回答

    Args:
        messages (list): 完整的对话消息
    """
    print("opening gpt api")
    completion = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages,timeout=30)
    print(completion.choices[0].message.content)
    return completion.choices[0].message.content
def resume_agent1(order,JD,docu_RESUME):
    #with open(docu_JD, 'r', encoding='utf-8') as file:
    job_description = JD
    with open(docu_RESUME, 'r', encoding='utf-8') as file:
      resume = file.read()
    system_prompt=("As a professional resume editor, revise my resume to closely align with the provided job "
                   "description (JD). Follow these guidelines: Precision Matching: Tailor the language, "
                   "skills, and achievements to mirror the JD’s keywords, tone, and core requirements—without adding any skills or experiences not originally present."
                   "Relevance First: Emphasize the most relevant projects, responsibilities, reframe existing experiences to align with the JD’s requirements whenever possible,"
                   "and quantifiable results while downplaying unrelated content."
                   "Conciseness: Use industry-specific terminology from the JD and keep wording concise and impactful. Avoid redundancy."
                   "Consistency: Preserve the original resume structure (e.g., reverse chronology) and only refine the content without deleteing any experiences existed!!!Even if it is not relevant to the job description."
                    "Output Format: Return the revised resume strictly with the original aspects and their orders"
                   "Deliverable: Provide only the final revised resume (no explanations or notes) ready for immediate submission."
                   "- Return strictly valid JSON without any explanation or extra text."
                   )

    messages = [
      {
        'role': 'system',
        'content': system_prompt,
      },
      {
        'role': 'user',
        'content': f"""This is the job description：{job_description}""",
      },
      {
        'role': 'user',
        'content': f"""This is the original resume of the candidate in JSON format：{json.dumps(resume, ensure_ascii=False)}""",
      },
    {
        'role': 'user',
        'content': "Keep every existing experience even if it is not relevant."
    }
    ]
    response=gpt_api(messages)
    # 保存结果
    os.makedirs("output_resume", exist_ok=True)
    with open(f"output_resume/{order}_revised_resume.json", "w", encoding="utf-8") as f:
        f.write(response)
    # with open(f"output_resume/jsons.txt", "w", encoding="utf-8") as f:
    #   f.write(response)


# 读取 JSON 文件
with open('job_description/jobs.json', 'r', encoding='utf-8') as f:
    jd_json = json.load(f)

# 提取 job_position 和 job_description
positions = jd_json["job_position"]
descriptions =jd_json["job_description"]

# 遍历 job_position 和对应的 jd
for key in positions:
    position = positions[key]
    jd = descriptions.get(key, "No description available.")
    print(f"Job Position: {position}")
    resume_agent1(key,jd,docu_RESUME='input_resume/resume.json')
    print("-" * 50)



