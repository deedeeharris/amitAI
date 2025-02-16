// State Management
let state = {
    currentScreen: 'library',
    botData: {
        name: '',
        language: 'he',
        voice: '',
        temperature: 0.3,
        imagePrompt: '',
        imageUrl: ''
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const elements = {
        navButtons: document.querySelectorAll('.nav-button'),
        screens: {
            library: document.getElementById('library-screen'),
            myBots: document.getElementById('my-bots-screen'),
            create: document.getElementById('create-bot-screen')
        },
        preview: {
            panel: document.getElementById('bot-preview'),
            header: document.querySelector('.preview-header'),
            minimizeBtn: document.querySelector('.minimize-btn'),
            closeBtn: document.querySelector('.close-preview')
        },
        form: {
            botName: document.getElementById('bot-name'),
            language: document.getElementById('bot-language'),
            voice: document.getElementById('bot-voice'),
            temperature: document.getElementById('temperature-slider'),
            temperatureValue: document.getElementById('temperature-value'),
            imagePrompt: document.getElementById('image-prompt'),
            generateImage: document.getElementById('generate-image'),
            imagePreview: document.getElementById('image-preview')
        }
    };

    // Navigation handling
    function showScreen(screenId) {
        // Update navigation buttons
        elements.navButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.screen === screenId);
        });

        // Update screens
        Object.values(elements.screens).forEach(screen => {
            if (screen) {
                screen.classList.toggle('active', screen.id === `${screenId}-screen`);
            }
        });

        // Handle bot preview visibility
        if (elements.preview.panel) {
            elements.preview.panel.style.display = screenId === 'create' ? 'flex' : 'none';
        }

        // Save current screen to localStorage
        localStorage.setItem('currentScreen', screenId);
        state.currentScreen = screenId;
        saveState();
    }

    // Attach navigation event listeners
    elements.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const screenId = button.dataset.screen;
            if (screenId) {
                showScreen(screenId);
            }
        });
    });

    // Preview panel controls
    if (elements.preview.header) {
        elements.preview.header.addEventListener('click', (e) => {
            if (!e.target.closest('.preview-controls') && elements.preview.panel) {
                elements.preview.panel.classList.toggle('minimized');
            }
        });
    }

    if (elements.preview.minimizeBtn) {
        elements.preview.minimizeBtn.addEventListener('click', () => {
            if (elements.preview.panel) {
                elements.preview.panel.classList.toggle('minimized');
            }
        });
    }

    if (elements.preview.closeBtn) {
        elements.preview.closeBtn.addEventListener('click', () => {
            if (elements.preview.panel) {
                elements.preview.panel.style.display = 'none';
            }
        });
    }

    // Form controls
    if (elements.form.temperature && elements.form.temperatureValue) {
        elements.form.temperature.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            elements.form.temperatureValue.textContent = value.toFixed(1);
            state.botData.temperature = value;
            saveState();

            // Update bot preview if it exists
            if (window.botPreview) {
                window.botPreview.updateBotInfo(null, value);
            }
        });
    }

    if (elements.form.botName) {
        elements.form.botName.addEventListener('input', (e) => {
            state.botData.name = e.target.value;
            saveState();

            // Update bot preview if it exists
            if (window.botPreview) {
                window.botPreview.updateBotInfo(e.target.value);
            }
        });
    }

    if (elements.form.language) {
        elements.form.language.addEventListener('change', (e) => {
            state.botData.language = e.target.value;
            updateVoiceOptions(e.target.value);
            saveState();
        });
    }

    if (elements.form.voice) {
        elements.form.voice.addEventListener('change', (e) => {
            state.botData.voice = e.target.value;
            saveState();
        });
    }

    if (elements.form.imagePrompt) {
        elements.form.imagePrompt.addEventListener('input', (e) => {
            state.botData.imagePrompt = e.target.value;
            saveState();
        });
    }

    if (elements.form.generateImage) {
        elements.form.generateImage.addEventListener('click', async () => {
            try {
                const imageUrl = await mockGenerateImage();
                if (elements.form.imagePreview) {
                    elements.form.imagePreview.src = imageUrl;
                    state.botData.imageUrl = imageUrl;
                    saveState();
                }
            } catch (error) {
                console.error('Failed to generate image:', error);
            }
        });
    }

    // Load saved state and show initial screen
    loadState();
    const lastScreen = localStorage.getItem('currentScreen') || 'library';
    showScreen(lastScreen);

    // Form Handlers
    class FormHandlers {
        constructor() {
            this.initializeElements();
            this.attachEventListeners();
            this.updateVoiceOptions();
        }

        initializeElements() {
            // Basic Info
            this.botName = document.getElementById('bot-name');
            this.botDescription = document.getElementById('bot-description');
            this.botLanguage = document.getElementById('bot-language');
            this.botVoice = document.getElementById('bot-voice');
            this.temperature = document.getElementById('temperature');
            this.temperatureValue = document.getElementById('temperature-value');
            this.imagePrompt = document.getElementById('image-prompt');
            this.generateImageBtn = document.getElementById('generate-image');
            this.imagePreview = document.getElementById('image-preview');

            // Sources
            this.sourceSearch = document.querySelector('.source-search');
            this.sourceList = document.querySelector('.source-list');
            this.selectedList = document.querySelector('.selected-list');
            this.uploadButton = document.querySelector('.upload-source button');

            // Scenario
            this.scenarioTypes = document.querySelectorAll('input[name="scenario-type"]');
            this.simplePrompt = document.getElementById('simple-prompt');
            this.dynamicPrompt = document.getElementById('dynamic-prompt');
            this.systemPrompt = document.getElementById('system-prompt');
            this.addPromptButton = document.getElementById('add-prompt');
        }

        attachEventListeners() {
            // Basic Info Listeners
            this.botLanguage?.addEventListener('change', () => this.updateVoiceOptions());
            this.temperature?.addEventListener('input', () => this.updateTemperature());
            this.generateImageBtn?.addEventListener('click', () => this.generateImage());

            // Sources Listeners
            this.sourceSearch?.addEventListener('input', (e) => this.filterSources(e.target.value));
            this.uploadButton?.addEventListener('click', () => this.handleFileUpload());

            // Scenario Listeners
            this.scenarioTypes.forEach(type => {
                type.addEventListener('change', () => this.toggleScenarioType());
            });

            this.addPromptButton?.addEventListener('click', () => this.addDynamicPrompt());
        }

        updateVoiceOptions() {
            if (!this.botVoice) return;
            
            const language = this.botLanguage.value;
            this.botVoice.innerHTML = ''; // Clear existing options
            
            const voices = {
                he: [
                    { id: 'he-female-1', name: 'נשי 1' },
                    { id: 'he-female-2', name: 'נשי 2' },
                    { id: 'he-male-1', name: 'גברי 1' },
                    { id: 'he-male-2', name: 'גברי 2' }
                ],
                en: [
                    { id: 'en-female-1', name: 'Female 1' },
                    { id: 'en-female-2', name: 'Female 2' },
                    { id: 'en-male-1', name: 'Male 1' },
                    { id: 'en-male-2', name: 'Male 2' }
                ]
            };

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'בחר קול';
            this.botVoice.appendChild(defaultOption);

            voices[language].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.id;
                option.textContent = voice.name;
                this.botVoice.appendChild(option);
            });
        }

        updateTemperature() {
            if (this.temperatureValue) {
                this.temperatureValue.textContent = this.temperature.value;
            }
        }

        async generateImage() {
            if (!this.imagePrompt?.value) {
                alert('נא להזין תיאור לתמונה');
                return;
            }

            this.generateImageBtn.disabled = true;
            this.generateImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> מייצר תמונה...';

            try {
                // Mock image generation for now
                await new Promise(resolve => setTimeout(resolve, 2000));
                const mockImageUrl = 'https://via.placeholder.com/200x200?text=AI+Bot';
                
                const img = this.imagePreview.querySelector('img');
                img.src = mockImageUrl;
                this.imagePreview.classList.remove('hidden');
            } catch (error) {
                alert('שגיאה ביצירת התמונה. נא לנסות שוב.');
            } finally {
                this.generateImageBtn.disabled = false;
                this.generateImageBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> צור תמונה';
            }
        }

        filterSources(query) {
            // Mock source filtering
            const sources = Array.from(this.sourceList.children);
            sources.forEach(source => {
                const matches = source.textContent.toLowerCase().includes(query.toLowerCase());
                source.style.display = matches ? 'block' : 'none';
            });
        }

        handleFileUpload() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.doc,.docx,.txt';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Mock file upload
                    const sourceElement = document.createElement('div');
                    sourceElement.className = 'selected-source';
                    sourceElement.innerHTML = `
                        <span>${file.name}</span>
                        <button class="remove-source">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    sourceElement.querySelector('.remove-source').onclick = () => {
                        sourceElement.remove();
                    };
                    
                    this.selectedList.appendChild(sourceElement);
                }
            };
            
            input.click();
        }

        toggleScenarioType() {
            const selectedType = document.querySelector('input[name="scenario-type"]:checked').value;
            
            if (selectedType === 'simple') {
                this.simplePrompt.classList.remove('hidden');
                this.dynamicPrompt.classList.add('hidden');
            } else {
                this.simplePrompt.classList.add('hidden');
                this.dynamicPrompt.classList.remove('hidden');
            }
        }

        addDynamicPrompt() {
            const tbody = this.dynamicPrompt.querySelector('tbody');
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <input type="text" placeholder="הגדר תנאי...">
                </td>
                <td>
                    <textarea placeholder="כתוב הנחייה..."></textarea>
                </td>
                <td>
                    <button class="button secondary remove-prompt">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            row.querySelector('.remove-prompt').onclick = () => row.remove();
            tbody.appendChild(row);
        }
    }

    window.formHandlers = new FormHandlers();
});

// Helper functions
function saveState() {
    localStorage.setItem('botGeneratorState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('botGeneratorState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(state, parsed);
        } catch (error) {
            console.warn('Failed to load saved state:', error);
        }
    }
}

function updateVoiceOptions(language) {
    const voiceSelect = document.getElementById('bot-voice');
    if (!voiceSelect) return;

    // Clear existing options
    voiceSelect.innerHTML = '';

    // Get voices for selected language
    const voices = language === 'he' 
        ? [
            { id: 'he-female-1', name: 'קול נשי 1' },
            { id: 'he-male-1', name: 'קול גברי 1' }
        ]
        : [
            { id: 'en-female-1', name: 'Female Voice 1' },
            { id: 'en-male-1', name: 'Male Voice 1' }
        ];

    // Add new options
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.id;
        option.textContent = voice.name;
        voiceSelect.appendChild(option);
    });
}

// Mock image generation
function mockGenerateImage() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`https://via.placeholder.com/200x200?text=${encodeURIComponent(state.botData.imagePrompt)}`);
        }, 1500);
    });
}
