document.addEventListener('DOMContentLoaded', () => {

    // This is the public URL for your live back-end API on Render
    const API_BASE_URL = 'https://dcc-christ.onrender.com';
    const API_URL = `${API_BASE_URL}/api/challenge`;

    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');
    let clearButton = document.querySelector('.clear-response-btn');

    const fetchChallengeData = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayChallenge(data);
        } catch (error) {
            console.error("Could not fetch challenge data:", error);
            questionBox.innerHTML = "<p>Failed to load challenge. Please try again later.</p>";
        }
    };

    const displayChallenge = (challenge) => {
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
    };

    fetchChallengeData();
});