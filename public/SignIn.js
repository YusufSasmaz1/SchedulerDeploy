// Password toggle functionality
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', function() {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  
  // Toggle the eye icon
  const eyeIcon = this.querySelector('i');
  eyeIcon.classList.toggle('fa-eye');
  eyeIcon.classList.toggle('fa-eye-slash');
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Store userId in localStorage
      localStorage.setItem('userId', data.userId);
      window.location.href = 'MonthCalendar.html';
    } else {
      alert('Invalid email or password');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Invalid email or password');
  }
});
