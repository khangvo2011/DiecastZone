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
  apiKey: "AIzaSyCRWKLBOm5orqDnBaj_2iI1BVvv83Lh2Jk",
  authDomain: "fir-853e2.firebaseapp.com",
  projectId: "fir-853e2",
  storageBucket: "fir-853e2.firebasestorage.app",
  messagingSenderId: "366241259082",
  appId: "1:366241259082:web:3400fecdd3f6df58dad0b3",
  measurementId: "G-H8KNV1DS4Q"
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
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", credentials.user.uid), {
    email,
    role: 1,
    createdAt: serverTimestamp(),
  });
  return credentials.user;
}

async function loginUser(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(credentials.user);
}

window.FirebaseAuth = {
  auth,
  db,
  loginUser,
  registerUser,
  getUserProfile,
  signOut: () => signOut(auth),
  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
};

export {
  auth,
  db,
  getUserProfile,
  loginUser,
  registerUser,
  signOut,
  onAuthStateChanged,
};
