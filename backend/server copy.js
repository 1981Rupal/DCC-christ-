const express = require('express');
const app = express();

// We are setting the port to 8080 to match the Codespaces port forwarding.
const PORT = process.env.PORT || 8080; 

// A simple API endpoint for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Sample data for the challenge
const challengeData = {
  question: "Which element is used to get highlighted text in HTML5?",
  options: [
    { id: 'u', text: "<u>" },
    { id: 'mark', text: "<mark>" },
    { id: 'highlight', text: "<highlight>" }
  ]
};

// An API endpoint to get challenge data
app.get('/api/challenge', (req, res) => {
  res.json(challengeData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});