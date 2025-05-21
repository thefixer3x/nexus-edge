import os
import requests
from ratelimit import limits, sleep_and_retry

class DeepseekAgent:
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.base_url = "https://api.deepseek.com/v1"
        
    @sleep_and_retry
    @limits(calls=3, period=60)
    def get_code_review(self, code: str, context: str = ""):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": f"Review this code and suggest improvements:\n\n{code}\n\nContext: {context}",
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/completions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()["choices"][0]["text"]
        except requests.exceptions.HTTPError as err:
            raise Exception(f"API Error: {err.response.status_code} - {err.response.text}")
