// Enhanced Challenge System - Complete Functional Implementation
document.addEventListener('DOMContentLoaded', () => {
    initializeChallengeSystem();
});

// Global variables
let currentChallenge = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let challengeTimer = null;
let timeRemaining = 0;
let isSubmitted = false;

// Initialize the challenge system
function initializeChallengeSystem() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Update user info
    updateUserInfo();
    
    // Get challenge ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('id');
    
    if (challengeId) {
        loadChallenge(challengeId);
    } else {
        loadDefaultChallenge();
    }

    // Set up event listeners
    setupEventListeners();
}

// Update user information in header
function updateUserInfo() {
    const userName = localStorage.getItem('userName') || 'Student';
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    const prevButton = document.getElementById('prev-challenge');
    const nextButton = document.getElementById('next-challenge');
    const submitBtn = document.getElementById('submit-btn');
    const clearButton = document.querySelector('.clear-response-btn');
    const fileInput = document.getElementById('submission-file');
    const logoutBtn = document.getElementById('logout-btn');

    if (prevButton) {
        prevButton.addEventListener('click', () => navigateQuestion(-1));
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => navigateQuestion(1));
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitChallenge);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearCurrentAnswer);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Load challenge data
function loadChallenge(challengeId) {
    showLoading(true);
    
    // Mock challenge data - In real app, this would come from API
    const mockChallenges = {
        '1': {
            id: 1,
            title: 'Array Manipulation Challenge',
            description: 'Test your skills with array operations and algorithms',
            difficulty: 'Easy',
            timeLimit: 3600, // 60 minutes in seconds
            dueDate: '2024-01-20',
            points: 100,
            questions: [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'What is the time complexity of accessing an element in an array by index?',
                    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                    correctAnswer: 0,
                    explanation: 'Array access by index is constant time O(1) because arrays store elements in contiguous memory locations.',
                    points: 25
                },
                {
                    id: 2,
                    type: 'multiple-choice',
                    question: 'Which method would you use to add an element to the end of an array in JavaScript?',
                    options: ['append()', 'push()', 'add()', 'insert()'],
                    correctAnswer: 1,
                    explanation: 'The push() method adds one or more elements to the end of an array.',
                    points: 25
                },
                {
                    id: 3,
                    type: 'coding',
                    question: 'Write a function that finds the maximum element in an array.',
                    description: 'Implement a function called findMax that takes an array of numbers and returns the maximum value.',
                    starterCode: 'function findMax(arr) {\n    // Your code here\n}',
                    testCases: [
                        { input: '[1, 3, 2, 8, 5]', expected: '8' },
                        { input: '[-1, -3, -2]', expected: '-1' },
                        { input: '[42]', expected: '42' }
                    ],
                    points: 50
                }
            ]
        },
        '2': {
            id: 2,
            title: 'Binary Search Implementation',
            description: 'Master the binary search algorithm',
            difficulty: 'Medium',
            timeLimit: 4500, // 75 minutes
            dueDate: '2024-01-22',
            points: 150,
            questions: [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'What is the prerequisite for binary search to work?',
                    options: ['Array must be sorted', 'Array must be of even length', 'Array must contain unique elements', 'Array must be numeric'],
                    correctAnswer: 0,
                    explanation: 'Binary search requires the array to be sorted to work correctly.',
                    points: 30
                },
                {
                    id: 2,
                    type: 'coding',
                    question: 'Implement binary search algorithm.',
                    description: 'Write a function that performs binary search on a sorted array.',
                    starterCode: 'function binarySearch(arr, target) {\n    // Your code here\n}',
                    testCases: [
                        { input: '[1, 3, 5, 7, 9], 5', expected: '2' },
                        { input: '[1, 3, 5, 7, 9], 1', expected: '0' },
                        { input: '[1, 3, 5, 7, 9], 10', expected: '-1' }
                    ],
                    points: 120
                }
            ]
        }
    };

    // Simulate API delay
    setTimeout(() => {
        currentChallenge = mockChallenges[challengeId] || mockChallenges['1'];
        initializeChallenge();
        showLoading(false);
    }, 500);
}

// Load default challenge if no ID provided
function loadDefaultChallenge() {
    loadChallenge('1');
}

// Initialize challenge after loading
function initializeChallenge() {
    if (!currentChallenge) return;

    // Update challenge info
    updateChallengeInfo();
    
    // Initialize user answers
    userAnswers = {};
    currentQuestionIndex = 0;
    isSubmitted = false;
    
    // Start timer
    timeRemaining = currentChallenge.timeLimit;
    startTimer();
    
    // Display first question
    displayQuestion(0);
    
    // Update navigation
    updateNavigation();
}

// Update challenge information display
function updateChallengeInfo() {
    const titleElement = document.querySelector('.challenge-title');
    const descriptionElement = document.querySelector('.challenge-description');
    const difficultyElement = document.getElementById('challenge-difficulty');
    const dueDateElement = document.getElementById('challenge-due-date');
    const pointsElement = document.querySelector('.challenge-points');
    const progressElement = document.querySelector('.challenge-progress');

    if (titleElement) titleElement.textContent = currentChallenge.title;
    if (descriptionElement) descriptionElement.textContent = currentChallenge.description;
    if (difficultyElement) difficultyElement.textContent = currentChallenge.difficulty;
    if (dueDateElement) dueDateElement.textContent = `Due: ${currentChallenge.dueDate}`;
    if (pointsElement) pointsElement.textContent = `${currentChallenge.points} points`;
    if (progressElement) {
        progressElement.textContent = `Question 1 of ${currentChallenge.questions.length}`;
    }
}

// Start challenge timer
function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    challengeTimer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(challengeTimer);
            autoSubmitChallenge();
            return;
        }

        timeRemaining--;
        updateTimerDisplay();
    }, 1000);

    updateTimerDisplay();
}

// Update timer display
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.textContent = timeString;

    // Change color when time is running low
    if (timeRemaining < 300) { // Less than 5 minutes
        timerElement.style.color = '#ef4444';
    } else if (timeRemaining < 600) { // Less than 10 minutes
        timerElement.style.color = '#f59e0b';
    } else {
        timerElement.style.color = '#059669';
    }
}

// Display question
function displayQuestion(index) {
    if (!currentChallenge || !currentChallenge.questions[index]) return;

    const question = currentChallenge.questions[index];
    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');
    const codeEditor = document.getElementById('code-editor');
    const progressElement = document.querySelector('.challenge-progress');

    // Update progress
    if (progressElement) {
        progressElement.textContent = `Question ${index + 1} of ${currentChallenge.questions.length}`;
    }

    // Clear previous content
    if (questionBox) questionBox.innerHTML = '';
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (codeEditor) codeEditor.style.display = 'none';

    if (question.type === 'multiple-choice') {
        displayMultipleChoiceQuestion(question, index);
    } else if (question.type === 'coding') {
        displayCodingQuestion(question, index);
    }

    // Update navigation buttons
    updateNavigation();
}

// Display multiple choice question
function displayMultipleChoiceQuestion(question, index) {
    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');

    if (questionBox) {
        questionBox.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
            <div class="question-points">Points: ${question.points}</div>
        `;
    }

    if (optionsContainer) {
        optionsContainer.innerHTML = question.options.map((option, optionIndex) => `
            <div class="option" data-option="${optionIndex}">
                <input type="radio" name="question-${index}" id="option-${optionIndex}" value="${optionIndex}">
                <label for="option-${optionIndex}">${option}</label>
            </div>
        `).join('');

        // Add event listeners to options
        const optionElements = optionsContainer.querySelectorAll('.option');
        optionElements.forEach(optionElement => {
            optionElement.addEventListener('click', () => {
                const optionIndex = parseInt(optionElement.dataset.option);
                selectOption(index, optionIndex);
            });
        });

        // Restore previous answer if exists
        if (userAnswers[index] !== undefined) {
            const savedAnswer = userAnswers[index];
            const radioButton = optionsContainer.querySelector(`input[value="${savedAnswer}"]`);
            if (radioButton) {
                radioButton.checked = true;
                optionElements[savedAnswer].classList.add('selected');
            }
        }
    }
}

// Display coding question
function displayCodingQuestion(question, index) {
    const questionBox = document.querySelector('.question-box');
    const codeEditor = document.getElementById('code-editor');
    const codeTextarea = document.getElementById('code-input');

    if (questionBox) {
        questionBox.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
            <div class="question-description">${question.description}</div>
            <div class="question-points">Points: ${question.points}</div>
            <div class="test-cases">
                <h4>Test Cases:</h4>
                ${question.testCases.map((testCase, i) => `
                    <div class="test-case">
                        <strong>Test ${i + 1}:</strong> Input: ${testCase.input} → Expected: ${testCase.expected}
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (codeEditor) {
        codeEditor.style.display = 'block';
        if (codeTextarea) {
            // Set starter code or restore previous answer
            codeTextarea.value = userAnswers[index] || question.starterCode || '';

            // Add event listener to save code as user types
            codeTextarea.addEventListener('input', () => {
                userAnswers[index] = codeTextarea.value;
            });
        }
    }
}

// Select option for multiple choice questions
function selectOption(questionIndex, optionIndex) {
    userAnswers[questionIndex] = optionIndex;

    // Update visual selection
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.classList.toggle('selected', index === optionIndex);
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = index === optionIndex;
        }
    });
}

// Navigate between questions
function navigateQuestion(direction) {
    const newIndex = currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < currentChallenge.questions.length) {
        currentQuestionIndex = newIndex;
        displayQuestion(currentQuestionIndex);
    }
}

// Update navigation buttons
function updateNavigation() {
    const prevButton = document.getElementById('prev-challenge');
    const nextButton = document.getElementById('next-challenge');
    const submitBtn = document.getElementById('submit-btn');

    if (prevButton) {
        prevButton.disabled = currentQuestionIndex === 0;
    }

    if (nextButton) {
        nextButton.disabled = currentQuestionIndex === currentChallenge.questions.length - 1;
    }

    if (submitBtn) {
        // Show submit button only on last question or if all questions answered
        const allAnswered = currentChallenge.questions.every((_, index) => userAnswers[index] !== undefined);
        const isLastQuestion = currentQuestionIndex === currentChallenge.questions.length - 1;

        submitBtn.style.display = (isLastQuestion || allAnswered) ? 'block' : 'none';
        submitBtn.disabled = isSubmitted;
    }
}

// Clear current answer
function clearCurrentAnswer() {
    delete userAnswers[currentQuestionIndex];

    // Clear visual selection
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = false;
        }
    });

    // Clear code editor if it's a coding question
    const codeTextarea = document.getElementById('code-input');
    if (codeTextarea && codeTextarea.style.display !== 'none') {
        codeTextarea.value = currentChallenge.questions[currentQuestionIndex].starterCode || '';
    }

    updateNavigation();
}

// Handle file selection for submissions
function handleFileSelection(event) {
    const file = event.target.files[0];
    const fileName = document.getElementById('file-name');

    if (file) {
        fileName.textContent = file.name;
        fileName.style.display = 'block';
    } else {
        fileName.style.display = 'none';
    }
}

// Submit challenge
async function submitChallenge() {
    if (isSubmitted) return;

    // Validate all questions are answered
    const unansweredQuestions = [];
    currentChallenge.questions.forEach((question, index) => {
        if (userAnswers[index] === undefined) {
            unansweredQuestions.push(index + 1);
        }
    });

    if (unansweredQuestions.length > 0) {
        alert(`Please answer all questions. Missing: Question(s) ${unansweredQuestions.join(', ')}`);
        return;
    }

    // Confirm submission
    if (!confirm('Are you sure you want to submit your answers? This action cannot be undone.')) {
        return;
    }

    showLoading(true);
    isSubmitted = true;

    // Stop timer
    if (challengeTimer) {
        clearInterval(challengeTimer);
    }

    try {
        // Calculate score
        let totalScore = 0;
        let correctAnswers = 0;

        currentChallenge.questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];

            if (question.type === 'multiple-choice') {
                if (userAnswer === question.correctAnswer) {
                    totalScore += question.points;
                    correctAnswers++;
                }
            } else if (question.type === 'coding') {
                // For coding questions, we'll give partial credit
                // In a real system, this would involve running tests
                const codeLength = userAnswer ? userAnswer.length : 0;
                if (codeLength > 50) { // Basic check for effort
                    totalScore += Math.floor(question.points * 0.7); // 70% for attempt
                    correctAnswers++;
                }
            }
        });

        // Simulate API submission
        const submissionData = {
            challengeId: currentChallenge.id,
            answers: userAnswers,
            score: totalScore,
            maxScore: currentChallenge.points,
            timeSpent: currentChallenge.timeLimit - timeRemaining,
            submittedAt: new Date().toISOString()
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show results
        showResults(totalScore, currentChallenge.points, correctAnswers, currentChallenge.questions.length);

    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting challenge. Please try again.');
        isSubmitted = false;
    } finally {
        showLoading(false);
    }
}

// Auto-submit when time runs out
function autoSubmitChallenge() {
    alert('⏰ Time\'s up! Your challenge will be submitted automatically.');
    submitChallenge();
}

// Show results modal
function showResults(score, maxScore, correct, total) {
    const percentage = Math.round((score / maxScore) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

    const resultHTML = `
        <div class="results-modal">
            <div class="results-content">
                <h2>🎉 Challenge Completed!</h2>
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-percentage">${percentage}%</span>
                        <span class="score-grade">Grade: ${grade}</span>
                    </div>
                </div>
                <div class="score-details">
                    <p><strong>Score:</strong> ${score} / ${maxScore} points</p>
                    <p><strong>Correct Answers:</strong> ${correct} / ${total}</p>
                    <p><strong>Time Spent:</strong> ${formatTime(currentChallenge.timeLimit - timeRemaining)}</p>
                </div>
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="goToDashboard()">Back to Dashboard</button>
                    <button class="btn btn-secondary" onclick="reviewAnswers()">Review Answers</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', resultHTML);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    if (isSubmitted) return;

    switch(event.key) {
        case 'ArrowLeft':
            if (event.ctrlKey) {
                event.preventDefault();
                navigateQuestion(-1);
            }
            break;
        case 'ArrowRight':
            if (event.ctrlKey) {
                event.preventDefault();
                navigateQuestion(1);
            }
            break;
        case 'Enter':
            if (event.ctrlKey) {
                event.preventDefault();
                submitChallenge();
            }
            break;
        case '1':
        case '2':
        case '3':
        case '4':
            if (event.altKey) {
                event.preventDefault();
                const optionIndex = parseInt(event.key) - 1;
                const question = currentChallenge.questions[currentQuestionIndex];
                if (question.type === 'multiple-choice' && optionIndex < question.options.length) {
                    selectOption(currentQuestionIndex, optionIndex);
                }
            }
            break;
    }
}

// Utility functions
function showLoading(show) {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

function goToDashboard() {
    window.location.href = 'student-dashboard.html';
}

function reviewAnswers() {
    // Hide results modal and show review mode
    const modal = document.querySelector('.results-modal');
    if (modal) {
        modal.remove();
    }

    // Enable review mode
    enableReviewMode();
}

function enableReviewMode() {
    // Show all questions with answers and explanations
    currentQuestionIndex = 0;
    displayQuestionReview(0);

    // Update navigation for review mode
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
}

function displayQuestionReview(index) {
    const question = currentChallenge.questions[index];
    const userAnswer = userAnswers[index];

    // Similar to displayQuestion but with answers shown
    displayQuestion(index);

    // Add review information
    const questionBox = document.querySelector('.question-box');
    if (questionBox && question.type === 'multiple-choice') {
        const isCorrect = userAnswer === question.correctAnswer;
        const reviewInfo = `
            <div class="review-info">
                <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </div>
                <div class="correct-answer">
                    <strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}
                </div>
                <div class="explanation">
                    <strong>Explanation:</strong> ${question.explanation}
                </div>
            </div>
        `;
        questionBox.insertAdjacentHTML('beforeend', reviewInfo);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}
