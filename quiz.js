document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Update user info in the header
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }

    // Set up logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // API endpoints - Use relative URLs for production
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
    const API_URL = `${API_BASE}/api/challenges`;
    const SUBMISSION_URL = `${API_BASE}/api/submissions`;

    // Quiz elements
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');
    const progressFill = document.getElementById('progress-fill');
    const challengeTitle = document.getElementById('challenge-title');
    const quizTimer = document.getElementById('quiz-timer');

    // Quiz state
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timerInterval;
    let timeLeft = 15 * 60; // 15 minutes in seconds

    // Sample quiz questions
    const quizQuestions = [
        {
            question: "What will be the output of the following code?\n\nconsole.log(typeof null);",
            options: [
                { id: "A", text: "null" },
                { id: "B", text: "undefined" },
                { id: "C", text: "object" },
                { id: "D", text: "number" }
            ],
            correctAnswer: "C"
        },
        {
            question: "Which CSS property is used to change the text color of an element?",
            options: [
                { id: "A", text: "color" },
                { id: "B", text: "text-color" },
                { id: "C", text: "font-color" },
                { id: "D", text: "background-color" }
            ],
            correctAnswer: "A"
        },
        {
            question: "Which HTML tag is used to define an unordered list?",
            options: [
                { id: "A", text: "<ol>" },
                { id: "B", text: "<ul>" },
                { id: "C", text: "<li>" },
                { id: "D", text: "<list>" }
            ],
            correctAnswer: "B"
        },
        {
            question: "What is the correct way to write a JavaScript array?",
            options: [
                { id: "A", text: "var colors = (1:'red', 2:'green', 3:'blue')" },
                { id: "B", text: "var colors = ['red', 'green', 'blue']" },
                { id: "C", text: "var colors = 'red', 'green', 'blue'" },
                { id: "D", text: "var colors = {red, green, blue}" }
            ],
            correctAnswer: "B"
        },
        {
            question: "Which method is used to add new elements to the end of an array in JavaScript?",
            options: [
                { id: "A", text: "push()" },
                { id: "B", text: "append()" },
                { id: "C", text: "add()" },
                { id: "D", text: "insert()" }
            ],
            correctAnswer: "A"
        }
    ];

    // Initialize user answers array
    for (let i = 0; i < quizQuestions.length; i++) {
        userAnswers.push(null);
    }

    // Initialize timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            quizTimer.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitQuiz();
            }
        }, 1000);
    }

    // Display current question
    function displayQuestion() {
        const question = quizQuestions[currentQuestionIndex];
        
        // Update question number
        questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
        
        // Update question text
        questionText.innerHTML = question.question;
        
        // Update progress bar
        const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Clear options list
        optionsList.innerHTML = '';
        
        // Add options
        question.options.forEach(option => {
            const li = document.createElement('li');
            li.className = 'option-item';
            if (userAnswers[currentQuestionIndex] === option.id) {
                li.classList.add('selected');
            }
            
            li.innerHTML = `
                <div class="option-marker">${option.id}</div>
                <div class="option-text">${option.text}</div>
            `;
            
            li.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.option-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                li.classList.add('selected');
                
                // Save user's answer
                userAnswers[currentQuestionIndex] = option.id;
            });
            
            optionsList.appendChild(li);
        });
        
        // Update navigation buttons
        prevButton.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else {
            nextButton.style.display = 'block';
            submitButton.style.display = 'none';
        }
    }

    // Navigate to previous question
    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });

    // Navigate to next question
    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    });

    // Submit quiz
    submitButton.addEventListener('click', submitQuiz);

    function submitQuiz() {
        clearInterval(timerInterval);
        
        // Calculate score
        let score = 0;
        for (let i = 0; i < quizQuestions.length; i++) {
            if (userAnswers[i] === quizQuestions[i].correctAnswer) {
                score++;
            }
        }
        
        // Display results
        const percentage = Math.round((score / quizQuestions.length) * 100);
        
        // Clear quiz container
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = `
            <h2>Quiz Results</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="result-summary">
                <p>You scored ${score} out of ${quizQuestions.length} (${percentage}%)</p>
            </div>
            <div class="result-details">
                <h3>Question Summary:</h3>
                <ul class="result-list">
                    ${quizQuestions.map((q, index) => `
                        <li class="result-item ${userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}">
                            <div class="question-result">
                                <span class="question-number">Question ${index + 1}:</span>
                                <span class="result-icon">${userAnswers[index] === q.correctAnswer ? '✓' : '✗'}</span>
                            </div>
                            <p class="question-text">${q.question}</p>
                            <p class="answer-text">Your answer: ${userAnswers[index] ? `Option ${userAnswers[index]}` : 'Not answered'}</p>
                            <p class="correct-answer">Correct answer: Option ${q.correctAnswer}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="navigation-controls">
                <button class="nav-button" onclick="window.location.href='challenge.html'">Back to Challenges</button>
            </div>
        `;
        
        // Add styles for results
        const style = document.createElement('style');
        style.textContent = `
            .result-summary {
                font-size: 1.2rem;
                margin: 20px 0;
                text-align: center;
            }
            .result-list {
                list-style-type: none;
                padding: 0;
            }
            .result-item {
                background-color: #f5f5f5;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                border-left: 5px solid #ccc;
            }
            .result-item.correct {
                border-left-color: #4caf50;
            }
            .result-item.incorrect {
                border-left-color: #f44336;
            }
            .question-result {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .result-icon {
                font-weight: bold;
            }
            .correct .result-icon {
                color: #4caf50;
            }
            .incorrect .result-icon {
                color: #f44336;
            }
            .answer-text, .correct-answer {
                margin: 5px 0;
            }
            .correct-answer {
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize quiz
    displayQuestion();
    startTimer();
});