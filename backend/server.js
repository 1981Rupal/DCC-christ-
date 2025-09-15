const express = require('express');
const app = express();
const cors = require('cors'); 

app.use(cors());

// The port is set to 8080 for your Codespaces environment
// For Render deployment, Render will automatically set the port
const PORT = process.env.PORT || 8080; 

// A simple API endpoint for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Sample data for the challenge
// TEXT HAS BEEN CHANGED HERE
const challengeData = {
  question: "Which element is used to get highlighted text in HTML5?",
  options: [
    { id: 'u', text: "Underline Tag" },
    { id: 'mark', text: "Mark Tag" },
    { id: 'highlight', text: "Highlight Tag" }
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