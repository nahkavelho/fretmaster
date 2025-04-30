import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDLwqN9uh7GjphPqB0H4eGp5Yh5C8Twfbs",
  authDomain: "fretboarder-1871e.firebaseapp.com",
  projectId: "fretboarder-1871e",
  storageBucket: "fretboarder-1871e.appspot.com",
  messagingSenderId: "650240327074",
  appId: "1:650240327074:web:9404dee67e9cf8de97c6fb"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

export { auth };
