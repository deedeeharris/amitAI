// Create bot page main functionality
document.addEventListener('DOMContentLoaded', () => {
    // Temperature slider functionality
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.querySelector('.temperature-value');
    
    temperatureSlider?.addEventListener('input', (e) => {
        temperatureValue.textContent = e.target.value;
    });

    // URL import functionality
    const urlInput = document.getElementById('url-import');
    const addUrlButton = document.querySelector('.add-url');
    const sourcesList = document.querySelector('.sources-list');

    addUrlButton?.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            addSource('url', url);
            urlInput.value = '';
        }
    });

    // Manual input functionality
    const manualInput = document.getElementById('manual-input');
    let manualInputTimeout;

    manualInput?.addEventListener('input', () => {
        clearTimeout(manualInputTimeout);
        manualInputTimeout = setTimeout(() => {
            const content = manualInput.value.trim();
            if (content) {
                addSource('text', content);
                manualInput.value = '';
            }
        }, 1000);
    });

    // Chat preview functionality
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-message');
    const chatPreview = document.getElementById('chat-preview');
    const resetChat = document.querySelector('.reset-chat');

    sendButton?.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('user', message);
            chatInput.value = '';
            // Simulate bot response
            simulateBotResponse();
        }
    });

    resetChat?.addEventListener('click', () => {
        chatPreview.innerHTML = '';
    });

    // Helper functions
    function addSource(type, content) {
        const sourceItem = document.createElement('div');
        sourceItem.className = 'source-item';
        sourceItem.innerHTML = `
            <i class="fas fa-${type === 'url' ? 'link' : 'file-alt'}"></i>
            <span>${content}</span>
            <button class="remove-source">
                <i class="fas fa-times"></i>
            </button>
        `;
        sourcesList.appendChild(sourceItem);

        sourceItem.querySelector('.remove-source').addEventListener('click', () => {
            sourceItem.remove();
        });
    }

    function addMessage(type, content) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = content;
        chatPreview.appendChild(message);
        chatPreview.scrollTop = chatPreview.scrollHeight;
    }

    function simulateBotResponse() {
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot typing';
        loadingMessage.innerHTML = '<div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
        chatPreview.appendChild(loadingMessage);
        chatPreview.scrollTop = chatPreview.scrollHeight;

        setTimeout(() => {
            loadingMessage.remove();
            addMessage('bot', 'זוהי תשובת הדגמה מהמלווה. בהפצה, התשובות יתבססו על מקורות המידע והגדרות האישיות שהוגדרו.');
        }, 1500);
    }
});