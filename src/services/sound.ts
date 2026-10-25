/**
 * BPROTIC SEMPOA - Audio & Haptic Feedback Service
 * Designed by Agent 3 & Agent 4
 * Cross-platform sound synthesis (Web Audio API on Web, safe fallbacks on Native)
 */

import { Platform } from 'react-native';

class SoundService {
  private audioContext: any = null;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio not initialized yet:', e);
      }
    }
  }

  private ensureAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  /**
   * Sound when moving a wooden bead (soroban click)
   */
  playBeadClick() {
    if (Platform.OS === 'web' && this.audioContext) {
      try {
        this.ensureAudioContext();
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + Math.random() * 40, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.05);

        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
      } catch {}
    }
  }

  /**
   * Duolingo-style cheerful correct chime!
   */
  playCorrect() {
    if (Platform.OS === 'web' && this.audioContext) {
      try {
        this.ensureAudioContext();
        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

        notes.forEach((freq, idx) => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

          osc.connect(gain);
          gain.connect(this.audioContext.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } catch {}
    }
  }

  /**
   * Gentle incorrect chime
   */
  playIncorrect() {
    if (Platform.OS === 'web' && this.audioContext) {
      try {
        this.ensureAudioContext();
        const now = this.audioContext.currentTime;
        const notes = [311.13, 277.18]; // Eb4, Db4 descending

        notes.forEach((freq, idx) => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);

          gain.gain.setValueAtTime(0.15, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);

          osc.connect(gain);
          gain.connect(this.audioContext.destination);

          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.2);
        });
      } catch {}
    }
  }

  /**
   * Fanfare when unlocking a chest or completing a lesson
   */
  playFanfare() {
    if (Platform.OS === 'web' && this.audioContext) {
      try {
        this.ensureAudioContext();
        const now = this.audioContext.currentTime;
        const notes = [440, 554.37, 659.25, 880];

        notes.forEach((freq, idx) => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);

          gain.gain.setValueAtTime(0.25, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

          osc.connect(gain);
          gain.connect(this.audioContext.destination);

          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.35);
        });
      } catch {}
    }
  }
}

export const sound = new SoundService();
