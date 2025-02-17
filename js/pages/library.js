// Library page functionality
class BotLibrary {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            subject: '',
            grade: '',
            sort: 'newest'
        };
        this.initializeElements();
        this.attachEventListeners();
        this.loadBots();
    }

    initializeElements() {
        // Search elements
        this.searchInput = document.getElementById('search-input');
        this.subjectFilter = document.getElementById('subject-filter');
        this.gradeFilter = document.getElementById('grade-filter');
        this.sortSelect = document.getElementById('sort-select');
        
        // Grid and pagination
        this.botGrid = document.getElementById('bot-grid');
        this.pageNumbers = document.getElementById('page-numbers');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
    }

    attachEventListeners() {
        // Search and filter events
        this.searchInput.addEventListener('input', debounce(() => this.loadBots(), 300));
        this.subjectFilter.addEventListener('change', () => this.loadBots());
        this.gradeFilter.addEventListener('change', () => this.loadBots());
        this.sortSelect.addEventListener('change', () => this.loadBots());

        // Pagination events
        this.prevPageBtn.addEventListener('click', () => this.changePage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(this.currentPage + 1));
    }

    async loadBots() {
        try {
            const searchQuery = this.searchInput.value;
            const filters = {
                subject: this.subjectFilter.value,
                grade: this.gradeFilter.value,
                sort: this.sortSelect.value
            };

            // Show loading state
            this.botGrid.innerHTML = '<div class="loading">טוען מלווים...</div>';

            // Fetch bots from API
            const response = await api.get('/bots', {
                params: {
                    page: this.currentPage,
                    limit: this.itemsPerPage,
                    search: searchQuery,
                    ...filters
                }
            });

            const { bots, total } = response.data;
            
            // Update grid
            this.renderBots(bots);
            
            // Update pagination
            this.updatePagination(total);
            
        } catch (error) {
            console.error('Error loading bots:', error);
            this.botGrid.innerHTML = '<div class="error">שגיאה בטעינת המלווים. אנא נסה שוב.</div>';
        }
    }

    renderBots(bots) {
        if (!bots.length) {
            this.botGrid.innerHTML = '<div class="no-results">לא נמצאו מלווים תואמים לחיפוש</div>';
            return;
        }

        this.botGrid.innerHTML = bots.map(bot => `
            <div class="bot-card">
                <div class="bot-image">
                    <img src="${bot.imageUrl || 'assets/default-bot.png'}" alt="${bot.name}">
                </div>
                <div class="bot-info">
                    <h3>${bot.name}</h3>
                    <p>${bot.description}</p>
                    <div class="bot-tags">
                        ${bot.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="bot-actions">
                    <a href="pages/bot-details.html?id=${bot.id}" class="action-button">
                        <i class="fas fa-info-circle"></i>
                        פרטים נוספים
                    </a>
                    <button class="action-button primary" onclick="startChat('${bot.id}')">
                        <i class="fas fa-play"></i>
                        התחל שיחה
                    </button>
                </div>
            </div>
        `).join('');
    }

    updatePagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        
        // Update buttons state
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;

        // Generate page numbers
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // First page
                i === totalPages || // Last page
                (i >= this.currentPage - 1 && i <= this.currentPage + 1) // Pages around current
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        this.pageNumbers.innerHTML = pages.map(page => {
            if (page === '...') {
                return '<span class="page-ellipsis">...</span>';
            }
            return `
                <button class="page-number ${page === this.currentPage ? 'active' : ''}"
                        onclick="library.changePage(${page})">
                    ${page}
                </button>
            `;
        }).join('');
    }

    changePage(page) {
        this.currentPage = page;
        this.loadBots();
        // Scroll to top of grid
        this.botGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// Helper function for debouncing search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize library when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.library = new BotLibrary();
});
