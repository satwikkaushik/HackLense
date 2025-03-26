import os, re
import requests
import time
from dotenv import load_dotenv
import json
import google.generativeai as genai

class GenericEvaluator:
    def __init__(self):
        """Initialize the evaluator with API keys and configurations."""
        # Load environment variables
        load_dotenv()

        # Configure API keys
        self.genai_api_key = os.getenv("GENAI_API_KEY")
        self.judge0_api_key = os.getenv("JUDGE0_API_KEY")
        self.judge0_url = os.getenv("JUDGE0_URL")

        # Configure Google Generative AI
        genai.configure(api_key=self.genai_api_key)

        # Define headers for external API
        self.headers = {
            "X-RapidAPI-Key": self.judge0_api_key,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }

    def generate(self, prompt):
        """Generates AI-generated content using Google Gemini."""
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip()
    
    def summary(self, params):
        """Generates a short summary of a given solution."""

        s = params.get("solution")
        ps = params.get("problem_statement")

        response = self.generate(f"Generate a detailed summary of this solution within 100 words. The problem statement is: {ps}.Provide only the summary and no extra text: {s}")

        return response
    
    def language(self, params):
        """Converts complex text into simple English."""

        s = params.get('solution')

        response = self.generate(f"Convert this text into simple English and return only the converted text: {s}")

        return response

    def hackathon(self, params):
        """Generates 50 basic keywords for TF-IDF based evaluation."""

        ps = params.get("problem_statement")
        if not ps:
            raise ValueError("Missing 'problem_statement' in parameters.")

        prompt = (f"We have a hackathon problem statement in the field of {ps}. We want to evaluate submissions using NLP and TF-IDF. Please generate 50 unique and relevant keywords that are focused on this problem statement. Keywords should be separated by commas and should be concise and specific to the topic.")
        response = self.generate(prompt)
        keywords = response.split(", ")
        return keywords
    
    def mathsScience(self, params):
        """Scores a given solution out of 10 using AI."""

        t = params.get("topic")
        ps = params.get("problem_statement")
        s = params.get("solution")

        response = self.generate(f"We have a problem statement in the topic of {t}. The problem statement is: {ps}. The proposed solution to this problem is: {s}. Please evaluate the accuracy, completeness, and correctness of the solution. Provide a score out of 10, with 10 being perfect. Just give one integer score.")
        score_match = re.search(r'\d+', response)

        score = int(score_match.group()) if score_match else 0

        return score
    
    def program(self, params):
        """Generates 8 test cases for a given problem statement."""

        ps = params.get("problem_statement")

        response = self.generate(f"Generate exactly 10 test cases for the following computer science problem statement in JSON format. Only return the test cases without any additional explanation or text: {ps}")
        
        try:
            test_cases = json.loads(response)
        except json.JSONDecodeError:
            test_cases = response

        return test_cases

    def evaluate_code_gemini(self, code: str, test_cases: dict):
        
        prompt = f"""
        You are an expert code evaluator tasked with assessing code against test cases.
        INSTRUCTIONS:
        1. Analyze and execute the code provided below
        2. For each test case in the test_cases_json, determine if the code produces the expected output
        3. Count the total number of passing test cases
        4. Respond ONLY with a single integer representing the number of passing test cases
        5. Modify the code to correct indentation errors, but do not change logic
        CODE TO EVALUATE:
        {code}
        TEST CASES:
        {test_cases}
        IMPORTANT: Your response must contain ONLY the number of passing test cases - no explanations, no code, no other text.
        """
        
        response = self.generate(prompt)
        try:
            return int(response)
        except ValueError:
            print(ValueError)