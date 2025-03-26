import os
from flask import Flask, request, jsonify
from evaluator import Evaluator
from genericEvaluation.genericEvaluator import GenericEvaluator
from extraction import process_video, process_audio, process_image, process_text_file
from dotenv import load_dotenv

# load environment variables from .env file
load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
PORT = int(os.getenv("PORT"))

print(f"UPLOAD_FOLDER: {UPLOAD_FOLDER}")

@app.route("/")
def home():
    return jsonify({"message": "Hello, Flask!"})

@app.route('/evaluate/innovation', methods=['POST'])
def evaluate_innovation():
    try:
        # Get input JSON from request body
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input, expected a dictionary"}), 400

        # Initialize Evaluator and run evaluation
        evaluator = Evaluator(data)
        evaluation_result = evaluator.run()

        return {"finalScore": evaluation_result["final_score"]}, 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/extract', methods=['POST'])
def extract_content():
    """API to extract semantic descriptions from uploaded files."""
    try:
        data = request.get_json()
        filename = data.get("fileURI") # example: idea.txt

        if not filename:
            return jsonify({"error": "No file found with provided name"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404

        semantic_descriptions = {}
        
        # Process the file based on its type
        ext = os.path.splitext(file_path)[-1].lower()
        if ext in [".mp4", ".avi", ".mov"]:  # Video files
            semantic_descriptions = process_video(file_path)
        elif ext in [".wav", ".mp3", ".aac"]:  # Audio files
            semantic_descriptions = process_audio(file_path)
        elif ext in [".jpg", ".jpeg", ".png"]:  # Image files
            semantic_descriptions = process_image(file_path)
        elif ext == ".txt":  # Text files
            semantic_descriptions = process_text_file(file_path)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    return jsonify(semantic_descriptions), 200

@app.route('/evaluate/ms', methods=['POST'])
def evaluate_mathsScience():
    """API to evaluate submission for hackathon using Google Generative AI."""
    try:
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"score": 0}), 400

        # Initialize GenericEvaluator and generate content
        evaluator = GenericEvaluator()
        generated_content = evaluator.mathsScience(data)

        return jsonify({"score": generated_content}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/evaluate/code', methods=['POST'])
def evaluate_code():
    """API to programming submission for hackathon using Google Generative AI."""
    try:
        data = request.get_json()

        codeToSend = data.get("code")
        testCases = data.get("testCases")

        if not data or not isinstance(data, dict):
            return jsonify({"score": 0}), 400

        # Initialize GenericEvaluator and generate content
        evaluator = GenericEvaluator()
        generated_content = evaluator.evaluate_code_gemini(codeToSend, testCases)

        return jsonify({"score": generated_content}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/generate/keywords', methods=['POST'])
def generate_keywords():
    """API to generate keywords for hackathon using Google Generative AI."""
    try:
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "No data provided"}), 400

        # Initialize GenericEvaluator and generate content
        evaluator = GenericEvaluator()
        generated_content = evaluator.hackathon(data)

        return jsonify({"keywords": generated_content}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/generate/summary', methods=['POST'])
def generate_summary():
    """API to generate summary for hackathon using Google Generative AI."""
    try:
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "No data provided"}), 400

        # Initialize GenericEvaluator and generate content
        evaluator = GenericEvaluator()
        generated_content = evaluator.summary(data)

        return jsonify({"summary": generated_content}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/generate/testCases', methods=['POST'])
def generate_testCases():
    """API to generate test cases for hackathon using Google Generative AI."""
    try:
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "No data provided"}), 400

        # Initialize GenericEvaluator and generate content
        evaluator = GenericEvaluator()
        generated_content = evaluator.program(data)

        return jsonify({"testCases": generated_content}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/translate', methods=['POST'])
def translate():
    """API to translate multilungual to english using Google Generative AI."""
    try:
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "No data provided"}), 400

        # Initialize GenericEvaluator and generate content
        evaluator = GenericEvaluator()
        generated_content = evaluator.language(data)

        return jsonify({"text": generated_content}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":  
    app.run(port=PORT)
