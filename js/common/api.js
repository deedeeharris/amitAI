/**
 * Mock API service for development without a backend
 */
class API {
    /**
     * Mock GET request that returns static data
     * @param {string} endpoint - The API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} Response data
     */
    static async get(endpoint, params = {}) {
        console.log('Mock API GET:', endpoint, params);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Return mock data based on endpoint
        if (endpoint === '/bots') {
            return this.getMockBots(params);
        } else if (endpoint === '/bots/featured') {
            return this.getMockFeaturedBots();
        } else if (endpoint.startsWith('/bots/') && endpoint.length > 6) {
            const botId = endpoint.substring(6);
            return this.getMockBotDetails(botId);
        } else if (endpoint === '/categories') {
            return this.getMockCategories();
        } else if (endpoint === '/sources') {
            return { data: [] };
        }
        
        return { data: [] };
    }

    /**
     * Mock POST request
     * @param {string} endpoint - The API endpoint
     * @param {Object} data - The data to send
     * @returns {Promise<any>} Response data
     */
    static async post(endpoint, data = {}) {
        console.log('Mock API POST:', endpoint, data);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Handle chat messages
        if (endpoint.startsWith('/chat/')) {
            return {
                data: {
                    message: 'זוהי תשובה לדוגמה מהמלווה. אני כאן כדי לעזור לך ללמוד!',
                    timestamp: new Date().toISOString()
                }
            };
        }
        
        return { data: { success: true, id: 'mock-' + Date.now() } };
    }

    /**
     * Mock PUT request
     * @param {string} endpoint - The API endpoint
     * @param {Object} data - The data to send
     * @returns {Promise<any>} Response data
     */
    static async put(endpoint, data = {}) {
        console.log('Mock API PUT:', endpoint, data);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return { data: { success: true } };
    }

    /**
     * Mock DELETE request
     * @param {string} endpoint - The API endpoint
     * @returns {Promise<any>} Response data
     */
    static async delete(endpoint) {
        console.log('Mock API DELETE:', endpoint);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return { data: { success: true } };
    }

    /**
     * Mock file upload
     * @param {string} endpoint - The API endpoint
     * @param {File} file - The file to upload
     * @param {Object} additionalData - Additional form data
     * @returns {Promise<any>} Response data
     */
    static async uploadFile(endpoint, file, additionalData = {}) {
        console.log('Mock API Upload:', endpoint, file.name, additionalData);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { data: { success: true, fileId: 'mock-file-' + Date.now() } };
    }

    // Mock data generators
    static getMockBots(params = {}) {
        const allBots = [
            {
                id: 'bot-1',
                name: 'מלווה מתמטיקה',
                description: 'מלווה למידה למתמטיקה לכיתות ז׳-ט׳',
                subject: 'math',
                grade: '7-9',
                imageUrl: '../assets/bot-math.png',
                rating: 4.8,
                usageCount: 1250,
                createdAt: '2023-09-15T10:30:00Z',
                creator: 'צוות מתמטיקה'
            },
            {
                id: 'bot-2',
                name: 'מלווה אנגלית',
                description: 'מלווה למידה לאנגלית לכיתות י׳-י״ב',
                subject: 'english',
                grade: '10-12',
                imageUrl: '../assets/bot-english.png',
                rating: 4.6,
                usageCount: 980,
                createdAt: '2023-10-05T14:20:00Z',
                creator: 'צוות אנגלית'
            },
            {
                id: 'bot-3',
                name: 'מלווה היסטוריה',
                description: 'מלווה למידה להיסטוריה לכיתות י׳-י״ב',
                subject: 'history',
                grade: '10-12',
                imageUrl: '../assets/bot-history.png',
                rating: 4.5,
                usageCount: 820,
                createdAt: '2023-11-10T09:15:00Z',
                creator: 'צוות היסטוריה'
            },
            {
                id: 'bot-4',
                name: 'מלווה מדעים',
                description: 'מלווה למידה למדעים לכיתות ז׳-ט׳',
                subject: 'science',
                grade: '7-9',
                imageUrl: '../assets/bot-science.png',
                rating: 4.3,
                usageCount: 750,
                createdAt: '2023-12-01T11:45:00Z',
                creator: 'צוות מדעים'
            },
            {
                id: 'bot-5',
                name: 'מלווה ספרות',
                description: 'מלווה למידה לספרות לכיתות י׳-י״ב',
                subject: 'literature',
                grade: '10-12',
                imageUrl: '../assets/bot-literature.png',
                rating: 4.2,
                usageCount: 680,
                createdAt: '2024-01-20T13:10:00Z',
                creator: 'צוות ספרות'
            },
            {
                id: 'bot-6',
                name: 'מלווה תנ״ך',
                description: 'מלווה למידה לתנ״ך לכיתות ז׳-י״ב',
                subject: 'bible',
                grade: '7-12',
                imageUrl: '../assets/bot-bible.png',
                rating: 4.4,
                usageCount: 920,
                createdAt: '2024-02-05T09:30:00Z',
                creator: 'צוות תנ״ך'
            },
            {
                id: 'bot-7',
                name: 'מלווה פיזיקה',
                description: 'מלווה למידה לפיזיקה לכיתות י׳-י״ב',
                subject: 'physics',
                grade: '10-12',
                imageUrl: '../assets/bot-physics.png',
                rating: 4.7,
                usageCount: 850,
                createdAt: '2024-02-15T10:20:00Z',
                creator: 'צוות פיזיקה'
            },
            {
                id: 'bot-8',
                name: 'מלווה כימיה',
                description: 'מלווה למידה לכימיה לכיתות י׳-י״ב',
                subject: 'chemistry',
                grade: '10-12',
                imageUrl: '../assets/bot-chemistry.png',
                rating: 4.5,
                usageCount: 720,
                createdAt: '2024-03-01T14:45:00Z',
                creator: 'צוות כימיה'
            }
        ];
        
        // Apply search filter
        let filteredBots = [...allBots];
        if (params.params?.search) {
            const searchTerm = params.params.search.toLowerCase();
            filteredBots = filteredBots.filter(bot => 
                bot.name.toLowerCase().includes(searchTerm) || 
                bot.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply subject filter
        if (params.params?.subject) {
            filteredBots = filteredBots.filter(bot => bot.subject === params.params.subject);
        }
        
        // Apply grade filter
        if (params.params?.grade) {
            filteredBots = filteredBots.filter(bot => bot.grade.includes(params.params.grade));
        }
        
        // Apply sorting
        if (params.params?.sort) {
            switch (params.params.sort) {
                case 'newest':
                    filteredBots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'popular':
                    filteredBots.sort((a, b) => b.usageCount - a.usageCount);
                    break;
                case 'rating':
                    filteredBots.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }
        
        // Apply pagination
        const page = params.params?.page || 1;
        const limit = params.params?.limit || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBots = filteredBots.slice(startIndex, endIndex);
        
        return {
            data: {
                bots: paginatedBots,
                total: filteredBots.length
            }
        };
    }
    
    static getMockFeaturedBots() {
        return {
            data: [
                {
                    id: 'bot-7',
                    name: 'מלווה פיזיקה',
                    description: 'מלווה למידה לפיזיקה לכיתות י׳-י״ב',
                    subject: 'physics',
                    grade: '10-12',
                    imageUrl: '../assets/bot-physics.png',
                    rating: 4.7,
                    usageCount: 850,
                    createdAt: '2024-02-15T10:20:00Z',
                    creator: 'צוות פיזיקה'
                },
                {
                    id: 'bot-1',
                    name: 'מלווה מתמטיקה',
                    description: 'מלווה למידה למתמטיקה לכיתות ז׳-ט׳',
                    subject: 'math',
                    grade: '7-9',
                    imageUrl: '../assets/bot-math.png',
                    rating: 4.8,
                    usageCount: 1250,
                    createdAt: '2023-09-15T10:30:00Z',
                    creator: 'צוות מתמטיקה'
                }
            ]
        };
    }
    
    static getMockBotDetails(botId) {
        const allBots = this.getMockBots().data.bots;
        const bot = allBots.find(b => b.id === botId) || {
            id: botId,
            name: 'מלווה לדוגמה',
            description: 'תיאור לדוגמה',
            subject: 'general',
            grade: '7-12',
            imageUrl: '../assets/default-bot.png',
            rating: 4.0,
            usageCount: 500,
            createdAt: '2023-01-01T00:00:00Z',
            creator: 'צוות פיתוח'
        };
        
        return { data: bot };
    }
    
    static getMockCategories() {
        return {
            data: [
                { id: 'math', name: 'מתמטיקה', icon: 'fas fa-calculator', botCount: 12 },
                { id: 'science', name: 'מדעים', icon: 'fas fa-flask', botCount: 8 },
                { id: 'history', name: 'היסטוריה', icon: 'fas fa-landmark', botCount: 6 },
                { id: 'literature', name: 'ספרות', icon: 'fas fa-book', botCount: 5 },
                { id: 'english', name: 'אנגלית', icon: 'fas fa-language', botCount: 7 },
                { id: 'bible', name: 'תנ״ך', icon: 'fas fa-book-open', botCount: 4 }
            ]
        };
    }

    // Bot-specific API methods
    static async getBots() {
        return this.get(CONFIG.API.ENDPOINTS.BOTS);
    }

    static async getBot(id) {
        return this.get(`${CONFIG.API.ENDPOINTS.BOTS}/${id}`);
    }

    static async createBot(botData) {
        return this.post(CONFIG.API.ENDPOINTS.BOTS, botData);
    }

    static async updateBot(id, botData) {
        return this.put(`${CONFIG.API.ENDPOINTS.BOTS}/${id}`, botData);
    }

    static async deleteBot(id) {
        return this.delete(`${CONFIG.API.ENDPOINTS.BOTS}/${id}`);
    }

    // Source-specific API methods
    static async getSources() {
        return this.get(CONFIG.API.ENDPOINTS.SOURCES);
    }

    static async uploadSource(file, metadata) {
        return this.uploadFile(CONFIG.API.ENDPOINTS.SOURCES, file, metadata);
    }

    // Image generation API methods
    static async generateImage(prompt) {
        return this.post(CONFIG.API.ENDPOINTS.GENERATE_IMAGE, { prompt });
    }

    // Chat API methods
    static async sendMessage(botId, message) {
        return this.post(`${CONFIG.API.ENDPOINTS.CHAT}/${botId}`, { message });
    }
}

// Make API globally available
window.api = API;
