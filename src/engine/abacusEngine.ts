/**
 * BPROTIC SEMPOA - Abacus Math Engine
 * Designed by Agent 2 (System Architect) & Audited by Agent 6 (Bug Hunter)
 * Complete logic for Soroban 1:4 (1 upper bead = 5, 4 lower beads = 1 each)
 */

export interface RodDigit {
  upperActive: boolean; // true = 5 active
  lowerCount: number;   // 0 to 4 active
}

/**
 * Converts a digit (0 - 9) into Soroban rod state
 */
export function digitToRod(digit: number): RodDigit {
  const bounded = Math.max(0, Math.min(9, Math.floor(digit)));
  const upperActive = bounded >= 5;
  const lowerCount = bounded % 5;
  return { upperActive, lowerCount };
}

/**
 * Converts a Soroban rod state into a numerical digit (0 - 9)
 */
export function rodToDigit(rod: RodDigit): number {
  return (rod.upperActive ? 5 : 0) + Math.max(0, Math.min(4, rod.lowerCount));
}

/**
 * Converts an entire integer value into array of rod digits for N rods
 */
export function numberToAbacusRods(value: number, totalRods: number): RodDigit[] {
  const strVal = Math.abs(Math.floor(value)).toString();
  const rods: RodDigit[] = [];

  for (let i = 0; i < totalRods; i++) {
    const digitIndex = strVal.length - totalRods + i;
    const digitChar = digitIndex >= 0 ? strVal[digitIndex] : '0';
    const digitNum = parseInt(digitChar, 10) || 0;
    rods.push(digitToRod(digitNum));
  }

  return rods;
}

/**
 * Calculates the total numerical value from array of rod digits
 */
export function abacusRodsToNumber(rods: RodDigit[]): number {
  let result = 0;
  for (let i = 0; i < rods.length; i++) {
    const digit = rodToDigit(rods[i]);
    const power = rods.length - 1 - i;
    result += digit * Math.pow(10, power);
  }
  return result;
}

/**
 * Formats numbers for Indonesian locale (e.g. 1.500)
 */
export function formatIndonesianNumber(num: number): string {
  return num.toLocaleString('id-ID');
}
