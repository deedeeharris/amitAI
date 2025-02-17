// File upload handling
class FileUpload {
    constructor() {
        this.uploadZone = null;
        this.fileInput = null;
        this.sourcesList = null;
        this.uploadedFiles = new Set();
        this.init();
    }

    init() {
        // Wait for DOM to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find elements in step 2 (Data Sources)
        const dataSourcesStep = document.querySelector('[data-step="2"] .form-section');
        if (!dataSourcesStep) return;

        this.uploadZone = dataSourcesStep.querySelector('.upload-zone');
        this.fileInput = this.uploadZone?.querySelector('input[type="file"]');
        this.sourcesList = dataSourcesStep.querySelector('.sources-list');

        if (!this.uploadZone || !this.fileInput || !this.sourcesList) return;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Handle drag and drop
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('drag-over');
        });

        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('drag-over');
        });

        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });

        // Handle click upload
        this.uploadZone.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    handleFiles(files) {
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            // Check if file is already uploaded
            if (this.uploadedFiles.has(file.name)) {
                this.showNotification('warning', `הקובץ ${file.name} כבר קיים`);
                return;
            }

            // Check file type
            if (!this.isValidFileType(file)) {
                this.showNotification('error', `סוג הקובץ ${file.name} אינו נתמך`);
                return;
            }

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showNotification('error', `הקובץ ${file.name} גדול מדי (מקסימום 10MB)`);
                return;
            }

            // Add to uploaded files
            this.uploadedFiles.add(file.name);
            this.addFileToList(file);
        });

        // Reset file input
        this.fileInput.value = '';
    }

    isValidFileType(file) {
        const validTypes = [
            'text/plain',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        return validTypes.includes(file.type);
    }

    addFileToList(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        
        const fileSize = this.formatFileSize(file.size);
        fileElement.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-alt"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize}</span>
            </div>
            <button class="remove-file" title="הסר קובץ">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add remove functionality
        const removeButton = fileElement.querySelector('.remove-file');
        removeButton.addEventListener('click', () => {
            this.uploadedFiles.delete(file.name);
            fileElement.remove();
            this.showNotification('info', `הקובץ ${file.name} הוסר`);
        });

        this.sourcesList.appendChild(fileElement);
        this.showNotification('success', `הקובץ ${file.name} הועלה בהצלחה`);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }

    showNotification(type, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `upload-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-circle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }
}

// Export for use in other modules
export default FileUpload;