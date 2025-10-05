// GreenPromptAI Browser Extension Content Script

class PromptCompressor {
  constructor() {
    this.apiUrl = 'http://localhost:8000';
    this.compressionButton = null;
    this.isCompressing = false;
    this.init();
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupUI());
    } else {
      this.setupUI();
    }

    // Re-setup UI when navigating (for SPAs)
    this.observeNavigation();
  }

  setupUI() {
    // Find text areas and inputs where users type prompts
    const textAreas = document.querySelectorAll('textarea, input[type="text"]');
    
    textAreas.forEach(textArea => {
      if (this.isPromptInput(textArea)) {
        this.addCompressionButton(textArea);
      }
    });
  }

  isPromptInput(element) {
    // Check if this looks like a prompt input
    const placeholder = element.placeholder?.toLowerCase() || '';
    const className = element.className?.toLowerCase() || '';
    const id = element.id?.toLowerCase() || '';
    
    const promptKeywords = [
      'message', 'prompt', 'question', 'ask', 'chat', 'input',
      'what', 'how', 'tell', 'explain', 'describe'
    ];
    
    return promptKeywords.some(keyword => 
      placeholder.includes(keyword) || 
      className.includes(keyword) || 
      id.includes(keyword)
    );
  }

  addCompressionButton(textArea) {
    // Don't add button if already exists
    if (textArea.parentNode.querySelector('.greenpromptai-btn')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'greenpromptai-btn';
    button.innerHTML = '🌱 Compress';
    button.title = 'Compress prompt to save tokens and energy';
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.compressPrompt(textArea);
    });

    // Insert button after the textarea
    textArea.parentNode.insertBefore(button, textArea.nextSibling);
  }

  async compressPrompt(textArea) {
    const originalText = textArea.value.trim();
    
    if (!originalText) {
      this.showNotification('Please enter a prompt first', 'warning');
      return;
    }

    if (originalText.length < 50) {
      this.showNotification('Prompt is too short to benefit from compression', 'info');
      return;
    }

    this.isCompressing = true;
    this.updateButtonState(textArea, true);

    try {
      const response = await fetch(`${this.apiUrl}/compress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: originalText,
          compression_ratio: 1.5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Show compression results
      this.showCompressionResults(originalText, result);
      
      // Update textarea with compressed version
      textArea.value = result.compressed_prompt;
      
      // Trigger input event to notify the app
      textArea.dispatchEvent(new Event('input', { bubbles: true }));

    } catch (error) {
      console.error('Compression error:', error);
      this.showNotification('Failed to compress prompt. Make sure the backend server is running.', 'error');
    } finally {
      this.isCompressing = false;
      this.updateButtonState(textArea, false);
    }
  }

  updateButtonState(textArea, isCompressing) {
    const button = textArea.parentNode.querySelector('.greenpromptai-btn');
    if (button) {
      if (isCompressing) {
        button.innerHTML = '⏳ Compressing...';
        button.disabled = true;
      } else {
        button.innerHTML = '🌱 Compress';
        button.disabled = false;
      }
    }
  }

  showCompressionResults(original, result) {
    const modal = document.createElement('div');
    modal.className = 'greenpromptai-modal';
    modal.innerHTML = `
      <div class="greenpromptai-modal-content">
        <div class="greenpromptai-modal-header">
          <h3>🌱 Compression Results</h3>
          <button class="greenpromptai-close">&times;</button>
        </div>
        <div class="greenpromptai-results">
          <div class="greenpromptai-metric">
            <span class="label">Compression Ratio:</span>
            <span class="value compression">${result.compression_ratio}x</span>
          </div>
          <div class="greenpromptai-metric">
            <span class="label">Tokens Saved:</span>
            <span class="value savings">${result.tokens_saved}</span>
          </div>
          <div class="greenpromptai-metric">
            <span class="label">Energy Saved:</span>
            <span class="value savings">${result.energy_saved_kwh.toFixed(6)} kWh</span>
          </div>
          <div class="greenpromptai-metric">
            <span class="label">CO₂ Saved:</span>
            <span class="value savings">${result.co2_saved_kg.toFixed(6)} kg</span>
          </div>
        </div>
        <div class="greenpromptai-prompt-comparison">
          <div class="greenpromptai-original">
            <h4>Original (${result.original_tokens} tokens)</h4>
            <p>${original.substring(0, 200)}${original.length > 200 ? '...' : ''}</p>
          </div>
          <div class="greenpromptai-compressed">
            <h4>Compressed (${result.compressed_tokens} tokens)</h4>
            <p>${result.compressed_prompt.substring(0, 200)}${result.compressed_prompt.length > 200 ? '...' : ''}</p>
          </div>
        </div>
        <div class="greenpromptai-actions">
          <button class="greenpromptai-btn-secondary" id="keep-original">Keep Original</button>
          <button class="greenpromptai-btn-primary">Use Compressed</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle modal interactions
    modal.querySelector('.greenpromptai-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('#keep-original').addEventListener('click', () => {
      // Find the textarea and restore original text
      const textAreas = document.querySelectorAll('textarea, input[type="text"]');
      textAreas.forEach(textArea => {
        if (textArea.value === result.compressed_prompt) {
          textArea.value = original;
          textArea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      document.body.removeChild(modal);
    });

    modal.querySelector('.greenpromptai-btn-primary').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `greenpromptai-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  observeNavigation() {
    // For SPAs, observe URL changes
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        setTimeout(() => this.setupUI(), 1000);
      }
    });
    
    observer.observe(document, { subtree: true, childList: true });
  }
}

// Initialize the extension
new PromptCompressor();
