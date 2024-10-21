// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { /* connectFirestoreEmulator, */ getFirestore } from 'firebase/firestore';
import { /* connectStorageEmulator, */ getStorage } from 'firebase/storage';
// import { isDev } from '../isDev';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBRw8FkdHx21_AEKDVg5gJjp3oHZCugSpg',
    authDomain: 'miniextensions-test.firebaseapp.com',
    projectId: 'miniextensions-test',
    storageBucket: 'miniextensions-test.appspot.com',
    messagingSenderId: '865757186970',
    appId: '1:865757186970:web:72e869bce5a745b156c823',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const baseBucketName = 'miniextensions-test.appspot.com';

/* if (isDev) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
} */
