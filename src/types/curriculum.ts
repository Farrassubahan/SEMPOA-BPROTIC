/**
 * BPROTIC SEMPOA - Curriculum & Pedagogy Types
 * Designed by Agent 1 (Master Kurikulum) & Agent 2 (System Architect)
 */

export type GradeLevel =
  | 'sd_rendah' // Kelas 1-2 SD (Kyu 10-8: Direct, Friends of 5)
  | 'sd_tinggi' // Kelas 3-4 SD (Kyu 7-5: Friends of 10, Mixed Formulas)
  | 'sd_mahir'  // Kelas 5-6 SD (Kyu 4-2: Multiplication, Division, Intro Anzan)
  | 'smp'       // Kelas 1-3 SMP (Kyu 1 - Dan 1: Multi-digit & Flash Anzan)
  | 'sma';      // Kelas 1-3 SMA (Dan 2 - Dan 5: Decimal, Square Roots, Master Anzan)

export type NodeType = 'lesson' | 'chest' | 'quiz_boss';

export type ProblemType =
  | 'interactive_abacus' // Student operates the virtual abacus to reach answer
  | 'read_abacus'        // Student reads the bead value from an abacus display
  | 'guided_touch'       // Step-by-step fingering tutorial with glowing beads
  | 'mental_math'        // Mental calculation (Anzan preview)
  | 'flash_anzan';       // High-speed blinking numbers for advanced mental calculation

export interface Problem {
  id: string;
  type: ProblemType;
  prompt: string;
  formulaHint?: string;
  explanation?: string;
  expression?: string; // e.g. "3 + 1" or "4 + 5 - 2"
  expectedAnswer: number;
  options?: number[]; // For multiple-choice questions
  initialBeadValue?: number; // Starting abacus value
  flashNumbers?: number[]; // Numbers sequence for Flash Anzan
  flashIntervalMs?: number; // Duration of each number flash
}

export interface LessonNode {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  type: NodeType;
  gradeLevel: GradeLevel;
  requiredXp?: number;
  xpReward: number;
  gemReward: number;
  formulaCode?: string; // e.g., "KK+4" (Kawan Kecil +4), "KB+9" (Kawan Besar +9)
  problems: Problem[];
}

export interface Unit {
  id: string;
  gradeLevel: GradeLevel;
  gradeTitle: string; // e.g. "Tingkat Dasar (Kelas 1-2 SD)"
  unitNumber: number;
  title: string;
  description: string;
  color: string; // Theme color for Duolingo unit banner
  nodes: LessonNode[];
}
