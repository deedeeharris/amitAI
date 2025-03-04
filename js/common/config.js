/**
 * Global configuration for the Bot Generator application
 */
const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: '/api',
        ENDPOINTS: {
            BOTS: '/bots',
            SOURCES: '/sources',
            GENERATE_IMAGE: '/generate-image',
            CHAT: '/chat'
        },
        TIMEOUT: 30000 // 30 seconds
    },

    // Language Settings
    LANGUAGES: {
        HEBREW: 'he',
        ENGLISH: 'en'
    },

    // Voice Options
    VOICES: {
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
    },

    // Bot Settings
    BOT: {
        TEMPERATURE: {
            MIN: 0,
            MAX: 0.5,
            DEFAULT: 0.2,
            STEP: 0.1
        },
        IMAGE: {
            MAX_SIZE: 5 * 1024 * 1024, // 5MB
            ALLOWED_TYPES: ['image/jpeg', 'image/png'],
            DEFAULT_PLACEHOLDER: 'https://via.placeholder.com/200x200?text=AI+Bot'
        }
    },

    // Source Settings
    SOURCES: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ],
        FILE_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt']
    },

    // Storage Keys
    STORAGE: {
        CURRENT_BOT: 'currentBot',
        USER_SETTINGS: 'userSettings',
        AUTOSAVE_PREFIX: 'botAutosave_'
    },

    // Autosave Settings
    AUTOSAVE: {
        INTERVAL: 30000, // 30 seconds
        MAX_SAVES: 5
    },

    // UI Settings
    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        MOBILE_BREAKPOINT: 768
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG);

// Make CONFIG globally available
window.CONFIG = CONFIG;
