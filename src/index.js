import { createRoot } from "react-dom/client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARq-AFwKAE-QOEitQn2WTs1mXJWx6ljJY",
  authDomain: "notegpt2023.firebaseapp.com",
  projectId: "notegpt2023",
  storageBucket: "notegpt2023.appspot.com",
  messagingSenderId: "637628451779",
  appId: "1:637628451779:web:bd91c23eef398bc88ecb76",
  measurementId: "G-L0KY3HKHY8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
