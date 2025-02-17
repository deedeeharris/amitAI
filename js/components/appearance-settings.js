class AppearanceSettings {
    constructor() {
        this.avatarDescription = '';
        this.currentAvatar = null;
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const descriptionInput = document.querySelector('.avatar-description');
        const generateBtn = document.querySelector('.generate-avatar');
        const regenerateBtn = document.querySelector('.regenerate-avatar');
        const approveBtn = document.querySelector('.approve-avatar');
        const testVoiceBtn = document.querySelector('.test-voice');

        // Enable/disable generate button based on description
        descriptionInput?.addEventListener('input', (e) => {
            this.avatarDescription = e.target.value.trim();
            generateBtn.disabled = this.avatarDescription.length < 10;
        });

        // Generate avatar
        generateBtn?.addEventListener('click', () => this.generateAvatar());
        regenerateBtn?.addEventListener('click', () => this.generateAvatar());
        approveBtn?.addEventListener('click', () => this.approveAvatar());

        // Voice preview
        testVoiceBtn?.addEventListener('click', () => this.previewVoice());

        // Voice selection
        document.querySelector('.voice-gender')?.addEventListener('change', () => this.updateVoicePreview());
        document.querySelector('.voice-age')?.addEventListener('change', () => this.updateVoicePreview());
    }

    async generateAvatar() {
        if (this.isGenerating) return;

        const avatarContainer = document.querySelector('.avatar-container');
        const placeholder = avatarContainer.querySelector('.avatar-placeholder');
        const img = avatarContainer.querySelector('img');
        const generateBtn = document.querySelector('.generate-avatar');
        const regenerateBtn = document.querySelector('.regenerate-avatar');
        const approveBtn = document.querySelector('.approve-avatar');

        try {
            this.isGenerating = true;
            generateBtn.disabled = true;
            regenerateBtn.style.display = 'none';
            approveBtn.style.display = 'none';

            // Show loading state
            placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>מייצר תמונה...</span>';
            placeholder.style.display = 'flex';
            img.style.display = 'none';

            // TODO: Call avatar generation API
            // For now, simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate receiving an image URL
            const imageUrl = 'https://placeholder.com/avatar.jpg';
            this.currentAvatar = imageUrl;

            // Show generated image
            img.src = imageUrl;
            img.style.display = 'block';
            placeholder.style.display = 'none';

            // Show regenerate and approve buttons
            regenerateBtn.style.display = 'block';
            approveBtn.style.display = 'block';

        } catch (error) {
            console.error('Failed to generate avatar:', error);
            placeholder.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>שגיאה ביצירת התמונה</span>';
        } finally {
            this.isGenerating = false;
            generateBtn.disabled = false;
        }
    }

    approveAvatar() {
        if (!this.currentAvatar) return;

        // Emit event with approved avatar
        const event = new CustomEvent('avatarApproved', {
            detail: { avatarUrl: this.currentAvatar }
        });
        document.dispatchEvent(event);

        // Update UI
        const regenerateBtn = document.querySelector('.regenerate-avatar');
        const approveBtn = document.querySelector('.approve-avatar');
        regenerateBtn.style.display = 'none';
        approveBtn.style.display = 'none';
    }

    updateVoicePreview() {
        const gender = document.querySelector('.voice-gender').value;
        const age = document.querySelector('.voice-age').value;
        document.querySelector('.test-voice').disabled = false;
    }

    async previewVoice() {
        const gender = document.querySelector('.voice-gender').value;
        const age = document.querySelector('.voice-age').value;
        const testBtn = document.querySelector('.test-voice');

        try {
            testBtn.disabled = true;
            testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> טוען...';

            // TODO: Call voice preview API
            // For now, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // TODO: Play audio sample
            console.log('Playing voice sample:', { gender, age });

        } catch (error) {
            console.error('Failed to preview voice:', error);
        } finally {
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-play"></i> נסה את הקול';
        }
    }

    activate() {
        // This method is called when step 3 becomes active
        document.querySelector('.test-voice').disabled = false;
    }
}

export default AppearanceSettings;
