// Data Sources Screen Management
class DataSourcesScreen {
    constructor() {
        this.sources = [];
        this.initializeElements();
        this.attachEventListeners();
        this.loadSources();
    }

    initializeElements() {
        // Source Library
        this.sourceLibraryBtn = document.getElementById('open-sources-library');
        this.sourcesModal = document.getElementById('sources-modal');
        this.sourcesSearchInput = document.getElementById('sources-search-modal');
        this.sourcesListModal = document.getElementById('sources-list-modal');
        
        // File Upload
        this.uploadInput = document.getElementById('upload-source');
        this.uploadButton = document.getElementById('upload-source-button');
        
        // URL Inputs
        this.youtubeInput = document.getElementById('youtube-link');
        this.youtubeButton = document.getElementById('add-youtube-link');
        this.websiteInput = document.getElementById('website-link');
        this.websiteButton = document.getElementById('add-website-link');
        
        // Sources List
        this.sourcesList = document.getElementById('added-sources');
    }

    attachEventListeners() {
        // Source Library
        this.sourceLibraryBtn.addEventListener('click', () => this.openSourceLibrary());
        this.sourcesSearchInput.addEventListener('input', (e) => this.filterSources(e.target.value));
        
        // File Upload
        this.uploadButton.addEventListener('click', () => this.uploadInput.click());
        this.uploadInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // URL Inputs
        this.youtubeButton.addEventListener('click', () => this.addYoutubeLink());
        this.websiteButton.addEventListener('click', () => this.addWebsiteLink());
        
        // Close Modal
        document.querySelector('.close-button').addEventListener('click', () => this.closeSourceLibrary());
    }

    async loadSources() {
        try {
            const sources = await mockService.getDataSources();
            this.populateSourceLibrary(sources);
        } catch (error) {
            console.error('Failed to load sources:', error);
            alert('שגיאה בטעינת מקורות המידע');
        }
    }

    populateSourceLibrary(sources) {
        this.sourcesListModal.innerHTML = sources.map(source => `
            <li data-source-id="${source.id}">
                <div class="source-info">
                    <span class="source-title">${source.title}</span>
                    <span class="source-meta">${source.type} | ${source.format} | ${source.size}</span>
                </div>
                <button class="add-source-btn">הוסף</button>
            </li>
        `).join('');

        // Add click handlers
        this.sourcesListModal.querySelectorAll('.add-source-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sourceId = e.target.closest('li').dataset.sourceId;
                const source = sources.find(s => s.id === sourceId);
                this.addSource(source);
            });
        });
    }

    filterSources(query) {
        const items = this.sourcesListModal.querySelectorAll('li');
        items.forEach(item => {
            const title = item.querySelector('.source-title').textContent.toLowerCase();
            const matches = title.includes(query.toLowerCase());
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    addSource(source) {
        if (this.sources.some(s => s.id === source.id)) {
            alert('מקור זה כבר קיים ברשימה');
            return;
        }

        this.sources.push(source);
        this.updateSourcesList();
        this.closeSourceLibrary();
        this.saveState();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Mock file upload
        const source = {
            id: 'file-' + Math.random().toString(36).substr(2, 9),
            title: file.name,
            type: 'upload',
            format: file.name.split('.').pop(),
            size: this.formatFileSize(file.size)
        };

        this.addSource(source);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    addYoutubeLink() {
        const url = this.youtubeInput.value.trim();
        if (!url) return;

        if (!this.isValidYoutubeUrl(url)) {
            alert('נא להזין קישור תקין ל-YouTube');
            return;
        }

        const source = {
            id: 'yt-' + Math.random().toString(36).substr(2, 9),
            title: 'סרטון YouTube',
            type: 'video',
            format: 'youtube',
            url: url
        };

        this.addSource(source);
        this.youtubeInput.value = '';
    }

    addWebsiteLink() {
        const url = this.websiteInput.value.trim();
        if (!url) return;

        if (!this.isValidUrl(url)) {
            alert('נא להזין כתובת אתר תקינה');
            return;
        }

        const source = {
            id: 'web-' + Math.random().toString(36).substr(2, 9),
            title: url,
            type: 'website',
            format: 'url',
            url: url
        };

        this.addSource(source);
        this.websiteInput.value = '';
    }

    isValidYoutubeUrl(url) {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return pattern.test(url);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    updateSourcesList() {
        this.sourcesList.innerHTML = this.sources.map(source => `
            <li data-source-id="${source.id}">
                <div class="source-info">
                    <i class="fas ${this.getSourceIcon(source.type)}"></i>
                    <span>${source.title}</span>
                </div>
                <button class="remove-source" title="הסר מקור">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </li>
        `).join('');

        // Add remove handlers
        this.sourcesList.querySelectorAll('.remove-source').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sourceId = e.target.closest('li').dataset.sourceId;
                this.removeSource(sourceId);
            });
        });
    }

    getSourceIcon(type) {
        const icons = {
            'book': 'fa-book',
            'presentation': 'fa-file-powerpoint',
            'article': 'fa-file-alt',
            'video': 'fa-video',
            'website': 'fa-globe',
            'upload': 'fa-file-upload'
        };
        return icons[type] || 'fa-file';
    }

    removeSource(sourceId) {
        this.sources = this.sources.filter(s => s.id !== sourceId);
        this.updateSourcesList();
        this.saveState();
    }

    openSourceLibrary() {
        this.sourcesModal.style.display = 'block';
    }

    closeSourceLibrary() {
        this.sourcesModal.style.display = 'none';
    }

    saveState() {
        const state = JSON.parse(localStorage.getItem('botGeneratorState') || '{}');
        state.sources = this.sources;
        localStorage.setItem('botGeneratorState', JSON.stringify(state));
    }

    loadState() {
        const state = JSON.parse(localStorage.getItem('botGeneratorState') || '{}');
        if (state.sources) {
            this.sources = state.sources;
            this.updateSourcesList();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataSourcesScreen = new DataSourcesScreen();
});
