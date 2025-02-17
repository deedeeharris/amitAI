// Form validation functionality
window.validateCurrentStep = function() {
    const currentStepContent = document.querySelector('.step-content-item.active');
    if (!currentStepContent) return true;

    const stepNumber = parseInt(currentStepContent.dataset.step);
    const requiredFields = currentStepContent.querySelectorAll('[required]');
    let isValid = true;

    // Remove existing error messages
    currentStepContent.querySelectorAll('.error-message').forEach(msg => msg.remove());
    currentStepContent.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

    // Validate required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showError(field, 'שדה חובה');
        }
    });

    // Step-specific validation
    switch(stepNumber) {
        case 1:
            // Basic Information validation
            const botName = document.getElementById('bot-name');
            if (botName && botName.value.length < 3) {
                isValid = false;
                showError(botName, 'שם המלווה חייב להכיל לפחות 3 תווים');
            }
            break;

        case 2:
            // Personality validation
            const temperature = document.getElementById('temperature');
            if (temperature && (temperature.value < 0 || temperature.value > 1)) {
                isValid = false;
                showError(temperature, 'ערך הטמפרטורה חייב להיות בין 0 ל-1');
            }
            break;

        case 3:
            // Knowledge Base validation
            const sourcesList = document.querySelector('.sources-list');
            if (sourcesList && !sourcesList.children.length) {
                isValid = false;
                showError(sourcesList.parentElement, 'יש להוסיף לפחות מקור מידע אחד');
            }
            break;

        case 4:
            // Preview validation - no specific validation needed
            break;

        case 5:
            // Deployment settings validation
            const accessOptions = document.querySelectorAll('input[name="access"]:checked');
            if (!accessOptions.length) {
                isValid = false;
                showError(document.querySelector('.access-controls'), 'יש לבחור הגדרת גישה');
            }
            break;
    }

    return isValid;
}

function showError(element, message) {
    if (!element) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.classList.add('error');
    
    // If the element is an input, add error after it
    // Otherwise, add it to the parent element
    if (element.tagName.toLowerCase() === 'input' || 
        element.tagName.toLowerCase() === 'select' || 
        element.tagName.toLowerCase() === 'textarea') {
        element.parentNode.appendChild(errorDiv);
    } else {
        element.appendChild(errorDiv);
    }
}