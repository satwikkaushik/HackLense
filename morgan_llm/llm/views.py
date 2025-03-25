import requests
import time
import re
import json
import google.generativeai as genai
from django.http import JsonResponse

# Load API keys from environment variables (recommended) or replace them with secure storage methods.
GENAI_API_KEY = "AIzaSyD3e6f36wkku9g_gj9vaOs7CIkNgyX3Ftw"
JUDGE0_API_KEY = "d0588ba131mshb942943163284e4p17e598jsn3ce843de2301"

genai.configure(api_key=GENAI_API_KEY)
JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions"

HEADERS = {
    "X-RapidAPI-Key": JUDGE0_API_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
}

def generate(s):
    """Generates AI-generated content using Google Gemini."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(s)
    return response.text.strip()

def ms(request):
    """Scores a given solution out of 10 using AI."""
    if request.method == 'POST':
        t = request.POST.get('topic', '')
        ps = request.POST.get('problem_statement', '')
        s = request.POST.get('solution', '')

        response = generate(f"We have a {t} problem statement with topic {ps}. I have received a solution for the problem statement which is this: {s}. Score this out of 10, just give one integer which will be the score.")
        score_match = re.search(r'\d+', response)

        score = int(score_match.group()) if score_match else 0
        return JsonResponse({"score": score})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

def program(request):
    """Generates 8 test cases for a given problem statement."""
    if request.method == 'POST':
        ps = request.POST.get('problem_statement', '')

        response = generate(f"We have a computer science problem statement with topic {ps}. Generate 8 test cases for this problem statement in JSON format.")
        try:
            test_cases = json.loads(response)
        except json.JSONDecodeError:
            test_cases = response
        
        return JsonResponse({"test_cases": test_cases})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

def hackathon(request):
    """Generates 50 basic keywords for TF-IDF based evaluation."""
    if request.method == 'POST':
        ps = request.POST.get('problem_statement', '')

        response = generate(f"We have a hackathon problem statement with topic {ps}. We want to rate the submissions using NLP and TF-IDF. Give me 50 basic keywords for TF-IDF as a string separated by commas.")
        keywords = response.split(", ")

        return JsonResponse({"keywords": keywords})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

def summary(request):
    """Generates a short summary of a given solution."""
    if request.method == 'POST':
        s = request.POST.get('solution', '')

        response = generate(f"Generate a short summary of this solution: {s}")

        return JsonResponse({"summary": response})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

def language(request):
    """Converts complex text into simple English."""
    if request.method == 'POST':
        s = request.POST.get('solution', '')

        response = generate(f"Convert this into simple English: {s}")

        return JsonResponse({"simple_english": response})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

def run_code(request):
    """Executes the given code with test cases using Judge0 API."""
    if request.method == 'POST':
        try:
            language_id = request.POST.get('language_id', '')
            source_code = request.POST.get('source_code', '')
            test_cases = json.loads(request.POST.get('test_cases', '[]'))  # Ensure test_cases is a list

            if not language_id or not source_code or not test_cases:
                return JsonResponse({"error": "Missing required parameters"}, status=400)

            passed = 0
            failed_cases = []

            for case in test_cases:
                inp, expected = case["input"], case["expected_output"]
                payload = {
                    "language_id": language_id,
                    "source_code": source_code,
                    "stdin": inp,
                    "expected_output": expected
                }

                response = requests.post(f"{JUDGE0_URL}?base64_encoded=false", json=payload, headers=HEADERS)
                if response.status_code != 201:
                    return JsonResponse({"error": "Failed to submit code for execution"}, status=500)

                token = response.json().get("token")
                result = None

                while result is None or result["status"]["id"] in [1, 2]: 
                    time.sleep(1)
                    result = requests.get(f"{JUDGE0_URL}/{token}", headers=HEADERS).json()

                output = result.get("stdout", "").strip()
                if output == expected:
                    passed += 1
                else:
                    failed_cases.append({"input": inp, "expected": expected, "actual": output})

            return JsonResponse({
                "passed": passed,
                "total": len(test_cases),
                "failed_cases": failed_cases
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)






