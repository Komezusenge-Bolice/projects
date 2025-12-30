import speech_recognition as sr
import pyttsx3
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import torch

# Initialize TTS
engine = pyttsx3.init()
recognizer = sr.Recognizer()

# Load DialoGPT (no Conversation needed)
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
chat_history_ids = None

def speak(text):
    print(f"🤖 AI: {text}")
    engine.say(text)
    engine.runAndWait()

def listen():
    with sr.Microphone() as source:
        print("👤 Say something...")
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
    try:
        text = recognizer.recognize_google(audio).lower()
        print(f"👤 You: {text}")
        return text
    except:
        return None

def generate_response(user_input):
    global chat_history_ids
    # Encode input
    new_user_input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt')
    
    # Append to chat history
    bot_input_ids = torch.cat([chat_history_ids, new_user_input_ids], dim=-1) if chat_history_ids is not None else new_user_input_ids
    
    # Generate response
    chat_history_ids = model.generate(bot_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id, do_sample=True, temperature=0.8)
    
    # Decode response
    response = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
    return response.strip()

print("🎤 Voice Chatbot Ready! Say 'quit' to exit.")
while True:
    user_input = listen()
    if user_input and 'quit' in user_input:
        speak("Goodbye!")
        break
    
    if user_input:
        response = generate_response(user_input)
        speak(response if response else "Sorry, let me think...")
    else:
        speak("Sorry, didn't catch that.")
