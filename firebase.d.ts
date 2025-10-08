import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export const auth: Auth;
export const db: Firestore;
export const saveUserLevel: (userId: string, level: number) => Promise<void>;
export const getUserLevel: (userId: string) => Promise<number | null>;
export const saveLevelScore: (userId: string, level: number, score: number) => Promise<void>;
export const getLevelScores: (userId: string) => Promise<Record<string, number>>;
export const getUserStats: (userId: string) => Promise<{ totalTimeSeconds: number; bestStreak: number; recentSessions: Array<{ ts: number; mode: 'campaign'|'free'; level?: number|null; score: number; durationSec: number; streak: number }> }>;
export const saveSessionStats: (userId: string, payload: { mode: 'campaign'|'free'; level?: number|null; score: number; durationSec: number; streak: number }) => Promise<void>;
export const resetProgress: (userId: string) => Promise<void>;
