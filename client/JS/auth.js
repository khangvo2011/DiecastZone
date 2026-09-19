const auth = window.FirebaseAuth;

if (!auth) {
  throw new Error("Firebase Auth has not been loaded.");
}

// =========================
// Firebase error messages
// =========================

const messageForAuthError = (error) => {
  const messages = {
    "auth/invalid-credential": "Email or password is incorrect.",

    "auth/email-already-in-use": "This email is already registered.",

    "auth/weak-password": "Password must contain at least 6 characters.",

    "auth/invalid-email": "Please enter a valid email address.",

    "auth/user-not-found": "Account not found.",

    "auth/wrong-password": "Email or password is incorrect.",

    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };

  return messages[error.code] || error.message || "Authentication failed.";
};

// =========================
// Status message
// =========================

const setStatus = (message, isError = true) => {
  const status = document.getElementById("auth-status");

  if (!status) {
    return;
  }

  status.textContent = message;

  status.className = `mt-4 text-center text-sm ${
    isError ? "text-red-600" : "text-green-700"
  }`;
};

// =========================
// Login
// =========================

const loginForm = document.getElementById("form-login");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();

    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      setStatus("Please enter your email and password.");

      return;
    }

    try {
      const profile = await auth.loginUser(email, password);

      setStatus("Signed in successfully.", false);

      // =========================
      // Redirect
      // =========================

      if (profile.role === 2) {
        window.location.href = "admin1.html";
      } else {
        window.location.href = "home.html";
      }
    } catch (error) {
      console.error(error)

      setStatus(messageForAuthError(error));
    }
  });
}

// =========================
// Register
// =========================

const registerForm = document.getElementById("form-register");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("reg-email").value.trim();

    const password = document.getElementById("reg-password").value;

    const confirmPassword = document.getElementById(
      "reg-confirm-password",
    ).value;

    // =========================
    // Validate
    // =========================

    if (!email || !password || !confirmPassword) {
      setStatus("Please fill in all fields.");

      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");

      return;
    }

    if (password.length < 6) {
      setStatus("Password must contain at least 6 characters.");

      return;
    }

    try {
      await auth.registerUser(email, password);

      setStatus("Account created. You can now sign in.", false);

      registerForm.reset();

      // Chuyển về Login
      if (window.toggleView) {
        window.toggleView("login");
      }
    } catch (error) {
      console.error("Register error:", error);

      setStatus(messageForAuthError(error));
    }
  });
}
