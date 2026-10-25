/**
 * BPROTIC SEMPOA - Security Services
 * Designed by Agent 7 (Security Lead)
 * Ensures offline data integrity, PIN hashing, input sanitization, and anti-tamper safeguards.
 */

/**
 * Lightweight deterministic offline hash for tutor PIN (prevents plain-text storage)
 */
export function hashPin(pin: string): string {
  const salt = 'BPROTIC_SEMPOA_SECURE_SALT_2026';
  let hash = 0;
  const combined = `${salt}:${pin}:${salt}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `sec_${Math.abs(hash).toString(16)}`;
}

/**
 * Validates a tutor PIN against the stored hash
 */
export function verifyPin(inputPin: string, storedHash: string): boolean {
  if (!inputPin || inputPin.length !== 4) return false;
  return hashPin(inputPin) === storedHash;
}

/**
 * Sanitizes student names against injection, script tags, and excessive spaces
 */
export function sanitizeStudentName(rawName: string): string {
  if (!rawName) return 'Murid Baru';
  // Strip any HTML/script tags or dangerous chars
  const sanitized = rawName
    .replace(/[<>'"/\\&]/g, '')
    .trim()
    .slice(0, 24); // Maximum 24 chars for child names
  return sanitized.length > 0 ? sanitized : 'Murid Baru';
}

/**
 * Validates and safely bounds numerical answer input
 */
export function sanitizeNumericInput(input: any): number {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.min(Math.max(Math.floor(num), -999999), 999999);
}
