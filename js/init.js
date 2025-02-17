import DataSourcesModal from './components/data-sources-modal.js';
import PromptGenerator from './components/prompt-generator.js';
import BotPreview from './components/bot-preview.js';
import FileUpload from './components/file-upload.js';
import WizardNavigation from './wizard-navigation.js';
import AppearanceSettings from './components/appearance-settings.js';
import PersonalitySettings from './components/personality-settings.js';

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const dataSourcesModal = new DataSourcesModal();
    const botPreview = new BotPreview();
    const fileUpload = new FileUpload();
    const wizardNavigation = new WizardNavigation();
    const appearanceSettings = new AppearanceSettings();
    const personalitySettings = new PersonalitySettings();

    // Listen for step changes to update component states
    document.addEventListener('wizardStepChange', (event) => {
        const { step } = event.detail;
        
        // Update components based on current step
        switch(step) {
            case 2: // Data Sources
                dataSourcesModal.activate();
                break;
            case 3: // Appearance
                appearanceSettings.activate();
                break;
            case 4: // Personality
                personalitySettings.activate();
                const promptGenerator = new PromptGenerator();
                break;
            case 5: // Preview
                botPreview.activate();
                break;
        }
    });

    // Store components in window for debugging
    window.botComponents = {
        dataSourcesModal,
        botPreview,
        fileUpload,
        wizardNavigation,
        appearanceSettings,
        personalitySettings
    };
});
