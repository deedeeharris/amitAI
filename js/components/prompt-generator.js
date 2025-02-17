class PromptGenerator {
    constructor() {
        this.chatHistory = [];
        this.currentPrompt = '';
        this.container = null;
        this.init();
    }

    init() {
        this.createChatInterface();
        this.attachEventListeners();
    }

    createChatInterface() {
        const template = `
            <div class="prompt-generator">
                <div class="chat-section">
                    <div class="chat-header">
                        <h3>צ'אט ליצירת פרומפט</h3>
                        <p class="chat-subtitle">בואו ניצור יחד את האישיות המושלמת למלווה שלך</p>
                    </div>
                    <div class="chat-messages"></div>
                    <div class="chat-input-area">
                        <textarea 
                            class="chat-input" 
                            placeholder="תאר את האישיות הרצויה למלווה שלך..."
                            rows="3"
                        ></textarea>
                        <button class="send-message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                <div class="prompt-preview">
                    <div class="preview-header">
                        <h3>תצוגה מקדימה של הפרומפט</h3>
                        <div class="preview-actions">
                            <button class="copy-prompt">
                                <i class="fas fa-copy"></i>
                                העתק
                            </button>
                            <button class="reset-prompt">
                                <i class="fas fa-redo"></i>
                                אפס
                            </button>
                        </div>
                    </div>
                    <div class="preview-content"></div>
                </div>
                <div class="general-instructions">
                    <h3>הנחיות כלליות</h3>
                    <textarea 
                        class="instructions-input" 
                        placeholder="הוסף הנחיות כלליות למלווה..."
                        rows="4"
                    ></textarea>
                </div>
            </div>`;

        // Insert the template into the page
        const targetContainer = document.querySelector('[data-step="3"] .form-section');
        targetContainer.insertAdjacentHTML('beforeend', template);
        this.container = targetContainer.querySelector('.prompt-generator');
    }

    attachEventListeners() {
        const sendButton = this.container.querySelector('.send-message');
        const chatInput = this.container.querySelector('.chat-input');
        const copyButton = this.container.querySelector('.copy-prompt');
        const resetButton = this.container.querySelector('.reset-prompt');
        const instructionsInput = this.container.querySelector('.instructions-input');

        sendButton.addEventListener('click', () => this.handleSendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        copyButton.addEventListener('click', () => this.copyPromptToClipboard());
        resetButton.addEventListener('click', () => this.resetPrompt());
        instructionsInput.addEventListener('input', () => this.updatePrompt());
    }

    handleSendMessage() {
        const chatInput = this.container.querySelector('.chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        chatInput.value = '';

        // Simulate AI response (replace with actual API call)
        this.simulateAIResponse(message);
    }

    addMessage(type, content) {
        const messagesContainer = this.container.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}-message`;
        
        messageElement.innerHTML = `
            <div class="message-content">
                <span class="message-text">${content}</span>
                <span class="message-time">${this.getFormattedTime()}</span>
            </div>`;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to chat history
        this.chatHistory.push({ type, content });
        this.updatePrompt();
    }

    simulateAIResponse(userMessage) {
        // Add typing indicator
        this.showTypingIndicator();

        // Simulate API delay
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // Example response logic (replace with actual AI response)
            let response = "אני מבין שאתה רוצה ליצור מלווה ";
            if (userMessage.includes("מורה")) {
                response += "שמתפקד כמורה תומך ומעודד. ";
            } else if (userMessage.includes("חבר")) {
                response += "שמתפקד כחבר קרוב ותומך. ";
            }
            response += "האם תוכל לפרט יותר על סגנון התקשורת המועדף?";

            this.addMessage('assistant', response);
        }, 1000);
    }

    showTypingIndicator() {
        const messagesContainer = this.container.querySelector('.chat-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = this.container.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updatePrompt() {
        const previewContent = this.container.querySelector('.preview-content');
        const instructionsInput = this.container.querySelector('.instructions-input');
        
        // Build prompt from chat history and instructions
        let prompt = "הנחיות למלווה למידה:\n\n";
        
        // Add general instructions
        const instructions = instructionsInput.value.trim();
        if (instructions) {
            prompt += "הנחיות כלליות:\n" + instructions + "\n\n";
        }

        // Add personality traits from chat
        prompt += "אישיות ותכונות:\n";
        this.chatHistory.forEach(message => {
            if (message.type === 'user') {
                prompt += "- " + message.content + "\n";
            }
        });

        this.currentPrompt = prompt;
        previewContent.textContent = prompt;
    }

    copyPromptToClipboard() {
        navigator.clipboard.writeText(this.currentPrompt)
            .then(() => {
                const copyButton = this.container.querySelector('.copy-prompt');
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i> הועתק!';
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy prompt:', err);
            });
    }

    resetPrompt() {
        this.chatHistory = [];
        this.currentPrompt = '';
        
        // Clear UI
        this.container.querySelector('.chat-messages').innerHTML = '';
        this.container.querySelector('.instructions-input').value = '';
        this.container.querySelector('.preview-content').textContent = '';
    }

    getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

export default PromptGenerator;
