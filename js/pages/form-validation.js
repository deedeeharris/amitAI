/**
 * Form Validation Component
 * Validates form inputs across all steps of the wizard
 */
class FormValidation {
    constructor() {
        this.validators = {
            required: this.validateRequired,
            minLength: this.validateMinLength,
            maxLength: this.validateMaxLength,
            pattern: this.validatePattern
        };
        
        this.init();
    }
    
    /**
     * Initialize the component
     */
    init() {
        // Set up event listeners for form inputs
        this.setupInputListeners();
    }
    
    /**
     * Set up event listeners for form inputs
     */
    setupInputListeners() {
        // Find all form inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add blur event listener
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            // Add input event listener for real-time validation
            input.addEventListener('input', () => {
                // Remove error state if input is valid
                if (this.validateInput(input, true)) {
                    this.removeError(input);
                }
            });
        });
    }
    
    /**
     * Validate a specific input
     * @param {HTMLElement} input - The input element to validate
     * @param {boolean} silent - If true, don't show error messages
     * @returns {boolean} - Whether the input is valid
     */
    validateInput(input, silent = false) {
        let isValid = true;
        
        // Check required
        if (input.hasAttribute('required') && !this.validators.required(input)) {
            isValid = false;
        }
        
        // Check min length
        if (input.hasAttribute('minlength') && !this.validators.minLength(input)) {
            isValid = false;
        }
        
        // Check max length
        if (input.hasAttribute('maxlength') && !this.validators.maxLength(input)) {
            isValid = false;
        }
        
        // Check pattern
        if (input.hasAttribute('pattern') && !this.validators.pattern(input)) {
            isValid = false;
        }
        
        // Show or hide error
        if (!isValid && !silent) {
            this.showError(input);
        } else if (isValid) {
            this.removeError(input);
        }
        
        return isValid;
    }
    
    /**
     * Validate all inputs in a container
     * @param {HTMLElement} container - The container element
     * @returns {boolean} - Whether all inputs are valid
     */
    validateContainer(container) {
        const inputs = container.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Show error for an input
     */
    showError(input) {
        input.classList.add('invalid');
        
        // Find or create error message element
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        // Set error message
        errorElement.textContent = this.getErrorMessage(input);
    }
    
    /**
     * Remove error for an input
     */
    removeError(input) {
        input.classList.remove('invalid');
        
        // Remove error message element
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }
    
    /**
     * Get appropriate error message for an input
     */
    getErrorMessage(input) {
        if (input.hasAttribute('required') && !this.validators.required(input)) {
            return 'שדה זה הוא שדה חובה';
        }
        
        if (input.hasAttribute('minlength') && !this.validators.minLength(input)) {
            const minLength = input.getAttribute('minlength');
            return `אורך מינימלי הוא ${minLength} תווים`;
        }
        
        if (input.hasAttribute('maxlength') && !this.validators.maxLength(input)) {
            const maxLength = input.getAttribute('maxlength');
            return `אורך מקסימלי הוא ${maxLength} תווים`;
        }
        
        if (input.hasAttribute('pattern') && !this.validators.pattern(input)) {
            return 'ערך לא תקין';
        }
        
        return 'שדה לא תקין';
    }
    
    // Validator functions
    
    /**
     * Validate required field
     */
    validateRequired(input) {
        return input.value.trim() !== '';
    }
    
    /**
     * Validate minimum length
     */
    validateMinLength(input) {
        const minLength = parseInt(input.getAttribute('minlength'));
        return input.value.length >= minLength;
    }
    
    /**
     * Validate maximum length
     */
    validateMaxLength(input) {
        const maxLength = parseInt(input.getAttribute('maxlength'));
        return input.value.length <= maxLength;
    }
    
    /**
     * Validate pattern
     */
    validatePattern(input) {
        const pattern = new RegExp(input.getAttribute('pattern'));
        return pattern.test(input.value);
    }
} 