/**
 * Wizard Navigation Component
 * Handles step navigation, validation, and state management for the wizard
 */
class WizardNavigation {
    constructor(options = {}) {
        this.currentStep = 1;
        this.totalSteps = 5;
        
        // Default options
        this.options = {
            tabsSelector: '.wizard-tab',
            contentSelector: '.step-content-item',
            prevButtonSelector: '.prev-step-button',
            nextButtonSelector: '.next-step-button',
            activeClass: 'active',
            inactiveClass: 'inactive',
            onStepChange: null,
            ...options
        };
        
        this.stepContents = [];
        this.stepTabs = [];
        
        this.init();
    }
    
    /**
     * Initialize the component
     */
    init() {
        // Find all step content elements
        this.stepContents = Array.from(document.querySelectorAll(this.options.contentSelector));
        
        // Find all step tabs
        this.stepTabs = Array.from(document.querySelectorAll(this.options.tabsSelector));
        
        // Set up navigation buttons
        this.prevButton = document.querySelector(this.options.prevButtonSelector);
        this.nextButton = document.querySelector(this.options.nextButtonSelector);
        
        if (this.prevButton && this.nextButton) {
            this.prevButton.addEventListener('click', () => this.goToPreviousStep());
            this.nextButton.addEventListener('click', () => this.goToNextStep());
        }
        
        // Set up tab click events
        this.stepTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.goToStep(index + 1));
        });
        
        // Show the first step
        this.updateStepDisplay();
    }
    
    /**
     * Go to the next step if validation passes
     */
    goToNextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                
                // Call the onStepChange callback if provided
                if (typeof this.options.onStepChange === 'function') {
                    this.options.onStepChange(this.currentStep);
                }
            } else if (this.currentStep === this.totalSteps) {
                // Handle finish action
                console.log('Wizard completed');
                // You could trigger form submission or other completion actions here
            }
        }
    }
    
    /**
     * Go to the previous step
     */
    goToPreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            
            // Call the onStepChange callback if provided
            if (typeof this.options.onStepChange === 'function') {
                this.options.onStepChange(this.currentStep);
            }
        }
    }
    
    /**
     * Go to a specific step if validation passes for all previous steps
     */
    goToStep(stepNumber) {
        // Only allow going to a step if all previous steps are valid
        let canProceed = true;
        
        // If trying to go forward, validate all previous steps
        if (stepNumber > this.currentStep) {
            for (let i = 1; i < stepNumber; i++) {
                if (!this.validateStep(i)) {
                    canProceed = false;
                    break;
                }
            }
        }
        
        if (canProceed && stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this.currentStep = stepNumber;
            this.updateStepDisplay();
            
            // Call the onStepChange callback if provided
            if (typeof this.options.onStepChange === 'function') {
                this.options.onStepChange(this.currentStep);
            }
        }
    }
    
    /**
     * Update the display to show the current step
     */
    updateStepDisplay() {
        // Update step content visibility
        this.stepContents.forEach((content, index) => {
            content.style.display = index + 1 === this.currentStep ? 'block' : 'none';
        });
        
        // Update tab active state
        this.stepTabs.forEach((tab, index) => {
            if (index + 1 === this.currentStep) {
                tab.classList.add(this.options.activeClass);
                tab.classList.remove(this.options.inactiveClass);
            } else {
                tab.classList.remove(this.options.activeClass);
                tab.classList.add(this.options.inactiveClass);
            }
        });
        
        // Update button states
        if (this.prevButton) {
            this.prevButton.disabled = this.currentStep === 1;
        }
        
        if (this.nextButton) {
            if (this.currentStep === this.totalSteps) {
                // Change button text and style for final step
                this.nextButton.innerHTML = `
                    סיום
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                `;
                this.nextButton.classList.add('finish-button');
            } else {
                // Reset button for normal steps
                this.nextButton.innerHTML = `
                    הבא
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                `;
                this.nextButton.classList.remove('finish-button');
            }
        }
        
        // Scroll to top of the step content
        const activeContent = this.stepContents[this.currentStep - 1];
        if (activeContent) {
            activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    /**
     * Validate the current step
     */
    validateCurrentStep() {
        return this.validateStep(this.currentStep);
    }
    
    /**
     * Validate a specific step
     */
    validateStep(stepNumber) {
        const stepContent = this.stepContents[stepNumber - 1];
        if (!stepContent) return true;
        
        let isValid = true;
        
        // Find all required inputs in the step
        const requiredInputs = stepContent.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
                
                // Add shake animation for invalid fields
                input.classList.add('shake');
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 500);
            } else {
                input.classList.remove('invalid');
            }
        });
        
        return isValid;
    }
    
    /**
     * Get the current step number
     */
    getCurrentStep() {
        return this.currentStep;
    }
    
    /**
     * Get the total number of steps
     */
    getTotalSteps() {
        return this.totalSteps;
    }
}

// This function should be called whenever a step is changed
function updateStepButtons(currentStep) {
    const prevButton = document.querySelector('.prev-step-button');
    const nextButton = document.querySelector('.next-step-button');
    const totalSteps = 5;
    
    // Enable/disable previous button
    prevButton.disabled = currentStep === 1;
    
    // Handle next button for final step
    if (currentStep === totalSteps) {
        // Hide the next button completely on the final step
        nextButton.style.display = 'none';
    } else {
        // Show the next button on all other steps
        nextButton.style.display = '';
        
        // Change text for the button before the final step
        if (currentStep === totalSteps - 1) {
            nextButton.innerHTML = 'סיום <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
        } else {
            nextButton.innerHTML = 'הבא <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
        }
    }
}

// Make sure this function is called when initializing and when changing steps
document.addEventListener('DOMContentLoaded', function() {
    const wizardTabs = document.querySelectorAll('.wizard-tab');
    const prevButton = document.querySelector('.prev-step-button');
    const nextButton = document.querySelector('.next-step-button');
    
    // Initial setup
    let currentStep = 1;
    updateStepButtons(currentStep);
    
    // Next button click handler
    nextButton.addEventListener('click', function() {
        if (currentStep < 5) {
            currentStep++;
            // Update UI for the new step
            showStep(currentStep);
            updateStepButtons(currentStep);
        }
    });
    
    // Previous button click handler
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            // Update UI for the new step
            showStep(currentStep);
            updateStepButtons(currentStep);
        }
    });
    
    // Tab click handler
    wizardTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (!tab.classList.contains('inactive')) {
                currentStep = parseInt(tab.dataset.step);
                // Update UI for the new step
                showStep(currentStep);
                updateStepButtons(currentStep);
            }
        });
    });
    
    // Function to show the current step and hide others
    function showStep(step) {
        document.querySelectorAll('.step-content-item').forEach((item, index) => {
            item.style.display = index + 1 === step ? 'block' : 'none';
        });
        
        // Update active tab
        wizardTabs.forEach(tab => {
            const tabStep = parseInt(tab.dataset.step);
            if (tabStep === step) {
                tab.classList.add('active');
                tab.classList.remove('inactive');
            } else if (tabStep < step) {
                tab.classList.remove('active', 'inactive');
            } else {
                tab.classList.remove('active');
                tab.classList.add('inactive');
            }
        });
    }
}); 