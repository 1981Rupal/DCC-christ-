// Student Dashboard JavaScript - Complete Student Dashboard Functionality

// Global variables
let currentTab = 'dashboard';
let studentCharts = {};
let currentChallenges = [];
let pastChallenges = [];
let leaderboardData = [];
let questionBankData = [];

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeStudentDashboard();
    loadStudentMockData();
    setupStudentEventListeners();
    initializeStudentCharts();
    updateStudentUserInfo();
});

// Initialize student dashboard
function initializeStudentDashboard() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Set up navigation
    setupStudentNavigation();
    showTab('dashboard');
}

// Setup navigation
function setupStudentNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            showTab(tab);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show specific tab
function showTab(tabName) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        currentTab = tabName;
        
        // Update page title
        updateStudentPageTitle(tabName);
        
        // Load tab-specific data
        loadStudentTabData(tabName);
    }
}

// Update page title based on current tab
function updateStudentPageTitle(tabName) {
    const titles = {
        'dashboard': 'Student Dashboard',
        'current-challenges': 'Current Challenges',
        'past-challenges': 'Past Challenges',
        'leaderboard': 'Leaderboard',
        'question-bank': 'Question Bank',
        'progress': 'My Progress',
        'profile': 'My Profile'
    };
    
    document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
}

// Load tab-specific data
function loadStudentTabData(tabName) {
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'current-challenges':
            loadCurrentChallengesData();
            break;
        case 'past-challenges':
            loadPastChallengesData();
            break;
        case 'leaderboard':
            loadLeaderboardData();
            break;
        case 'question-bank':
            loadQuestionBankData();
            break;
        case 'progress':
            loadProgressData();
            break;
        case 'profile':
            loadProfileData();
            break;
    }
}

// Load mock data for student
function loadStudentMockData() {
    // Mock current challenges
    currentChallenges = [
        { 
            id: 1, 
            title: 'Array Manipulation', 
            difficulty: 'easy', 
            subject: 'arrays', 
            dueDate: '2024-01-20', 
            timeLeft: '2 days',
            description: 'Implement various array manipulation functions',
            points: 100,
            status: 'not-started'
        },
        { 
            id: 2, 
            title: 'Binary Search Implementation', 
            difficulty: 'medium', 
            subject: 'algorithms', 
            dueDate: '2024-01-22', 
            timeLeft: '4 days',
            description: 'Implement binary search algorithm with variations',
            points: 150,
            status: 'in-progress'
        },
        { 
            id: 3, 
            title: 'String Pattern Matching', 
            difficulty: 'hard', 
            subject: 'strings', 
            dueDate: '2024-01-25', 
            timeLeft: '1 week',
            description: 'Advanced string pattern matching algorithms',
            points: 200,
            status: 'not-started'
        }
    ];

    // Mock past challenges
    pastChallenges = [
        { 
            id: 4, 
            title: 'Linked List Operations', 
            difficulty: 'medium', 
            subject: 'data-structures', 
            completedDate: '2024-01-15', 
            score: 85,
            maxScore: 100,
            timeSpent: '45 minutes'
        },
        { 
            id: 5, 
            title: 'Sorting Algorithms', 
            difficulty: 'easy', 
            subject: 'algorithms', 
            completedDate: '2024-01-12', 
            score: 92,
            maxScore: 100,
            timeSpent: '30 minutes'
        },
        { 
            id: 6, 
            title: 'Hash Table Implementation', 
            difficulty: 'hard', 
            subject: 'data-structures', 
            completedDate: '2024-01-10', 
            score: 78,
            maxScore: 100,
            timeSpent: '75 minutes'
        }
    ];

    // Mock leaderboard data
    leaderboardData = [
        { rank: 1, name: 'Mike Johnson', score: 2680, avatar: 'M', change: 0 },
        { rank: 2, name: 'Sarah Chen', score: 2450, avatar: 'S', change: 1 },
        { rank: 3, name: 'Emma Davis', score: 2320, avatar: 'E', change: -1 },
        { rank: 4, name: 'David Wilson', score: 2180, avatar: 'D', change: 2 },
        { rank: 5, name: 'Alex Johnson', score: 2050, avatar: 'A', change: 2, isCurrentUser: true },
        { rank: 6, name: 'Lisa Brown', score: 1980, avatar: 'L', change: -2 },
        { rank: 7, name: 'Tom Anderson', score: 1850, avatar: 'T', change: 0 },
        { rank: 8, name: 'Maria Garcia', score: 1720, avatar: 'M', change: 1 }
    ];

    // Mock question bank data
    questionBankData = [
        {
            id: 1,
            title: 'Two Sum Problem',
            difficulty: 'easy',
            topic: 'arrays',
            description: 'Find two numbers in an array that add up to a target sum',
            solved: true,
            attempts: 2,
            bestScore: 95
        },
        {
            id: 2,
            title: 'Reverse Linked List',
            difficulty: 'medium',
            topic: 'data-structures',
            description: 'Reverse a singly linked list iteratively and recursively',
            solved: true,
            attempts: 3,
            bestScore: 88
        },
        {
            id: 3,
            title: 'Longest Palindromic Substring',
            difficulty: 'hard',
            topic: 'strings',
            description: 'Find the longest palindromic substring in a given string',
            solved: false,
            attempts: 1,
            bestScore: 0
        },
        {
            id: 4,
            title: 'Binary Tree Traversal',
            difficulty: 'medium',
            topic: 'data-structures',
            description: 'Implement inorder, preorder, and postorder traversals',
            solved: true,
            attempts: 1,
            bestScore: 100
        }
    ];
}

// Setup event listeners
function setupStudentEventListeners() {
    // Profile settings form
    const profileForm = document.getElementById('profile-settings-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateStudentProfile();
        });
    }
}

// Initialize charts
function initializeStudentCharts() {
    // Student Progress Chart
    const progressCtx = document.getElementById('studentProgressChart');
    if (progressCtx) {
        studentCharts.progress = new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Your Score',
                    data: [65, 72, 78, 85, 82, 88],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Skills Chart
    const skillsCtx = document.getElementById('skillsChart');
    if (skillsCtx) {
        studentCharts.skills = new Chart(skillsCtx, {
            type: 'radar',
            data: {
                labels: ['Arrays', 'Strings', 'Algorithms', 'Data Structures', 'Dynamic Programming', 'Graphs'],
                datasets: [{
                    label: 'Skill Level',
                    data: [85, 78, 92, 88, 65, 72],
                    borderColor: 'rgb(124, 58, 237)',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    pointBackgroundColor: 'rgb(124, 58, 237)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(124, 58, 237)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Load dashboard data
function loadDashboardData() {
    // Load active challenges preview
    loadActiveChallengesPreview();
    
    // Load recent achievements
    loadRecentAchievements();
}

// Load active challenges preview
function loadActiveChallengesPreview() {
    const previewContainer = document.getElementById('active-challenges-preview');
    if (!previewContainer) return;

    const activeChallenges = currentChallenges.slice(0, 3); // Show first 3
    
    previewContainer.innerHTML = activeChallenges.map(challenge => `
        <div class="challenge-preview-item">
            <div class="challenge-preview-info">
                <h4>${challenge.title}</h4>
                <div class="challenge-preview-meta">
                    <span class="badge badge-${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'danger'}">${challenge.difficulty}</span>
                    <span><i class="fas fa-clock"></i> ${challenge.timeLeft}</span>
                    <span><i class="fas fa-star"></i> ${challenge.points} pts</span>
                </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="startChallenge(${challenge.id})">
                ${challenge.status === 'in-progress' ? 'Continue' : 'Start'}
            </button>
        </div>
    `).join('');
}

// Load recent achievements
function loadRecentAchievements() {
    const achievementsContainer = document.getElementById('recent-achievements');
    if (!achievementsContainer) return;

    const achievements = [
        { icon: 'fas fa-fire', title: 'Hot Streak!', description: 'Completed 5 challenges in a row', date: '2 days ago' },
        { icon: 'fas fa-trophy', title: 'Top Performer', description: 'Ranked in top 5 this week', date: '3 days ago' },
        { icon: 'fas fa-star', title: 'Perfect Score', description: 'Got 100% on Sorting Algorithms', date: '1 week ago' },
        { icon: 'fas fa-medal', title: 'Quick Solver', description: 'Solved challenge in under 30 minutes', date: '1 week ago' }
    ];

    achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="achievement-item">
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-content">
                <h5>${achievement.title}</h5>
                <p>${achievement.description}</p>
                <small>${achievement.date}</small>
            </div>
        </div>
    `).join('');
}

// Load current challenges data
function loadCurrentChallengesData() {
    const challengesGrid = document.getElementById('current-challenges-grid');
    if (!challengesGrid) return;

    challengesGrid.innerHTML = currentChallenges.map(challenge => `
        <div class="challenge-card">
            <div class="challenge-header">
                <h3>${challenge.title}</h3>
                <span class="badge badge-${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'danger'}">${challenge.difficulty}</span>
            </div>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-meta">
                <div class="challenge-info">
                    <span><i class="fas fa-clock"></i> Due: ${challenge.dueDate}</span>
                    <span><i class="fas fa-star"></i> ${challenge.points} points</span>
                    <span><i class="fas fa-tag"></i> ${challenge.subject}</span>
                </div>
                <div class="challenge-status">
                    <span class="status-badge ${challenge.status}">${challenge.status.replace('-', ' ')}</span>
                </div>
            </div>
            <div class="challenge-actions">
                <button class="btn btn-primary" onclick="startChallenge(${challenge.id})">
                    ${challenge.status === 'in-progress' ? 'Continue' : 'Start Challenge'}
                </button>
                <button class="btn btn-secondary" onclick="viewChallengeDetails(${challenge.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `).join('');
}

// Update user info
function updateStudentUserInfo() {
    const userName = localStorage.getItem('userName') || 'Student';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-avatar').textContent = userName.charAt(0).toUpperCase();
    document.getElementById('student-name').textContent = userName;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

// Utility functions
function startChallenge(challengeId) {
    // Redirect to challenge page
    window.location.href = `challenge.html?id=${challengeId}`;
}

function viewChallengeDetails(challengeId) {
    alert(`View Challenge ${challengeId} Details - To be implemented`);
}

function filterCurrentChallenges() {
    alert('Filter Current Challenges - To be implemented');
}

// Load past challenges data
function loadPastChallengesData() {
    const pastChallengesList = document.getElementById('past-challenges-list');
    if (!pastChallengesList) return;

    // Apply current filters
    const searchTerm = document.getElementById('past-challenge-search')?.value.toLowerCase() || '';
    const difficultyFilter = document.getElementById('past-difficulty-filter')?.value || '';

    // Filter past challenges
    let filteredChallenges = pastChallenges.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm);
        const matchesDifficulty = !difficultyFilter || challenge.difficulty === difficultyFilter;

        return matchesSearch && matchesDifficulty;
    });

    pastChallengesList.innerHTML = filteredChallenges.map(challenge => `
        <div class="past-challenge-item">
            <div class="challenge-info">
                <div class="challenge-header">
                    <h4>${challenge.title}</h4>
                    <span class="badge badge-${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'danger'}">
                        ${challenge.difficulty}
                    </span>
                </div>
                <div class="challenge-meta">
                    <span><i class="fas fa-calendar"></i> Completed: ${challenge.completedDate}</span>
                    <span><i class="fas fa-clock"></i> Time: ${challenge.timeSpent}</span>
                    <span><i class="fas fa-tag"></i> ${challenge.subject}</span>
                </div>
            </div>
            <div class="challenge-score">
                <div class="score-display">
                    <div class="score-circle ${getScoreClass(challenge.score, challenge.maxScore)}">
                        ${Math.round((challenge.score / challenge.maxScore) * 100)}%
                    </div>
                    <div class="score-details">
                        <span>${challenge.score}/${challenge.maxScore} points</span>
                    </div>
                </div>
            </div>
            <div class="challenge-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewChallengeResults(${challenge.id})">
                    <i class="fas fa-chart-bar"></i> View Results
                </button>
                <button class="btn btn-primary btn-sm" onclick="retakeChallenge(${challenge.id})">
                    <i class="fas fa-redo"></i> Retake
                </button>
            </div>
        </div>
    `).join('');

    // Show no results message if needed
    if (filteredChallenges.length === 0) {
        pastChallengesList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-history"></i>
                <h3>No past challenges found</h3>
                <p>Complete some challenges to see your history here.</p>
            </div>
        `;
    }
}

// Get score class for styling
function getScoreClass(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    return 'needs-improvement';
}

// Search past challenges
function searchPastChallenges() {
    loadPastChallengesData();
}

// Filter past challenges
function filterPastChallenges() {
    loadPastChallengesData();
}

// View challenge results
function viewChallengeResults(challengeId) {
    const challenge = pastChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const percentage = Math.round((challenge.score / challenge.maxScore) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

    const modalHTML = `
        <div class="challenge-results-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Challenge Results: ${challenge.title}</h3>
                    <button class="modal-close" onclick="closeChallengeResultsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="results-summary">
                        <div class="score-display-large">
                            <div class="score-circle-large ${getScoreClass(challenge.score, challenge.maxScore)}">
                                <span class="percentage">${percentage}%</span>
                                <span class="grade">Grade: ${grade}</span>
                            </div>
                        </div>
                        <div class="results-details">
                            <div class="detail-item">
                                <span class="label">Score:</span>
                                <span class="value">${challenge.score} / ${challenge.maxScore} points</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Time Spent:</span>
                                <span class="value">${challenge.timeSpent}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Completed:</span>
                                <span class="value">${challenge.completedDate}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Difficulty:</span>
                                <span class="value">
                                    <span class="badge badge-${challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'danger'}">
                                        ${challenge.difficulty}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="performance-insights">
                        <h4>Performance Insights</h4>
                        <div class="insights-list">
                            ${generatePerformanceInsights(challenge, percentage)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeChallengeResultsModal()">Close</button>
                    <button class="btn btn-primary" onclick="retakeChallenge(${challenge.id})">
                        <i class="fas fa-redo"></i> Retake Challenge
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Generate performance insights
function generatePerformanceInsights(challenge, percentage) {
    const insights = [];

    if (percentage >= 90) {
        insights.push('<div class="insight success"><i class="fas fa-star"></i> Excellent performance! You mastered this challenge.</div>');
    } else if (percentage >= 80) {
        insights.push('<div class="insight good"><i class="fas fa-thumbs-up"></i> Great job! You have a solid understanding.</div>');
    } else if (percentage >= 70) {
        insights.push('<div class="insight average"><i class="fas fa-info-circle"></i> Good effort! Consider reviewing the concepts.</div>');
    } else {
        insights.push('<div class="insight needs-improvement"><i class="fas fa-exclamation-triangle"></i> This topic needs more practice.</div>');
    }

    // Add time-based insights
    const timeSpentMinutes = parseInt(challenge.timeSpent);
    if (timeSpentMinutes < 30) {
        insights.push('<div class="insight info"><i class="fas fa-clock"></i> You completed this quickly! Great efficiency.</div>');
    } else if (timeSpentMinutes > 60) {
        insights.push('<div class="insight info"><i class="fas fa-clock"></i> You took your time to think through the problems.</div>');
    }

    return insights.join('');
}

// Close challenge results modal
function closeChallengeResultsModal() {
    const modal = document.querySelector('.challenge-results-modal');
    if (modal) {
        modal.remove();
    }
}

// Retake challenge
function retakeChallenge(challengeId) {
    window.location.href = `challenge.html?id=${challengeId}&retake=true`;
}

// Load leaderboard data
function loadLeaderboardData() {
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardList) return;

    // Filter leaderboard data based on current settings
    const period = document.getElementById('leaderboard-period')?.value || 'week';
    const classFilter = document.getElementById('leaderboard-class')?.value || 'my-class';

    // Generate filtered leaderboard
    const filteredData = filterLeaderboardData(leaderboardData, period, classFilter);

    leaderboardList.innerHTML = filteredData.slice(3).map(student => `
        <div class="leaderboard-item ${student.isCurrentUser ? 'current-user' : ''}">
            <div class="leaderboard-rank">${student.rank}</div>
            <div class="leaderboard-avatar">${student.avatar}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${student.name}</div>
                <div class="leaderboard-score">${student.score} points</div>
            </div>
            <div class="leaderboard-change ${getChangeClass(student.change)}">
                ${getChangeText(student.change)}
            </div>
        </div>
    `).join('');
}

// Filter leaderboard data
function filterLeaderboardData(data, period, classFilter) {
    // Mock filtering logic - in real app, this would filter by actual criteria
    let filteredData = [...data];

    // Apply period filter (mock different scores for different periods)
    if (period === 'month') {
        filteredData = filteredData.map(student => ({
            ...student,
            score: Math.round(student.score * 1.2) // Mock monthly scores
        }));
    } else if (period === 'semester') {
        filteredData = filteredData.map(student => ({
            ...student,
            score: Math.round(student.score * 2.5) // Mock semester scores
        }));
    } else if (period === 'all-time') {
        filteredData = filteredData.map(student => ({
            ...student,
            score: Math.round(student.score * 3.2) // Mock all-time scores
        }));
    }

    // Apply class filter
    if (classFilter === 'all-classes') {
        // Add some additional students for all-classes view
        const additionalStudents = [
            { rank: 9, name: 'Alex Chen', score: Math.round(1650 * getScoreMultiplier(period)), avatar: 'A', change: 1, isCurrentUser: false },
            { rank: 10, name: 'Jordan Smith', score: Math.round(1580 * getScoreMultiplier(period)), avatar: 'J', change: -1, isCurrentUser: false }
        ];
        filteredData = [...filteredData, ...additionalStudents];
    }

    // Re-sort and update ranks
    filteredData.sort((a, b) => b.score - a.score);
    filteredData.forEach((student, index) => {
        student.rank = index + 1;
    });

    return filteredData;
}

// Get score multiplier for different periods
function getScoreMultiplier(period) {
    switch(period) {
        case 'month': return 1.2;
        case 'semester': return 2.5;
        case 'all-time': return 3.2;
        default: return 1;
    }
}

// Get change class for styling
function getChangeClass(change) {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'same';
}

// Get change text
function getChangeText(change) {
    if (change > 0) return `↑${change}`;
    if (change < 0) return `↓${Math.abs(change)}`;
    return '—';
}

// Update leaderboard based on filters
function updateLeaderboard() {
    loadLeaderboardData();

    // Update podium as well
    updateLeaderboardPodium();
}

// Update leaderboard podium
function updateLeaderboardPodium() {
    const period = document.getElementById('leaderboard-period')?.value || 'week';
    const classFilter = document.getElementById('leaderboard-class')?.value || 'my-class';

    const filteredData = filterLeaderboardData(leaderboardData, period, classFilter);
    const topThree = filteredData.slice(0, 3);

    // Update first place
    const firstPlace = document.getElementById('first-place');
    if (firstPlace && topThree[0]) {
        firstPlace.querySelector('.podium-name').textContent = topThree[0].name;
        firstPlace.querySelector('.podium-score').textContent = `${topThree[0].score} pts`;
    }

    // Update second place
    const secondPlace = document.getElementById('second-place');
    if (secondPlace && topThree[1]) {
        secondPlace.querySelector('.podium-name').textContent = topThree[1].name;
        secondPlace.querySelector('.podium-score').textContent = `${topThree[1].score} pts`;
    }

    // Update third place
    const thirdPlace = document.getElementById('third-place');
    if (thirdPlace && topThree[2]) {
        thirdPlace.querySelector('.podium-name').textContent = topThree[2].name;
        thirdPlace.querySelector('.podium-score').textContent = `${topThree[2].score} pts`;
    }
}

// Load question bank data
function loadQuestionBankData() {
    const questionBankGrid = document.getElementById('question-bank-grid');
    if (!questionBankGrid) return;

    // Apply current filters
    const searchTerm = document.getElementById('question-search')?.value.toLowerCase() || '';
    const difficultyFilter = document.getElementById('question-difficulty-filter')?.value || '';
    const topicFilter = document.getElementById('question-topic-filter')?.value || '';

    // Filter questions
    let filteredQuestions = questionBankData.filter(question => {
        const matchesSearch = question.title.toLowerCase().includes(searchTerm) ||
                            question.description.toLowerCase().includes(searchTerm);
        const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;
        const matchesTopic = !topicFilter || question.topic === topicFilter;

        return matchesSearch && matchesDifficulty && matchesTopic;
    });

    questionBankGrid.innerHTML = filteredQuestions.map(question => `
        <div class="question-card ${question.solved ? 'solved' : ''}">
            <div class="question-header">
                <h4 class="question-title">${question.title}</h4>
                <span class="badge badge-${question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'}">
                    ${question.difficulty}
                </span>
            </div>
            <p class="question-description">${question.description}</p>
            <div class="question-stats">
                <span><i class="fas fa-tag"></i> ${question.topic}</span>
                <span><i class="fas fa-attempt"></i> ${question.attempts} attempts</span>
                ${question.solved ? `<span><i class="fas fa-star"></i> Best: ${question.bestScore}%</span>` : ''}
            </div>
            <div class="question-actions">
                <button class="btn btn-primary btn-sm" onclick="practiceQuestion(${question.id})">
                    ${question.solved ? 'Practice Again' : 'Start Practice'}
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewQuestionDetails(${question.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `).join('');

    // Show no results message if needed
    if (filteredQuestions.length === 0) {
        questionBankGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No questions found</h3>
                <p>Try adjusting your search criteria or filters.</p>
            </div>
        `;
    }
}

// Search questions
function searchQuestions() {
    loadQuestionBankData();
}

// Filter questions
function filterQuestions() {
    loadQuestionBankData();
}

// Practice question
function practiceQuestion(questionId) {
    // Redirect to practice mode for specific question
    window.location.href = `challenge.html?practice=true&question=${questionId}`;
}

// View question details
function viewQuestionDetails(questionId) {
    const question = questionBankData.find(q => q.id === questionId);
    if (!question) return;

    // Create modal with question details
    const modalHTML = `
        <div class="question-details-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${question.title}</h3>
                    <button class="modal-close" onclick="closeQuestionModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="question-meta">
                        <span class="badge badge-${question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'}">
                            ${question.difficulty}
                        </span>
                        <span class="topic-tag">${question.topic}</span>
                    </div>
                    <div class="question-description-full">
                        <h4>Description</h4>
                        <p>${question.description}</p>
                    </div>
                    <div class="question-stats-full">
                        <h4>Your Progress</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Attempts</span>
                                <span class="stat-value">${question.attempts}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Status</span>
                                <span class="stat-value ${question.solved ? 'solved' : 'unsolved'}">
                                    ${question.solved ? 'Solved' : 'Not Solved'}
                                </span>
                            </div>
                            ${question.solved ? `
                                <div class="stat-item">
                                    <span class="stat-label">Best Score</span>
                                    <span class="stat-value">${question.bestScore}%</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeQuestionModal()">Close</button>
                    <button class="btn btn-primary" onclick="practiceQuestion(${question.id})">
                        ${question.solved ? 'Practice Again' : 'Start Practice'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close question modal
function closeQuestionModal() {
    const modal = document.querySelector('.question-details-modal');
    if (modal) {
        modal.remove();
    }
}

// Load progress data
function loadProgressData() {
    updateProgressCharts();
    updateProgressOverview();
}

// Update progress charts
function updateProgressCharts() {
    const period = document.getElementById('progress-period')?.value || 'week';

    // Update score progression chart
    updateScoreProgressChart(period);

    // Update time spent chart
    updateTimeSpentChart(period);

    // Update topic mastery chart
    updateTopicMasteryChart();

    // Update weekly activity chart
    updateWeeklyActivityChart();
}

// Update score progression chart
function updateScoreProgressChart(period) {
    const ctx = document.getElementById('scoreProgressChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (studentCharts.scoreProgress) {
        studentCharts.scoreProgress.destroy();
    }

    const data = getScoreProgressData(period);

    studentCharts.scoreProgress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Average Score',
                data: data.scores,
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(37, 99, 235)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update time spent chart
function updateTimeSpentChart(period) {
    const ctx = document.getElementById('timeSpentChart');
    if (!ctx) return;

    if (studentCharts.timeSpent) {
        studentCharts.timeSpent.destroy();
    }

    const data = getTimeSpentData(period);

    studentCharts.timeSpent = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Time Spent (minutes)',
                data: data.times,
                backgroundColor: 'rgba(124, 58, 237, 0.8)',
                borderColor: 'rgb(124, 58, 237)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + 'min';
                        }
                    }
                }
            }
        }
    });
}

// Update topic mastery chart
function updateTopicMasteryChart() {
    const ctx = document.getElementById('topicMasteryChart');
    if (!ctx) return;

    if (studentCharts.topicMastery) {
        studentCharts.topicMastery.destroy();
    }

    const topics = ['Arrays', 'Strings', 'Algorithms', 'Data Structures', 'Recursion', 'Graphs'];
    const masteryLevels = [85, 78, 92, 88, 65, 72]; // Mock data

    studentCharts.topicMastery = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: topics,
            datasets: [{
                label: 'Mastery Level',
                data: masteryLevels,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(16, 185, 129)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// Update weekly activity chart
function updateWeeklyActivityChart() {
    const ctx = document.getElementById('weeklyActivityChart');
    if (!ctx) return;

    if (studentCharts.weeklyActivity) {
        studentCharts.weeklyActivity.destroy();
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activities = [3, 5, 2, 4, 6, 1, 2]; // Mock data - challenges completed per day

    studentCharts.weeklyActivity = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: days,
            datasets: [{
                data: activities,
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(20, 184, 166, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Get score progress data based on period
function getScoreProgressData(period) {
    switch(period) {
        case 'week':
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                scores: [78, 82, 85, 79, 88, 91, 87]
            };
        case 'month':
            return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                scores: [75, 82, 88, 91]
            };
        case 'semester':
            return {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
                scores: [68, 75, 83, 89]
            };
        default:
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                scores: [78, 82, 85, 79, 88, 91, 87]
            };
    }
}

// Get time spent data based on period
function getTimeSpentData(period) {
    switch(period) {
        case 'week':
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                times: [45, 60, 30, 75, 90, 25, 40]
            };
        case 'month':
            return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                times: [280, 320, 290, 350]
            };
        case 'semester':
            return {
                labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
                times: [1200, 1350, 1180, 1420]
            };
        default:
            return {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                times: [45, 60, 30, 75, 90, 25, 40]
            };
    }
}

// Update progress overview
function updateProgressOverview() {
    // Update overall progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const currentProgress = 68; // Mock progress percentage
        progressFill.style.width = currentProgress + '%';
    }

    // Update skill level badge
    const skillBadge = document.querySelector('.skill-badge');
    if (skillBadge) {
        const skillLevel = 'intermediate'; // Mock skill level
        skillBadge.className = `skill-badge ${skillLevel}`;
        skillBadge.textContent = skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1);
    }
}

function changeAvatar() {
    alert('Change Avatar - To be implemented');
}

function updateStudentProfile() {
    alert('Profile Updated Successfully!');
}
