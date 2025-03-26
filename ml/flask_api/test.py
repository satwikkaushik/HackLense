from genericEvaluation.genericEvaluator import GenericEvaluator

evaluator = GenericEvaluator()

def test_hackathon():
    params = {"problem_statement": "derive an idea to make coding more accessible to blind people"}
    result = evaluator.hackathon(params)
    print(result["keywords"])

def test_mathsScience():
    params = {
        "topic": "calculus",
        "problem_statement": "find the derivative of f(x) = x^2 + 3x + 1",
        "solution": "f'(x) = 2x + 1"
    }
    result = evaluator.mathsScience(params)
    print(result)

def test_summary():
    params = {
        "topic": "calculus",
        "problem_statement": "find the derivative of f(x) = x^2 + 3x + 1",
        "solution": "f'(x) = 2x + 1"
    }
    result = evaluator.summary(params)
    print(result)

def test_program():
    params = {"problem_statement": "write a function to calculate the factorial of a number"}
    result = evaluator.program(params)
    print(result)

def test_language():
    params = {"solution": "घर की सफाई एक ऐसा काम है जिसे कई लोग नापसंद करते हैं, लेकिन यह कीटाणुओं के प्रसार को रोकता है और घर को अच्छा दिखने में मदद करता है।"}
    result = evaluator.language(params)
    # result: "Cleaning the house is a task that many people dislike, but it stops the spread of germs and helps the house look good."
    print(result)

def test_codeEval():
    params = {
        "code": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
        "test_cases": [
            {"input": 1, "expected": 1},
            {"input": 2, "expected": 2},
            {"input": 3, "expected": 6},
            {"input": 4, "expected": 24},
            {"input": 5, "expected": 120},
            {"input": 6, "expected": 680},
            {"input": 7, "expected": 5040},
            {"input": 8, "expected": 40320},
            {"input": 9, "expected": 362880},
            {"input": 10, "expected": 3628800},
        ]
    }
    result = evaluator.evaluate_code_gemini(params["code"], params["test_cases"])
    print(result)

print("Hello from test.py")
test_codeEval()