/**
 * BPROTIC SEMPOA - Duolingo-style Lesson Runner Modal
 * Designed by Agent 4 (UI/UX Dev), Agent 8 (User Tester) & Audited by Agent 6
 * Clean component architecture, fully compliant with React 19 & ESLint flat config.
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LessonNode, Problem } from '@/types/curriculum';
import { StudentProfile } from '@/types/student';
import { AbacusBoard } from '@/components/abacus/AbacusBoard';
import { RodDigit, abacusRodsToNumber, numberToAbacusRods } from '@/engine/abacusEngine';
import { sound } from '@/services/sound';

interface LessonRunnerModalProps {
  visible: boolean;
  node: LessonNode | null;
  student: StudentProfile;
  unlimitedHearts?: boolean;
  onClose: () => void;
  onCompleteLesson: (result: {
    nodeId: string;
    stars: number;
    accuracy: number;
    xpEarned: number;
    gemEarned: number;
    weakFormulas?: Record<string, number>;
  }) => void;
}

export function LessonRunnerModal({
  visible,
  node,
  student,
  unlimitedHearts = false,
  onClose,
  onCompleteLesson,
}: LessonRunnerModalProps) {
  if (!visible || !node) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <LessonRunnerContent
        key={node.id}
        node={node}
        student={student}
        unlimitedHearts={unlimitedHearts}
        onClose={onClose}
        onCompleteLesson={onCompleteLesson}
      />
    </Modal>
  );
}

function LessonRunnerContent({
  node,
  student,
  unlimitedHearts,
  onClose,
  onCompleteLesson,
}: {
  node: LessonNode;
  student: StudentProfile;
  unlimitedHearts: boolean;
  onClose: () => void;
  onCompleteLesson: LessonRunnerModalProps['onCompleteLesson'];
}) {
  const problems = node.problems;
  const isChest = node.type === 'chest';
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentRods, setCurrentRods] = useState<RodDigit[]>(() => {
    const initialVal = problems[0]?.initialBeadValue ?? 0;
    return numberToAbacusRods(initialVal, 5);
  });
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [heartsLeft, setHeartsLeft] = useState(student.hearts);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFinished, setShowFinished] = useState(false);
  const [sessionErrors, setSessionErrors] = useState<Record<string, number>>({});

  // Flash Anzan state
  const [flashIndex, setFlashIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  const currentProblem: Problem | undefined = problems[currentIndex];

  // Play chest fanfare or handle flash anzan setup
  useEffect(() => {
    if (isChest) {
      sound.playFanfare();
      return;
    }

    if (currentProblem?.type === 'flash_anzan' && currentProblem.flashNumbers) {
      const numbers = currentProblem.flashNumbers;
      const interval = currentProblem.flashIntervalMs || 800;

      const startTimeout = setTimeout(() => {
        setIsFlashing(true);
        setFlashIndex(0);

        let idx = 0;
        const timer = setInterval(() => {
          idx++;
          if (idx < numbers.length) {
            setFlashIndex(idx);
            sound.playBeadClick();
          } else {
            clearInterval(timer);
            setIsFlashing(false);
          }
        }, interval);
      }, 300);

      return () => clearTimeout(startTimeout);
    }
  }, [currentIndex, currentProblem, isChest]);

  // Chest Node Instant Reward Claim
  if (isChest) {
    return (
      <View
        style={[
          styles.chestContainer,
          {
            paddingTop: Math.max(insets.top, 24) + 12,
            paddingBottom: Math.max(insets.bottom, 16) + 20,
          },
        ]}>
        <Text style={styles.chestIcon}>🎁</Text>
        <Text style={styles.chestTitle}>{node.title}</Text>
        <Text style={styles.chestSubtitle}>{node.subtitle}</Text>

        <View style={styles.rewardCard}>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardEmoji}>⭐</Text>
            <Text style={styles.rewardNumber}>+{node.xpReward} XP</Text>
          </View>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardEmoji}>💎</Text>
            <Text style={styles.rewardNumber}>+{node.gemReward} Permata</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.claimButton}
          activeOpacity={0.8}
          onPress={() => {
            onCompleteLesson({
              nodeId: node.id,
              stars: 3,
              accuracy: 100,
              xpEarned: node.xpReward,
              gemEarned: node.gemReward,
            });
            onClose();
          }}>
          <Text style={styles.claimButtonText}>KLAIM HADIAH</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check student's answer
  const handleCheckAnswer = () => {
    if (!currentProblem) return;

    let studentAnswer = 0;
    if (currentProblem.type === 'interactive_abacus' || currentProblem.type === 'guided_touch') {
      studentAnswer = abacusRodsToNumber(currentRods);
    } else {
      studentAnswer = selectedOption ?? -999999;
    }

    const correct = studentAnswer === currentProblem.expectedAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      sound.playCorrect();
      setCorrectCount((prev) => prev + 1);
    } else {
      sound.playIncorrect();
      if (!unlimitedHearts) {
        setHeartsLeft((prev) => Math.max(0, prev - 1));
      }
      if (node.formulaCode) {
        setSessionErrors((prev) => ({
          ...prev,
          [node.formulaCode!]: (prev[node.formulaCode!] || 0) + 1,
        }));
      }
    }
  };

  // Next problem or finish lesson
  const handleNextProblem = () => {
    if (currentIndex + 1 < problems.length) {
      const nextIdx = currentIndex + 1;
      const nextProblem = problems[nextIdx];
      setCurrentIndex(nextIdx);
      setIsAnswerChecked(false);
      setSelectedOption(null);
      setCurrentRods(numberToAbacusRods(nextProblem?.initialBeadValue ?? 0, 5));
    } else {
      sound.playFanfare();
      setShowFinished(true);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / problems.length) * 100);
  const accuracy = Math.round((correctCount / Math.max(1, problems.length)) * 100);
  const starsEarned = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

  // Final Completion Screen
  if (showFinished) {
    return (
      <View
        style={[
          styles.finishContainer,
          {
            paddingTop: Math.max(insets.top, 24) + 12,
            paddingBottom: Math.max(insets.bottom, 16) + 20,
          },
        ]}>
        <Text style={styles.finishTrophy}>🏆</Text>
        <Text style={styles.finishTitle}>Pelajaran Selesai!</Text>
        <Text style={styles.finishSubtitle}>Kerja bagus! Otak sempoamu makin tajam!</Text>

        <View style={styles.starsResultRow}>
          {[1, 2, 3].map((s) => (
            <Text
              key={`star_${s}`}
              style={[
                styles.finishStar,
                s <= starsEarned ? styles.finishStarActive : styles.finishStarInactive,
              ]}>
              ★
            </Text>
          ))}
        </View>

        <View style={styles.finishStatsCard}>
          <View style={styles.finishStatItem}>
            <Text style={styles.finishStatLabel}>Akurasi</Text>
            <Text style={styles.finishStatVal}>{accuracy}%</Text>
          </View>
          <View style={styles.finishStatItem}>
            <Text style={styles.finishStatLabel}>XP Diperoleh</Text>
            <Text style={[styles.finishStatVal, { color: '#58CC02' }]}>
              +{node.xpReward} XP
            </Text>
          </View>
          <View style={styles.finishStatItem}>
            <Text style={styles.finishStatLabel}>Permata</Text>
            <Text style={[styles.finishStatVal, { color: '#1CB0F6' }]}>
              +{node.gemReward} 💎
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.finishButton}
          activeOpacity={0.8}
          onPress={() => {
            onCompleteLesson({
              nodeId: node.id,
              stars: starsEarned,
              accuracy,
              xpEarned: node.xpReward,
              gemEarned: node.gemReward,
              weakFormulas: sessionErrors,
            });
            onClose();
          }}>
          <Text style={styles.finishButtonText}>LANJUTKAN KE PETA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.modalSafe,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
        },
      ]}>
      {/* Top Navigation Bar: Close, Progress Bar, Hearts */}
      <View style={styles.topNavBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        <View style={styles.heartRow}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.heartText}>{unlimitedHearts ? '∞' : heartsLeft}</Text>
        </View>
      </View>

      {/* Question Content Area */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 160 + Math.max(insets.bottom, 24) },
        ]}>
        {currentProblem && (
          <View style={styles.problemCard}>
            {/* Formula Hint Badge */}
            {currentProblem.formulaHint && (
              <View style={styles.hintBadge}>
                <Text style={styles.hintBadgeText}>💡 {currentProblem.formulaHint}</Text>
              </View>
            )}

            {/* Main Question Text */}
            <Text style={styles.problemPrompt}>{currentProblem.prompt}</Text>

            {/* Expression Math (e.g. 2 + 1) */}
            {currentProblem.expression && (
              <Text style={styles.mathExpression}>{currentProblem.expression}</Text>
            )}

            {/* Problem Type: Interactive Abacus or Guided Touch */}
            {(currentProblem.type === 'interactive_abacus' ||
              currentProblem.type === 'guided_touch') && (
              <View style={styles.abacusWrapper}>
                <AbacusBoard
                  rods={currentRods}
                  onChangeRods={(newRods) => {
                    if (!isAnswerChecked) setCurrentRods(newRods);
                  }}
                  showDigitLabel={true}
                />
                <Text style={styles.dragHelpText}>
                  Geser manik di atas untuk mencapai nilai yang benar
                </Text>
              </View>
            )}

            {/* Problem Type: Read Abacus */}
            {currentProblem.type === 'read_abacus' && (
              <View style={styles.readAbacusWrapper}>
                <AbacusBoard
                  rods={numberToAbacusRods(currentProblem.initialBeadValue || 0, 5)}
                  readOnly={true}
                  showDigitLabel={false}
                />
                <Text style={styles.optionInstruction}>
                  Pilihlah angka yang tepat sesuai posisi manik:
                </Text>
                <View style={styles.optionsGrid}>
                  {currentProblem.options?.map((opt) => (
                    <TouchableOpacity
                      key={`opt_${opt}`}
                      activeOpacity={0.7}
                      disabled={isAnswerChecked}
                      onPress={() => setSelectedOption(opt)}
                      style={[
                        styles.optionBtn,
                        selectedOption === opt && styles.optionBtnSelected,
                      ]}>
                      <Text
                        style={[
                          styles.optionBtnText,
                          selectedOption === opt && styles.optionBtnTextSelected,
                        ]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Problem Type: Flash Anzan */}
            {currentProblem.type === 'flash_anzan' && (
              <View style={styles.flashAnzanContainer}>
                {isFlashing ? (
                  <View style={styles.flashBox}>
                    <Text style={styles.flashNumber}>
                      {currentProblem.flashNumbers?.[flashIndex]}
                    </Text>
                    <Text style={styles.flashCounter}>
                      Angka ke-{flashIndex + 1} dari{' '}
                      {currentProblem.flashNumbers?.length}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.flashDoneArea}>
                    <Text style={styles.flashDonePrompt}>Berapa total semuanya?</Text>
                    <View style={styles.optionsGrid}>
                      {currentProblem.options?.map((opt) => (
                        <TouchableOpacity
                          key={`flash_opt_${opt}`}
                          activeOpacity={0.7}
                          disabled={isAnswerChecked}
                          onPress={() => setSelectedOption(opt)}
                          style={[
                            styles.optionBtn,
                            selectedOption === opt && styles.optionBtnSelected,
                          ]}>
                          <Text
                            style={[
                              styles.optionBtnText,
                              selectedOption === opt && styles.optionBtnTextSelected,
                            ]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Feedback / Check Action Sheet */}
      <View
        style={[
          styles.bottomSheet,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          },
          isAnswerChecked &&
            (isCorrect ? styles.bottomSheetCorrect : styles.bottomSheetIncorrect),
        ]}>
        {isAnswerChecked ? (
          <View style={styles.feedbackRow}>
            <View style={styles.feedbackTextWrapper}>
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: isCorrect ? '#58A700' : '#EA2B2B' },
                ]}>
                {isCorrect ? '🎉 Luar Biasa!' : '⚠️ Perhatikan Rumus!'}
              </Text>
              <Text style={styles.feedbackDesc}>
                {isCorrect
                  ? 'Jawabanmu tepat sekali!'
                  : currentProblem?.explanation ||
                    `Jawaban yang benar: ${currentProblem?.expectedAnswer}`}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                isCorrect ? styles.actionBtnCorrect : styles.actionBtnIncorrect,
              ]}
              activeOpacity={0.8}
              onPress={handleNextProblem}>
              <Text style={styles.actionBtnText}>
                {currentIndex + 1 < problems.length ? 'LANJUT' : 'LIHAT HASIL'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.actionBtnCheck,
              isFlashing && styles.actionBtnDisabled,
            ]}
            disabled={isFlashing}
            activeOpacity={0.8}
            onPress={handleCheckAnswer}>
            <Text style={styles.actionBtnText}>PERIKSA</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalSafe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeBtn: {
    padding: 8,
    cursor: 'pointer' as any,
  },
  closeBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#AFAFAF',
  },
  progressBarBg: {
    flex: 1,
    height: 14,
    backgroundColor: '#E5E5E5',
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 7,
  },
  heartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartIcon: {
    fontSize: 16,
  },
  heartText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF4B4B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: 'center',
  },
  problemCard: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    marginTop: 10,
  },
  hintBadge: {
    backgroundColor: '#FFF4D6',
    borderWidth: 1,
    borderColor: '#F6CE3E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  hintBadgeText: {
    color: '#9E7400',
    fontSize: 12,
    fontWeight: '800',
  },
  problemPrompt: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3C3C3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  mathExpression: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1CB0F6',
    marginBottom: 10,
  },
  abacusWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  dragHelpText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
    marginTop: 4,
  },
  readAbacusWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  optionInstruction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B4B4B',
    marginVertical: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  optionBtn: {
    minWidth: 90,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  optionBtnSelected: {
    borderColor: '#84D8FF',
    backgroundColor: '#DDF4FF',
  },
  optionBtnText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4B4B4B',
  },
  optionBtnTextSelected: {
    color: '#1CB0F6',
  },
  flashAnzanContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  flashBox: {
    width: 220,
    height: 160,
    backgroundColor: '#1E232A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#3B4252',
  },
  flashNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ECEFF4',
  },
  flashCounter: {
    fontSize: 11,
    color: '#81A1C1',
    fontWeight: '600',
    marginTop: 8,
  },
  flashDoneArea: {
    width: '100%',
    alignItems: 'center',
  },
  flashDonePrompt: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3C3C3C',
    marginBottom: 16,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  bottomSheetCorrect: {
    backgroundColor: '#D7FFB8',
    borderTopColor: '#58CC02',
  },
  bottomSheetIncorrect: {
    backgroundColor: '#FFDFE0',
    borderTopColor: '#FF4B4B',
  },
  feedbackRow: {
    gap: 12,
    width: '100%',
    maxWidth: 500,
  },
  feedbackTextWrapper: {
    gap: 4,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  feedbackDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B4B4B',
  },
  actionButton: {
    width: '100%',
    maxWidth: 500,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    cursor: 'pointer' as any,
  },
  actionBtnCheck: {
    backgroundColor: '#58CC02',
    borderBottomColor: '#46A302',
  },
  actionBtnCorrect: {
    backgroundColor: '#58CC02',
    borderBottomColor: '#46A302',
  },
  actionBtnIncorrect: {
    backgroundColor: '#FF4B4B',
    borderBottomColor: '#EA2B2B',
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  // Chest Screen
  chestContainer: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  chestIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  chestTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#B57500',
    marginBottom: 8,
  },
  chestSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7C5C1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  rewardCard: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  rewardBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2D070',
    borderBottomWidth: 4,
  },
  rewardEmoji: {
    fontSize: 28,
  },
  rewardNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3C3C3C',
    marginTop: 4,
  },
  claimButton: {
    backgroundColor: '#FFC800',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#CC9900',
    cursor: 'pointer' as any,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  // Finished Screen
  finishContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  finishTrophy: {
    fontSize: 84,
    marginBottom: 16,
  },
  finishTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3C3C3C',
    marginBottom: 6,
  },
  finishSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8A8A',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsResultRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  finishStar: {
    fontSize: 48,
  },
  finishStarActive: {
    color: '#FFC800',
  },
  finishStarInactive: {
    color: '#E5E5E5',
  },
  finishStatsCard: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-around',
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  finishStatItem: {
    alignItems: 'center',
  },
  finishStatLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    fontWeight: '700',
    marginBottom: 4,
  },
  finishStatVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3C3C3C',
  },
  finishButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#46A302',
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
