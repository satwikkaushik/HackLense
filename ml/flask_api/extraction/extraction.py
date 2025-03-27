import speech_recognition as sr
import moviepy as mp
import pytesseract
import cv2
import json
import sys
import os

# Set Tesseract OCR path (modify if needed)
# pytesseract.pytesseract.tesseract_cmd = "C:\\Users\\Udi Gupta\\AppData\\Local\\Programs\\Tesseract-OCR\\tesseract.exe"
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

# Output JSON file
output_json = "recognized.json"

# Initialize result dictionary
semantic_descriptions = {}

def process_video(video_path):
    """Extract audio from video and recognize speech."""
    try:
        audio_path = "converted.wav"
        clip = mp.VideoFileClip(video_path)
        clip.audio.write_audiofile(audio_path)

        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            recognized_text = recognizer.recognize_google(audio_data)

        semantic_descriptions["text"] = recognized_text
        os.remove(audio_path)  # Clean up the audio file
    except Exception as e:
        semantic_descriptions["text"] = f"Error processing video: {e}"
    return semantic_descriptions


def process_audio(audio_path):
    """Recognize speech from an audio file."""
    try:
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            recognized_text = recognizer.recognize_google(audio_data)

        semantic_descriptions["text"] = recognized_text
    except Exception as e:
        semantic_descriptions["text"] = f"Error processing audio: {e}"
    return semantic_descriptions
    

def process_image(image_path):
    """Extract text from an image using OCR."""
    try:
        img = cv2.imread(image_path)
        extracted_text = pytesseract.image_to_string(img).strip()
        semantic_descriptions["text"] = extracted_text
    except Exception as e:
        semantic_descriptions["text"] = f"Error processing image: {e}"
    print(semantic_descriptions)
    return semantic_descriptions
    

def process_text_file(text_file):
    """Read text from a .txt file and store it."""
    try:
        with open(text_file, "r", encoding="utf-8") as file:
            content = file.read().strip()
        semantic_descriptions["text"] = content
    except Exception as e:
        semantic_descriptions["text"] = f"Error reading text file: {e}"
    return semantic_descriptions
    

def process_text(text):
    """Save direct text input into the JSON output."""
    semantic_descriptions["text"] = text
    return semantic_descriptions


if __name__ == "__main__":
    # Check if arguments are provided
    if len(sys.argv) < 2:
        print(json.dumps({"message": "No input provided"}))
        sys.exit(1)

    for arg in sys.argv[1:]:
        if os.path.exists(arg):  # If it's a file
            ext = os.path.splitext(arg)[-1].lower()
            if ext in [".mp4", ".avi", ".mov"]:  # Video files
                process_video(arg)
            elif ext in [".wav", ".mp3", ".aac"]:  # Audio files
                process_audio(arg)
            elif ext in [".jpg", ".jpeg", ".png"]:  # Image files
                process_image(arg)
            elif ext == ".txt":  # Text files
                process_text_file(arg)
        else:  # If it's not a file, assume it's text
            process_text(arg)

    # Write results to JSON
    with open(output_json, "w", encoding="utf-8") as file:
        json.dump(semantic_descriptions, file, indent=4)
