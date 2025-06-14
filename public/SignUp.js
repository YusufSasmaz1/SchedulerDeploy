//initalize variables
const form = document.querySelector('.form');
const togglePassword = document.getElementById("togglePassword");
const togglePasswordConfirm = document.getElementById("togglePasswordConfirm");
const passwordInput = document.getElementById("password");
const passwordConfirmInput = document.getElementById("passwordConfirm");

// Form submission for sign up
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    const cpassword = passwordConfirmInput.value;
    const errorElement = document.getElementById("errorPassword");
    errorElement.style.color = "red";
    errorElement.style.fontSize = "14px";
    errorElement.style.fontFamily = "Poppins, sans-serif";
    errorElement.textContent = "";
    // Email and password validation
    if (!email.includes("@")) {
        errorElement.textContent = "Please enter a valid email";
        return;
    } 
    if (password !== cpassword) {
        errorElement.textContent = "Passwords do not match";
        return;
    }
    if (password.length < 8) {
        errorElement.textContent = "Minimum 8 character password";
        return;
    }
    // Send user data to server
    const userData = { firstName, lastName, email, password };
    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/signin';
        } else {
            return response.text().then(text => {
                errorElement.textContent = text || "Signup failed";
            });
        }
    })
    .catch(() => {
        errorElement.textContent = "Network error, please try again";
    });
});

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const icon = togglePassword.querySelector("i");
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});

// Toggle confirm password visibility
togglePasswordConfirm.addEventListener('click', function() {
    const icon = togglePasswordConfirm.querySelector("i");
    const isPasswordConfirm = passwordConfirmInput.type === "password";
    passwordConfirmInput.type = isPasswordConfirm ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});
