import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDhhbpzbw290uqc0JFqbBZav8bKPZCuTo8',
  authDomain: 'viso-test-task-e1a5c.firebaseapp.com',
  projectId: 'viso-test-task-e1a5c',
  storageBucket: 'viso-test-task-e1a5c.appspot.com',
  messagingSenderId: '254855654009',
  appId: '1:254855654009:web:0e89a09d934adbfd8242a8',
  measurementId: 'G-824SE11PXZ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
