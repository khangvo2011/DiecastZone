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
  apiKey: "AIzaSyAxWhc-0Ex2ubRKKjwUK6oOBj2Vj_syZDM",
  authDomain: "coffee-managenments-project.firebaseapp.com",
  projectId: "coffee-managenments-project",
  storageBucket: "coffee-managenments-project.firebasestorage.app",
  messagingSenderId: "141430650964",
  appId: "1:141430650964:web:fdf37b178ef4291cc2d5c1",
  measurementId: "G-6D5FPV873L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getUserProfile(user) {
  if (!user) return null;

  const snapshot = await getDoc(doc(db, "users", user.uid));
  return {
    uid: user.uid,
    email: user.email,
    ...(snapshot.exists() ? snapshot.data() : { role: 1 }),
  };
}

async function registerUser(email, password) {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await setDoc(doc(db, "users", credentials.user.uid), {
    uid: credentials.user.uid,
    email: credentials.user.email,
    role: 1,
    createdAt: serverTimestamp(),
  });
  return credentials.user;
}

async function loginUser(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(credentials.user);
}

async function logoutUser() {
  await signOut(auth);
}

window.FirebaseAuth = {
  auth,
  db,
  loginUser,
  registerUser,
  getUserProfile,
  signOut: logoutUser,
  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
};

export {
  auth,
  db,
  getUserProfile,
  loginUser,
  registerUser,
  logoutUser,
  onAuthStateChanged,
};
