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
