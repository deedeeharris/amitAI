// Library page functionality
class BotLibrary {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            subject: '',
            grade: '',
            sort: 'newest',
            favoritesOnly: false
        };
        this.currentView = 'search'; // 'search' or 'gallery'
        this.mockFavoriteBots = this.createMockFavoriteBots();
        this.favorites = this.loadFavorites();
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
        this.favoritesCheckbox = document.getElementById('favorites-only');
        
        // View toggles
        this.gridViewBtn = document.getElementById('grid-view-btn');
        this.galleryViewBtn = document.getElementById('gallery-view-btn');
        this.viewTabs = document.querySelectorAll('.tab-btn');
        
        // View containers
        this.botGrid = document.getElementById('bot-grid');
        this.featuredBots = document.getElementById('featured-bots');
        this.botCategories = document.getElementById('bot-categories');
        
        // Pagination
        this.pageNumbers = document.getElementById('page-numbers');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        
        // Preview modal
        this.previewModal = document.getElementById('bot-preview-modal');
        this.previewBotName = document.querySelector('.bot-preview-name');
        this.previewMessages = document.querySelector('.chat-messages');
        this.previewInput = document.querySelector('.chat-input input');
        this.previewSendBtn = document.querySelector('.send-message');
        this.closeModalBtn = document.querySelector('.close-modal');
    }

    attachEventListeners() {
        // Search and filter events
        this.searchInput.addEventListener('input', Utils.debounce(() => this.loadBots(), 300));
        this.subjectFilter.addEventListener('change', () => this.loadBots());
        this.gradeFilter.addEventListener('change', () => this.loadBots());
        this.sortSelect.addEventListener('change', () => this.loadBots());
        this.favoritesCheckbox.addEventListener('change', () => {
            this.filters.favoritesOnly = this.favoritesCheckbox.checked;
            this.loadBots();
        });

        // View toggle events
        this.gridViewBtn.addEventListener('click', () => this.toggleViewMode('grid'));
        this.galleryViewBtn.addEventListener('click', () => this.toggleViewMode('gallery'));
        
        // View tabs
        this.viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchView(tab.dataset.view);
            });
        });

        // Pagination events
        this.prevPageBtn.addEventListener('click', () => this.changePage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(this.currentPage + 1));
        
        // Preview modal events
        this.closeModalBtn.addEventListener('click', () => this.closePreviewModal());
        this.previewSendBtn.addEventListener('click', () => this.sendMessage());
        this.previewInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggleViewMode(mode) {
        if (mode === 'grid') {
            this.gridViewBtn.classList.add('active');
            this.galleryViewBtn.classList.remove('active');
            this.botGrid.classList.remove('gallery-mode');
        } else {
            this.gridViewBtn.classList.remove('active');
            this.galleryViewBtn.classList.add('active');
            this.botGrid.classList.add('gallery-mode');
        }
    }
    
    switchView(view) {
        this.currentView = view;
        this.viewTabs.forEach(tab => {
            if (tab.dataset.view === view) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        if (view === 'search') {
            this.botGrid.style.display = 'grid';
            this.featuredBots.style.display = 'none';
            this.botCategories.style.display = 'none';
        } else {
            this.botGrid.style.display = 'none';
            this.featuredBots.style.display = 'block';
            this.botCategories.style.display = 'block';
            this.loadFeaturedBots();
            this.loadCategories();
        }
    }

    createMockFavoriteBots() {
        return [
            {
                id: 'mock-fav-1',
                name: 'מלווה מתמטיקה מועדף',
                description: 'מלווה למידה למתמטיקה לכיתות ז׳-ט׳',
                subject: 'math',
                grade: '7-9',
                imageUrl: '../assets/bot-math.png',
                rating: 4.9,
                usageCount: 1500,
                createdAt: '2023-09-15T10:30:00Z',
                creator: 'צוות מתמטיקה'
            },
            {
                id: 'mock-fav-2',
                name: 'מלווה אנגלית מועדף',
                description: 'מלווה למידה לאנגלית לכיתות י׳-י״ב',
                subject: 'english',
                grade: '10-12',
                imageUrl: '../assets/bot-english.png',
                rating: 4.8,
                usageCount: 1200,
                createdAt: '2023-10-05T14:20:00Z',
                creator: 'צוות אנגלית'
            },
            {
                id: 'mock-fav-3',
                name: 'מלווה היסטוריה מועדף',
                description: 'מלווה למידה להיסטוריה לכיתות י׳-י״ב',
                subject: 'history',
                grade: '10-12',
                imageUrl: '../assets/bot-history.png',
                rating: 4.7,
                usageCount: 1100,
                createdAt: '2023-11-10T09:15:00Z',
                creator: 'צוות היסטוריה'
            }
        ];
    }

    getSubjectName(subjectCode) {
        const subjectMap = {
            'math': 'מתמטיקה',
            'science': 'מדעים',
            'history': 'היסטוריה',
            'literature': 'ספרות',
            'english': 'אנגלית',
            'hebrew': 'עברית',
            'bible': 'תנ״ך',
            'geography': 'גאוגרפיה',
            'computer_science': 'מדעי המחשב',
            'physics': 'פיזיקה',
            'chemistry': 'כימיה',
            'biology': 'ביולוגיה',
            'art': 'אמנות',
            'music': 'מוזיקה',
            'pe': 'חינוך גופני',
            'civics': 'אזרחות'
        };
        
        return subjectMap[subjectCode] || subjectCode;
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

            let bots = [];
            let total = 0;

            // If there's a search query or filters, use the API
            if (searchQuery || filters.subject || filters.grade) {
                // Fetch bots from API
                const response = await api.get('/bots', {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        search: searchQuery,
                        ...filters
                    }
                });

                bots = response.data.bots;
                total = response.data.total;
            } else {
                // If no search or filters, use mock data with favorites at the top
                const response = await api.get('/bots', {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        ...filters
                    }
                });

                // Add mock favorites to the beginning of the list
                bots = [...this.mockFavoriteBots, ...response.data.bots];
                total = response.data.total + this.mockFavoriteBots.length;

                // Mark mock favorites as favorites automatically
                this.mockFavoriteBots.forEach(bot => {
                    if (!this.favorites.includes(bot.id)) {
                        this.favorites.push(bot.id);
                    }
                });
                
                // Save updated favorites
                this.saveFavorites();
            }
            
            // Filter by favorites if needed
            if (this.filters.favoritesOnly) {
                bots = bots.filter(bot => this.favorites.includes(bot.id));
                total = bots.length;
            }
            
            // Update grid
            this.renderBots(bots);
            
            // Update pagination
            this.updatePagination(total);
            
        } catch (error) {
            console.error('Error loading bots:', error);
            
            // If there's an error, show mock favorites
            const bots = this.mockFavoriteBots || [];
            this.renderBots(bots);
            this.updatePagination(bots.length);
        }
    }
    
    async loadFeaturedBots() {
        try {
            const featuredGrid = this.featuredBots.querySelector('.featured-grid');
            featuredGrid.innerHTML = '<div class="loading">טוען מלווים מומלצים...</div>';
            
            // Fetch featured bots from API
            const response = await api.get('/bots/featured');
            let featuredBots = response.data;
            
            // Add mock favorites to featured bots
            if (this.mockFavoriteBots && this.mockFavoriteBots.length) {
                // Add mock favorites to the beginning of the list
                featuredBots = [...this.mockFavoriteBots, ...featuredBots];
            }
            
            if (!featuredBots.length) {
                featuredGrid.innerHTML = '<div class="no-results">אין מלווים מומלצים כרגע</div>';
                return;
            }
            
            featuredGrid.innerHTML = featuredBots.map(bot => this.createBotCard(bot, true)).join('');
            this.attachBotCardListeners(featuredGrid);
            
        } catch (error) {
            console.error('Error loading featured bots:', error);
            
            // If API fails, show mock favorites
            if (this.mockFavoriteBots && this.mockFavoriteBots.length) {
                const featuredGrid = this.featuredBots.querySelector('.featured-grid');
                featuredGrid.innerHTML = this.mockFavoriteBots.map(bot => this.createBotCard(bot, true)).join('');
                this.attachBotCardListeners(featuredGrid);
            } else {
                this.featuredBots.querySelector('.featured-grid').innerHTML = 
                    '<div class="error">שגיאה בטעינת המלווים המומלצים</div>';
            }
        }
    }
    
    async loadCategories() {
        try {
            const categoriesGrid = this.botCategories.querySelector('.categories-grid');
            categoriesGrid.innerHTML = '<div class="loading">טוען קטגוריות...</div>';
            
            // Fetch categories from API
            const response = await api.get('/categories');
            const categories = response.data;
            
            if (!categories.length) {
                categoriesGrid.innerHTML = '<div class="no-results">אין קטגוריות זמינות</div>';
                return;
            }
            
            categoriesGrid.innerHTML = categories.map(category => `
                <div class="category-card" data-category="${category.id}">
                    <div class="category-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <h3>${category.name}</h3>
                    <p>${category.botCount} מלווים</p>
                </div>
            `).join('');
            
            // Attach category click listeners
            const categoryCards = categoriesGrid.querySelectorAll('.category-card');
            categoryCards.forEach(card => {
                card.addEventListener('click', () => {
                    this.switchView('search');
                    this.subjectFilter.value = card.dataset.category;
                    this.loadBots();
                });
            });
            
        } catch (error) {
            console.error('Error loading categories:', error);
            this.botCategories.querySelector('.categories-grid').innerHTML = 
                '<div class="error">שגיאה בטעינת הקטגוריות</div>';
        }
    }

    renderBots(bots) {
        if (!bots.length) {
            this.botGrid.innerHTML = '<div class="no-results">לא נמצאו מלווים תואמים לחיפוש</div>';
            return;
        }

        this.botGrid.innerHTML = bots.map(bot => this.createBotCard(bot)).join('');
        this.attachBotCardListeners(this.botGrid);
    }
    
    createBotCard(bot, isFeatured = false) {
        const isFavorite = this.favorites.includes(bot.id);
        const favoriteClass = isFavorite ? 'favorited' : '';
        const featuredClass = isFeatured ? 'featured' : '';
        const isMockFavorite = this.mockFavoriteBots && this.mockFavoriteBots.some(mockBot => mockBot.id === bot.id);
        const mockFavoriteClass = isMockFavorite ? 'mock-favorite' : '';
        
        return `
            <div class="bot-card ${featuredClass} ${mockFavoriteClass}" data-id="${bot.id}">
                <div class="bot-image">
                    <img src="${bot.imageUrl || '../assets/default-bot.png'}" alt="${bot.name}">
                    <button class="favorite-btn ${favoriteClass}" data-id="${bot.id}" title="${isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}">
                        <i class="fas fa-star"></i>
                    </button>
                    ${isMockFavorite ? '<div class="mock-favorite-badge">מועדף</div>' : ''}
                </div>
                <div class="bot-info">
                    <h3 class="bot-name">${bot.name}</h3>
                    <p class="bot-description">${bot.description || ''}</p>
                    <div class="bot-meta">
                        ${bot.subject ? `<span class="bot-subject">${this.getSubjectName(bot.subject)}</span>` : ''}
                        ${bot.grade ? `<span class="bot-grade">כיתות ${bot.grade}</span>` : ''}
                    </div>
                    <div class="bot-stats">
                        <span class="bot-rating">
                            <i class="fas fa-star"></i>
                            ${bot.rating ? bot.rating.toFixed(1) : '0.0'}
                        </span>
                        <span class="bot-usage">
                            <i class="fas fa-users"></i>
                            ${bot.usageCount || 0}
                        </span>
                    </div>
                </div>
                <div class="bot-actions">
                    <button class="action-btn preview-btn" data-id="${bot.id}">
                        <i class="fas fa-eye"></i>
                        תצוגה מקדימה
                    </button>
                    <button class="action-btn duplicate-btn" data-id="${bot.id}">
                        <i class="fas fa-copy"></i>
                        שכפל
                    </button>
                </div>
            </div>
        `;
    }
    
    attachBotCardListeners(container) {
        // Favorite button listeners
        const favoriteButtons = container.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const botId = button.dataset.id;
                this.toggleFavorite(botId);
                
                // Update button state
                const isFavorite = this.favorites.includes(botId);
                button.classList.toggle('favorited', isFavorite);
                button.title = isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים';
                
                // If in favorites-only mode and removing from favorites, reload to filter out
                if (this.filters.favoritesOnly && !isFavorite) {
                    this.loadBots();
                }
            });
        });
        
        // Preview button listeners
        const previewButtons = container.querySelectorAll('.preview-btn');
        previewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const botId = button.dataset.id;
                this.openChatPreview(botId);
            });
        });
        
        // Duplicate button listeners
        const duplicateButtons = container.querySelectorAll('.duplicate-btn');
        duplicateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const botId = button.dataset.id;
                this.duplicateBot(botId);
            });
        });
    }

    updatePagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        
        // Update page numbers
        let paginationHTML = '';
        
        // Previous button
        this.prevPageBtn.disabled = this.currentPage <= 1;
        
        // Generate page numbers
        if (totalPages <= 7) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            data-page="${i}">${i}</button>
                `;
            }
        } else {
            // Show first page
            paginationHTML += `
                <button class="page-number ${this.currentPage === 1 ? 'active' : ''}" 
                        data-page="1">1</button>
            `;
            
            // Show ellipsis or second page
            if (this.currentPage > 3) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            } else {
                paginationHTML += `
                    <button class="page-number ${this.currentPage === 2 ? 'active' : ''}" 
                            data-page="2">2</button>
                `;
            }
            
            // Show current page and surrounding pages
            const startPage = Math.max(3, this.currentPage - 1);
            const endPage = Math.min(totalPages - 2, this.currentPage + 1);
            
            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            data-page="${i}">${i}</button>
                `;
            }
            
            // Show ellipsis or second-to-last page
            if (this.currentPage < totalPages - 2) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            } else {
                paginationHTML += `
                    <button class="page-number ${this.currentPage === totalPages - 1 ? 'active' : ''}" 
                            data-page="${totalPages - 1}">${totalPages - 1}</button>
                `;
            }
            
            // Show last page
            paginationHTML += `
                <button class="page-number ${this.currentPage === totalPages ? 'active' : ''}" 
                        data-page="${totalPages}">${totalPages}</button>
            `;
        }
        
        this.pageNumbers.innerHTML = paginationHTML;
        
        // Next button
        this.nextPageBtn.disabled = this.currentPage >= totalPages;
        
        // Add click event to page numbers
        const pageButtons = this.pageNumbers.querySelectorAll('.page-number');
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const page = parseInt(button.dataset.page);
                this.changePage(page);
            });
        });
    }

    changePage(page) {
        if (page !== this.currentPage) {
            this.currentPage = page;
            this.loadBots();
            
            // Scroll to top of grid
            this.botGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Favorites functionality
    loadFavorites() {
        const favorites = Utils.loadFromStorage('favorites') || [];
        
        // Add mock favorite IDs to ensure they're always in favorites
        if (this.mockFavoriteBots) {
            const mockIds = this.mockFavoriteBots.map(bot => bot.id);
            mockIds.forEach(id => {
                if (!favorites.includes(id)) {
                    favorites.push(id);
                }
            });
        }
        
        return favorites;
    }
    
    saveFavorites() {
        Utils.saveToStorage('favorites', this.favorites);
    }
    
    toggleFavorite(botId) {
        const index = this.favorites.indexOf(botId);
        
        // Check if it's a mock favorite
        const isMockFavorite = this.mockFavoriteBots && this.mockFavoriteBots.some(bot => bot.id === botId);
        
        if (isMockFavorite) {
            // Don't allow removing mock favorites
            if (index === -1) {
                this.favorites.push(botId);
                this.saveFavorites();
                Utils.showToast('נוסף למועדפים', 'success');
            } else {
                Utils.showToast('לא ניתן להסיר מלווה מועדף קבוע', 'warning');
            }
        } else {
            // Regular favorites can be toggled
            if (index === -1) {
                this.favorites.push(botId);
                this.saveFavorites();
                Utils.showToast('נוסף למועדפים', 'success');
            } else {
                this.favorites.splice(index, 1);
                this.saveFavorites();
                Utils.showToast('הוסר מהמועדפים', 'info');
            }
        }
    }
    
    // Bot preview functionality
    async openChatPreview(botId) {
        try {
            // Show loading state
            this.previewModal.style.display = 'block';
            this.previewBotName.textContent = 'טוען...';
            this.previewMessages.innerHTML = '<div class="loading">טוען שיחה...</div>';
            
            // Get bot details
            const response = await api.get(`/bots/${botId}`);
            const bot = response.data;
            
            // Update modal with bot info
            this.previewBotName.textContent = bot.name;
            
            // Clear messages and add welcome message
            this.previewMessages.innerHTML = '';
            
            // Add bot welcome message
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'message bot-message';
            welcomeMessage.innerHTML = `
                <div class="message-avatar">
                    <img src="${bot.imageUrl || '../assets/default-bot.png'}" alt="${bot.name}">
                </div>
                <div class="message-content">
                    <p>שלום! אני ${bot.name}. איך אוכל לעזור לך היום?</p>
                </div>
            `;
            this.previewMessages.appendChild(welcomeMessage);
            
            // Focus on input
            this.previewInput.value = '';
            this.previewInput.focus();
            
        } catch (error) {
            console.error('Error opening chat preview:', error);
            this.previewMessages.innerHTML = '<div class="error">שגיאה בטעינת השיחה</div>';
        }
    }
    
    closePreviewModal() {
        this.previewModal.style.display = 'none';
        this.previewMessages.innerHTML = '';
        this.previewInput.value = '';
    }
    
    async sendMessage() {
        const message = this.previewInput.value.trim();
        if (!message) return;
        
        // Clear input
        this.previewInput.value = '';
        
        // Add user message to chat
        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'message user-message';
        userMessageEl.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        this.previewMessages.appendChild(userMessageEl);
        
        // Scroll to bottom
        this.previewMessages.scrollTop = this.previewMessages.scrollHeight;
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <img src="../assets/default-bot.png" alt="Bot">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.previewMessages.appendChild(typingIndicator);
        
        // Scroll to bottom again
        this.previewMessages.scrollTop = this.previewMessages.scrollHeight;
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response
            const botMessageEl = document.createElement('div');
            botMessageEl.className = 'message bot-message';
            botMessageEl.innerHTML = `
                <div class="message-avatar">
                    <img src="../assets/default-bot.png" alt="Bot">
                </div>
                <div class="message-content">
                    <p>זוהי תשובה לדוגמה מהמלווה. אני כאן כדי לעזור לך ללמוד!</p>
                </div>
            `;
            this.previewMessages.appendChild(botMessageEl);
            
            // Scroll to bottom
            this.previewMessages.scrollTop = this.previewMessages.scrollHeight;
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add error message
            const errorMessageEl = document.createElement('div');
            errorMessageEl.className = 'message bot-message error';
            errorMessageEl.innerHTML = `
                <div class="message-avatar">
                    <img src="../assets/default-bot.png" alt="Bot">
                </div>
                <div class="message-content">
                    <p>אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.</p>
                </div>
            `;
            this.previewMessages.appendChild(errorMessageEl);
            
            // Scroll to bottom
            this.previewMessages.scrollTop = this.previewMessages.scrollHeight;
        }
    }
    
    // Bot duplication
    async duplicateBot(botId) {
        try {
            Utils.showToast('מכפיל מלווה...', 'info');
            
            // In a real implementation, this would call the API to duplicate the bot
            // For now, we'll just show a success message
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            Utils.showToast('המלווה שוכפל בהצלחה!', 'success');
            
            // Reload bots to show the new duplicate
            this.loadBots();
        } catch (error) {
            console.error('Error duplicating bot:', error);
            Utils.showToast('אירעה שגיאה בשכפול המלווה', 'error');
        }
    }
}

// Initialize the library when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BotLibrary();
});
