import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBQYs1txpvRQVQB9J4tfqSIDG0Zfk6Ndw",
  authDomain: "student-assessment-syste-4c102.firebaseapp.com",
  projectId: "student-assessment-syste-4c102",
  storageBucket: "student-assessment-syste-4c102.firebasestorage.app",
  messagingSenderId: "129261860490",
  appId: "1:129261860490:web:44ede117864fb3ec74df73",
  measurementId: "G-S5SXR0CKNT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

