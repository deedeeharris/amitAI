/**
 * Avatar Upload Component
 * Manages avatar image uploads and processing
 */
class AvatarUpload {
    constructor() {
        this.uploadContainer = document.getElementById('avatar-upload-container');
        this.uploadPreview = document.getElementById('avatar-upload-preview');
        this.avatarTabs = document.querySelectorAll('.avatar-tab');
        this.avatarTabContents = document.querySelectorAll('.avatar-tab-content');
        this.selectedAvatar = document.querySelector('.selected-avatar');
        this.avatarDescription = document.getElementById('avatar-description');
        
        this.init();
    }
    
    /**
     * Initialize the component
     */
    init() {
        this.setupUploader();
        this.setupTabs();
        this.setupGenerateButtons();
    }
    
    setupUploader() {
        if (!this.uploadContainer) return;
        
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'avatar-file-input';
        this.uploadContainer.appendChild(fileInput);
        
        // Create upload button
        const uploadButton = document.createElement('button');
        uploadButton.className = 'upload-button';
        uploadButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            העלאת תמונה
        `;
        this.uploadContainer.appendChild(uploadButton);
        
        // Handle click on upload button
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.displayUploadedImage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    displayUploadedImage(src) {
        this.uploadPreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Uploaded Avatar';
        img.className = 'uploaded-avatar';
        this.uploadPreview.appendChild(img);
        
        // Add approve button
        const approveButton = document.createElement('button');
        approveButton.className = 'approve-upload-button';
        approveButton.textContent = 'אשר תמונה';
        this.uploadPreview.appendChild(approveButton);
        
        // Handle approve button click
        approveButton.addEventListener('click', () => {
            if (this.selectedAvatar) {
                this.selectedAvatar.src = src;
                
                // Trigger an event to notify that the avatar has been updated
                const event = new CustomEvent('avatar-updated', { detail: { src } });
                document.dispatchEvent(event);
            }
        });
    }
    
    setupTabs() {
        this.avatarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                this.avatarTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                this.avatarTabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });
                
                // Show the corresponding tab content
                const tabId = tab.getAttribute('data-tab');
                const tabContent = document.getElementById(`tab-${tabId}`);
                if (tabContent) {
                    tabContent.classList.add('active');
                    tabContent.style.display = 'block';
                }
            });
        });
    }
    
    setupGenerateButtons() {
        const generateButton = document.querySelector('.generate-image-button');
        const generateNewButton = document.querySelector('.generate-new-image-button');
        const approveButton = document.querySelector('.approve-image-button');
        
        if (generateButton) {
            generateButton.addEventListener('click', () => {
                // Check if there's a description
                if (!this.avatarDescription || !this.avatarDescription.value.trim()) {
                    alert('אנא הזן תיאור לדמות לפני יצירת תמונה');
                    return;
                }
                
                // In a real implementation, this would call an AI service to generate an image based on the description
                // For now, we'll just simulate it by showing the other buttons and using a placeholder
                this.simulateImageGeneration();
                
                // Show new buttons
                generateButton.style.display = 'none';
                generateNewButton.style.display = 'inline-block';
                approveButton.style.display = 'inline-block';
            });
        }
        
        if (generateNewButton) {
            generateNewButton.addEventListener('click', () => {
                // Simulate generating a new image based on the description
                this.simulateImageGeneration();
            });
        }
        
        if (approveButton) {
            approveButton.addEventListener('click', () => {
                // In a real implementation, this would save the generated image
                // For now, we'll just reset the UI
                generateButton.style.display = 'inline-block';
                generateNewButton.style.display = 'none';
                approveButton.style.display = 'none';
                
                // Trigger an event to notify that the avatar has been updated
                if (this.selectedAvatar) {
                    const event = new CustomEvent('avatar-updated', { detail: { src: this.selectedAvatar.src } });
                    document.dispatchEvent(event);
                }
            });
        }
    }
    
    simulateImageGeneration() {
        // Show loading overlay
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Simulate AI image generation delay
        setTimeout(() => {
            // Hide loading overlay
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            // For demo purposes, we'll just use one of our placeholder images randomly
            if (this.selectedAvatar) {
                const avatars = [
                    '../assets/images/placeholder-avatar.svg',
                    '../assets/images/avatar-blue.svg',
                    '../assets/images/avatar-green.svg',
                    '../assets/images/avatar-purple.svg',
                    '../assets/images/avatar-orange.svg'
                ];
                
                const randomIndex = Math.floor(Math.random() * avatars.length);
                this.selectedAvatar.src = avatars[randomIndex];
            }
        }, 1500);
    }
}

// Initialize the avatar upload component when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AvatarUpload();
}); 