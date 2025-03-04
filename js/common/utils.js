/**
 * Utility functions for the Bot Generator application
 */
const Utils = {
    /**
     * Debounce a function call
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle a function call
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format a file size in bytes to a human-readable string
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Validate a file type against allowed types
     * @param {File} file - File to validate
     * @param {string[]} allowedTypes - Array of allowed MIME types
     * @returns {boolean} Is valid
     */
    validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    },

    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Storage Error:', error);
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @returns {any} Stored data
     */
    loadFromStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage Error:', error);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage Error:', error);
        }
    },

    /**
     * Show a toast notification
     * @param {string} message - Message to show
     * @param {string} type - Notification type (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Trigger reflow
        toast.offsetHeight;
        
        // Add show class for animation
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Validate form input
     * @param {string} value - Input value
     * @param {Object} rules - Validation rules
     * @returns {boolean} Is valid
     */
    validateInput(value, rules) {
        if (rules.required && !value) {
            return false;
        }
        if (rules.minLength && value.length < rules.minLength) {
            return false;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
            return false;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            return false;
        }
        return true;
    },

    /**
     * Format a date to a locale string
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Check if the device is mobile
     * @returns {boolean} Is mobile device
     */
    isMobile() {
        return window.innerWidth < CONFIG.UI.MOBILE_BREAKPOINT;
    },

    /**
     * Add event listener with automatic cleanup
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    addCleanupEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        return () => element.removeEventListener(event, handler);
    },

    /**
     * Create a DOM element with attributes and children
     * @param {string} tag - HTML tag
     * @param {Object} attributes - Element attributes
     * @param {Array} children - Child elements or text
     * @returns {Element} Created element
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    }
};

// Make Utils globally available
window.Utils = Utils;
