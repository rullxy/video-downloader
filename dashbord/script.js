// Ganti dengan URL Render kamu setelah deploy
const API_BASE_URL = 'https://your-bot-app.onrender.com';

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        const data = await response.json();
        
        if (data.success) {
            updateDashboard(data.data);
            updateStatus('🟢 Connected', 'success');
        } else {
            throw new Error('Failed to load stats');
        }
    } catch (error) {
        console.error('Error:', error);
        updateStatus('🔴 Disconnected', 'error');
    }
}

function updateDashboard(stats) {
    const statsGrid = document.getElementById('statsGrid');
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📥</div>
            <div class="stat-value">${stats.totalDownloads}</div>
            <div class="stat-label">Total Downloads</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">${stats.totalUsers}</div>
            <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">🕒</div>
            <div class="stat-value">${formatTime(stats.lastActivity)}</div>
            <div class="stat-label">Last Activity</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">${stats.uptime}</div>
            <div class="stat-label">Uptime</div>
        </div>
    `;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
}

function updateStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    
    if (type === 'success') {
        statusElement.style.background = 'rgba(76, 175, 80, 0.3)';
    } else {
        statusElement.style.background = 'rgba(244, 67, 54, 0.3)';
    }
}

function refreshStats() {
    updateStatus('🔄 Refreshing...', 'success');
    loadStats();
}

function openBot() {
    window.open('https://t.me/your_bot_username', '_blank');
}

// Auto-refresh every 30 seconds
setInterval(loadStats, 30000);

// Initial load
document.addEventListener('DOMContentLoaded', loadStats);
