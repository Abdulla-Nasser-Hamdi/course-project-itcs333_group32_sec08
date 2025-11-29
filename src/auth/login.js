const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageContainer = document.getElementById("message-container");


function displayMessage(message, type) {
  const alertType = type === "success" ? "alert-success" : "alert-danger"; // what will be displayed to user based on login data
  messageContainer.innerHTML = `
    <div class="alert ${alertType}" role="alert">
      ${message}
    </div>
  `;
}


function isValidEmail(email) {
  const regex = /\S+@\S+\.\S+/;  // make sure that user input for email is like this : example@example.example
  return regex.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;  // only when password input 8 or longer
}


const loginButton = document.getElementById("login");

async function handleLogin(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!isValidEmail(email)) {
    displayMessage("Invalid email format.", "error");
    return;
  }

  if (!isValidPassword(password)) {
    displayMessage("Password must be at least 8 characters.", "error");
    return;
  }

  loginButton.classList.add("loading");
  loginButton.textContent = "Logging in...";

  try {
    const response = await fetch("api/index.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.success) {
      displayMessage(result.message || "Login failed.", "error");
      return;
    }

    displayMessage("✅ Login successful!", "success");

    setTimeout(() => {
      if (result.user && result.user.is_admin === 1) {
        window.location.href = "../admin/manage_users.html";
      } else {
        window.location.href = "../index.html";
      }
    }, 1200);

  } catch (error) {
    console.error("Error during login:", error);
    displayMessage("Server error. Please try again.", "error");
  } finally {
    loginButton.classList.remove("loading");
    loginButton.textContent = "Log In";
  }
}

function setupLoginForm() {
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

setupLoginForm();
const togglePassword = document.getElementById("togglePassword");
const icon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  
  passwordInput.type = isHidden ? "text" : "password";
  icon.className = isHidden ? "bi bi-eye-slash" : "bi bi-eye";
});