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

    // API endpoints
    const API_URL = 'http://localhost:8080/api/challenges';
    const SUBMISSION_URL = 'http://localhost:8080/api/submissions';

    // DOM elements
    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');
    const prevButton = document.getElementById('prev-challenge');
    const nextButton = document.getElementById('next-challenge');
    const clearButton = document.querySelector('.clear-response-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const challengeDifficulty = document.getElementById('challenge-difficulty');
    const challengeDueDate = document.getElementById('challenge-due-date');
    const challengeImageContainer = document.getElementById('challenge-image-container');
    const fileInput = document.getElementById('submission-file');
    const fileName = document.getElementById('file-name');
    const submitBtn = document.getElementById('submit-btn');

    let allChallenges = [];
    let currentQuestionIndex = 0;
    let selectedOption = null;

    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileName.textContent = e.target.files[0].name;
            } else {
                fileName.textContent = 'No file selected';
            }
        });
    }

    // Handle submission
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            if (!selectedOption && !fileInput.files[0]) {
                alert('Please select an answer or upload a solution file');
                return;
            }

            const challenge = allChallenges[currentQuestionIndex];
            
            try {
                const formData = new FormData();
                formData.append('challengeId', challenge.id);
                
                if (selectedOption) {
                    formData.append('answer', selectedOption);
                }
                
                if (fileInput.files[0]) {
                    formData.append('image', fileInput.files[0]);
                }

                const response = await fetch(SUBMISSION_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to submit solution');
                }

                const result = await response.json();
                alert('Solution submitted successfully!');
                
                // Clear selection and file
                document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                fileInput.value = '';
                fileName.textContent = 'No file selected';
                selectedOption = null;
                
            } catch (error) {
                console.error('Error submitting solution:', error);
                alert('Failed to submit solution. Please try again.');
            }
        });
    }

    const fetchChallengeData = async () => {
        try {
            loadingSpinner.style.display = 'block';
            
            // Sample challenge data (fallback if API fails)
            const sampleChallenges = [
                {
                    id: 1,
                    title: "JavaScript Fundamentals",
                    description: "Test your knowledge of JavaScript basics",
                    question: "What will be the output of the following code?\n\nconsole.log(typeof null);",
                    difficulty: "Easy",
                    dueDate: new Date().toISOString(),
                    options: [
                        { id: "A", text: "null" },
                        { id: "B", text: "undefined" },
                        { id: "C", text: "object" },
                        { id: "D", text: "number" }
                    ]
                },
                {
                    id: 2,
                    title: "CSS Challenge",
                    description: "Test your knowledge of CSS",
                    question: "Which CSS property is used to change the text color of an element?",
                    difficulty: "Easy",
                    dueDate: new Date().toISOString(),
                    options: [
                        { id: "A", text: "color" },
                        { id: "B", text: "text-color" },
                        { id: "C", text: "font-color" },
                        { id: "D", text: "background-color" }
                    ]
                },
                {
                    id: 3,
                    title: "HTML Structure",
                    description: "Test your knowledge of HTML",
                    question: "Which HTML tag is used to define an unordered list?",
                    difficulty: "Medium",
                    dueDate: new Date().toISOString(),
                    options: [
                        { id: "A", text: "<ol>" },
                        { id: "B", text: "<ul>" },
                        { id: "C", text: "<li>" },
                        { id: "D", text: "<list>" }
                    ]
                }
            ];
            
            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                allChallenges = await response.json();
                
                // If API returns empty array, use sample data
                if (!allChallenges || allChallenges.length === 0) {
                    allChallenges = sampleChallenges;
                }
            } catch (error) {
                console.error("Could not fetch challenge data from API, using sample data:", error);
                allChallenges = sampleChallenges;
            }
            
            loadingSpinner.style.display = 'none';
            
            if (allChallenges.length > 0) {
                displayChallenge();
            } else {
                questionBox.innerHTML = "<p>No challenges available.</p>";
                challengeImageContainer.style.display = 'none';
            }
        } catch (error) {
            console.error("Could not load challenges:", error);
            loadingSpinner.style.display = 'none';
            questionBox.innerHTML = "<p>Failed to load challenges. Please try again later.</p>";
        }
    };

    const displayChallenge = () => {
        if (allChallenges.length === 0) {
            questionBox.innerHTML = "<p>No challenges available.</p>";
            return;
        }

        const challenge = allChallenges[currentQuestionIndex];
        
        // Display challenge details
        questionBox.innerHTML = `
            <h3>${challenge.title}</h3>
            <p>${challenge.description || ''}</p>
            <p class="question">${challenge.question}</p>
        `;

        // Display difficulty and due date
        if (challengeDifficulty) {
            challengeDifficulty.textContent = challenge.difficulty || 'Medium';
            challengeDifficulty.className = 'difficulty ' + (challenge.difficulty || '').toLowerCase();
        }

        if (challengeDueDate && challenge.dueDate) {
            const dueDate = new Date(challenge.dueDate);
            challengeDueDate.textContent = `Due: ${dueDate.toLocaleDateString()}`;
        }

        // Display challenge image if available
        if (challengeImageContainer) {
            if (challenge.imageUrl) {
                challengeImageContainer.innerHTML = `<img src="${challenge.imageUrl}" alt="Challenge Image">`;
                challengeImageContainer.style.display = 'block';
            } else {
                challengeImageContainer.style.display = 'none';
            }
        }

        // Display options
        optionsContainer.innerHTML = '';
        if (challenge.options && challenge.options.length > 0) {
            challenge.options.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('option');
                optionDiv.dataset.value = option.id;
                optionDiv.innerHTML = `<span class="option-marker">${option.id}</span><p>${option.text}</p>`;
                optionsContainer.appendChild(optionDiv);

                optionDiv.addEventListener('click', () => {
                    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                    optionDiv.classList.add('selected');
                    selectedOption = option.id;
                });
            });
            optionsContainer.style.display = 'block';
        } else {
            optionsContainer.style.display = 'none';
        }

        // Clear button functionality
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
                selectedOption = null;
                fileInput.value = '';
                fileName.textContent = 'No file selected';
            });
        }
        
        updateNavigationButtons();
    };

    const updateNavigationButtons = () => {
        if (currentQuestionIndex === 0) {
            prevButton.disabled = true;
            prevButton.classList.add('disabled');
        } else {
            prevButton.disabled = false;
            prevButton.classList.remove('disabled');
        }

        if (currentQuestionIndex === allChallenges.length - 1) {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
        } else {
            nextButton.disabled = false;
            nextButton.classList.remove('disabled');
        }
    };

    // Navigation button event listeners
    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayChallenge();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < allChallenges.length - 1) {
            currentQuestionIndex++;
            displayChallenge();
        }
    });

    // Initialize
    fetchChallengeData();
});