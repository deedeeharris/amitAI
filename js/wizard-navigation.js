class WizardNavigation {
    constructor() {
        this.stepContents = document.querySelectorAll('.step-content-item');
        this.stepIndicators = document.querySelectorAll('.step');
        this.prevBtn = document.querySelector('.prev-step');
        this.nextBtn = document.querySelector('.next-step');
        this.currentStep = 1;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.attachEventListeners();
        this.updateSteps();
    }

    attachEventListeners() {
        this.nextBtn.addEventListener('click', () => {
            if (this.currentStep < 5) {
                if (this.validateCurrentStep()) {
                    this.currentStep++;
                    this.updateSteps();
                }
            } else if (this.currentStep === 5) {
                // Handle form submission
                if (this.validateCurrentStep()) {
                    const loadingOverlay = document.querySelector('.loading-overlay');
                    loadingOverlay.style.display = 'flex';
                    // TODO: Add form submission logic here
                }
            }
        });

        this.prevBtn.addEventListener('click', () => {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.updateSteps();
            }
        });

        // Add step indicator clicks
        this.stepIndicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const step = parseInt(indicator.dataset.step);
                if (step < this.currentStep || this.validateCurrentStep()) {
                    this.goToStep(step);
                }
            });
        });
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.step-content-item[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    updateSteps() {
        // Update step indicators
        this.stepIndicators.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            } else if (stepNum < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update step content visibility
        this.stepContents.forEach(content => {
            content.classList.remove('active');
            if (parseInt(content.dataset.step) === this.currentStep) {
                content.classList.add('active');
            }
        });

        // Update navigation buttons
        this.prevBtn.disabled = this.currentStep === 1;
        this.nextBtn.textContent = this.currentStep === 5 ? 'סיום והפצה <i class="fas fa-check"></i>' : 'הבא <i class="fas fa-arrow-left"></i>';
        
        // Emit step change event
        const event = new CustomEvent('wizardStepChange', {
            detail: { step: this.currentStep }
        });
        document.dispatchEvent(event);
    }

    goToStep(step) {
        if (step >= 1 && step <= 5) {
            this.currentStep = step;
            this.updateSteps();
        }
    }
}

export default WizardNavigation;
