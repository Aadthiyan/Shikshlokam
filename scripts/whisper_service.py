#!/usr/bin/env python3
"""
Whisper Transcription Service
Transcribes audio files to text using local Whisper model
"""

import whisper
import sys
import json
import os

# Fix Windows encoding issue for Unicode characters
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def transcribe_audio(audio_path, language="hi"):
    """
    Transcribe audio file using Whisper
    
    Args:
        audio_path: Path to audio file
        language: Language code (hi=Hindi, en=English, auto=Auto-detect, etc.)
    
    Returns:
        dict with transcription result
    """
    try:
        # Load Whisper model (base model for speed, can use 'small', 'medium', 'large')
        print(f"Loading Whisper model...", file=sys.stderr)
        model = whisper.load_model("base")
        
        # Transcribe
        print(f"Transcribing {audio_path}...", file=sys.stderr)
        
        # If language is "auto", let Whisper detect automatically
        if language == "auto" or language is None:
            result = model.transcribe(
                audio_path,
                fp16=False  # Use FP32 for CPU
            )
        else:
            result = model.transcribe(
                audio_path,
                language=language,
                fp16=False  # Use FP32 for CPU
            )
        
        return {
            "success": True,
            "text": result["text"],
            "language": result.get("language", language),
            "segments": [
                {
                    "start": seg["start"],
                    "end": seg["end"],
                    "text": seg["text"]
                }
                for seg in result.get("segments", [])
            ]
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python whisper_service.py <audio_file> [language]"
        }))
        sys.exit(1)
    
    audio_path = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "hi"  # Default to Hindi
    
    if not os.path.exists(audio_path):
        print(json.dumps({
            "success": False,
            "error": f"Audio file not found: {audio_path}"
        }))
        sys.exit(1)
    
    result = transcribe_audio(audio_path, language)
    print(json.dumps(result, ensure_ascii=False))
