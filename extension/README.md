# Haiat Browser Extension

## 🚀 Quick Setup & Testing

### 1. **Install the Extension**
1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `extension` folder from your project

### 2. **Start Your Backend**
```bash
python app.py
```

### 3. **Test the Extension**
1. Go to ChatGPT, Claude, or any AI chat site
2. Type a long prompt (50+ characters)
3. Click the "⚡ Compress" button that appears
4. See compression results and efficiency metrics!

## 🎯 How It Works

- **Auto-Detection**: Finds prompt input fields on AI chat sites
- **One-Click Compression**: Compress prompts with a single button click
- **Visual Results**: Shows before/after comparison and efficiency impact
- **Smart Fallback**: Works even if LLM-Lingua isn't available

## 🔧 Supported Sites
- ChatGPT (chat.openai.com)
- Claude (claude.ai)
- Google Bard (bard.google.com)
- Perplexity (perplexity.ai)

## 📊 Features
- Real-time compression with your backend API
- Token and energy savings tracking
- Modern blue UI with compression results
- Extension popup with stats and testing
