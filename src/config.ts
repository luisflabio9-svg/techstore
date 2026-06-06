import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACMVzOco8kXqtVKnFHcPQZF8vTodkj68o",
  authDomain: "electronicosjapon-58fdb.firebaseapp.com",
  projectId: "electronicosjapon-58fdb",
  storageBucket: "electronicosjapon-58fdb.firebasestorage.app",
  messagingSenderId: "943854900016",
  appId: "1:943854900016:web:6295cc21ff63868b53eef5",
  measurementId: "G-1FMBZ6NWS6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
