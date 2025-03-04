/**
 * File Upload Component
 * Handles document uploads with drag-and-drop support
 */
class FileUpload {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            maxFileSize: 10 * 1024 * 1024, // 10MB default
            allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
            ...options
        };
        
        this.files = [];
        this.init();
    }
    
    /**
     * Initialize the component
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) return;
        
        // Create upload zone (hidden but still functional)
        this.createUploadZone();
        
        // Create file list container
        this.fileListContainer = document.createElement('div');
        this.fileListContainer.className = 'file-list';
        if (this.files.length === 0) {
            this.fileListContainer.style.display = 'none';
        }
        this.container.appendChild(this.fileListContainer);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up compact button listener
        this.setupCompactButton();
    }
    
    /**
     * Create the upload zone element
     */
    createUploadZone() {
        this.uploadZone = document.createElement('div');
        this.uploadZone.className = 'upload-zone';
        this.uploadZone.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p>גרור קבצים לכאן או לחץ להעלאה</p>
            <p class="upload-formats">קבצים נתמכים: ${this.options.allowedTypes.join(', ')}</p>
            <input type="file" multiple class="file-input" style="display: none;">
        `;
        
        this.container.appendChild(this.uploadZone);
        this.fileInput = this.uploadZone.querySelector('.file-input');
    }
    
    /**
     * Set up event listeners for drag and drop and file selection
     */
    setupEventListeners() {
        // Click to select files
        this.uploadZone.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Drag and drop events
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });
        
        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('dragover');
        });
        
        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }
    
    /**
     * Set up the compact button
     */
    setupCompactButton() {
        const compactButton = document.getElementById('compact-file-upload-btn');
        if (compactButton) {
            compactButton.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
    }
    
    /**
     * Handle the selected files
     */
    handleFiles(fileList) {
        Array.from(fileList).forEach(file => {
            // Check file size
            if (file.size > this.options.maxFileSize) {
                this.showError(`הקובץ ${file.name} גדול מדי. גודל מקסימלי: ${this.formatFileSize(this.options.maxFileSize)}`);
                return;
            }
            
            // Check file type
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!this.options.allowedTypes.includes(fileExtension)) {
                this.showError(`סוג הקובץ ${fileExtension} אינו נתמך. סוגים נתמכים: ${this.options.allowedTypes.join(', ')}`);
                return;
            }
            
            // Add file to the list
            this.addFile(file);
        });
    }
    
    /**
     * Add a file to the list
     */
    addFile(file) {
        // Check if file already exists
        if (this.files.some(f => f.name === file.name && f.size === file.size)) {
            this.showError(`הקובץ ${file.name} כבר קיים ברשימה`);
            return;
        }
        
        // Add to files array
        this.files.push(file);
        
        // Show file list if it was hidden
        if (this.fileListContainer.style.display === 'none') {
            this.fileListContainer.style.display = 'block';
        }
        
        // Create file item element
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
            </div>
            <button class="remove-file" data-filename="${file.name}" title="הסר קובץ">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        // Add remove button event
        const removeButton = fileItem.querySelector('.remove-file');
        removeButton.addEventListener('click', () => {
            this.removeFile(file.name);
            fileItem.remove();
            
            // Hide file list if empty
            if (this.files.length === 0) {
                this.fileListContainer.style.display = 'none';
            }
        });
        
        // Add to file list
        this.fileListContainer.appendChild(fileItem);
    }
    
    /**
     * Remove a file from the list
     */
    removeFile(fileName) {
        this.files = this.files.filter(file => file.name !== fileName);
    }
    
    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Show error message
     */
    showError(message) {
        // Simple alert for now, could be replaced with a more elegant solution
        alert(message);
    }
    
    /**
     * Get the list of files
     */
    getFiles() {
        return this.files;
    }
    
    /**
     * Clear all files
     */
    clearFiles() {
        this.files = [];
        this.fileListContainer.innerHTML = '';
        this.fileListContainer.style.display = 'none';
    }
} 