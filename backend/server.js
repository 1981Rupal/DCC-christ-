const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// A simple API endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// An API endpoint to get challenge data
app.get('/api/challenge', (req, res) => {
  const challengeData = {
    question: "Which element is used to get highlighted text in HTML5?",
    options: [
      { id: 'u', text: "<u>" },
      { id: 'mark', text: "<mark>" },
      { id: 'highlight', text: "<highlight>" }
    ]
  };
  res.json(challengeData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});