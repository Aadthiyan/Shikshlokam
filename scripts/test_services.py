#!/usr/bin/env python3
"""
Test script for Whisper and Translation services
"""

import sys
import json

print("=" * 60)
print("TESTING PYTHON SERVICES")
print("=" * 60)

# Test 1: Check Whisper installation
print("\n1. Testing Whisper installation...")
try:
    import whisper
    print("✅ Whisper installed successfully")
    print(f"   Version: {whisper.__version__ if hasattr(whisper, '__version__') else 'Unknown'}")
except ImportError as e:
    print(f"❌ Whisper not installed: {e}")
    print("   Run: pip install openai-whisper")

# Test 2: Check DeepTranslator installation
print("\n2. Testing DeepTranslator installation...")
try:
    from deep_translator import GoogleTranslator
    print("✅ DeepTranslator installed successfully")
    
    # Test translation
    translator = GoogleTranslator(source='en', target='hi')
    result = translator.translate("Hello, how are you?")
    print(f"   Test translation (EN→HI): {result}")
except ImportError as e:
    print(f"❌ DeepTranslator not installed: {e}")
    print("   Run: pip install deep-translator")
except Exception as e:
    print(f"⚠️  DeepTranslator installed but translation failed: {e}")

# Test 3: Check required packages
print("\n3. Checking other required packages...")
packages = {
    "tiktoken": "For Whisper tokenization",
    "numba": "For Whisper performance",
    "llvmlite": "For Numba",
}

for package, description in packages.items():
    try:
        __import__(package)
        print(f"✅ {package} installed - {description}")
    except ImportError:
        print(f"⚠️  {package} not installed - {description}")

# Test 4: Test translation service
print("\n4. Testing translation service...")
try:
    test_data = {
        "name": "Test Training Plan",
        "sessions": [
            {
                "title": "Session 1: Introduction",
                "objectives": ["Learn basics", "Practice examples"],
                "trainerNotes": "Use local examples for better understanding"
            }
        ]
    }
    
    from deep_translator import GoogleTranslator
    translator = GoogleTranslator(source='en', target='hi')
    
    # Translate plan name
    translated_name = translator.translate(test_data["name"])
    print(f"✅ Translation test successful")
    print(f"   Original: {test_data['name']}")
    print(f"   Hindi: {translated_name}")
    
except Exception as e:
    print(f"❌ Translation test failed: {e}")

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

print("\n✅ = Ready to use")
print("⚠️  = Optional but recommended")
print("❌ = Required, please install")

print("\n" + "=" * 60)
print("If all tests passed, you're ready to use:")
print("  - Voice-to-Text (Whisper)")
print("  - Regional Translation (DeepTranslator)")
print("=" * 60)
