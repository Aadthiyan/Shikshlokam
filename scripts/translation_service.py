#!/usr/bin/env python3
"""
Translation Service
Translates training plans to regional languages using DeepTranslator
"""

from deep_translator import GoogleTranslator
import sys
import json

# Fix Windows encoding issue for Unicode characters
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Language codes mapping
LANGUAGES = {
    "hindi": "hi",
    "bengali": "bn",
    "telugu": "te",
    "marathi": "mr",
    "tamil": "ta",
    "gujarati": "gu",
    "kannada": "kn",
    "malayalam": "ml",
    "odia": "or",
    "punjabi": "pa",
    "english": "en",
}

def translate_text(text, target_language="hi"):
    """
    Translate text to target language
    
    Args:
        text: Text to translate
        target_language: Target language code (hi, bn, te, etc.)
    
    Returns:
        Translated text
    """
    try:
        if not text or text.strip() == "":
            return text
        
        # Skip translation if already in target language or if English and target is English
        if target_language == "en":
            return text
        
        translator = GoogleTranslator(source='auto', target=target_language)
        translated = translator.translate(text)
        return translated
    
    except Exception as e:
        print(f"Translation error: {e}", file=sys.stderr)
        return text  # Return original if translation fails

def translate_plan(plan_data, target_language="hi"):
    """
    Translate entire training plan to target language
    
    Args:
        plan_data: Plan data dictionary
        target_language: Target language code
    
    Returns:
        Translated plan data
    """
    try:
        translated_plan = plan_data.copy()
        
        # Translate plan name
        if "name" in translated_plan:
            translated_plan["name"] = translate_text(translated_plan["name"], target_language)
        
        # Translate sessions
        if "sessions" in translated_plan:
            for session in translated_plan["sessions"]:
                # Translate session title
                if "title" in session:
                    session["title"] = translate_text(session["title"], target_language)
                
                # Translate objectives
                if "objectives" in session and isinstance(session["objectives"], list):
                    session["objectives"] = [
                        translate_text(obj, target_language)
                        for obj in session["objectives"]
                    ]
                
                # Translate trainer notes
                if "trainerNotes" in session:
                    session["trainerNotes"] = translate_text(session["trainerNotes"], target_language)
                
                # Translate module info
                if "module" in session:
                    if "title" in session["module"]:
                        session["module"]["title"] = translate_text(session["module"]["title"], target_language)
                    if "theme" in session["module"]:
                        session["module"]["theme"] = translate_text(session["module"]["theme"], target_language)
        
        # Translate cohort info
        if "cohort" in translated_plan:
            if "name" in translated_plan["cohort"]:
                translated_plan["cohort"]["name"] = translate_text(
                    translated_plan["cohort"]["name"], 
                    target_language
                )
        
        return {
            "success": True,
            "data": translated_plan,
            "language": target_language
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
            "error": "Usage: python translation_service.py <json_file_path> [language]"
        }))
        sys.exit(1)
    
    try:
        # Read plan data from file
        file_path = sys.argv[1]
        
        with open(file_path, 'r', encoding='utf-8') as f:
            plan_data = json.load(f)
        
        # Get target language (default to Hindi)
        target_lang = sys.argv[2] if len(sys.argv) > 2 else "hi"
        
        # Normalize language code
        target_lang = LANGUAGES.get(target_lang.lower(), target_lang)
        
        # Translate plan
        result = translate_plan(plan_data, target_lang)
        
        # Output result
        print(json.dumps(result, ensure_ascii=False))
    
    except FileNotFoundError as e:
        print(json.dumps({
            "success": False,
            "error": f"File not found: {str(e)}"
        }))
        sys.exit(1)
    
    except json.JSONDecodeError as e:
        print(json.dumps({
            "success": False,
            "error": f"Invalid JSON in file: {str(e)}"
        }))
        sys.exit(1)
    
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)
