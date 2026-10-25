/**
 * BPROTIC SEMPOA - Procedural Question Generator
 * Designed by Agent 1 (Master Kurikulum) & Agent 2 (System Architect)
 * Generates infinite 100% offline practice questions strictly adhering to Sempoa rules.
 */

import { Problem } from '@/types/curriculum';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a direct calculation problem (tanpa rumus)
 */
export function generateDirectProblem(): Problem {
  const a = getRandomInt(1, 3);
  const b = getRandomInt(1, 4 - a); // sum <= 4
  const expected = a + b;
  return {
    id: `gen_direct_${Date.now()}_${Math.random()}`,
    type: 'interactive_abacus',
    prompt: `Hitunglah: ${a} + ${b}`,
    expression: `${a} + ${b}`,
    formulaHint: 'Hitung langsung tanpa rumus',
    explanation: `Naikkan ${a} manik bawah, lalu tambahkan ${b} manik bawah. Hasil = ${expected}.`,
    expectedAnswer: expected,
    initialBeadValue: a,
  };
}

/**
 * Generates a Friends of 5 (Kawan Kecil) addition problem
 */
export function generateFriend5Problem(): Problem {
  // Target formulas: +4 (+5 - 1), +3 (+5 - 2), +2 (+5 - 3), +1 (+5 - 4)
  const choices = [
    { a: 1, add: 4, hint: '+4 = +5 - 1' },
    { a: 2, add: 4, hint: '+4 = +5 - 1' },
    { a: 3, add: 4, hint: '+4 = +5 - 1' },
    { a: 4, add: 3, hint: '+3 = +5 - 2' },
    { a: 3, add: 3, hint: '+3 = +5 - 2' },
    { a: 4, add: 2, hint: '+2 = +5 - 3' },
    { a: 3, add: 2, hint: '+2 = +5 - 3' },
    { a: 4, add: 1, hint: '+1 = +5 - 4' },
  ];
  const item = choices[Math.floor(Math.random() * choices.length)];
  const expected = item.a + item.add;

  return {
    id: `gen_kk_${Date.now()}_${Math.random()}`,
    type: 'interactive_abacus',
    prompt: `Hitunglah: ${item.a} + ${item.add}`,
    expression: `${item.a} + ${item.add}`,
    formulaHint: item.hint,
    explanation: `Gunakan rumus Kawan Kecil: ${item.hint}. Hasil = ${expected}.`,
    expectedAnswer: expected,
    initialBeadValue: item.a,
  };
}

/**
 * Generates a Friends of 10 (Kawan Besar) addition problem
 */
export function generateFriend10Problem(): Problem {
  const choices = [
    { a: 9, add: 9, hint: '+9 = -1 + 10' },
    { a: 8, add: 8, hint: '+8 = -2 + 10' },
    { a: 7, add: 7, hint: '+7 = -3 + 10' },
    { a: 6, add: 6, hint: '+6 = -4 + 10' },
    { a: 9, add: 8, hint: '+8 = -2 + 10' },
    { a: 8, add: 9, hint: '+9 = -1 + 10' },
    { a: 7, add: 8, hint: '+8 = -2 + 10' },
  ];
  const item = choices[Math.floor(Math.random() * choices.length)];
  const expected = item.a + item.add;

  return {
    id: `gen_kb_${Date.now()}_${Math.random()}`,
    type: 'interactive_abacus',
    prompt: `Hitunglah: ${item.a} + ${item.add}`,
    expression: `${item.a} + ${item.add}`,
    formulaHint: item.hint,
    explanation: `Gunakan rumus Kawan Besar: ${item.hint}. Hasil = ${expected}.`,
    expectedAnswer: expected,
    initialBeadValue: item.a,
  };
}

/**
 * Generates a Flash Anzan problem for mental arithmetic
 */
export function generateFlashAnzanProblem(level: 'easy' | 'medium' | 'hard'): Problem {
  let count = 3;
  let intervalMs = 1000;
  let min = 1;
  let max = 9;

  if (level === 'medium') {
    count = 4;
    intervalMs = 700;
    min = 10;
    max = 50;
  } else if (level === 'hard') {
    count = 5;
    intervalMs = 400;
    min = 15;
    max = 99;
  }

  const numbers: number[] = [];
  let total = 0;
  for (let i = 0; i < count; i++) {
    const num = getRandomInt(min, max);
    numbers.push(num);
    total += num;
  }

  // Create 4 plausible options for multiple choice
  const options = [total];
  while (options.length < 4) {
    const delta = (Math.random() > 0.5 ? 1 : -1) * getRandomInt(1, 4) * (level === 'easy' ? 1 : 2);
    const candidate = total + delta;
    if (candidate > 0 && !options.includes(candidate)) {
      options.push(candidate);
    }
  }
  options.sort((a, b) => a - b);

  return {
    id: `gen_flash_${Date.now()}_${Math.random()}`,
    type: 'flash_anzan',
    prompt: `Flash Anzan (${count} Angka, ${intervalMs}ms)`,
    flashNumbers: numbers,
    flashIntervalMs: intervalMs,
    expectedAnswer: total,
    options,
    explanation: `Urutan: ${numbers.join(' + ')} = ${total}`,
  };
}

export interface HeartChallengeItem {
  id: string;
  expression: string;
  expected: number;
  options: number[];
}

/**
 * Generates rapid-fire mental arithmetic drills for recovering hearts
 */
export function generateHeartChallengeDrills(count = 3): HeartChallengeItem[] {
  const drills: HeartChallengeItem[] = [];
  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() > 0.35;
    let a = 0;
    let b = 0;
    let expected = 0;
    let expr = '';

    if (isAddition) {
      a = getRandomInt(2, 7);
      b = getRandomInt(1, 9);
      expected = a + b;
      expr = `${a} + ${b}`;
    } else {
      a = getRandomInt(6, 15);
      b = getRandomInt(1, Math.min(9, a - 1));
      expected = a - b;
      expr = `${a} - ${b}`;
    }

    const options = [expected];
    while (options.length < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * getRandomInt(1, 4);
      const cand = expected + delta;
      if (cand >= 0 && !options.includes(cand)) {
        options.push(cand);
      }
    }
    options.sort(() => Math.random() - 0.5);

    drills.push({
      id: `drill_${i}_${Date.now()}`,
      expression: expr,
      expected,
      options,
    });
  }
  return drills;
}

