import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
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

// Initialize Firestore (v1)
const db = getFirestore(app);

// Firestore functions for user progress
export const saveUserLevel = async (userId, level) => {
  if (!userId) return;
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    // Get current progress to only update if new level is higher
    const docSnap = await getDoc(userProgressRef);
    if (docSnap.exists()) {
      const currentProgress = docSnap.data();
      if (level > (currentProgress.highestLevelCompleted || 0)) {
        await setDoc(userProgressRef, { highestLevelCompleted: level }, { merge: true });
        console.log("User level progress saved:", userId, level);
      }
    } else {
      // If no document exists, create it
      await setDoc(userProgressRef, { highestLevelCompleted: level });
      console.log("User level progress created and saved:", userId, level);
    }
  } catch (error) {
    console.error("Error saving user level:", error);
  }
};

export const getUserLevel = async (userId) => {
  if (!userId) return null;
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(userProgressRef);
    if (docSnap.exists()) {
      console.log("User level progress loaded:", userId, docSnap.data().highestLevelCompleted);
      return docSnap.data().highestLevelCompleted;
    } else {
      console.log("No progress found for user:", userId);
      return null; // Or a default starting level like 0 or 1
    }
  } catch (error) {
    console.error("Error getting user level:", error);
    return null;
  }
};

// Save per-level best score (max) into a nested map bestScores: { [level: string]: number }
export const saveLevelScore = async (userId, level, score) => {
  if (!userId || !level || typeof score !== 'number') return;
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(userProgressRef);
    const levelKey = String(level);
    if (docSnap.exists()) {
      const data = docSnap.data() || {};
      const currentBestScores = data.bestScores || {};
      const prev = typeof currentBestScores[levelKey] === 'number' ? currentBestScores[levelKey] : -Infinity;
      if (score > prev) {
        const newBestScores = { ...currentBestScores, [levelKey]: score };
        await setDoc(userProgressRef, { bestScores: newBestScores }, { merge: true });
        console.log("Saved new best score", { userId, level, score });
      }
    } else {
      await setDoc(userProgressRef, { bestScores: { [levelKey]: score } }, { merge: true });
      console.log("Created progress doc with best score", { userId, level, score });
    }
  } catch (error) {
    console.error("Error saving level score:", error);
  }
};

// Load all best scores as an object map { [level: string]: number }
export const getLevelScores = async (userId) => {
  if (!userId) return {};
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(userProgressRef);
    if (docSnap.exists()) {
      const data = docSnap.data() || {};
      return data.bestScores || {};
    }
    return {};
  } catch (error) {
    console.error("Error getting level scores:", error);
    return {};
  }
};

// Aggregate stats helpers
// recentSessions: [{ ts: number, mode: 'campaign'|'free', level?: number, score: number, durationSec: number }]
export const getUserStats = async (userId) => {
  if (!userId) return { totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] };
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(userProgressRef);
    if (docSnap.exists()) {
      const data = docSnap.data() || {};
      return {
        totalTimeSeconds: data.totalTimeSeconds || 0,
        bestStreak: data.bestStreak || 0,
        recentSessions: Array.isArray(data.recentSessions) ? data.recentSessions : [],
      };
    }
    return { totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] };
  } catch (e) {
    console.error("Error getting user stats:", e);
    return { totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] };
  }
};

export const saveSessionStats = async (userId, { mode, level, score, durationSec, streak }) => {
  if (!userId) return;
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(userProgressRef);
    const data = docSnap.exists() ? (docSnap.data() || {}) : {};
    const prevTotal = data.totalTimeSeconds || 0;
    const prevBestStreak = data.bestStreak || 0;
    const prevSessions = Array.isArray(data.recentSessions) ? data.recentSessions : [];
    const session = {
      ts: Date.now(),
      mode: mode || 'free',
      level: typeof level === 'number' ? level : null,
      score: typeof score === 'number' ? score : 0,
      durationSec: typeof durationSec === 'number' ? durationSec : 0,
      streak: typeof streak === 'number' ? streak : 0,
    };
    const updated = {
      totalTimeSeconds: prevTotal + session.durationSec,
      bestStreak: Math.max(prevBestStreak, session.streak || 0),
      recentSessions: [session, ...prevSessions].slice(0, 5),
    };
    await setDoc(userProgressRef, updated, { merge: true });
  } catch (e) {
    console.error("Error saving session stats:", e);
  }
};

export const resetProgress = async (userId) => {
  if (!userId) return;
  try {
    const userProgressRef = doc(db, "userProgress", userId);
    await setDoc(userProgressRef, {
      highestLevelCompleted: 1,
      bestScores: {},
      totalTimeSeconds: 0,
      bestStreak: 0,
      recentSessions: [],
    }, { merge: true });
  } catch (e) {
    console.error("Error resetting progress:", e);
  }
};

export { auth, db }; // saveUserLevel, getUserLevel, saveLevelScore, getLevelScores, getUserStats, saveSessionStats, resetProgress are exported individually
