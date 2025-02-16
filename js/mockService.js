// Mock Data Service
const mockService = {
    // Mock library bots
    libraryBots: [
        {
            id: 'lib-1',
            name: 'מלווה למידה למתמטיקה',
            description: 'עוזר בפתרון תרגילים ומסביר מושגים במתמטיקה',
            imageUrl: 'https://via.placeholder.com/200x200?text=Math+Bot',
            tags: ['מתמטיקה', 'כיתה י'],
            language: 'he',
            usageCount: 1250
        },
        {
            id: 'lib-2',
            name: 'מלווה היסטוריה',
            description: 'מסייע בלמידת היסטוריה עולמית ומקומית',
            imageUrl: 'https://via.placeholder.com/200x200?text=History+Bot',
            tags: ['היסטוריה', 'כיתה יא'],
            language: 'he',
            usageCount: 890
        },
        {
            id: 'lib-3',
            name: 'English Learning Assistant',
            description: 'Helps students practice English conversation and grammar',
            imageUrl: 'https://via.placeholder.com/200x200?text=English+Bot',
            tags: ['אנגלית', 'כיתה ט'],
            language: 'en',
            usageCount: 2100
        }
    ],

    // Mock user's bots
    userBots: [
        {
            id: 'user-1',
            name: 'המורה לפיזיקה שלי',
            description: 'מלווה למידה לפיזיקה מכניקה',
            imageUrl: 'https://via.placeholder.com/200x200?text=Physics+Bot',
            status: 'active',
            created: '2025-01-15',
            lastUsed: '2025-02-15',
            usageCount: 156
        },
        {
            id: 'user-2',
            name: 'עוזר תנך',
            description: 'מסייע בהבנת טקסטים מקראיים',
            imageUrl: 'https://via.placeholder.com/200x200?text=Bible+Bot',
            status: 'draft',
            created: '2025-02-10',
            lastUsed: null,
            usageCount: 0
        }
    ],

    // Mock data sources
    dataSources: [
        {
            id: 'src-1',
            title: 'ספר לימוד מתמטיקה י',
            type: 'book',
            format: 'pdf',
            size: '15MB'
        },
        {
            id: 'src-2',
            title: 'מצגת פיזיקה - מכניקה',
            type: 'presentation',
            format: 'pptx',
            size: '8MB'
        },
        {
            id: 'src-3',
            title: 'מאמר - שיטות הוראה מודרניות',
            type: 'article',
            format: 'pdf',
            size: '2MB'
        }
    ],

    // Mock API methods
    async getLibraryBots() {
        return new Promise(resolve => {
            setTimeout(() => resolve(this.libraryBots), 500);
        });
    },

    async getUserBots() {
        return new Promise(resolve => {
            setTimeout(() => resolve(this.userBots), 500);
        });
    },

    async getDataSources() {
        return new Promise(resolve => {
            setTimeout(() => resolve(this.dataSources), 500);
        });
    },

    async generateImage(prompt) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`https://via.placeholder.com/200x200?text=${encodeURIComponent(prompt)}`);
            }, 1500);
        });
    },

    async saveBot(botData) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    botId: 'bot-' + Math.random().toString(36).substr(2, 9)
                });
            }, 1000);
        });
    },

    async generatePrompt(idea) {
        return new Promise(resolve => {
            setTimeout(() => {
                const mockPrompt = `You are an educational AI assistant specialized in ${idea}. Your role is to:
1. Help students understand complex concepts
2. Provide clear, age-appropriate explanations
3. Encourage critical thinking
4. Maintain a supportive and patient demeanor

Always communicate in a friendly, encouraging tone. Break down complex topics into manageable parts.`;
                resolve(mockPrompt);
            }, 1500);
        });
    },

    async chatWithBot(message) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    text: `This is a mock response to: "${message}". In a real implementation, this would be connected to the actual AI model.`,
                    timestamp: new Date().toISOString()
                });
            }, 800);
        });
    },

    // Mock bot responses based on configuration
    async getBotResponse(message, config = {}) {
        const { name = 'המלווה', temperature = 0.3 } = config;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Basic response templates
        const templates = [
            `שלום, אני ${name}. איך אוכל לעזור?`,
            `אשמח לסייע לך. מה תרצה לדעת?`,
            `תודה על השאלה. אנסה לעזור כמיטב יכולתי.`,
            `זו שאלה מעניינת. בוא נחשוב על זה יחד.`,
            `אני כאן כדי לעזור. ספר לי עוד.`
        ];

        // Questions get more varied responses based on temperature
        if (message.endsWith('?')) {
            if (temperature < 0.2) {
                return `לפי הידע שלי, ${message.replace('?', '.')} אשמח להרחיב אם תרצה.`;
            } else if (temperature < 0.4) {
                return `בוא נחשוב על זה יחד. ${message.replace('?', '.')} מה דעתך?`;
            } else {
                return `שאלה מעניינת! יש כמה דרכים להסתכל על זה. אשמח לשמוע את דעתך.`;
            }
        }

        // Greetings get consistent responses
        if (message.match(/שלום|היי|בוקר טוב|ערב טוב/i)) {
            return `שלום! אני ${name}, המלווה החינוכי שלך. איך אוכל לעזור?`;
        }

        // For other messages, select response based on temperature
        if (temperature < 0.2) {
            return `אני מבין. ${message}. אשמח להסביר יותר אם צריך.`;
        } else if (temperature < 0.4) {
            return templates[Math.floor(Math.random() * templates.length)];
        } else {
            return `מעניין מאוד! בוא נחקור את זה יחד. מה דעתך על ${message}?`;
        }
    },

    // Mock image generation
    async generateBotImage() {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'https://example.com/bot-image.png';
    },

    // Mock voice list
    getVoiceOptions() {
        return [
            { id: 'v1', name: 'דני', gender: 'male', language: 'he' },
            { id: 'v2', name: 'מיכל', gender: 'female', language: 'he' },
            { id: 'v3', name: 'John', gender: 'male', language: 'en' },
            { id: 'v4', name: 'Sarah', gender: 'female', language: 'en' }
        ];
    },

    // Mock source library
    getSourceLibrary() {
        return [
            { id: 's1', title: 'מתמטיקה לכיתה ז', type: 'pdf', category: 'math' },
            { id: 's2', title: 'אנגלית - רמה בסיסית', type: 'pdf', category: 'english' },
            { id: 's3', title: 'היסטוריה - המאה ה-20', type: 'pdf', category: 'history' },
            { id: 's4', title: 'מדעים - כוחות ותנועה', type: 'pdf', category: 'science' }
        ];
    },

    // Mock file upload
    async uploadFile(file) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: 'f' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type
        };
    },

    // Mock save bot configuration
    async saveBotConfig(config) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            success: true,
            botId: 'bot_' + Math.random().toString(36).substr(2, 9)
        };
    },

    // Mock voice options
    getVoiceOptions(language) {
        return language === 'he' 
            ? [
                { id: 'he-female-1', name: 'קול נשי 1' },
                { id: 'he-male-1', name: 'קול גברי 1' },
                { id: 'he-female-2', name: 'קול נשי 2' },
                { id: 'he-male-2', name: 'קול גברי 2' }
            ]
            : [
                { id: 'en-female-1', name: 'Female Voice 1' },
                { id: 'en-male-1', name: 'Male Voice 1' },
                { id: 'en-female-2', name: 'Female Voice 2' },
                { id: 'en-male-2', name: 'Male Voice 2' }
            ];
    }
};

// Export for use in other files
window.mockService = mockService;
