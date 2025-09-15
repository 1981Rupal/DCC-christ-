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
const challengeData = [
  {
    id: 1,
    question: "Which element is used to get highlighted text in HTML5?",
    options: [
      { id: 'u', text: "Underline Tag" },
      { id: 'mark', text: "Mark Tag" },
      { id: 'highlight', text: "Highlight Tag" }
    ]
  },
  {
    id: 2,
    question: "How do you select an element with id='header' in CSS?",
    options: [
      { id: 'a', text: "#header" },
      { id: 'b', text: ".header" },
      { id: 'c', text: "header" }
    ]
  },
  {
    id: 3,
    question: "What does 'git push origin main' do?",
    options: [
      { id: 'a', text: "Clones the repository" },
      { id: 'b', text: "Uploads your local changes to the main branch" },
      { id: 'c', text: "Creates a new branch" }
    ]
  }
];

// ... (the rest of your server.js file remains the same)

// An API endpoint to get challenge data
app.get('/api/challenge', (req, res) => {
  const randomIndex = Math.floor(Math.random() * challengeData.length);
  const randomChallenge = challengeData[randomIndex];
  res.json(randomChallenge);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});