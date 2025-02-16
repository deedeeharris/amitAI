// Bot Preview Management
class BotPreview {
    constructor() {
        // Only initialize if we're on the create bot screen
        const createBotScreen = document.getElementById('create-bot-screen');
        if (!createBotScreen || !createBotScreen.classList.contains('active')) {
            return;
        }

        this.panel = document.getElementById('bot-preview-panel');
        if (!this.panel) return;

        this.chatContainer = this.panel.querySelector('.chat-messages');
        this.input = this.panel.querySelector('.chat-input input');
        this.sendButton = this.panel.querySelector('.send-message');
        this.minimizeButton = this.panel.querySelector('.minimize-btn');
        
        // Set default values
        this.botName = 'המלווה';
        this.temperature = 0.3;

        this.initialize();
    }

    initialize() {
        if (!this.panel || !this.chatContainer || !this.input || !this.sendButton || !this.minimizeButton) {
            console.warn('Bot preview elements not found');
            return;
        }

        // Initialize event listeners
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSend();
            }
        });

        this.minimizeButton.addEventListener('click', () => {
            this.panel.classList.toggle('minimized');
            const icon = this.minimizeButton.querySelector('i');
            if (icon) {
                icon.className = this.panel.classList.contains('minimized') ? 'fas fa-expand' : 'fas fa-minus';
            }
        });

        // Add initial greeting
        this.addBotMessage(`שלום! אני ${this.botName}, המלווה החינוכי שלך. איך אוכל לעזור?`);
        
        // Set initial visibility
        this.panel.style.display = 'flex';
    }

    updateBotInfo(name, temperature) {
        if (name) {
            this.botName = name;
            const titleElement = this.panel.querySelector('.preview-title');
            if (titleElement) {
                titleElement.textContent = name;
            }
        }
        if (temperature !== undefined) {
            this.temperature = temperature;
        }
    }

    async handleSend() {
        if (!this.input) return;
        
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addUserMessage(message);
        this.input.value = '';

        // Get bot response
        try {
            const response = await mockService.getBotResponse(message, {
                name: this.botName,
                temperature: this.temperature
            });
            this.addBotMessage(response);
        } catch (error) {
            console.error('Error getting bot response:', error);
            this.addBotMessage('מצטער, נתקלתי בבעיה. אנא נסה שוב.');
        }
    }

    addUserMessage(text) {
        if (!this.chatContainer) return;
        
        const message = document.createElement('div');
        message.className = 'chat-message user-message';
        message.textContent = text;
        this.chatContainer.appendChild(message);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        if (!this.chatContainer) return;
        
        const message = document.createElement('div');
        message.className = 'chat-message bot-message';
        
        // Add typing indicator
        message.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        this.chatContainer.appendChild(message);
        this.scrollToBottom();

        // Simulate typing delay
        setTimeout(() => {
            message.textContent = text;
            this.scrollToBottom();
        }, 1000);
    }

    scrollToBottom() {
        if (this.chatContainer) {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    clear() {
        if (this.chatContainer) {
            this.chatContainer.innerHTML = '';
            this.addBotMessage(`שלום! אני ${this.botName}, המלווה החינוכי שלך. איך אוכל לעזור?`);
        }
    }
}

// Initialize bot preview only when DOM is loaded and we're on the create bot screen
document.addEventListener('DOMContentLoaded', () => {
    const createBotScreen = document.getElementById('create-bot-screen');
    if (createBotScreen && createBotScreen.classList.contains('active')) {
        window.botPreview = new BotPreview();
    }
});
