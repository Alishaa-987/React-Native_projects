// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "@firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArPcxS-dbZBOENSxZxvgYWLhrMBt0SGv8",
  authDomain: "expense-tracker-6115b.firebaseapp.com",
  projectId: "expense-tracker-6115b",
  storageBucket: "expense-tracker-6115b.firebasestorage.app",
  messagingSenderId: "752081904020",
  appId: "1:752081904020:web:c6671ac5ca6a5c72bf6f81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const fireStore = getFirestore(app);