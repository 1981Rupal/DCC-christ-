document.addEventListener('DOMContentLoaded', () => {

    // 1. **PASTE YOUR CODESPACES URL HERE**
    //    Copy the URL you found in your Ports tab (e.g., https://<your-name>-3000.app.github.dev)
    const API_BASE_URL = 'https://crispy-waffle-4j79jqrq7x45hjp66-3000.app.github.dev';
    const API_URL = `${API_BASE_URL}/api/challenge`;

    const questionBox = document.querySelector('.question-box');
    const optionsContainer = document.querySelector('.options-container');
    let clearButton = document.querySelector('.clear-response-btn');

    // Function to fetch the challenge data from the API
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

    // Function to display the challenge data on the page
    const displayChallenge = (challenge) => {
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

            // Add event listener for selecting an option
            optionDiv.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                optionDiv.classList.add('selected');
            });
        });

        // Re-attach clear button listener after options are created
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
            });
        }
    };

    // Call the function to load the data when the page loads
    fetchChallengeData();
});