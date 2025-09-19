// Dashboard JavaScript - Complete Teacher Dashboard Functionality

// Global variables
let currentTab = 'overview';
let charts = {};
let studentsData = [];
let challengesData = [];
let questionsData = [];
let submissionsData = [];

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadMockData();
    setupEventListeners();
    initializeCharts();
    updateUserInfo();
});

// Initialize dashboard
function initializeDashboard() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Set up navigation
    setupNavigation();
    showTab('overview');
}

// Setup navigation
function setupNavigation() {
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
        updatePageTitle(tabName);
        
        // Load tab-specific data
        loadTabData(tabName);
    }
}

// Update page title based on current tab
function updatePageTitle(tabName) {
    const titles = {
        'overview': 'Dashboard Overview',
        'challenges': 'Manage Challenges',
        'students': 'Student Management',
        'analytics': 'Performance Analytics',
        'question-bank': 'Question Bank',
        'submissions': 'Student Submissions',
        'settings': 'Settings'
    };
    
    document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
}

// Load tab-specific data
function loadTabData(tabName) {
    switch(tabName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'challenges':
            loadChallengesData();
            break;
        case 'students':
            loadStudentsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'question-bank':
            loadQuestionBankData();
            break;
        case 'submissions':
            loadSubmissionsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// Load mock data
function loadMockData() {
    // Mock students data
    studentsData = [
        { id: 1, name: 'Alice Johnson', email: 'alice@student.edu', class: 'CS 101', completed: 15, avgScore: 85, lastActive: '2024-01-15' },
        { id: 2, name: 'Bob Smith', email: 'bob@student.edu', class: 'CS 101', completed: 12, avgScore: 78, lastActive: '2024-01-14' },
        { id: 3, name: 'Carol Davis', email: 'carol@student.edu', class: 'CS 102', completed: 18, avgScore: 92, lastActive: '2024-01-15' },
        { id: 4, name: 'David Wilson', email: 'david@student.edu', class: 'CS 102', completed: 14, avgScore: 81, lastActive: '2024-01-13' },
        { id: 5, name: 'Emma Brown', email: 'emma@student.edu', class: 'CS 201', completed: 20, avgScore: 88, lastActive: '2024-01-15' }
    ];

    // Mock challenges data
    challengesData = [
        { id: 1, title: 'Array Manipulation', difficulty: 'easy', status: 'active', submissions: 45, avgScore: 82, dueDate: '2024-01-20' },
        { id: 2, title: 'Binary Search Implementation', difficulty: 'medium', status: 'active', submissions: 38, avgScore: 75, dueDate: '2024-01-22' },
        { id: 3, title: 'Graph Traversal', difficulty: 'hard', status: 'draft', submissions: 0, avgScore: 0, dueDate: '2024-01-25' },
        { id: 4, title: 'String Algorithms', difficulty: 'medium', status: 'completed', submissions: 52, avgScore: 79, dueDate: '2024-01-18' }
    ];

    // Mock questions data
    questionsData = [
        { id: 1, question: 'What is the time complexity of binary search?', difficulty: 'easy', topic: 'algorithms', type: 'multiple-choice' },
        { id: 2, question: 'Implement a function to reverse a linked list', difficulty: 'medium', topic: 'data-structures', type: 'coding' },
        { id: 3, question: 'Find the longest palindromic substring', difficulty: 'hard', topic: 'strings', type: 'coding' },
        { id: 4, question: 'What is the difference between stack and queue?', difficulty: 'easy', topic: 'data-structures', type: 'multiple-choice' }
    ];

    // Mock submissions data
    submissionsData = [
        { id: 1, student: 'Alice Johnson', challenge: 'Array Manipulation', submitted: '2024-01-15 14:30', score: 85, status: 'graded' },
        { id: 2, student: 'Bob Smith', challenge: 'Binary Search Implementation', submitted: '2024-01-14 16:45', score: 0, status: 'pending' },
        { id: 3, student: 'Carol Davis', challenge: 'Array Manipulation', submitted: '2024-01-15 10:20', score: 92, status: 'graded' },
        { id: 4, student: 'David Wilson', challenge: 'String Algorithms', submitted: '2024-01-13 18:15', score: 78, status: 'late' }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }

    // Challenge settings form
    const challengeSettingsForm = document.getElementById('challenge-settings-form');
    if (challengeSettingsForm) {
        challengeSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateChallengeSettings();
        });
    }
}

// Initialize charts
function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        charts.performance = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Average Score',
                    data: [65, 72, 78, 75, 82, 85],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
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

    // Difficulty Chart
    const difficultyCtx = document.getElementById('difficultyChart');
    if (difficultyCtx) {
        charts.difficulty = new Chart(difficultyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: [
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ]
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
}

// Load overview data
function loadOverviewData() {
    // Update stats
    document.getElementById('total-students').textContent = studentsData.length;
    document.getElementById('active-challenges').textContent = challengesData.filter(c => c.status === 'active').length;
    
    const avgScore = Math.round(studentsData.reduce((sum, student) => sum + student.avgScore, 0) / studentsData.length);
    document.getElementById('avg-score').textContent = avgScore + '%';
    
    const completionRate = Math.round((challengesData.filter(c => c.status === 'completed').length / challengesData.length) * 100);
    document.getElementById('completion-rate').textContent = completionRate + '%';

    // Load recent activity
    loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;

    const activities = [
        { type: 'submission', message: 'Alice Johnson submitted Array Manipulation challenge', time: '2 hours ago', icon: 'fas fa-file-alt' },
        { type: 'challenge', message: 'New challenge "Binary Search" was created', time: '4 hours ago', icon: 'fas fa-plus-circle' },
        { type: 'student', message: 'Bob Smith joined CS 101 class', time: '1 day ago', icon: 'fas fa-user-plus' },
        { type: 'grade', message: 'Carol Davis scored 92% on String Algorithms', time: '2 days ago', icon: 'fas fa-star' }
    ];

    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Load challenges data
function loadChallengesData() {
    const challengeList = document.getElementById('challenge-list');
    if (!challengeList) return;

    challengeList.innerHTML = challengesData.map(challenge => `
        <div class="challenge-item">
            <div class="challenge-info">
                <div class="challenge-title">${challenge.title}</div>
                <div class="challenge-meta">
                    <span><i class="fas fa-signal"></i> ${challenge.difficulty}</span>
                    <span><i class="fas fa-users"></i> ${challenge.submissions} submissions</span>
                    <span><i class="fas fa-calendar"></i> Due: ${challenge.dueDate}</span>
                    <span class="badge badge-${challenge.status === 'active' ? 'success' : challenge.status === 'draft' ? 'warning' : 'secondary'}">${challenge.status}</span>
                </div>
            </div>
            <div class="challenge-actions">
                <button class="btn btn-sm btn-primary" onclick="editChallenge(${challenge.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewSubmissions(${challenge.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}

// Load students data
function loadStudentsData() {
    const studentsTableBody = document.getElementById('students-table-body');
    if (!studentsTableBody) return;

    studentsTableBody.innerHTML = studentsData.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.class}</td>
            <td>${student.completed}</td>
            <td>${student.avgScore}%</td>
            <td>${student.lastActive}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewStudentProfile(${student.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-secondary" onclick="messageStudent(${student.id})">
                    <i class="fas fa-envelope"></i> Message
                </button>
            </td>
        </tr>
    `).join('');
}

// Update user info
function updateUserInfo() {
    const userName = localStorage.getItem('userName') || 'Teacher';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-avatar').textContent = userName.charAt(0).toUpperCase();
}

// Logout function
// Enhanced Analytics Functions

// Load comprehensive analytics data
function loadAnalyticsData() {
    const analyticsContainer = document.getElementById('analytics');
    if (!analyticsContainer) return;

    // Generate comprehensive analytics
    const analytics = generateComprehensiveAnalytics();

    analyticsContainer.innerHTML = `
        <div class="analytics-overview">
            <div class="analytics-cards">
                <div class="analytics-card">
                    <h3>Class Performance</h3>
                    <div class="metric-large">${analytics.classAverage}%</div>
                    <div class="metric-change positive">+${analytics.performanceChange}% this month</div>
                </div>
                <div class="analytics-card">
                    <h3>Engagement Rate</h3>
                    <div class="metric-large">${analytics.engagementRate}%</div>
                    <div class="metric-change ${analytics.engagementTrend > 0 ? 'positive' : 'negative'}">
                        ${analytics.engagementTrend > 0 ? '+' : ''}${analytics.engagementTrend}% vs last week
                    </div>
                </div>
                <div class="analytics-card">
                    <h3>Completion Rate</h3>
                    <div class="metric-large">${analytics.completionRate}%</div>
                    <div class="metric-change positive">+${analytics.completionChange}% improvement</div>
                </div>
                <div class="analytics-card">
                    <h3>Average Time</h3>
                    <div class="metric-large">${analytics.averageTime}</div>
                    <div class="metric-change neutral">Per challenge completion</div>
                </div>
            </div>
        </div>

        <div class="analytics-charts">
            <div class="chart-container">
                <h3>Performance Trends</h3>
                <canvas id="performanceTrendChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Student Progress Distribution</h3>
                <canvas id="progressDistributionChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Challenge Difficulty Analysis</h3>
                <canvas id="difficultyAnalysisChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Weekly Activity Heatmap</h3>
                <canvas id="activityHeatmapChart"></canvas>
            </div>
        </div>

        <div class="detailed-analytics">
            <div class="analytics-section">
                <h3>Top Performers</h3>
                <div class="top-performers-list">
                    ${analytics.topPerformers.map(student => `
                        <div class="performer-item">
                            <div class="performer-info">
                                <div class="performer-avatar">${student.name.charAt(0)}</div>
                                <div class="performer-details">
                                    <div class="performer-name">${student.name}</div>
                                    <div class="performer-score">${student.score}% average</div>
                                </div>
                            </div>
                            <div class="performer-badge">#${student.rank}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="analytics-section">
                <h3>Challenge Performance</h3>
                <div class="challenge-performance-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Challenge</th>
                                <th>Attempts</th>
                                <th>Success Rate</th>
                                <th>Avg Score</th>
                                <th>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${analytics.challengePerformance.map(challenge => `
                                <tr>
                                    <td>${challenge.name}</td>
                                    <td>${challenge.attempts}</td>
                                    <td>
                                        <div class="success-rate ${challenge.successRate >= 80 ? 'high' : challenge.successRate >= 60 ? 'medium' : 'low'}">
                                            ${challenge.successRate}%
                                        </div>
                                    </td>
                                    <td>${challenge.avgScore}%</td>
                                    <td>
                                        <span class="difficulty-badge ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="analytics-section">
                <h3>Learning Insights</h3>
                <div class="insights-grid">
                    ${analytics.insights.map(insight => `
                        <div class="insight-card ${insight.type}">
                            <div class="insight-icon">
                                <i class="fas ${insight.icon}"></i>
                            </div>
                            <div class="insight-content">
                                <h4>${insight.title}</h4>
                                <p>${insight.description}</p>
                                <div class="insight-action">
                                    <button class="btn btn-sm btn-primary" onclick="handleInsightAction('${insight.action}')">
                                        ${insight.actionText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Initialize analytics charts
    initializeAnalyticsCharts();
}

// Generate comprehensive analytics
function generateComprehensiveAnalytics() {
    // Calculate class performance metrics
    const classAverage = Math.round(studentsData.reduce((sum, student) => sum + student.averageScore, 0) / studentsData.length);
    const performanceChange = Math.round(Math.random() * 10 + 2); // Mock improvement

    // Calculate engagement metrics
    const engagementRate = Math.round(85 + Math.random() * 10);
    const engagementTrend = Math.round((Math.random() - 0.5) * 10);

    // Calculate completion metrics
    const completionRate = Math.round(78 + Math.random() * 15);
    const completionChange = Math.round(Math.random() * 8 + 1);

    // Calculate average time
    const averageTime = `${Math.round(25 + Math.random() * 20)}min`;

    // Top performers
    const topPerformers = studentsData
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5)
        .map((student, index) => ({
            name: student.name,
            score: student.averageScore,
            rank: index + 1
        }));

    // Challenge performance analysis
    const challengePerformance = challengesData.map(challenge => ({
        name: challenge.title,
        attempts: Math.round(20 + Math.random() * 30),
        successRate: Math.round(60 + Math.random() * 35),
        avgScore: Math.round(70 + Math.random() * 25),
        difficulty: challenge.difficulty
    }));

    // Learning insights
    const insights = [
        {
            type: 'success',
            icon: 'fa-chart-line',
            title: 'Strong Progress in Arrays',
            description: 'Students are showing 23% improvement in array-based challenges this month.',
            action: 'view_array_progress',
            actionText: 'View Details'
        },
        {
            type: 'warning',
            icon: 'fa-exclamation-triangle',
            title: 'Struggling with Recursion',
            description: '40% of students need additional support with recursive algorithms.',
            action: 'create_recursion_help',
            actionText: 'Create Help Session'
        },
        {
            type: 'info',
            icon: 'fa-lightbulb',
            title: 'Optimal Challenge Timing',
            description: 'Students perform 15% better on challenges posted on Tuesday mornings.',
            action: 'schedule_optimization',
            actionText: 'Optimize Schedule'
        },
        {
            type: 'success',
            icon: 'fa-users',
            title: 'High Engagement',
            description: 'Class participation is up 18% compared to last semester.',
            action: 'engagement_report',
            actionText: 'View Report'
        }
    ];

    return {
        classAverage,
        performanceChange,
        engagementRate,
        engagementTrend,
        completionRate,
        completionChange,
        averageTime,
        topPerformers,
        challengePerformance,
        insights
    };
}

// Initialize analytics charts
function initializeAnalyticsCharts() {
    // Performance Trend Chart
    const performanceTrendCtx = document.getElementById('performanceTrendChart');
    if (performanceTrendCtx) {
        charts.performanceTrend = new Chart(performanceTrendCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
                datasets: [
                    {
                        label: 'Class Average',
                        data: [72, 75, 78, 76, 82, 85, 87, 89],
                        borderColor: 'rgb(37, 99, 235)',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Top 25%',
                        data: [85, 87, 89, 88, 92, 94, 95, 96],
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Bottom 25%',
                        data: [58, 62, 65, 63, 68, 72, 75, 78],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
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

    // Progress Distribution Chart
    const progressDistributionCtx = document.getElementById('progressDistributionChart');
    if (progressDistributionCtx) {
        charts.progressDistribution = new Chart(progressDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Excellent (90-100%)', 'Good (80-89%)', 'Average (70-79%)', 'Needs Improvement (<70%)'],
                datasets: [{
                    data: [8, 12, 15, 5],
                    backgroundColor: [
                        'rgb(16, 185, 129)',
                        'rgb(59, 130, 246)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
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
}

// Handle insight actions
function handleInsightAction(action) {
    switch(action) {
        case 'view_array_progress':
            alert('Viewing detailed array progress analytics...');
            break;
        case 'create_recursion_help':
            alert('Creating recursion help session...');
            break;
        case 'schedule_optimization':
            alert('Opening schedule optimization tool...');
            break;
        case 'engagement_report':
            alert('Generating engagement report...');
            break;
        default:
            alert('Action not implemented yet.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

// Utility functions
function showCreateChallengeModal() {
    alert('Create Challenge Modal - To be implemented');
}

function showCreateQuestionModal() {
    alert('Create Question Modal - To be implemented');
}

function filterChallenges() {
    alert('Filter Challenges - To be implemented');
}

function searchStudents() {
    alert('Search Students - To be implemented');
}

function exportStudentData() {
    alert('Export Student Data - To be implemented');
}

function refreshActivity() {
    loadRecentActivity();
}

function editChallenge(id) {
    alert(`Edit Challenge ${id} - To be implemented`);
}

function viewSubmissions(id) {
    alert(`View Submissions for Challenge ${id} - To be implemented`);
}

function viewStudentProfile(id) {
    alert(`View Student Profile ${id} - To be implemented`);
}

function messageStudent(id) {
    alert(`Message Student ${id} - To be implemented`);
}

function updateProfile() {
    alert('Profile Updated Successfully!');
}

function updateChallengeSettings() {
    alert('Challenge Settings Updated Successfully!');
}
