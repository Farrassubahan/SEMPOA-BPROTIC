/**
 * BPROTIC SEMPOA - Abacus Types & Interfaces
 * Agent 2 (System Architect) & Agent 3 (Engine Dev)
 */

export interface BeadState {
  upperActive: boolean; // Upper deck bead (value 5) pushed toward beam
  lowerActiveCount: number; // 0 to 4 lower beads pushed toward beam
}

export interface RodState {
  id: number; // Rod index from left (0) to right (N - 1)
  value: number; // 0 to 9 on standard decimal Soroban
  isUnitRod?: boolean; // Dot marker indicating the decimal unit or main column
}

export type OperationType = 'direct' | 'friend_5' | 'friend_10' | 'combo' | 'mult' | 'div' | 'anzan';

export interface AbacusStep {
  text: string;
  targetRod: number;
  action: 'push_upper' | 'pull_upper' | 'push_lower' | 'pull_lower';
  count?: number;
}
