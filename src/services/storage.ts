/**
 * BPROTIC SEMPOA - Offline Local Storage Service
 * Designed by Agent 7 (Security Lead) & Agent 2 (System Architect)
 * 100% Offline-First persistence using AsyncStorage with validation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentProfile, TutorConfig } from '@/types/student';
import { hashPin, sanitizeStudentName } from './security';

const STORAGE_KEYS = {
  PROFILES: '@bprotic_sempoa_students_v1',
  ACTIVE_PROFILE_ID: '@bprotic_sempoa_active_student_id_v1',
  TUTOR_CONFIG: '@bprotic_sempoa_tutor_config_v1',
};

// Default Tutor Config (Default PIN: 1234)
export const DEFAULT_TUTOR_CONFIG: TutorConfig = {
  pinHash: hashPin('1234'),
  unlimitedHearts: true, // Tutoring centers prefer unlimited hearts so students can keep practicing
  unlockAllLevels: false,
  soundEnabled: true,
  hapticEnabled: true,
  abacusRodCount: 5,
};

// Seed default students for classroom testing
export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student_1',
    name: 'Kenzo (SD 2)',
    avatar: '🦁',
    gradeLevel: 'sd_rendah',
    totalXp: 145,
    gems: 35,
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    hearts: 5,
    unlockedNodeIds: ['node_1_1', 'node_1_2', 'node_1_chest', 'node_1_boss', 'node_2_1'],
    completedNodeIds: ['node_1_1', 'node_1_2', 'node_1_chest'],
    nodeScores: {
      node_1_1: { stars: 3, accuracy: 100, bestTimeSeconds: 42, completedAt: new Date().toISOString() },
      node_1_2: { stars: 3, accuracy: 100, bestTimeSeconds: 50, completedAt: new Date().toISOString() },
    },
    weakFormulas: { 'DIRECT_5_9': 1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student_2',
    name: 'Nayla (SD 4)',
    avatar: '🐰',
    gradeLevel: 'sd_tinggi',
    totalXp: 380,
    gems: 90,
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    hearts: 5,
    unlockedNodeIds: ['node_1_1', 'node_1_2', 'node_1_chest', 'node_1_boss', 'node_2_1', 'node_2_2', 'node_2_boss', 'node_3_1'],
    completedNodeIds: ['node_1_1', 'node_1_2', 'node_1_chest', 'node_1_boss', 'node_2_1', 'node_2_2', 'node_2_boss'],
    nodeScores: {
      node_1_1: { stars: 3, accuracy: 100, bestTimeSeconds: 30, completedAt: new Date().toISOString() },
      node_2_1: { stars: 3, accuracy: 95, bestTimeSeconds: 45, completedAt: new Date().toISOString() },
      node_2_2: { stars: 2, accuracy: 80, bestTimeSeconds: 65, completedAt: new Date().toISOString() },
    },
    weakFormulas: { 'KK+3_+2': 3 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student_3',
    name: 'Rafi (SMP 2)',
    avatar: '🦅',
    gradeLevel: 'smp',
    totalXp: 620,
    gems: 150,
    streakDays: 12,
    lastActiveDate: new Date().toISOString().split('T')[0],
    hearts: 5,
    unlockedNodeIds: ['node_1_1', 'node_2_1', 'node_3_1', 'node_4_1', 'node_5_1'],
    completedNodeIds: ['node_1_1', 'node_2_1', 'node_3_1', 'node_4_1'],
    nodeScores: {
      node_4_1: { stars: 3, accuracy: 100, bestTimeSeconds: 38, completedAt: new Date().toISOString() },
    },
    weakFormulas: { 'MULT_2X1': 1 },
    createdAt: new Date().toISOString(),
  },
];

export async function loadStudents(): Promise<StudentProfile[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      await saveStudents(INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (error) {
    console.error('Failed to load students:', error);
    return INITIAL_STUDENTS;
  }
}

export async function saveStudents(students: StudentProfile[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(students));
  } catch (error) {
    console.error('Failed to save students:', error);
  }
}

export async function getActiveStudentId(): Promise<string> {
  try {
    const id = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    return id || INITIAL_STUDENTS[0].id;
  } catch {
    return INITIAL_STUDENTS[0].id;
  }
}

export async function setActiveStudentId(studentId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, studentId);
  } catch (error) {
    console.error('Failed to set active student id:', error);
  }
}

export async function loadTutorConfig(): Promise<TutorConfig> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TUTOR_CONFIG);
    if (!raw) {
      await saveTutorConfig(DEFAULT_TUTOR_CONFIG);
      return DEFAULT_TUTOR_CONFIG;
    }
    return { ...DEFAULT_TUTOR_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_TUTOR_CONFIG;
  }
}

export async function saveTutorConfig(config: TutorConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TUTOR_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save tutor config:', error);
  }
}

export function createNewStudent(name: string, gradeLevel: StudentProfile['gradeLevel'], avatar = '⭐'): StudentProfile {
  const sanitized = sanitizeStudentName(name);
  const newId = `student_${Date.now()}`;
  return {
    id: newId,
    name: sanitized,
    avatar,
    gradeLevel,
    totalXp: 0,
    gems: 10,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    hearts: 5,
    unlockedNodeIds: ['node_1_1'],
    completedNodeIds: [],
    nodeScores: {},
    weakFormulas: {},
    createdAt: new Date().toISOString(),
  };
}
