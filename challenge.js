document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'https://dcc-christ.onrender.com';
    const API_URL = `${API_BASE_URL}/api/challenge`;

    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const clearButton = document.querySelector('.clear-response-btn');

    let allChallenges = [];
    let currentQuestionIndex = 0;

    const fetchChallengeData = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allChallenges = await response.json();
            displayChallenge();
        } catch (error) {
            console.error("Could not fetch challenge data:", error);
            questionBox.innerHTML = "<p>Failed to load challenge. Please try again later.</p>";
        }
    };

    const displayChallenge = () => {
        if (allChallenges.length === 0) {
            questionBox.innerHTML = "<p>No challenges available.</p>";
            return;
        }

        const challenge = allChallenges[currentQuestionIndex];
        
        questionBox.innerHTML = `<p>${challenge.question}</p>`;

        optionsContainer.innerHTML = '';
        challenge.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.dataset.value = option.id;
            optionDiv.innerHTML = `<span class="icon">&#x1F441;</span><p>${option.text}</p>`;
            optionsContainer.appendChild(optionDiv);

            optionDiv.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                optionDiv.classList.add('selected');
            });
        });

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
            });
        }
        
        updateNavigationButtons();
    };

    const updateNavigationButtons = () => {
        if (currentQuestionIndex === 0) {
            prevButton.style.display = 'none';
        } else {
            prevButton.style.display = 'inline-block';
        }

        if (currentQuestionIndex === allChallenges.length - 1) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'inline-block';
        }
    };

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

    fetchChallengeData();
});