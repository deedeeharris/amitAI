class BotPreview {
    constructor() {
        this.isExpanded = false;
        this.isMinimized = true;
        this.container = null;
        this.messages = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createWidget();
                this.attachEventListeners();
            });
        } else {
            this.createWidget();
            this.attachEventListeners();
        }
    }

    createWidget() {
        const template = `
            <div class="bot-preview-widget" data-minimized="true">
                <div class="preview-circle" title="בדוק את המלווה">
                    <i class="fas fa-robot"></i>
                    <span class="notification-badge" style="display: none">1</span>
                </div>
                
                <div class="preview-window">
                    <div class="preview-header">
                        <div class="header-info">
                            <div class="bot-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="bot-info">
                                <h3 class="bot-name">תצוגה מקדימה של המלווה</h3>
                                <span class="bot-status">מחובר</span>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button class="minimize-window" title="מזער">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="expand-window" title="הרחב">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>

                    <div class="preview-messages">
                        <div class="welcome-message">
                            <p>שלום! אני המלווה החדש שלך. איך אוכל לעזור?</p>
                        </div>
                    </div>

                    <div class="preview-input">
                        <textarea 
                            class="message-input" 
                            placeholder="הקלד הודעה..."
                            rows="1"
                        ></textarea>
                        <button class="send-message" title="שלח">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>`;

        // Create temporary container
        const temp = document.createElement('div');
        temp.innerHTML = template;
        
        // Get the widget element
        this.container = temp.firstElementChild;
        
        // Append to body
        document.body.appendChild(this.container);
    }

    attachEventListeners() {
        // Circle click - toggle minimize
        const previewCircle = this.container.querySelector('.preview-circle');
        previewCircle.addEventListener('click', () => this.toggleMinimize());

        // Minimize button
        const minimizeBtn = this.container.querySelector('.minimize-window');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimize();
        });

        // Expand button
        const expandBtn = this.container.querySelector('.expand-window');
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExpand();
        });

        // Send message
        const sendBtn = this.container.querySelector('.send-message');
        const messageInput = this.container.querySelector('.message-input');

        sendBtn.addEventListener('click', () => this.handleSendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = messageInput.scrollHeight + 'px';
        });
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.container.setAttribute('data-minimized', this.isMinimized);
        
        // Hide notification badge when opening
        if (!this.isMinimized) {
            this.container.querySelector('.notification-badge').style.display = 'none';
        }
    }

    minimize() {
        this.isMinimized = true;
        this.container.setAttribute('data-minimized', 'true');
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        this.container.classList.toggle('expanded', this.isExpanded);
        
        const expandBtn = this.container.querySelector('.expand-window i');
        expandBtn.className = this.isExpanded ? 'fas fa-compress' : 'fas fa-expand';
    }

    handleSendMessage() {
        const messageInput = this.container.querySelector('.message-input');
        const message = messageInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Simulate bot response
        this.simulateBotResponse(message);
    }

    addMessage(type, content) {
        const messagesContainer = this.container.querySelector('.preview-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${this.getFormattedTime()}</span>
            </div>`;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show notification if minimized
        if (type === 'bot' && this.isMinimized) {
            const badge = this.container.querySelector('.notification-badge');
            badge.style.display = 'block';
        }

        // Store message
        this.messages.push({ type, content, timestamp: new Date() });
    }

    simulateBotResponse(userMessage) {
        // Add typing indicator
        this.showTypingIndicator();

        // Simulate API delay
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // Example response logic (replace with actual bot response)
            let response = "אני מבין את השאלה שלך";
            if (userMessage.includes("?")) {
                response += " ואשמח לעזור. ";
            } else {
                response += " ואשתדל לסייע. ";
            }
            response += "האם תוכל לפרט יותר?";

            this.addMessage('bot', response);
        }, 1500);
    }

    showTypingIndicator() {
        const messagesContainer = this.container.querySelector('.preview-messages');
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

    getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    updateBotName(name) {
        const botName = this.container.querySelector('.bot-name');
        botName.textContent = name || 'תצוגה מקדימה של המלווה';
    }

    clearChat() {
        const messagesContainer = this.container.querySelector('.preview-messages');
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <p>שלום! אני המלווה החדש שלך. איך אוכל לעזור?</p>
            </div>`;
        this.messages = [];
    }
}

export default BotPreview;
