/**
 * BPROTIC SEMPOA - Student & Tutor Types
 * Designed by Agent 7 (Security Lead) & Agent 2 (System Architect)
 */

import { GradeLevel } from './curriculum';

export interface StudentScoreRecord {
  stars: number; // 1, 2, or 3 stars
  accuracy: number; // percentage 0 - 100
  bestTimeSeconds: number;
  completedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string; // Avatar identifier or emoji
  gradeLevel: GradeLevel;
  totalXp: number;
  gems: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  hearts: number; // Max 5, can recharge or be infinite in Tutor Mode
  unlockedNodeIds: string[];
  completedNodeIds: string[];
  nodeScores: Record<string, StudentScoreRecord>;
  weakFormulas: Record<string, number>; // Formula code -> error count
  createdAt: string;
}

export interface TutorConfig {
  pinHash: string; // SHA-256 hashed 4-digit PIN for tutor security
  unlimitedHearts: boolean; // Places of study often prefer infinite hearts during class
  unlockAllLevels: boolean; // Tutor can bypass path lock to teach any topic
  soundEnabled: boolean;
  hapticEnabled: boolean;
  abacusRodCount: number; // 5, 7, 9, 11, or 13 rods
}
