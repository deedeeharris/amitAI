class StepNavigation {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.initializeElements();
        this.attachEventListeners();
        this.updateNavigation();
    }

    initializeElements() {
        // Step indicators
        this.stepIndicators = document.querySelectorAll('.step-progress .step');
        
        // Step content sections
        this.stepContents = document.querySelectorAll('.step-content');
        
        // Navigation buttons
        this.prevButton = document.getElementById('prev-step');
        this.nextButton = document.getElementById('next-step');
    }

    attachEventListeners() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.navigate('prev'));
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.navigate('next'));
        }

        // Add click listeners to step indicators
        this.stepIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToStep(index + 1));
        });
    }

    navigate(direction) {
        if (direction === 'prev' && this.currentStep > 1) {
            this.currentStep--;
        } else if (direction === 'next' && this.currentStep < this.totalSteps) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            }
        }
        
        this.updateNavigation();
    }

    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            // Validate all previous steps before allowing navigation
            for (let i = 1; i < step; i++) {
                if (!this.validateStep(i)) {
                    return;
                }
            }
            
            this.currentStep = step;
            this.updateNavigation();
        }
    }

    validateStep(step) {
        switch(step) {
            case 1:
                return this.validateBasicInfo();
            case 2:
                return this.validateDataSources();
            case 3:
                return this.validateScenario();
            default:
                return true;
        }
    }

    validateCurrentStep() {
        return this.validateStep(this.currentStep);
    }

    validateBasicInfo() {
        const name = document.getElementById('bot-name')?.value;
        const language = document.getElementById('bot-language')?.value;
        const voice = document.getElementById('bot-voice')?.value;
        const imagePreview = document.getElementById('image-preview');
        
        if (!name?.trim()) {
            alert('נא להזין שם למלווה');
            return false;
        }
        
        if (!language) {
            alert('נא לבחור שפה');
            return false;
        }
        
        if (!voice) {
            alert('נא לבחור קול');
            return false;
        }
        
        if (imagePreview?.classList.contains('hidden')) {
            const proceed = confirm('לא נוצרה תמונה למלווה. האם להמשיך בכל זאת?');
            return proceed;
        }
        
        return true;
    }

    validateDataSources() {
        const selectedSources = document.querySelector('.selected-list')?.children.length;
        
        if (!selectedSources) {
            const proceed = confirm('לא נבחרו מקורות מידע. האם להמשיך בכל זאת?');
            return proceed;
        }
        
        return true;
    }

    validateScenario() {
        const scenarioType = document.querySelector('input[name="scenario-type"]:checked')?.value;
        
        if (scenarioType === 'simple') {
            const systemPrompt = document.getElementById('system-prompt')?.value;
            if (!systemPrompt?.trim()) {
                alert('נא להזין הנחיית מערכת');
                return false;
            }
        } else {
            const promptRows = document.querySelector('.prompt-table tbody')?.children.length;
            if (!promptRows) {
                alert('נא להוסיף לפחות הנחיה אחת');
                return false;
            }
        }
        
        return true;
    }

    updateNavigation() {
        // Update step indicators
        this.stepIndicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            
            if (index + 1 === this.currentStep) {
                indicator.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                indicator.classList.add('completed');
            }
        });

        // Update step content visibility
        this.stepContents.forEach((content, index) => {
            content.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update navigation buttons
        if (this.prevButton) {
            this.prevButton.disabled = this.currentStep === 1;
        }
        
        if (this.nextButton) {
            this.nextButton.textContent = this.currentStep === this.totalSteps ? 'צור מלווה' : 'המשך';
        }

        // Save current step to localStorage
        localStorage.setItem('currentStep', this.currentStep.toString());
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.step-progress')) {
        window.stepNavigation = new StepNavigation();
        
        // Load saved step if exists
        const savedStep = localStorage.getItem('currentStep');
        if (savedStep) {
            window.stepNavigation.goToStep(parseInt(savedStep));
        }
    }
});
