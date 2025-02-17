class PersonalitySettings {
    constructor() {
        this.currentPrompt = '';
        this.promptGenerator = null;
        this.isChatOpen = false;
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const styleSelect = document.querySelector('.personality-style');
        const openChatBtn = document.querySelector('.open-prompt-chat');

        styleSelect?.addEventListener('change', (e) => {
            this.updatePersonalityStyle(e.target.value);
        });

        openChatBtn?.addEventListener('click', () => {
            if (!this.promptGenerator) {
                // Initialize prompt generator when needed
                import('./prompt-generator.js').then(module => {
                    this.promptGenerator = new module.default();
                });
            }
            this.openPromptChat();
        });
    }

    updatePersonalityStyle(style) {
        // Update base prompt based on selected personality style
        const basePrompts = {
            'friendly': 'מלווה ידידותי ונגיש שמדבר בגובה העיניים',
            'professional': 'מלווה מקצועי ורשמי עם דגש על דיוק ובהירות',
            'supportive': 'מלווה תומך ומעודד שנותן חיזוקים חיוביים',
            'challenging': 'מלווה מאתגר שדוחף את התלמידים לחשיבה עמוקה'
        };

        this.currentPrompt = basePrompts[style] || '';
        this.updatePromptPreview();
    }

    updatePromptPreview() {
        const previewElement = document.querySelector('.prompt-content');
        if (previewElement && this.currentPrompt) {
            previewElement.textContent = this.currentPrompt;
        }
    }

    openPromptChat() {
        if (this.isChatOpen) return;

        // Create chat interface
        const chatContainer = document.createElement('div');
        chatContainer.className = 'prompt-chat-container';
        chatContainer.innerHTML = `
            <div class="prompt-chat-header">
                <h3>יצירת פרומפט</h3>
                <button class="close-chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="prompt-chat-messages"></div>
            <div class="prompt-chat-input">
                <textarea placeholder="תאר את אופי המלווה..."></textarea>
                <button class="send-message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const closeBtn = chatContainer.querySelector('.close-chat');
        const sendBtn = chatContainer.querySelector('.send-message');
        const textarea = chatContainer.querySelector('textarea');

        closeBtn.addEventListener('click', () => this.closePromptChat(chatContainer));
        sendBtn.addEventListener('click', () => this.sendMessage(textarea.value));
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage(textarea.value);
                textarea.value = '';
            }
        });

        // Add to page
        document.body.appendChild(chatContainer);
        this.isChatOpen = true;
        textarea.focus();
    }

    closePromptChat(container) {
        container.remove();
        this.isChatOpen = false;
    }

    async sendMessage(message) {
        if (!message.trim()) return;

        const messagesContainer = document.querySelector('.prompt-chat-messages');
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user-message';
        userMsg.textContent = message;
        messagesContainer.appendChild(userMsg);

        // Add loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'chat-message system-message';
        loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> מעבד...';
        messagesContainer.appendChild(loadingMsg);

        try {
            // TODO: Call AI API to process message and generate/update prompt
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update prompt
            this.currentPrompt = 'Updated prompt based on chat: ' + message;
            this.updatePromptPreview();

            // Replace loading with response
            loadingMsg.innerHTML = 'עדכנתי את הפרומפט בהתאם להנחיות שלך';
            
        } catch (error) {
            console.error('Failed to process message:', error);
            loadingMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> שגיאה בעיבוד ההודעה';
        }

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    activate() {
        // This method is called when step 4 becomes active
        const styleSelect = document.querySelector('.personality-style');
        if (styleSelect && styleSelect.value) {
            this.updatePersonalityStyle(styleSelect.value);
        }
    }
}

export default PersonalitySettings;
