import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlA7_HvrpzGqRoAutXznKjFfpF7NJsYKA",
  authDomain: "diecast-zone.firebaseapp.com",
  projectId: "diecast-zone",
  storageBucket: "diecast-zone.firebasestorage.app",
  messagingSenderId: "233089376969",
  appId: "1:233089376969:web:7af3803238d4ebcdb8a318",
  measurementId: "G-62RMCN0VW7",
};
// =========================
// Firebase initialization
// =========================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// =========================
// Get user profile
// =========================

async function getUserProfile(user) {
  if (!user) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "users", user.uid));

  if (snapshot.exists()) {
    return {
      uid: user.uid,
      email: user.email,
      ...snapshot.data(),
    };
  }

  // Nếu user chưa có document trong Firestore
  return {
    uid: user.uid,
    email: user.email,
    role: 1,
  };
}

// =========================
// Register
// =========================

async function registerUser(email, password) {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = credentials.user;

  // Tạo user document trong Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    role: 1,
    createdAt: serverTimestamp(),
  });

  return user;
}

// =========================
// Login
// =========================

async function loginUser(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);

  return getUserProfile(credentials.user);
}

// =========================
// Logout
// =========================

async function logoutUser() {
  await signOut(auth);
}

// =========================
// Global object
// =========================

window.FirebaseAuth = {
  auth,
  db,

  loginUser,
  registerUser,
  getUserProfile,

  signOut: logoutUser,

  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
};

// =========================
// Export
// =========================

export {
  auth,
  db,
  getUserProfile,
  loginUser,
  registerUser,
  logoutUser,
  onAuthStateChanged,
};
