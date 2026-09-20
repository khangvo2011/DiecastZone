const auth = window.FirebaseAuth;

if (!auth) {
  throw new Error("Firebase Auth has not been loaded.");
}

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

const setStatus = (message, isError = true) => {
  const status = document.getElementById("auth-status");
  if (!status) return;

  status.textContent = message;
  status.className = `mt-4 text-center text-sm ${isError ? "text-red-600" : "text-green-700"}`;
};

const loginForm = document.getElementById("form-login");
const registerForm = document.getElementById("form-register");
const loginPanel = document.getElementById("login-panel");
const registerPanel = document.getElementById("register-panel");
const loginTab = document.getElementById("btn-login");
const registerTab = document.getElementById("btn-register");

const showAuthPanel = (panel) => {
  const isRegister = panel === "register";

  loginPanel?.classList.toggle("hidden-panel", isRegister);
  registerPanel?.classList.toggle("hidden-panel", !isRegister);
  loginTab?.classList.toggle("text-primary", !isRegister);
  loginTab?.classList.toggle("border-primary", !isRegister);
  loginTab?.classList.toggle("border-transparent", isRegister);
  loginTab?.classList.toggle("text-secondary", isRegister);
  registerTab?.classList.toggle("text-primary", isRegister);
  registerTab?.classList.toggle("border-primary", isRegister);
  registerTab?.classList.toggle("border-transparent", !isRegister);
  registerTab?.classList.toggle("text-secondary", !isRegister);
};

window.showAuthPanel = showAuthPanel;

loginTab?.addEventListener("click", () => showAuthPanel("login"));
registerTab?.addEventListener("click", () => showAuthPanel("register"));

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
      window.location.href = profile.role === 2 ? "admin1.html" : "home.html";
    } catch (error) {
      console.error("Login error:", error);
      setStatus(messageForAuthError(error));
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;

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
      showAuthPanel("login");
    } catch (error) {
      console.error("Register error:", error);
      setStatus(messageForAuthError(error));
    }
  });
}
