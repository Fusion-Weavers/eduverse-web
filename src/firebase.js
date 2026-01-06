import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwqq-7fryFWA1N1yr1axgzdU4lJ-kt65s",
  authDomain: "eduverse-71620.firebaseapp.com",
  projectId: "eduverse-71620",
  storageBucket: "eduverse-71620.firebasestorage.app",
  messagingSenderId: "176189402492",
  appId: "1:176189402492:web:bf34e2a366549e4fb448f9"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
