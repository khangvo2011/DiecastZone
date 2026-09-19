const auth = window.FirebaseAuth;

if (!auth) {
<<<<<<< HEAD
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
=======
  throw new Error("Firebase auth has not been loaded.");
}

const messageForAuthError = (error) => {
  const messages = {
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password must contain at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5
  };

  return messages[error.code] || error.message || "Authentication failed.";
};

<<<<<<< HEAD
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
=======
const setStatus = (message, isError = true) => {
  const status = document.getElementById("auth-status");
  if (!status) return;

  status.textContent = message;
  status.className = `mt-4 text-center text-sm ${isError ? "text-red-600" : "text-green-700"}`;
};

const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

<<<<<<< HEAD
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

=======
    try {
      const profile = await auth.loginUser(
        document.getElementById("login-email").value.trim(),
        document.getElementById("login-password").value,
      );

      setStatus("Signed in successfully.", false);
      window.location.href = profile.role === 2 ? "admin1.html" : "home.html";
    } catch (error) {
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5
      setStatus(messageForAuthError(error));
    }
  });
}

<<<<<<< HEAD
// =========================
// Register
// =========================

const registerForm = document.getElementById("form-register");

=======
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

<<<<<<< HEAD
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

=======
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5
      return;
    }

    try {
<<<<<<< HEAD
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
=======
      await auth.registerUser(document.getElementById("reg-email").value.trim(), password);
      setStatus("Account created. You can now sign in.", false);
      registerForm.reset();
      window.toggleView("login");
    } catch (error) {
      setStatus(messageForAuthError(error));
    }
  });
}
>>>>>>> 0322ba8ad2fbddfbf8558bf2f5472efeb7ce56f5
