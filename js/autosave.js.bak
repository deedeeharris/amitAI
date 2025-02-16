// Autosave Configuration
const AUTOSAVE_INTERVAL = 10000; // 10 seconds
const API_SAVE_INTERVAL = 60000; // 1 minute

// Track changes
let hasUnsavedChanges = false;
let lastApiSave = Date.now();

// Autosave to localStorage
setInterval(() => {
    if (hasUnsavedChanges) {
        const state = JSON.parse(localStorage.getItem('botGeneratorState'));
        if (state) {
            localStorage.setItem('botGeneratorState', JSON.stringify(state));
            hasUnsavedChanges = false;
            console.log('Autosaved to localStorage:', new Date().toLocaleTimeString());
        }
    }
}, AUTOSAVE_INTERVAL);

// Save to API
setInterval(async () => {
    const state = JSON.parse(localStorage.getItem('botGeneratorState'));
    if (state && hasUnsavedChanges && (Date.now() - lastApiSave >= API_SAVE_INTERVAL)) {
        try {
            // Mock API call - replace with actual API endpoint
            await saveToApi(state);
            lastApiSave = Date.now();
            console.log('Saved to API:', new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Failed to save to API:', error);
        }
    }
}, API_SAVE_INTERVAL);

// Mock API save function
async function saveToApi(state) {
    // Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
}

// Listen for state changes
document.addEventListener('input', () => {
    hasUnsavedChanges = true;
});

// Save before unload
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        const state = JSON.parse(localStorage.getItem('botGeneratorState'));
        if (state) {
            localStorage.setItem('botGeneratorState', JSON.stringify(state));
        }
    }
});

// Autosave functionality
function initAutosave() {
    // Get form elements
    const elements = {
        botName: document.getElementById('bot-name'),
        language: document.getElementById('bot-language'),
        voice: document.getElementById('bot-voice'),
        temperature: document.getElementById('temperature-slider'),
        imagePrompt: document.getElementById('image-prompt')
    };

    // Load saved data
    const savedData = localStorage.getItem('botGeneratorAutosave');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Restore values to form elements
            if (elements.botName) elements.botName.value = data.name || '';
            if (elements.language) elements.language.value = data.language || 'he';
            if (elements.voice) elements.voice.value = data.voice || '';
            if (elements.temperature) elements.temperature.value = data.temperature || 0.3;
            if (elements.imagePrompt) elements.imagePrompt.value = data.imagePrompt || '';
            
            // Trigger change events
            if (elements.language) {
                const event = new Event('change');
                elements.language.dispatchEvent(event);
            }
        } catch (error) {
            console.warn('Failed to load autosaved data:', error);
        }
    }

    // Attach autosave listeners
    Object.values(elements).forEach(element => {
        if (element) {
            element.addEventListener('input', saveFormData);
            element.addEventListener('change', saveFormData);
        }
    });
}

function saveFormData() {
    // Get current form values
    const formData = {
        name: document.getElementById('bot-name')?.value || '',
        language: document.getElementById('bot-language')?.value || 'he',
        voice: document.getElementById('bot-voice')?.value || '',
        temperature: document.getElementById('temperature-slider')?.value || 0.3,
        imagePrompt: document.getElementById('image-prompt')?.value || ''
    };

    // Save to localStorage
    try {
        localStorage.setItem('botGeneratorAutosave', JSON.stringify(formData));
    } catch (error) {
        console.warn('Failed to autosave form data:', error);
    }
}

// Clear autosave data when bot is created
function clearAutosave() {
    localStorage.removeItem('botGeneratorAutosave');
}

// Export functions
window.initAutosave = initAutosave;
window.clearAutosave = clearAutosave;
