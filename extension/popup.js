// GreenPromptAI Extension Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const totalCompressions = document.getElementById('totalCompressions');
  const totalSavings = document.getElementById('totalSavings');
  const testCompressionBtn = document.getElementById('testCompression');
  const openWebAppBtn = document.getElementById('openWebApp');

  // Check backend connection
  await checkConnection();

  // Load saved stats
  loadStats();

  // Event listeners
  testCompressionBtn.addEventListener('click', testCompression);
  openWebAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });

  async function checkConnection() {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        const data = await response.json();
        statusDiv.className = 'status connected';
        statusDiv.querySelector('.status-text').textContent = 
          `✓ Connected (${data.llmlingua_available ? 'LLM-Lingua' : 'Simple'})`;
      } else {
        throw new Error('Server not responding');
      }
    } catch (error) {
      statusDiv.className = 'status disconnected';
      statusDiv.querySelector('.status-text').textContent = '✗ Backend not running';
    }
  }

  async function testCompression() {
    testCompressionBtn.disabled = true;
    testCompressionBtn.textContent = 'Testing...';

    try {
      const response = await fetch('http://localhost:8000/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'This is a test prompt to verify that the compression functionality is working correctly. It should be compressed to save tokens and energy.',
          compression_ratio: 1.5
        })
      });

      if (response.ok) {
        const result = await response.json();
        showNotification('Test successful! ' + result.tokens_saved + ' tokens saved', 'success');
        
        // Update stats
        updateStats(result.tokens_saved);
      } else {
        throw new Error('Compression failed');
      }
    } catch (error) {
      showNotification('Test failed: ' + error.message, 'error');
    } finally {
      testCompressionBtn.disabled = false;
      testCompressionBtn.textContent = 'Test Compression';
    }
  }

  function loadStats() {
    chrome.storage.local.get(['totalCompressions', 'totalSavings'], (result) => {
      totalCompressions.textContent = result.totalCompressions || 0;
      totalSavings.textContent = result.totalSavings || 0;
    });
  }

  function updateStats(tokensSaved) {
    chrome.storage.local.get(['totalCompressions', 'totalSavings'], (result) => {
      const newCompressions = (result.totalCompressions || 0) + 1;
      const newSavings = (result.totalSavings || 0) + tokensSaved;
      
      chrome.storage.local.set({
        totalCompressions: newCompressions,
        totalSavings: newSavings
      });
      
      totalCompressions.textContent = newCompressions;
      totalSavings.textContent = newSavings;
    });
  }

  function showNotification(message, type) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      max-width: 250px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }
});
