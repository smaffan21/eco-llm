# GreenPromptAI 🌱

A tool that compresses text prompts using LLM-Lingua or similar algorithms, then calculates token savings and estimates carbon emission reduction.

## Features

- **Prompt Compression**: Compress long prompts while preserving meaning
- **Token Analysis**: Count tokens before and after compression
- **Environmental Impact**: Calculate energy and CO₂ savings
- **Green UI**: Clean interface with sustainability-focused design
- **Progress Tracking**: Visual progress bars for environmental impact

## Tech Stack

- **Backend**: Python + FastAPI
- **Frontend**: React + TypeScript + Material-UI
- **Compression**: LLM-Lingua (with fallback compression)

## Installation & Setup

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the FastAPI server:**
   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check with compression method info
- `POST /compress` - Compress a prompt

## Usage

1. Open the web interface at `http://localhost:3000`
2. Paste your text prompt in the input field
3. Click "Compress Prompt" to see the results
4. View original vs compressed prompts, token counts, and environmental impact

## Environmental Impact Calculation

The app estimates:
- **Energy Saved**: 0.0003 kWh per token saved
- **CO₂ Saved**: Energy saved × 0.475 kg CO₂/kWh

## Compression Methods

- **LLM-Lingua**: Advanced compression using large language models (when available)
- **Simple Compression**: Fallback method using sentence-based truncation

## Contributing

Feel free to contribute improvements to the compression algorithms or UI design!
