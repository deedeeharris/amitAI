/**
 * Preview Chat Sidebar Component
 * Manages the chat interface for testing the bot during creation
 */
class PreviewChatSidebar {
    constructor() {
        this.sidebarElement = document.querySelector('.chat-preview');
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.send-button');
        this.botName = 'מלווה חדש';
        this.botDescription = '';
    }
    
    /**
     * Initialize the component
     */
    init() {
        if (!this.sidebarElement || !this.chatMessages || !this.chatInput || !this.sendButton) {
            console.error('Preview chat sidebar elements not found');
            return;
        }

        // Add event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Add initial welcome message
        this.addBotMessage(this.getWelcomeMessage());

        console.log('Preview chat sidebar initialized');
    }
    
    /**
     * Send a message from the user
     */
    sendMessage() {
        const messageText = this.chatInput.value.trim();
        if (messageText) {
            this.addUserMessage(messageText);
            this.chatInput.value = '';
            
            // Simulate bot response after a short delay
            setTimeout(() => {
                const botResponse = this.generateBotResponse(messageText);
                this.addBotMessage(botResponse);
            }, 1000);
        }
    }
    
    /**
     * Add a user message to the chat
     */
    addUserMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        messageElement.textContent = text;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    /**
     * Add a bot message to the chat
     */
    addBotMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message bot-message';
        messageElement.textContent = text;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    /**
     * Scroll the chat to the bottom
     */
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    /**
     * Generate a welcome message based on bot configuration
     */
    getWelcomeMessage() {
        if (this.botDescription) {
            return `שלום, אני ${this.botName}. ${this.botDescription}`;
        } else {
            return `שלום, אני ${this.botName}. איך אוכל לעזור לך?`;
        }
    }
    
    /**
     * Generate a simulated bot response based on user input
     */
    generateBotResponse(userMessage) {
        // Simple response generation based on user message
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('שלום') || lowerMessage.includes('היי')) {
            return `שלום! איך אני יכול לעזור לך היום?`;
        } else if (lowerMessage.includes('?')) {
            return `זו שאלה מעניינת. אני אשמח לעזור לך למצוא תשובה.`;
        } else if (lowerMessage.includes('תודה')) {
            return `בשמחה! אני כאן כדי לעזור.`;
        } else {
            return `אני מבין. האם תרצה לדעת עוד על הנושא?`;
        }
    }
    
    /**
     * Update bot name and description
     */
    updateBotInfo(name, description) {
        if (name) {
            this.botName = name;
        }
        
        if (description !== undefined) {
            this.botDescription = description;
        }
        
        // Update the first message if it exists
        const firstMessage = this.chatMessages.querySelector('.chat-message.bot-message');
        if (firstMessage) {
            firstMessage.textContent = this.getWelcomeMessage();
        }
    }
} 