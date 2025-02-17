class DataSourcesModal {
    constructor() {
        this.modal = null;
        this.sourcesList = [];
        this.selectedSources = new Set();
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div class="modal data-sources-modal" id="data-sources-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>ספריית מקורות</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="sources-search">
                            <input type="text" placeholder="חיפוש מקורות..." class="search-input">
                        </div>
                        <div class="sources-list"></div>
                        <div class="selected-sources">
                            <h4>מקורות נבחרים</h4>
                            <div class="selected-sources-list"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary cancel-selection">ביטול</button>
                        <button class="btn-primary confirm-selection">אישור בחירה</button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('data-sources-modal');
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('.close-modal');
        const cancelBtn = this.modal.querySelector('.cancel-selection');
        const confirmBtn = this.modal.querySelector('.confirm-selection');
        const searchInput = this.modal.querySelector('.search-input');

        closeBtn.addEventListener('click', () => this.hide());
        cancelBtn.addEventListener('click', () => this.hide());
        confirmBtn.addEventListener('click', () => this.confirmSelection());
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    show() {
        this.modal.style.display = 'block';
        this.loadSources();
    }

    hide() {
        this.modal.style.display = 'none';
    }

    async loadSources() {
        // TODO: Replace with actual API call
        this.sourcesList = [
            { id: 1, title: 'מתמטיקה - כיתה ז', type: 'textbook' },
            { id: 2, title: 'היסטוריה - תקופת בית שני', type: 'document' },
            // Add more mock data
        ];
        this.renderSourcesList();
    }

    renderSourcesList() {
        const sourcesListEl = this.modal.querySelector('.sources-list');
        sourcesListEl.innerHTML = this.sourcesList
            .map(source => `
                <div class="source-item ${this.selectedSources.has(source.id) ? 'selected' : ''}" 
                     data-id="${source.id}">
                    <div class="source-info">
                        <h4>${source.title}</h4>
                        <span class="source-type">${source.type}</span>
                    </div>
                    <button class="select-source">
                        ${this.selectedSources.has(source.id) ? 'הסר' : 'הוסף'}
                    </button>
                </div>
            `).join('');

        this.updateSelectedSourcesList();
        this.attachSourceItemListeners();
    }

    updateSelectedSourcesList() {
        const selectedListEl = this.modal.querySelector('.selected-sources-list');
        const selectedSources = this.sourcesList.filter(s => this.selectedSources.has(s.id));
        
        selectedListEl.innerHTML = selectedSources
            .map(source => `
                <div class="selected-source" data-id="${source.id}">
                    <span>${source.title}</span>
                    <button class="remove-source">&times;</button>
                </div>
            `).join('');
    }

    attachSourceItemListeners() {
        const sourceItems = this.modal.querySelectorAll('.source-item');
        sourceItems.forEach(item => {
            const selectBtn = item.querySelector('.select-source');
            selectBtn.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                if (this.selectedSources.has(id)) {
                    this.selectedSources.delete(id);
                } else {
                    this.selectedSources.add(id);
                }
                this.renderSourcesList();
            });
        });
    }

    handleSearch(query) {
        if (!query) {
            this.renderSourcesList();
            return;
        }

        const filtered = this.sourcesList.filter(source => 
            source.title.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredSources(filtered);
    }

    renderFilteredSources(filteredSources) {
        const sourcesListEl = this.modal.querySelector('.sources-list');
        sourcesListEl.innerHTML = filteredSources
            .map(source => `
                <div class="source-item ${this.selectedSources.has(source.id) ? 'selected' : ''}" 
                     data-id="${source.id}">
                    <div class="source-info">
                        <h4>${source.title}</h4>
                        <span class="source-type">${source.type}</span>
                    </div>
                    <button class="select-source">
                        ${this.selectedSources.has(source.id) ? 'הסר' : 'הוסף'}
                    </button>
                </div>
            `).join('');

        this.attachSourceItemListeners();
    }

    confirmSelection() {
        // TODO: Handle selected sources
        const selectedSourcesData = this.sourcesList
            .filter(s => this.selectedSources.has(s.id));
        console.log('Selected sources:', selectedSourcesData);
        this.hide();
    }
}

// Export for use in other modules
export default DataSourcesModal;
