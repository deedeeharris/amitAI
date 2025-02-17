// Handle wizard step navigation
document.addEventListener('DOMContentLoaded', () => {
    const stepContents = document.querySelectorAll('.step-content-item');
    const stepIndicators = document.querySelectorAll('.step');
    const prevBtn = document.querySelector('.prev-step');
    const nextBtn = document.querySelector('.next-step');
    let currentStep = 1;

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.step-content-item[data-step="${currentStep}"]`);
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

    function updateSteps() {
        // Update content visibility
        stepContents.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index + 1 === currentStep) {
                indicator.classList.add('active');
            } else if (index + 1 < currentStep) {
                indicator.classList.add('completed');
            }
        });

        // Update navigation buttons
        prevBtn.disabled = currentStep === 1;
        if (currentStep === 5) {
            nextBtn.innerHTML = 'סיום והפצה <i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'הבא <i class="fas fa-arrow-left"></i>';
        }
    }

    function goToStep(step) {
        if (step < 1 || step > 5) return;
        currentStep = step;
        updateSteps();
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < 5) {
            if (validateCurrentStep()) {
                currentStep++;
                updateSteps();
            }
        } else if (currentStep === 5) {
            // Handle form submission
            if (validateCurrentStep()) {
                const loadingOverlay = document.querySelector('.loading-overlay');
                loadingOverlay.style.display = 'flex';
                // TODO: Add form submission logic here
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    // Allow clicking on step indicators to navigate
    stepIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const targetStep = index + 1;
            if (targetStep < currentStep || validateCurrentStep()) {
                goToStep(targetStep);
            }
        });
    });

    // Initialize
    updateSteps();
});
