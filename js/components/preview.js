/**
 * Bot Preview Component
 * Handles the chat preview functionality
 */
class BotPreview {
    constructor(containerId = 'bot-preview') {
        this.container = document.getElementById(containerId);
        this.messages = [];
        this.isMinimized = false;
        this.botInfo = {
            name: '',
            temperature: CONFIG.BOT.TEMPERATURE.DEFAULT
        };
        
        this.init();
    }

    /**
     * Initialize the preview component
     */
    init() {
        if (!this.container) return;

        // Cache DOM elements
        this.header = this.container.querySelector('.preview-header');
        this.content = this.container.querySelector('.preview-content');
        this.input = this.container.querySelector('.preview-input input');
        this.sendButton = this.container.querySelector('.preview-input button');
        this.minimizeButton = this.container.querySelector('.minimize-btn');
        this.closeButton = this.container.querySelector('.close-preview');

        // Bind event listeners
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Header drag functionality
        this.header.addEventListener('mousedown', this.startDragging.bind(this));
        
        // Minimize/Close buttons
        this.minimizeButton.addEventListener('click', () => this.toggleMinimize());
        this.closeButton.addEventListener('click', () => this.hide());

        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Prevent text selection while dragging
        this.header.addEventListener('selectstart', e => e.preventDefault());
    }

    /**
     * Start dragging the preview window
     * @param {MouseEvent} e 
     */
    startDragging(e) {
        if (e.target.closest('.preview-controls')) return;

        const initialX = e.clientX - this.container.offsetLeft;
        const initialY = e.clientY - this.container.offsetTop;

        const doDrag = (e) => {
            this.container.style.left = `${e.clientX - initialX}px`;
            this.container.style.top = `${e.clientY - initialY}px`;
        };

        const stopDragging = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDragging);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDragging);
    }

    /**
     * Toggle preview window minimize state
     */
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.container.classList.toggle('minimized', this.isMinimized);
    }

    /**
     * Show the preview window
     */
    show() {
        this.container.style.display = 'flex';
    }

    /**
     * Hide the preview window
     */
    hide() {
        this.container.style.display = 'none';
    }

    /**
     * Update bot information
     * @param {string} name - Bot name
     * @param {number} temperature - Bot temperature
     */
    updateBotInfo(name = null, temperature = null) {
        if (name !== null) this.botInfo.name = name;
        if (temperature !== null) this.botInfo.temperature = temperature;
        
        // Update preview title if name changed
        if (name) {
            const title = this.container.querySelector('.preview-title');
            title.textContent = `שיחה עם ${name}`;
        }
    }

    /**
     * Send a message
     */
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Simulate bot response based on temperature
            await this.simulateBotResponse(message);
        } catch (error) {
            console.error('Error getting bot response:', error);
            this.addMessage('מצטער, אירעה שגיאה. נסה שוב.', 'bot', true);
        }

        // Hide typing indicator
        this.hideTypingIndicator();
    }

    /**
     * Add a message to the chat
     * @param {string} text - Message text
     * @param {string} sender - Message sender (user/bot)
     * @param {boolean} isError - Is error message
     */
    addMessage(text, sender = 'user', isError = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message${isError ? ' error' : ''}`;
        messageElement.textContent = text;

        this.messages.push({ text, sender, timestamp: new Date() });
        this.content.appendChild(messageElement);
        this.scrollToBottom();
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        this.content.appendChild(indicator);
        this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const indicator = this.content.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        this.content.scrollTop = this.content.scrollHeight;
    }

    /**
     * Simulate bot response based on temperature
     * @param {string} userMessage - User's message
     */
    async simulateBotResponse(userMessage) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Generate response based on temperature
        let response;
        if (this.botInfo.temperature < 0.2) {
            response = 'תשובה ממוקדת וקצרה.';
        } else if (this.botInfo.temperature < 0.35) {
            response = 'תשובה מפורטת יותר עם הסברים נוספים.';
        } else {
            response = 'תשובה יצירתית ומגוונת עם דוגמאות והרחבות נוספות.';
        }

        this.addMessage(response, 'bot');
    }

    /**
     * Clear chat history
     */
    clearChat() {
        this.messages = [];
        this.content.innerHTML = '';
    }

    /**
     * Get chat history
     * @returns {Array} Chat messages
     */
    getChatHistory() {
        return [...this.messages];
    }
}

// Initialize preview when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.botPreview = new BotPreview();
});
