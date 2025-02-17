// My Bots page functionality
class MyBots {
    constructor() {
        this.initializeElements();
        this.loadMyBots();
    }

    initializeElements() {
        this.botsList = document.querySelector('.my-bots-list');
    }

    async loadMyBots() {
        try {
            // Show loading state
            this.botsList.innerHTML = '<div class="loading">טוען מלווים...</div>';

            // Fetch user's bots from API
            const response = await api.get('/user/bots');
            const bots = response.data;

            this.renderBots(bots);
        } catch (error) {
            console.error('Error loading bots:', error);
            this.botsList.innerHTML = '<div class="error">שגיאה בטעינת המלווים. אנא נסה שוב.</div>';
        }
    }

    renderBots(bots) {
        if (!bots.length) {
            this.botsList.innerHTML = `
                <div class="no-bots">
                    <i class="fas fa-robot"></i>
                    <h2>אין לך עדיין מלווי למידה</h2>
                    <p>צור את המלווה הראשון שלך</p>
                    <a href="create-bot.html" class="create-bot-button">
                        <i class="fas fa-plus-circle"></i>
                        יצירת מלווה למידה
                    </a>
                </div>
            `;
            return;
        }

        this.botsList.innerHTML = bots.map(bot => `
            <div class="bot-item" data-bot-id="${bot.id}">
                <div class="bot-header">
                    <div class="bot-info">
                        <img src="${bot.imageUrl || '../assets/default-bot.png'}" alt="${bot.name}" class="bot-avatar">
                        <div class="bot-details">
                            <h3>${bot.name}</h3>
                            <div class="bot-stats">
                                <span class="stat">
                                    <i class="fas fa-comment"></i>
                                    ${bot.messageCount} הודעות
                                </span>
                                <span class="stat">
                                    <i class="fas fa-user"></i>
                                    ${bot.userCount} משתמשים
                                </span>
                                <span class="status ${bot.status === 'active' ? 'active' : 'inactive'}">
                                    <i class="fas fa-circle"></i>
                                    ${bot.status === 'active' ? 'פעיל' : 'לא פעיל'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="bot-actions">
                        <button class="action-button" onclick="myBots.toggleBotStatus('${bot.id}', '${bot.status}')">
                            <i class="fas ${bot.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                            ${bot.status === 'active' ? 'השהה' : 'הפעל'}
                        </button>
                        <button class="action-button" onclick="myBots.duplicateBot('${bot.id}')">
                            <i class="fas fa-copy"></i>
                            שכפל
                        </button>
                        <button class="action-button" onclick="myBots.exportBot('${bot.id}')">
                            <i class="fas fa-download"></i>
                            ייצא
                        </button>
                        <button class="action-button danger" onclick="myBots.deleteBot('${bot.id}')">
                            <i class="fas fa-trash"></i>
                            מחק
                        </button>
                    </div>
                </div>
                <div class="bot-analytics">
                    <div class="analytics-header">
                        <h4>סטטיסטיקות</h4>
                        <select class="time-range" onchange="myBots.updateAnalytics('${bot.id}', this.value)">
                            <option value="week">שבוע אחרון</option>
                            <option value="month">חודש אחרון</option>
                            <option value="year">שנה אחרונה</option>
                        </select>
                    </div>
                    <div class="analytics-content" id="analytics-${bot.id}">
                        <!-- Analytics will be loaded here -->
                    </div>
                </div>
            </div>
        `).join('');

        // Load analytics for each bot
        bots.forEach(bot => this.loadAnalytics(bot.id, 'week'));
    }

    async toggleBotStatus(botId, currentStatus) {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await api.put(`/bots/${botId}/status`, { status: newStatus });
            await this.loadMyBots(); // Reload the list to show updated status
        } catch (error) {
            console.error('Error toggling bot status:', error);
            alert('שגיאה בעדכון סטטוס המלווה');
        }
    }

    async duplicateBot(botId) {
        try {
            await api.post(`/bots/${botId}/duplicate`);
            await this.loadMyBots(); // Reload to show the new bot
        } catch (error) {
            console.error('Error duplicating bot:', error);
            alert('שגיאה בשכפול המלווה');
        }
    }

    async exportBot(botId) {
        try {
            const response = await api.get(`/bots/${botId}/export`);
            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bot-${botId}-export.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting bot:', error);
            alert('שגיאה בייצוא המלווה');
        }
    }

    async deleteBot(botId) {
        if (!confirm('האם אתה בטוח שברצונך למחוק את המלווה?')) {
            return;
        }

        try {
            await api.delete(`/bots/${botId}`);
            await this.loadMyBots(); // Reload the list
        } catch (error) {
            console.error('Error deleting bot:', error);
            alert('שגיאה במחיקת המלווה');
        }
    }

    async loadAnalytics(botId, timeRange) {
        try {
            const response = await api.get(`/bots/${botId}/analytics`, {
                params: { timeRange }
            });
            const analytics = response.data;

            const container = document.getElementById(`analytics-${botId}`);
            container.innerHTML = `
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="card-title">הודעות</div>
                        <div class="card-value">${analytics.messageCount}</div>
                        <div class="card-trend ${analytics.messageTrend > 0 ? 'up' : 'down'}">
                            <i class="fas fa-arrow-${analytics.messageTrend > 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(analytics.messageTrend)}%
                        </div>
                    </div>
                    <div class="analytics-card">
                        <div class="card-title">משתמשים</div>
                        <div class="card-value">${analytics.userCount}</div>
                        <div class="card-trend ${analytics.userTrend > 0 ? 'up' : 'down'}">
                            <i class="fas fa-arrow-${analytics.userTrend > 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(analytics.userTrend)}%
                        </div>
                    </div>
                    <div class="analytics-card">
                        <div class="card-title">זמן תגובה ממוצע</div>
                        <div class="card-value">${analytics.avgResponseTime}s</div>
                    </div>
                    <div class="analytics-card">
                        <div class="card-title">דירוג ממוצע</div>
                        <div class="card-value">
                            ${analytics.avgRating}
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading analytics:', error);
            const container = document.getElementById(`analytics-${botId}`);
            container.innerHTML = '<div class="error">שגיאה בטעינת הסטטיסטיקות</div>';
        }
    }

    async updateAnalytics(botId, timeRange) {
        await this.loadAnalytics(botId, timeRange);
    }
}

// Initialize MyBots when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.myBots = new MyBots();
});
