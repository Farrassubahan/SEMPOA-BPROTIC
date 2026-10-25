/**
 * BPROTIC SEMPOA - Interactive Heart Refill & Recovery Challenge Modal
 * Designed by Agent 1 (Gamification Lead) & Agent 2 (Interactive Mini-Game Lead)
 * Provides Duolingo-style mini-challenge (3 Rapid Mental Math Drills) or Gem redemption.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sound } from '@/services/sound';
import {
  generateHeartChallengeDrills,
  HeartChallengeItem,
} from '@/engine/generator';

interface HeartRefillModalProps {
  visible: boolean;
  currentHearts: number;
  gems: number;
  gemCost?: number;
  onRefillSuccess: (newHearts: number, gemsSpent: number) => void;
  onClose: () => void;
}

export function HeartRefillModal({
  visible,
  currentHearts,
  gems,
  gemCost = 20,
  onRefillSuccess,
  onClose,
}: HeartRefillModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <HeartRefillContent
        currentHearts={currentHearts}
        gems={gems}
        gemCost={gemCost}
        onRefillSuccess={onRefillSuccess}
        onClose={onClose}
      />
    </Modal>
  );
}

function HeartRefillContent({
  currentHearts,
  gems,
  gemCost = 20,
  onRefillSuccess,
  onClose,
}: Omit<HeartRefillModalProps, 'visible'>) {
  const insets = useSafeAreaInsets();
  const [stepMode, setStepMode] = useState<'choice' | 'challenge' | 'completed'>('choice');
  const [drills] = useState<HeartChallengeItem[]>(() => generateHeartChallengeDrills(3));
  const [drillIndex, setDrillIndex] = useState(0);
  const [wrongOption, setWrongOption] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const currentDrill = drills[drillIndex];
  const canAffordGems = gems >= gemCost;

  const handleStartChallenge = () => {
    sound.playPop();
    setDrillIndex(0);
    setWrongOption(null);
    setStepMode('challenge');
  };

  const handleSpendGems = () => {
    if (!canAffordGems) return;
    sound.playFanfare();
    onRefillSuccess(5, gemCost);
    onClose();
  };

  const handleAnswerChoice = (choice: number) => {
    if (isAnswering || !currentDrill) return;

    if (choice === currentDrill.expected) {
      sound.playCorrect();
      setIsAnswering(true);
      setWrongOption(null);

      setTimeout(() => {
        setIsAnswering(false);
        if (drillIndex + 1 < drills.length) {
          setDrillIndex((prev) => prev + 1);
        } else {
          // Completed all 3 drills!
          sound.playFanfare();
          setStepMode('completed');
        }
      }, 500);
    } else {
      sound.playIncorrect();
      setWrongOption(choice);
    }
  };

  const handleFinishChallenge = () => {
    sound.playPop();
    onRefillSuccess(5, 0);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View
        style={[
            styles.modalCard,
            {
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}>
          {/* Close X Button */}
          {stepMode !== 'completed' && (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                sound.playPop();
                onClose();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          )}

          {stepMode === 'choice' && (
            /* MODE 1: PILIHAN TANTANGAN ATAU PERMATA */
            <ScrollView
              contentContainerStyle={styles.choiceScroll}
              showsVerticalScrollIndicator={false}>
              {/* Mascot Heart Header */}
              <View style={styles.heartHeroBadge}>
                <Text style={styles.heartHeroEmoji}>💔</Text>
                <View style={styles.zeroHeartPill}>
                  <Text style={styles.zeroHeartText}>
                    Nyawa: {currentHearts} / 5
                  </Text>
                </View>
              </View>

              <Text style={styles.modalTitle}>Kehabisan Nyawa!</Text>
              <Text style={styles.modalSubtitle}>
                Jangan menyerah! Pulihkan 5 nyawamu dengan menyelesaikan tantangan kilat atau tukar permata.
              </Text>

              {/* Option 1: Tantangan Kilat (Challenge) */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.challengeCard}
                onPress={handleStartChallenge}>
                <View style={styles.challengeHeaderRow}>
                  <Text style={styles.challengeCardIcon}>⚔️</Text>
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>TANTANGAN KILAT</Text>
                  </View>
                </View>

                <Text style={styles.challengeCardTitle}>
                  Tantangan 3 Soal Hitung Cepat
                </Text>
                <Text style={styles.challengeCardDesc}>
                  Selesaikan 3 soal mental aritmatika cepat untuk memulihkan 5 nyawa penuh! GRATIS tanpa biaya permata.
                </Text>

                <View style={styles.challengeCardAction}>
                  <Text style={styles.challengeActionText}>Mulai Tantangan ➔</Text>
                </View>
              </TouchableOpacity>

              {/* Option 2: Tukar Permata */}
              <View style={styles.gemRedeemCard}>
                <View style={styles.gemHeaderRow}>
                  <View style={styles.gemTitleGroup}>
                    <Text style={styles.gemCardIcon}>💎</Text>
                    <Text style={styles.gemCardTitle}>Tukar Permata</Text>
                  </View>
                  <Text style={styles.gemBalanceText}>
                    Punya: 💎 {gems}
                  </Text>
                </View>

                <Text style={styles.gemCardDesc}>
                  Pulihkan 5 nyawa secara instan tanpa perlu mengerjakan tantangan.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!canAffordGems}
                  style={[
                    styles.gemRedeemBtn,
                    !canAffordGems && styles.gemRedeemBtnDisabled,
                  ]}
                  onPress={handleSpendGems}>
                  <Text style={styles.gemRedeemBtnText}>
                    {canAffordGems
                      ? `Tukar ${gemCost} 💎 untuk 5 ❤️`
                      : `Butuh ${gemCost} 💎 (Saldo Kurang)`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Exit Button */}
              <TouchableOpacity
                style={styles.exitBtn}
                onPress={() => {
                  sound.playPop();
                  onClose();
                }}>
                <Text style={styles.exitBtnText}>Kembali ke Peta</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {stepMode === 'challenge' && currentDrill && (
            /* MODE 2: MINI-CHALLENGE RUNNER */
            <View style={styles.challengeContainer}>
              {/* Challenge Step Tracker */}
              <View style={styles.trackerRow}>
                {[0, 1, 2].map((idx) => {
                  const isDone = idx < drillIndex;
                  const isCurrent = idx === drillIndex;
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.trackerStep,
                        isDone && styles.trackerStepDone,
                        isCurrent && styles.trackerStepCurrent,
                      ]}>
                      <Text
                        style={[
                          styles.trackerStepText,
                          isDone && styles.trackerStepTextDone,
                          isCurrent && styles.trackerStepTextCurrent,
                        ]}>
                        {isDone ? '✓' : idx + 1}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <Text style={styles.challengeStepLabel}>
                Tantangan {drillIndex + 1} dari 3
              </Text>
              <Text style={styles.challengePrompt}>
                Hitunglah dengan cepat:
              </Text>

              {/* Math Expression Card */}
              <View style={styles.expressionBox}>
                <Text style={styles.expressionText}>
                  {currentDrill.expression} = ?
                </Text>
              </View>

              {/* 4 Multiple Choice Buttons */}
              <View style={styles.choicesGrid}>
                {currentDrill.options.map((opt) => {
                  const isWrong = wrongOption === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      activeOpacity={0.7}
                      disabled={isAnswering}
                      style={[
                        styles.choiceBtn,
                        isWrong && styles.choiceBtnWrong,
                      ]}
                      onPress={() => handleAnswerChoice(opt)}>
                      <Text
                        style={[
                          styles.choiceBtnText,
                          isWrong && styles.choiceBtnTextWrong,
                        ]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {wrongOption !== null && (
                <Text style={styles.wrongNotice}>
                  Kurang tepat! Coba pilih jawaban lain.
                </Text>
              )}
            </View>
          )}

          {stepMode === 'completed' && (
            /* MODE 3: SELEBRASI TANTANGAN SELESAI */
            <View style={styles.completedContainer}>
              <Text style={styles.completedTrophy}>❤️‍🔥</Text>
              <Text style={styles.completedTitle}>Tantangan Berhasil!</Text>
              <Text style={styles.completedSubtitle}>
                Hebat sekali! Otak sempoamu makin gesit. 5 Nyawa telah dipulihkan penuh!
              </Text>

              <View style={styles.heartRestoreBadge}>
                <Text style={styles.heartRestoreText}>❤️❤️❤️❤️❤️ +5 NYAWA</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.continueBtn}
                onPress={handleFinishChallenge}>
                <Text style={styles.continueBtnText}>LANJUTKAN BELAJAR ➔</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 99999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D5DB',
    position: 'relative',
    maxHeight: '92%',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    cursor: 'pointer' as any,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6B7280',
  },
  choiceScroll: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  heartHeroBadge: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heartHeroEmoji: {
    fontSize: 54,
  },
  zeroHeartPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  zeroHeartText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  challengeCard: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    borderBottomWidth: 4,
    borderBottomColor: '#7DD3FC',
    marginBottom: 14,
    cursor: 'pointer' as any,
  },
  challengeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeCardIcon: {
    fontSize: 26,
  },
  freeBadge: {
    backgroundColor: '#1CB0F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  freeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  challengeCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0369A1',
    marginBottom: 4,
  },
  challengeCardDesc: {
    fontSize: 12,
    color: '#0C4A6E',
    lineHeight: 16,
    marginBottom: 12,
  },
  challengeCardAction: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#0284C7',
  },
  challengeActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  gemRedeemCard: {
    width: '100%',
    backgroundColor: '#FDF4FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F0ABFC',
    borderBottomWidth: 4,
    borderBottomColor: '#E879F9',
    marginBottom: 16,
  },
  gemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gemTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gemCardIcon: {
    fontSize: 22,
  },
  gemCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#86198F',
  },
  gemBalanceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A21CAF',
  },
  gemCardDesc: {
    fontSize: 12,
    color: '#701A75',
    marginBottom: 12,
  },
  gemRedeemBtn: {
    backgroundColor: '#A855F7',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#7E22CE',
    cursor: 'pointer' as any,
  },
  gemRedeemBtnDisabled: {
    opacity: 0.5,
  },
  gemRedeemBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  exitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  exitBtnText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* CHALLENGE RUNNER STYLES */
  challengeContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  trackerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  trackerStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerStepCurrent: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1CB0F6',
    transform: [{ scale: 1.1 }],
  },
  trackerStepDone: {
    backgroundColor: '#58CC02',
    borderColor: '#46A302',
  },
  trackerStepText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  trackerStepTextCurrent: {
    color: '#1CB0F6',
    fontWeight: '900',
  },
  trackerStepTextDone: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  challengeStepLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1CB0F6',
    marginBottom: 2,
  },
  challengePrompt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 14,
  },
  expressionBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 18,
  },
  expressionText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  choicesGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  choiceBtn: {
    width: '48%',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  choiceBtnWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderBottomColor: '#DC2626',
  },
  choiceBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  choiceBtnTextWrong: {
    color: '#DC2626',
  },
  wrongNotice: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
  },

  /* COMPLETED STYLES */
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  completedTrophy: {
    fontSize: 64,
    marginBottom: 10,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 6,
  },
  completedSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  heartRestoreBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    marginBottom: 24,
  },
  heartRestoreText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#58CC02',
    paddingVertical: 15,
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#46A302',
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
