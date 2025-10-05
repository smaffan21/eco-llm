from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import re
import math
from urllib.parse import urlparse, parse_qs
import sys

# Try to import LLM-Lingua, but don't fail if not available
try:
    from llmlingua import PromptCompressor
    LLMLINGUA_AVAILABLE = True
    print("LLM-Lingua is available")
except ImportError:
    LLMLINGUA_AVAILABLE = False
    print("LLM-Lingua not available, using fallback compression")

# Energy consumption constants (estimates)
ENERGY_PER_TOKEN_KWH = 0.0003  # kWh per token
CO2_PER_KWH_KG = 0.475  # kg CO2 per kWh

def estimate_tokens(text: str) -> int:
    """Rough token estimation based on words and characters"""
    # Simple approximation: ~4 characters per token on average
    words = len(text.split())
    chars = len(text)
    # Use a weighted average: words * 1.3 (for punctuation, etc.) + some buffer for formatting
    estimated_tokens = int(words * 1.3 + chars * 0.1)
    return max(estimated_tokens, 1)  # At least 1 token

def simple_compress_prompt(prompt: str, target_ratio: float = 1.5) -> str:
    """Simple compression fallback when LLM-Lingua isn't available"""
    if not prompt or target_ratio <= 1.0:
        return prompt

    # Split into sentences
    sentences = re.split(r'[.!?]+', prompt)
    sentences = [s.strip() for s in sentences if s.strip()]

    if len(sentences) <= 1:
        return prompt

    # Calculate how many sentences to keep
    target_sentences = max(1, int(len(sentences) / target_ratio))

    # Keep the first and most important sentences
    selected_sentences = sentences[:target_sentences]

    # Join back and add ellipsis if we truncated
    compressed = '. '.join(selected_sentences) + '.'
    if len(selected_sentences) < len(sentences):
        compressed += "..."

    return compressed.strip()

class RequestHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == '/':
            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                "message": "GreenPromptAI API is running",
                "llmlingua_available": LLMLINGUA_AVAILABLE
            }
            self.wfile.write(json.dumps(response).encode())

        elif path == '/health':
            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                "status": "healthy",
                "llmlingua_available": LLMLINGUA_AVAILABLE,
                "compression_methods": ["llmlingua" if LLMLINGUA_AVAILABLE else None, "simple"]
            }
            self.wfile.write(json.dumps(response).encode())

        else:
            self.send_response(404)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == '/compress':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode())

                original_prompt = data.get('prompt', '').strip()
                if not original_prompt:
                    self.send_response(400)
                    self.send_cors_headers()
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Prompt cannot be empty"}).encode())
                    return

                compression_ratio = data.get('compression_ratio', 1.5)
                compressed_prompt = original_prompt
                compression_method = "none"

                # Try LLM-Lingua compression if available
                if LLMLINGUA_AVAILABLE:
                    try:
                        compressor = PromptCompressor()
                        compressed_prompt = compressor.compress_prompt(
                            original_prompt,
                            ratio=compression_ratio,
                            target_token=-1  # Let it decide based on ratio
                        )
                        compression_method = "llmlingua"
                    except Exception as e:
                        print(f"LLM-Lingua compression failed: {e}")
                        # Fall back to simple compression
                        compressed_prompt = simple_compress_prompt(original_prompt, compression_ratio)
                        compression_method = "simple_fallback"
                else:
                    # Use simple compression as fallback
                    compressed_prompt = simple_compress_prompt(original_prompt, compression_ratio)
                    compression_method = "simple"

                # Calculate token estimates
                original_tokens = estimate_tokens(original_prompt)
                compressed_tokens = estimate_tokens(compressed_prompt)
                actual_ratio = original_tokens / max(compressed_tokens, 1)

                # Calculate savings
                tokens_saved = max(0, original_tokens - compressed_tokens)
                energy_saved_kwh = tokens_saved * ENERGY_PER_TOKEN_KWH
                co2_saved_kg = energy_saved_kwh * CO2_PER_KWH_KG

                response = {
                    "original_prompt": original_prompt,
                    "compressed_prompt": compressed_prompt,
                    "original_tokens": original_tokens,
                    "compressed_tokens": compressed_tokens,
                    "compression_ratio": round(actual_ratio, 2),
                    "tokens_saved": tokens_saved,
                    "energy_saved_kwh": round(energy_saved_kwh, 6),
                    "co2_saved_kg": round(co2_saved_kg, 6)
                }

                self.send_response(200)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())

            except Exception as e:
                self.send_response(500)
                self.send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())

        else:
            self.send_response(404)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"GreenPromptAI server running on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server(8000)
