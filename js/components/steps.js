// Wizard step navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content-item');
    const nextButton = document.querySelector('.next-step');
    const prevButton = document.querySelector('.prev-step');
    let currentStep = 1;

    function updateSteps() {
        // Update step indicators
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });

        // Update step content visibility
        stepContents.forEach(content => {
            content.classList.remove('active');
            if (parseInt(content.dataset.step) === currentStep) {
                content.classList.add('active');
            }
        });

        // Update navigation buttons
        prevButton.disabled = currentStep === 1;
        nextButton.textContent = currentStep === steps.length ? 'סיום' : 'הבא';
        nextButton.innerHTML = currentStep === steps.length ? 
            'סיום <i class="fas fa-check"></i>' : 
            'הבא <i class="fas fa-arrow-left"></i>';
    }

    // Initialize validation function if it exists
    const validateStep = window.validateCurrentStep || function() { return true; };

    nextButton.addEventListener('click', () => {
        if (validateStep()) {
            if (currentStep < steps.length) {
                currentStep++;
                updateSteps();
            } else {
                // Handle form submission
                const form = document.querySelector('form');
                if (form) {
                    form.submit();
                }
            }
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    // Allow clicking on step indicators to navigate
    steps.forEach(step => {
        step.addEventListener('click', () => {
            const targetStep = parseInt(step.dataset.step);
            if (targetStep < currentStep || validateStep()) {
                currentStep = targetStep;
                updateSteps();
            }
        });
    });

    // Initialize steps
    updateSteps();
});