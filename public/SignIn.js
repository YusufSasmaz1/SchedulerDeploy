const form = document.querySelector('.form');
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    //Check for valid email password
    .then(response => {
        if (response.ok) {
            alert("Login successful!");
             window.location.href = "/MonthCalendar.html"; //  redirect
        } else {
            alert("Invalid email or password");
        }
    })
    .catch(error => {
        console.error("Error logging in:", error);
    });
});

//Hide/show password 
togglePassword.addEventListener('click', function () {
    const icon = togglePassword.querySelector("i");
    const isPassword1 = passwordInput.type === "password";

    passwordInput.type = isPassword1 ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});
