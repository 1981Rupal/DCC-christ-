const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
const corsOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['https://daily-coding-challenge.onrender.com'])
  : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:8080'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
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
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }, // 5MB default
  fileFilter: function (req, file, cb) {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES || 'jpeg,jpg,png,gif,pdf';
    const filetypes = new RegExp(allowedTypes.replace(/,/g, '|'));
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File type not allowed!"));
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

// Submissions data - Initialize with sample data
let submissions = [
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

// Additional data structures for comprehensive functionality
let questionBank = [
  {
    id: 1,
    title: 'Two Sum Problem',
    difficulty: 'easy',
    topic: 'arrays',
    description: 'Find two numbers in an array that add up to a target sum',
    question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    starterCode: 'function twoSum(nums, target) {\n    // Your code here\n}',
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
      { input: '[3,3], 6', expected: '[0,1]' }
    ],
    createdBy: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Reverse Linked List',
    difficulty: 'medium',
    topic: 'data-structures',
    description: 'Reverse a singly linked list iteratively and recursively',
    question: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    starterCode: 'function reverseList(head) {\n    // Your code here\n}',
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { input: '[1,2]', expected: '[2,1]' },
      { input: '[]', expected: '[]' }
    ],
    createdBy: 1,
    createdAt: new Date().toISOString()
  }
];

let studentProgress = [];
let leaderboardData = [
  { rank: 1, studentId: 2, name: 'Jane Smith', score: 2680, change: 0 },
  { rank: 2, studentId: 3, name: 'Alex Johnson', score: 2450, change: 1 }
];

let analyticsData = {
  classPerformance: {
    average: 82,
    trend: 5,
    distribution: { excellent: 8, good: 12, average: 15, needsImprovement: 5 }
  },
  engagement: {
    rate: 87,
    trend: 3
  },
  completion: {
    rate: 78,
    trend: 8
  }
};

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

// Serve the login page as the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Daily Coding Challenge API is running!' });
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

// Add missing sample data and fix endpoints
const sampleStudents = [
    { id: 1, name: 'John Doe', email: 'john@example.com', class: 'CS101', semester: 1, completedChallenges: 5, averageScore: 85 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', class: 'CS101', semester: 1, completedChallenges: 3, averageScore: 92 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', class: 'CS102', semester: 2, completedChallenges: 7, averageScore: 78 }
];

// Students endpoint
app.get('/api/students', authenticateToken, authorize(['teacher']), (req, res) => {
    res.json(sampleStudents);
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', authenticateToken, authorize(['teacher']), (req, res) => {
    const stats = {
        totalChallenges: challengeData.length,
        totalStudents: sampleStudents.length,
        averageScore: 85,
        pendingReviews: 3
    };
    res.json(stats);
});

// ===== COMPREHENSIVE API ENDPOINTS FOR REAL-TIME DATA MANAGEMENT =====

// Student Progress API
app.get('/api/student/progress/:studentId', authenticateToken, (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const progress = studentProgress.filter(p => p.studentId === studentId);

    const progressSummary = {
        totalChallenges: progress.length,
        averageScore: progress.length > 0 ? Math.round(progress.reduce((sum, p) => sum + (p.score / p.maxScore * 100), 0) / progress.length) : 0,
        totalTimeSpent: progress.reduce((sum, p) => sum + p.timeSpent, 0),
        recentProgress: progress.slice(-10).map(p => ({
            challengeId: p.challengeId,
            score: p.score,
            maxScore: p.maxScore,
            percentage: Math.round((p.score / p.maxScore) * 100),
            completedAt: p.completedAt
        }))
    };

    res.json(progressSummary);
});

// Leaderboard API
app.get('/api/leaderboard', authenticateToken, (req, res) => {
    const { period = 'week', class: classFilter = 'all' } = req.query;

    // Mock filtering logic based on period and class
    let filteredLeaderboard = [...leaderboardData];

    if (period === 'month') {
        filteredLeaderboard = filteredLeaderboard.map(entry => ({
            ...entry,
            score: Math.round(entry.score * 1.2)
        }));
    } else if (period === 'semester') {
        filteredLeaderboard = filteredLeaderboard.map(entry => ({
            ...entry,
            score: Math.round(entry.score * 2.5)
        }));
    }

    // Sort by score and update ranks
    filteredLeaderboard.sort((a, b) => b.score - a.score);
    filteredLeaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    res.json(filteredLeaderboard);
});

// Analytics API for Teachers
app.get('/api/analytics/comprehensive', authenticateToken, authorize(['teacher']), (req, res) => {
    const { period = 'week', class: classFilter = 'all' } = req.query;

    // Generate comprehensive analytics
    const analytics = {
        classPerformance: {
            average: 82 + Math.round(Math.random() * 10),
            trend: Math.round((Math.random() - 0.5) * 20),
            distribution: {
                excellent: 8 + Math.round(Math.random() * 5),
                good: 12 + Math.round(Math.random() * 8),
                average: 15 + Math.round(Math.random() * 10),
                needsImprovement: 5 + Math.round(Math.random() * 5)
            }
        },
        engagement: {
            rate: 85 + Math.round(Math.random() * 10),
            trend: Math.round((Math.random() - 0.5) * 10),
            weeklyActivity: [3, 5, 2, 4, 6, 1, 2]
        },
        completion: {
            rate: 78 + Math.round(Math.random() * 15),
            trend: Math.round(Math.random() * 10),
            averageTime: `${25 + Math.round(Math.random() * 20)}min`
        },
        topPerformers: leaderboardData.slice(0, 5).map((student, index) => ({
            name: student.name,
            score: student.score,
            rank: index + 1
        })),
        challengePerformance: challengeData.slice(0, 5).map(challenge => ({
            name: challenge.title,
            attempts: Math.round(20 + Math.random() * 30),
            successRate: Math.round(60 + Math.random() * 35),
            avgScore: Math.round(70 + Math.random() * 25),
            difficulty: challenge.difficulty
        })),
        insights: [
            {
                type: 'success',
                icon: 'fa-chart-line',
                title: 'Strong Progress in Arrays',
                description: 'Students are showing 23% improvement in array-based challenges this month.',
                action: 'view_array_progress',
                actionText: 'View Details'
            },
            {
                type: 'warning',
                icon: 'fa-exclamation-triangle',
                title: 'Struggling with Recursion',
                description: '40% of students need additional support with recursive algorithms.',
                action: 'create_recursion_help',
                actionText: 'Create Help Session'
            }
        ]
    };

    res.json(analytics);
});

// Question Bank API
app.get('/api/questions', authenticateToken, (req, res) => {
    const { difficulty, topic, search } = req.query;

    let filteredQuestions = [...questionBank];

    if (difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    if (topic) {
        filteredQuestions = filteredQuestions.filter(q => q.topic === topic);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredQuestions = filteredQuestions.filter(q =>
            q.title.toLowerCase().includes(searchLower) ||
            q.description.toLowerCase().includes(searchLower)
        );
    }

    res.json(filteredQuestions);
});

// Add new question to bank
app.post('/api/questions', authenticateToken, authorize(['teacher']), (req, res) => {
    const { title, difficulty, topic, description, question, starterCode, testCases } = req.body;

    const newQuestion = {
        id: questionBank.length + 1,
        title,
        difficulty,
        topic,
        description,
        question,
        starterCode,
        testCases,
        createdBy: req.user.id,
        createdAt: new Date().toISOString()
    };

    questionBank.push(newQuestion);
    res.status(201).json(newQuestion);
});

// Student Challenge Submission API
app.post('/api/challenges/:challengeId/submit', authenticateToken, authorize(['student']), (req, res) => {
    const challengeId = parseInt(req.params.challengeId);
    const { answers, timeSpent } = req.body;

    // Find the challenge
    const challenge = challengeData.find(c => c.id === challengeId);
    if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
    }

    // Calculate score (simplified scoring)
    let totalScore = 0;
    let maxScore = 100; // Default max score

    // Mock scoring logic
    if (answers && Object.keys(answers).length > 0) {
        totalScore = Math.round(60 + Math.random() * 40); // Random score between 60-100
    }

    // Create submission record
    const submission = {
        id: submissions.length + 1,
        studentId: req.user.id,
        challengeId,
        answers,
        score: totalScore,
        maxScore,
        timeSpent: timeSpent || 0,
        submittedAt: new Date().toISOString()
    };

    submissions.push(submission);

    // Update student progress
    const progressEntry = {
        studentId: req.user.id,
        challengeId,
        score: totalScore,
        maxScore,
        timeSpent: timeSpent || 0,
        completedAt: new Date().toISOString(),
        answers
    };

    studentProgress.push(progressEntry);

    res.status(201).json({
        submissionId: submission.id,
        score: totalScore,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        message: 'Challenge submitted successfully!'
    });
});

// Real-time updates endpoint (Server-Sent Events)
app.get('/api/realtime/updates', authenticateToken, (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });

    // Send initial data
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Real-time updates connected' })}\n\n`);

    // Send periodic updates (every 30 seconds)
    const interval = setInterval(() => {
        const update = {
            type: 'stats_update',
            data: {
                timestamp: new Date().toISOString(),
                activeUsers: Math.round(10 + Math.random() * 20),
                recentSubmissions: Math.round(Math.random() * 5),
                leaderboardChanges: Math.round(Math.random() * 3)
            }
        };
        res.write(`data: ${JSON.stringify(update)}\n\n`);
    }, 30000);

    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(interval);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Real-time data management APIs are active`);
});
