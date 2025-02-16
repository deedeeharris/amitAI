/**
 * API service for handling all server communications
 */
class API {
    /**
     * Make a GET request to the specified endpoint
     * @param {string} endpoint - The API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<any>} Response data
     */
    static async get(endpoint, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${CONFIG.API.BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }

    /**
     * Make a POST request to the specified endpoint
     * @param {string} endpoint - The API endpoint
     * @param {Object} data - The data to send
     * @returns {Promise<any>} Response data
     */
    static async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${CONFIG.API.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }

    /**
     * Make a PUT request to the specified endpoint
     * @param {string} endpoint - The API endpoint
     * @param {Object} data - The data to send
     * @returns {Promise<any>} Response data
     */
    static async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${CONFIG.API.BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    }

    /**
     * Make a DELETE request to the specified endpoint
     * @param {string} endpoint - The API endpoint
     * @returns {Promise<any>} Response data
     */
    static async delete(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API.BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }

    /**
     * Upload a file to the specified endpoint
     * @param {string} endpoint - The API endpoint
     * @param {File} file - The file to upload
     * @param {Object} additionalData - Additional form data
     * @returns {Promise<any>} Response data
     */
    static async uploadFile(endpoint, file, additionalData = {}) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Add any additional data to the form
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await fetch(`${CONFIG.API.BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Upload Error:', error);
            throw error;
        }
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

// Add error event listener for failed API calls
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason instanceof Error) {
        console.error('API Error:', event.reason);
        // TODO: Add proper error handling/user notification
    }
});
