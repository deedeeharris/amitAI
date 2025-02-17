// Create bot page main functionality
document.addEventListener('DOMContentLoaded', () => {
    // Temperature slider functionality
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.querySelector('.temperature-value');
    
    if (temperatureSlider && temperatureValue) {
        temperatureSlider.addEventListener('input', (e) => {
            temperatureValue.textContent = e.target.value;
        });
    }

    // URL import functionality
    const urlInput = document.getElementById('url-import');
    const addUrlButton = document.querySelector('.add-url');
    const sourcesList = document.querySelector('.sources-list');

    if (urlInput && addUrlButton && sourcesList) {
        addUrlButton.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                addSource('url', url);
                urlInput.value = '';
            }
        });

        // Handle Enter key in URL input
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addUrlButton.click();
            }
        });
    }

    // Manual input functionality
    const manualInput = document.getElementById('manual-input');
    let manualInputTimeout;

    if (manualInput) {
        manualInput.addEventListener('input', () => {
            clearTimeout(manualInputTimeout);
            manualInputTimeout = setTimeout(() => {
                const content = manualInput.value.trim();
                if (content) {
                    addSource('text', content);
                    manualInput.value = '';
                }
            }, 1000);
        });
    }

    // Chat preview functionality
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-message');
    const chatPreview = document.getElementById('chat-preview');
    const resetChat = document.querySelector('.reset-chat');

    if (chatInput && sendButton && chatPreview) {
        sendButton.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                addMessage('user', message);
                chatInput.value = '';
                // Simulate bot response
                simulateBotResponse();
            }
        });

        // Handle Enter key in chat input
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendButton.click();
            }
        });
    }

    if (resetChat && chatPreview) {
        resetChat.addEventListener('click', () => {
            chatPreview.innerHTML = '';
        });
    }

    // Helper functions
    function addSource(type, content) {
        if (!sourcesList) return;

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
        if (!chatPreview) return;

        const message = document.createElement('div');
        message.className = `message ${type}`;
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        message.appendChild(messageContent);
        chatPreview.appendChild(message);
        chatPreview.scrollTop = chatPreview.scrollHeight;
    }

    function simulateBotResponse() {
        if (!chatPreview) return;

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot';
        loadingMessage.innerHTML = `
            <div class="message-content typing">
                <div class="typing-indicator">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        `;
        chatPreview.appendChild(loadingMessage);
        chatPreview.scrollTop = chatPreview.scrollHeight;

        setTimeout(() => {
            loadingMessage.remove();
            addMessage('bot', 'זוהי תשובת הדגמה מהמלווה. בהפצה, התשובות יתבססו על מקורות המידע והגדרות האישיות שהוגדרו.');
        }, 1500);
    }
});