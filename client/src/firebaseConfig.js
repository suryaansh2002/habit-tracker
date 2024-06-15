import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCosPNw6mySxTFLZpT5RNMRgitLQIRGFcE",
  authDomain: "habit-tracker-test-c0b16.firebaseapp.com",
  projectId: "habit-tracker-test-c0b16",
  storageBucket: "habit-tracker-test-c0b16.appspot.com",
  messagingSenderId: "599688044631",
  appId: "1:599688044631:web:9b58bfb69a3f7101f54312",
  measurementId: "G-7PCFJFX5ML",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider, analytics, logEvent, setUserId, setUserProperties };
