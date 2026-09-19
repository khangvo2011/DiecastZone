const auth = window.FirebaseAuth;

if (!auth) {
  throw new Error("Firebase auth has not been loaded.");
}

const messageForAuthError = (error) => {
  const messages = {
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password": "Password must contain at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
  };

  return messages[error.code] || error.message || "Authentication failed.";
};

const setStatus = (message, isError = true) => {
  const status = document.getElementById("auth-status");
  if (!status) return;

  status.textContent = message;
  status.className = `mt-4 text-center text-sm ${isError ? "text-red-600" : "text-green-700"}`;
};

const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const profile = await auth.loginUser(
        document.getElementById("login-email").value.trim(),
        document.getElementById("login-password").value,
      );

      setStatus("Signed in successfully.", false);
      window.location.href = profile.role === 2 ? "admin1.html" : "home.html";
    } catch (error) {
      setStatus(messageForAuthError(error));
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    try {
      await auth.registerUser(document.getElementById("reg-email").value.trim(), password);
      setStatus("Account created. You can now sign in.", false);
      registerForm.reset();
      window.toggleView("login");
    } catch (error) {
      setStatus(messageForAuthError(error));
    }
  });
}