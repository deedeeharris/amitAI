class DataSourcesModal {
    constructor() {
        this.isOpen = false;
        this.selectedSources = new Set();
        this.container = null;
        this.searchTimeout = null;
        this.predefinedSources = [
            { id: 'tanach', name: 'תנ״ך', category: 'יהדות', description: 'תורה, נביאים וכתובים' },
            { id: 'mishna', name: 'משנה', category: 'יהדות', description: 'ששה סדרי משנה' },
            { id: 'talmud', name: 'תלמוד', category: 'יהדות', description: 'תלמוד בבלי' },
            { id: 'rambam', name: 'רמב״ם', category: 'יהדות', description: 'משנה תורה להרמב״ם' },
            { id: 'shulchan', name: 'שולחן ערוך', category: 'יהדות', description: 'שולחן ערוך ונושאי כליו' },
            { id: 'zohar', name: 'זוהר', category: 'יהדות', description: 'ספר הזוהר' },
            { id: 'amit_values', name: 'ערכי אמית', category: 'חינוך', description: 'מאגר ערכי רשת אמית' },
            { id: 'curriculum', name: 'תכנית לימודים', category: 'חינוך', description: 'תכניות לימודים משרד החינוך' }
        ];
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const template = `
            <div class="data-sources-modal" style="display: none;">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>ספריית מקורות</h2>
                        <button class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="search-section">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" placeholder="חפש במקורות..." class="source-search">
                            </div>
                            <div class="filter-tags">
                                <button class="filter-tag active" data-category="all">הכל</button>
                                <button class="filter-tag" data-category="יהדות">יהדות</button>
                                <button class="filter-tag" data-category="חינוך">חינוך</button>
                            </div>
                        </div>

                        <div class="sources-list">
                            ${this.renderSourcesList()}
                        </div>

                        <div class="selected-sources">
                            <h3>מקורות נבחרים</h3>
                            <div class="selected-sources-list"></div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="add-sources-btn" disabled>
                            הוסף מקורות
                            <span class="sources-count">(0)</span>
                        </button>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', template);
        this.container = document.querySelector('.data-sources-modal');
    }

    renderSourcesList(filter = '', category = 'all') {
        return this.predefinedSources
            .filter(source => {
                const matchesSearch = !filter || 
                    source.name.toLowerCase().includes(filter.toLowerCase()) ||
                    source.description.toLowerCase().includes(filter.toLowerCase());
                const matchesCategory = category === 'all' || source.category === category;
                return matchesSearch && matchesCategory;
            })
            .map(source => `
                <div class="source-item" data-id="${source.id}">
                    <div class="source-checkbox">
                        <input type="checkbox" id="${source.id}" ${this.selectedSources.has(source.id) ? 'checked' : ''}>
                        <label for="${source.id}"></label>
                    </div>
                    <div class="source-info">
                        <h4>${source.name}</h4>
                        <p>${source.description}</p>
                        <span class="source-category">${source.category}</span>
                    </div>
                </div>
            `).join('');
    }

    updateSelectedSourcesList() {
        const container = this.container.querySelector('.selected-sources-list');
        const selectedSourcesHtml = Array.from(this.selectedSources)
            .map(id => {
                const source = this.predefinedSources.find(s => s.id === id);
                return `
                    <div class="selected-source" data-id="${source.id}">
                        <span>${source.name}</span>
                        <button class="remove-source">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            })
            .join('');
        
        container.innerHTML = selectedSourcesHtml;
        
        // Update sources count and button state
        const countElement = this.container.querySelector('.sources-count');
        const addButton = this.container.querySelector('.add-sources-btn');
        countElement.textContent = `(${this.selectedSources.size})`;
        addButton.disabled = this.selectedSources.size === 0;
    }

    attachEventListeners() {
        // Close modal
        this.container.querySelector('.close-modal').addEventListener('click', () => this.close());
        this.container.querySelector('.modal-overlay').addEventListener('click', () => this.close());

        // Search functionality
        const searchInput = this.container.querySelector('.source-search');
        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                const activeCategory = this.container.querySelector('.filter-tag.active').dataset.category;
                this.container.querySelector('.sources-list').innerHTML = 
                    this.renderSourcesList(e.target.value, activeCategory);
            }, 300);
        });

        // Category filter
        this.container.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.container.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                const searchTerm = this.container.querySelector('.source-search').value;
                this.container.querySelector('.sources-list').innerHTML = 
                    this.renderSourcesList(searchTerm, tag.dataset.category);
            });
        });

        // Source selection
        this.container.querySelector('.sources-list').addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const sourceId = e.target.id;
                if (e.target.checked) {
                    this.selectedSources.add(sourceId);
                } else {
                    this.selectedSources.delete(sourceId);
                }
                this.updateSelectedSourcesList();
            }
        });

        // Remove selected source
        this.container.querySelector('.selected-sources-list').addEventListener('click', (e) => {
            if (e.target.closest('.remove-source')) {
                const sourceItem = e.target.closest('.selected-source');
                const sourceId = sourceItem.dataset.id;
                this.selectedSources.delete(sourceId);
                this.updateSelectedSourcesList();
                
                // Update checkbox in sources list
                const checkbox = this.container.querySelector(`#${sourceId}`);
                if (checkbox) checkbox.checked = false;
            }
        });

        // Add sources button
        this.container.querySelector('.add-sources-btn').addEventListener('click', () => {
            // Emit event with selected sources
            const event = new CustomEvent('sourcesSelected', {
                detail: {
                    sources: Array.from(this.selectedSources).map(id => 
                        this.predefinedSources.find(s => s.id === id)
                    )
                }
            });
            document.dispatchEvent(event);
            this.close();
        });
    }

    open() {
        this.container.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.container.style.display = 'none';
        document.body.style.overflow = '';
    }

    activate() {
        // This method is called when step 2 becomes active
        const openModalBtn = document.querySelector('[data-step="2"] .open-sources-library');
        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => this.open());
        }
    }
}

export default DataSourcesModal;
