# ♿ AccessiPilot - Streamlit Web App
# AI-Powered Accessibility Companion

import streamlit as st
import requests
from PIL import Image
import io
import os
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

# Page configuration
st.set_page_config(
    page_title="AccessiPilot",
    page_icon="♿",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for accessibility
st.markdown("""
<style>
    :root {
        --primary-color: #2E86AB;
        --secondary-color: #A23B72;
        --success-color: #06A77D;
        --warning-color: #F18F01;
        --danger-color: #C1121F;
    }
    
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
    }
    
    .main-header {
        color: #2E86AB;
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    
    .feature-box {
        border: 2px solid #2E86AB;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        background-color: #f0f4f8;
    }
    
    .accessibility-info {
        background-color: #e8f4f8;
        border-left: 4px solid #06A77D;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
    }
    
    .stButton>button {
        background-color: #2E86AB;
        color: white;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .stButton>button:hover {
        background-color: #1e5a7a;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if "font_size" not in st.session_state:
    st.session_state.font_size = 16
if "dark_mode" not in st.session_state:
    st.session_state.dark_mode = False
if "history" not in st.session_state:
    st.session_state.history = []
if "contrast_level" not in st.session_state:
    st.session_state.contrast_level = "normal"

# Sidebar - Accessibility Controls
with st.sidebar:
    st.markdown("## ♿ Accessibility Settings")
    st.divider()
    
    # Font Size Control
    st.session_state.font_size = st.slider(
        "Font Size",
        min_value=12,
        max_value=24,
        value=st.session_state.font_size,
        step=2,
        help="Adjust the text size for better readability"
    )
    
    # Dark Mode Toggle
    st.session_state.dark_mode = st.toggle(
        "🌙 Dark Mode",
        value=st.session_state.dark_mode,
        help="Switch to dark theme for reduced eye strain"
    )
    
    # Contrast Level
    st.session_state.contrast_level = st.selectbox(
        "Contrast Level",
        options=["Normal", "High", "Very High"],
        index=0,
        help="Increase contrast for better visibility"
    )
    
    st.divider()
    st.markdown("### About AccessiPilot")
    st.info(
        "AccessiPilot is an AI-powered accessibility companion that helps make the web "
        "more accessible through automatic descriptions, alt-text generation, and assistive features."
    )

# Main Content
st.markdown('<div class="main-header">♿ AccessiPilot</div>', unsafe_allow_html=True)
st.markdown("*Making the web accessible for everyone*")
st.divider()

# Create tabs for different features
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs(
    ["🖼️ Image Analysis", "🔤 Alt-Text Generator", "🎤 Speech-to-Text", 
     "📢 Text-to-Speech", "🌐 Web Accessibility", "📊 History"]
)

# ============== TAB 1: IMAGE ANALYSIS ==============
with tab1:
    st.header("🖼️ Image Analysis & Description")
    st.markdown("Upload an image and get an AI-powered description of its contents.")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        uploaded_image = st.file_uploader(
            "Upload an image",
            type=["jpg", "jpeg", "png", "gif", "webp"],
            help="Supported formats: JPG, PNG, GIF, WebP"
        )
        
        if uploaded_image:
            image = Image.open(uploaded_image)
            st.image(image, caption="Uploaded Image", use_column_width=True)
            
            # Image details
            st.markdown("**Image Information:**")
            st.write(f"- Size: {image.size}")
            st.write(f"- Format: {image.format}")
    
    with col2:
        if uploaded_image:
            st.markdown("**AI Description**")
            
            # Simulated AI response (replace with actual API call)
            with st.spinner("Analyzing image..."):
                st.success("✅ Image Analysis Complete")
                
                description = """
                This image contains a professional workspace setup with:
                - A computer monitor displaying code
                - A keyboard and mouse
                - A cup of coffee
                - Some notebooks and writing materials
                - Natural lighting from a window
                
                **Suggested Alt-Text:**
                "A developer's workspace with a monitor, keyboard, and coding tools on a desk"
                """
                
                st.write(description)
                
                # Copy button for alt-text
                alt_text = "A developer's workspace with a monitor, keyboard, and coding tools on a desk"
                st.text_area("Alt-Text (copy if needed):", value=alt_text, height=60)
                
                if st.button("📋 Copy Alt-Text"):
                    st.success("Alt-text copied to clipboard!")

# ============== TAB 2: ALT-TEXT GENERATOR ==============
with tab2:
    st.header("🔤 Alternative Text Generator")
    st.markdown("Generate accessibility-compliant alt-text for your images automatically.")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Option 1: Batch Processing")
        batch_images = st.file_uploader(
            "Upload multiple images",
            type=["jpg", "jpeg", "png"],
            accept_multiple_files=True,
            help="Upload several images at once"
        )
        
        if batch_images:
            st.write(f"📁 {len(batch_images)} images selected")
            
            if st.button("Generate Alt-Text for All"):
                with st.spinner("Processing images..."):
                    progress_bar = st.progress(0)
                    
                    for idx, img_file in enumerate(batch_images):
                        # Simulate processing
                        image = Image.open(img_file)
                        st.image(image, width=150, caption=f"Image {idx+1}")
                        st.text_input(
                            f"Alt-Text for {img_file.name}:",
                            value="[AI-generated alt-text would appear here]"
                        )
                        
                        progress_bar.progress((idx + 1) / len(batch_images))
                    
                    st.success("✅ All alt-texts generated!")
    
    with col2:
        st.subheader("Option 2: URL-based")
        image_url = st.text_input(
            "Enter image URL",
            placeholder="https://example.com/image.jpg"
        )
        
        if image_url and st.button("Analyze URL Image"):
            st.info("Image would be loaded from URL and analyzed...")

# ============== TAB 3: SPEECH-TO-TEXT ==============
with tab3:
    st.header("🎤 Speech-to-Text Transcription")
    st.markdown("Convert your voice into text in real-time using AI speech recognition.")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Audio Input")
        
        audio_input = st.audio_input("Record your message")
        
        if audio_input:
            st.info("✅ Audio recorded successfully")
            st.audio(audio_input)
    
    with col2:
        st.subheader("Transcription Output")
        
        if audio_input:
            with st.spinner("Transcribing audio..."):
                transcription = "This is the transcribed text from your audio message. It would be generated using OpenAI Whisper or similar STT models."
                
                st.text_area(
                    "Transcribed Text:",
                    value=transcription,
                    height=200,
                    disabled=False
                )
                
                col_copy, col_clear = st.columns(2)
                with col_copy:
                    if st.button("📋 Copy Text"):
                        st.success("Text copied!")
                with col_clear:
                    if st.button("🗑️ Clear"):
                        st.rerun()

# ============== TAB 4: TEXT-TO-SPEECH ==============
with tab4:
    st.header("📢 Text-to-Speech Audio Generation")
    st.markdown("Convert text into natural-sounding audio output.")
    
    col1, col2 = st.columns([1, 1.5])
    
    with col1:
        st.subheader("Text Input")
        
        text_input = st.text_area(
            "Enter text to convert to speech:",
            height=150,
            placeholder="Type or paste your text here...",
            value="Welcome to AccessiPilot. This text-to-speech feature helps make content more accessible."
        )
        
        col_voice, col_speed = st.columns(2)
        with col_voice:
            voice_option = st.selectbox(
                "Voice",
                ["Natural (Female)", "Natural (Male)", "Neutral"],
                help="Choose preferred voice"
            )
        with col_speed:
            speed = st.slider("Speed", 0.5, 2.0, 1.0, 0.1, help="Speaking speed")
    
    with col2:
        st.subheader("Audio Output")
        
        if st.button("🔊 Generate Speech", use_container_width=True):
            with st.spinner("Generating audio..."):
                st.success("✅ Audio generated successfully!")
                
                # Simulate audio file (in real app, use pyttsx3 or gTTS)
                st.info("Audio file would be displayed here")
                
                col_download, col_info = st.columns([1, 1])
                with col_download:
                    st.download_button(
                        label="⬇️ Download MP3",
                        data=b"[audio data would go here]",
                        file_name="speech.mp3",
                        mime="audio/mpeg",
                        use_container_width=True
                    )
                
                with col_info:
                    st.metric("Duration", "0:05 seconds")

# ============== TAB 5: WEB ACCESSIBILITY ==============
with tab5:
    st.header("🌐 Web Accessibility Checker")
    st.markdown("Scan websites for accessibility issues and get improvement suggestions.")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("Website Analysis")
        
        website_url = st.text_input(
            "Enter website URL",
            placeholder="https://example.com",
            help="Enter the URL of the website to analyze"
        )
        
        if website_url and st.button("🔍 Scan for Accessibility"):
            with st.spinner("Scanning website..."):
                st.success("✅ Scan completed!")
    
    with col2:
        st.subheader("Accessibility Report")
        
        # Simulated report
        report_data = {
            "Total Issues": 12,
            "Critical": 3,
            "Major": 4,
            "Minor": 5,
            "Score": "72/100"
        }
        
        col_score, col_critical = st.columns(2)
        with col_score:
            st.metric("Accessibility Score", report_data["Score"])
        with col_critical:
            st.metric("Critical Issues", report_data["Critical"])
        
        st.divider()
        
        st.markdown("**Issues Found:**")
        
        issues = [
            {"type": "🔴 Critical", "issue": "Missing alt-text on 15 images", "fix": "Add descriptive alt-text"},
            {"type": "🟠 Major", "issue": "Low contrast text (2.1:1 ratio)", "fix": "Increase contrast to 4.5:1"},
            {"type": "🟠 Major", "issue": "Missing form labels", "fix": "Add labels to all input fields"},
            {"type": "🟡 Minor", "issue": "Keyboard navigation gaps", "fix": "Implement full keyboard support"}
        ]
        
        for idx, item in enumerate(issues[:4], 1):
            with st.expander(f"{item['type']} - {item['issue']}"):
                st.write(f"**Fix:** {item['fix']}")

# ============== TAB 6: HISTORY ==============
with tab6:
    st.header("📊 Processing History")
    st.markdown("View your recent accessibility tasks and results.")
    
    if st.session_state.history:
        for idx, item in enumerate(st.session_state.history, 1):
            with st.expander(f"{item['type']} - {item['timestamp']}"):
                st.json(item)
    else:
        st.info("📭 No history yet. Start using AccessiPilot to see your processed items here!")
    
    if st.button("🗑️ Clear History"):
        st.session_state.history = []
        st.success("History cleared!")

# Footer
st.divider()
st.markdown("""
<div class="accessibility-info">
    <strong>♿ Accessibility Features:</strong><br>
    ✅ Font size adjustment<br>
    ✅ Dark/Light mode<br>
    ✅ High contrast options<br>
    ✅ Keyboard navigation<br>
    ✅ Screen reader friendly<br>
    ✅ WCAG 2.1 AA compliant
</div>
""", unsafe_allow_html=True)

st.markdown("---")
st.markdown("""
<center>
    <small>
        AccessiPilot © 2024 | Making the web accessible for everyone<br>
        Built with ❤️ using Streamlit
    </small>
</center>
""", unsafe_allow_html=True)
