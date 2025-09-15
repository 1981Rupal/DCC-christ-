document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'https://dcc-christ.onrender.com';
    const API_URL = `${API_BASE_URL}/api/challenge`;

    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');

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
        
        // Update the question
        questionBox.innerHTML = `<p>${challenge.question}</p>`;

        // Update the options
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

        updateNavigationButtons();
    };

    const updateNavigationButtons = () => {
        // Handle "Previous" button
        if (currentQuestionIndex === 0) {
            prevButton.style.display = 'none';
        } else {
            prevButton.style.display = 'inline-block';
        }

        // Handle "Next" button
        if (currentQuestionIndex === allChallenges.length - 1) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'inline-block';
        }
    };

    // Event listeners for the navigation buttons
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