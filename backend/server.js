const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '..')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image and PDF files are allowed!"));
  }
});

// The port is set to 8080 for your Codespaces environment
// For Render deployment, Render will automatically set the port
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Create separate upload directories for challenges and submissions
const challengeUploadsDir = path.join(uploadsDir, 'challenges');
const submissionUploadsDir = path.join(uploadsDir, 'submissions');

if (!fs.existsSync(challengeUploadsDir)) {
  fs.mkdirSync(challengeUploadsDir, { recursive: true });
}

if (!fs.existsSync(submissionUploadsDir)) {
  fs.mkdirSync(submissionUploadsDir, { recursive: true });
}

// Database simulation (in a real app, use MongoDB, MySQL, etc.)
const users = [
  {
    id: 1,
    username: 'teacher1',
    password: '$2a$10$XFE.rRLn3IQT5R5rvpJ2B.zKlN7r0CdDJ1XBt4NLLAw1qkZuFzXZO', // password123
    role: 'teacher',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Computer Science'
  },
  {
    id: 2,
    username: 'student1',
    password: '$2a$10$XFE.rRLn3IQT5R5rvpJ2B.zKlN7r0CdDJ1XBt4NLLAw1qkZuFzXZO', // password123
    role: 'student',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    class: 'CS-101',
    semester: 3
  }
];

// Challenge data
const challengeData = [
  {
    id: 1,
    title: "HTML5 Basics",
    question: "Which element is used to get highlighted text in HTML5?",
    description: "Choose the correct HTML5 tag that is specifically designed to highlight text in a document.",
    difficulty: "easy",
    createdBy: 1, // teacher ID
    createdAt: new Date('2023-05-10'),
    dueDate: new Date('2023-05-17'),
    options: [
      { id: 'u', text: "Underline Tag" },
      { id: 'mark', text: "Mark Tag" },
      { id: 'highlight', text: "Highlight Tag" }
    ],
    correctAnswer: 'mark',
    imageUrl: null,
    class: 'CS-101',
    semester: 3
  },
  {
    id: 2,
    title: "CSS Selectors",
    question: "How do you select an element with id='header' in CSS?",
    description: "Identify the correct CSS selector syntax for targeting an element by its ID.",
    difficulty: "easy",
    createdBy: 1,
    createdAt: new Date('2023-05-12'),
    dueDate: new Date('2023-05-19'),
    options: [
      { id: 'a', text: "#header" },
      { id: 'b', text: ".header" },
      { id: 'c', text: "header" }
    ],
    correctAnswer: 'a',
    imageUrl: null,
    class: 'CS-101',
    semester: 3
  },
  {
    id: 3,
    title: "Git Commands",
    question: "What does 'git push origin main' do?",
    description: "Explain the purpose and effect of the git command 'git push origin main'.",
    difficulty: "medium",
    createdBy: 1,
    createdAt: new Date('2023-05-15'),
    dueDate: new Date('2023-05-22'),
    options: [
      { id: 'a', text: "Clones the repository" },
      { id: 'b', text: "Uploads your local changes to the main branch" },
      { id: 'c', text: "Creates a new branch" }
    ],
    correctAnswer: 'b',
    imageUrl: null,
    class: 'CS-101',
    semester: 3
  }
];

// Submissions data
const submissions = [
  {
    id: 1,
    challengeId: 1,
    userId: 2,
    answer: 'mark',
    isCorrect: true,
    submittedAt: new Date('2023-05-15T10:30:00'),
    timeSpent: 120, // seconds
    imageUrl: null
  },
  {
    id: 2,
    challengeId: 2,
    userId: 2,
    answer: 'a',
    isCorrect: true,
    submittedAt: new Date('2023-05-16T14:20:00'),
    timeSpent: 90,
    imageUrl: null
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

// A simple API endpoint for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Daily Coding Challenge API!');
});

// Image upload endpoints
// Upload challenge image (teacher only)
app.post('/api/upload/challenge', authenticateToken, authorize(['teacher']), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // In a real app, you would update the challenge in the database with the image URL
    res.status(200).json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Challenge image uploaded successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload submission image/file (student only)
app.post('/api/upload/submission', authenticateToken, authorize(['student']), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    const { challengeId } = req.body;
    
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    // In a real app, you would update the submission in the database with the file URL
    res.status(200).json({ 
      success: true, 
      fileUrl: fileUrl,
      message: 'Submission file uploaded successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { username, password } = req.body;
  
  // Find user
  const user = users.find(u => u.username === username);
  console.log('User found:', user ? 'Yes' : 'No');
  if (!user) return res.status(400).json({ message: 'Invalid username or password' });
  
  try {
    // For demo purposes, directly check if password is 'password123'
    const validPassword = (password === 'password123');
    console.log('Password valid:', validPassword ? 'Yes' : 'No');
    if (!validPassword) return res.status(400).json({ message: 'Invalid username or password' });
  } catch (error) {
    console.error('Password validation error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
  
  // Create and assign token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      ...(user.role === 'student' ? { class: user.class, semester: user.semester } : { department: user.department })
    }
  });
});

// User routes
app.get('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Challenge routes
app.get('/api/challenges', authenticateToken, (req, res) => {
  const { class: className, semester, difficulty } = req.query;
  
  let filteredChallenges = [...challengeData];
  
  if (className) {
    filteredChallenges = filteredChallenges.filter(c => c.class === className);
  }
  
  if (semester) {
    filteredChallenges = filteredChallenges.filter(c => c.semester === parseInt(semester));
  }
  
  if (difficulty) {
    filteredChallenges = filteredChallenges.filter(c => c.difficulty === difficulty);
  }
  
  // If student, only return challenges for their class and semester
  if (req.user.role === 'student') {
    const student = users.find(u => u.id === req.user.id);
    filteredChallenges = filteredChallenges.filter(c => 
      c.class === student.class && c.semester === student.semester
    );
  }
  
  res.json(filteredChallenges);
});

app.get('/api/challenges/:id', authenticateToken, (req, res) => {
  const challenge = challengeData.find(c => c.id === parseInt(req.params.id));
  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
  
  // If student, check if challenge is for their class and semester
  if (req.user.role === 'student') {
    const student = users.find(u => u.id === req.user.id);
    if (challenge.class !== student.class || challenge.semester !== student.semester) {
      return res.status(403).json({ message: 'You do not have access to this challenge' });
    }
  }
  
  res.json(challenge);
});

app.post('/api/challenges', authenticateToken, authorize(['teacher']), upload.single('image'), (req, res) => {
  const { title, question, description, difficulty, options, correctAnswer, dueDate, class: className, semester } = req.body;
  
  const newChallenge = {
    id: challengeData.length + 1,
    title,
    question,
    description,
    difficulty,
    createdBy: req.user.id,
    createdAt: new Date(),
    dueDate: new Date(dueDate),
    options: JSON.parse(options),
    correctAnswer,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    class: className,
    semester: parseInt(semester)
  };
  
  challengeData.push(newChallenge);
  res.status(201).json(newChallenge);
});

// Submission routes
app.post('/api/submissions', authenticateToken, authorize(['student']), upload.single('image'), (req, res) => {
  const { challengeId, answer, timeSpent } = req.body;
  
  const challenge = challengeData.find(c => c.id === parseInt(challengeId));
  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
  
  const isCorrect = answer === challenge.correctAnswer;
  
  const newSubmission = {
    id: submissions.length + 1,
    challengeId: parseInt(challengeId),
    userId: req.user.id,
    answer,
    isCorrect,
    submittedAt: new Date(),
    timeSpent: parseInt(timeSpent),
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null
  };
  
  submissions.push(newSubmission);
  res.status(201).json(newSubmission);
});

app.get('/api/submissions', authenticateToken, (req, res) => {
  let filteredSubmissions = [...submissions];
  
  // If teacher, can filter by class, semester, student
  if (req.user.role === 'teacher') {
    const { class: className, semester, userId } = req.query;
    
    if (className || semester) {
      const challengeIds = challengeData
        .filter(c => 
          (!className || c.class === className) && 
          (!semester || c.semester === parseInt(semester))
        )
        .map(c => c.id);
      
      filteredSubmissions = filteredSubmissions.filter(s => 
        challengeIds.includes(s.challengeId)
      );
    }
    
    if (userId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.userId === parseInt(userId));
    }
  } else {
    // If student, only return their own submissions
    filteredSubmissions = filteredSubmissions.filter(s => s.userId === req.user.id);
  }
  
  // Enrich submissions with challenge and user data
  const enrichedSubmissions = filteredSubmissions.map(submission => {
    const challenge = challengeData.find(c => c.id === submission.challengeId);
    const user = users.find(u => u.id === submission.userId);
    
    return {
      ...submission,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        question: challenge.question
      },
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        ...(user.role === 'student' ? { class: user.class, semester: user.semester } : {})
      }
    };
  });
  
  res.json(enrichedSubmissions);
});

// Leaderboard route
app.get('/api/leaderboard', authenticateToken, (req, res) => {
  const { class: className, semester } = req.query;
  
  // Get all student users
  const studentUsers = users.filter(u => u.role === 'student');
  
  // Filter students by class and semester if provided
  const filteredStudents = studentUsers.filter(student => 
    (!className || student.class === className) && 
    (!semester || student.semester === parseInt(semester))
  );
  
  // Calculate stats for each student
  const leaderboard = filteredStudents.map(student => {
    const studentSubmissions = submissions.filter(s => s.userId === student.id);
    const totalSubmissions = studentSubmissions.length;
    const correctSubmissions = studentSubmissions.filter(s => s.isCorrect).length;
    const accuracy = totalSubmissions > 0 ? (correctSubmissions / totalSubmissions) * 100 : 0;
    const averageTime = totalSubmissions > 0 
      ? studentSubmissions.reduce((sum, s) => sum + s.timeSpent, 0) / totalSubmissions 
      : 0;
    
    return {
      id: student.id,
      name: student.name,
      username: student.username,
      class: student.class,
      semester: student.semester,
      totalSubmissions,
      correctSubmissions,
      accuracy,
      averageTime,
      score: correctSubmissions * 10 - (averageTime / 10) // Simple scoring formula
    };
  });
  
  // Sort by score (descending)
  leaderboard.sort((a, b) => b.score - a.score);
  
  res.json(leaderboard);
});

// Question bank route
app.get('/api/question-bank', authenticateToken, (req, res) => {
  // For students, return past challenges (due date has passed)
  if (req.user.role === 'student') {
    const student = users.find(u => u.id === req.user.id);
    const pastChallenges = challengeData.filter(c => 
      c.class === student.class && 
      c.semester === student.semester &&
      new Date(c.dueDate) < new Date()
    );
    
    // Remove correctAnswer from challenges
    const sanitizedChallenges = pastChallenges.map(({ correctAnswer, ...challenge }) => challenge);
    
    return res.json(sanitizedChallenges);
  }
  
  // For teachers, return all challenges
  res.json(challengeData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});