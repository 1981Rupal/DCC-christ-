document.addEventListener('DOMContentLoaded', function() {
    // Role selection
    const studentRoleBtn = document.getElementById('student-role');
    const teacherRoleBtn = document.getElementById('teacher-role');
    let currentRole = 'student';

    studentRoleBtn.addEventListener('click', function() {
        setActiveRole('student');
    });

    teacherRoleBtn.addEventListener('click', function() {
        setActiveRole('teacher');
    });

    function setActiveRole(role) {
        currentRole = role;
        if (role === 'student') {
            studentRoleBtn.classList.add('active');
            teacherRoleBtn.classList.remove('active');
        } else {
            teacherRoleBtn.classList.add('active');
            studentRoleBtn.classList.remove('active');
        }
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const loadingSpinner = document.getElementById('loading-spinner');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Show loading spinner
        loadingSpinner.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Simulate API call with setTimeout
        setTimeout(function() {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            
            // Validate credentials
            if (currentRole === 'student') {
                if (username === 'student1' && password === 'password123') {
                    // Store user info in localStorage
                    const user = {
                        id: 1,
                        username: username,
                        role: 'student',
                        email: 'student1@example.com'
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // Redirect to student dashboard
                    window.location.href = 'student-dashboard.html';
                } else {
                    showError('Invalid student credentials');
                }
            } else {
                if (username === 'teacher1' && password === 'password123') {
                    // Store user info in localStorage
                    const user = {
                        id: 1,
                        username: username,
                        role: 'teacher',
                        email: 'teacher1@example.com'
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // Redirect to teacher dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    showError('Invalid teacher credentials');
                }
            }
        }, 1000);
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Check if user is already logged in
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        if (user.role === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'dashboard.html';
        }
    }
});