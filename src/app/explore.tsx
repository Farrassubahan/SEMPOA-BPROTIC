/**
 * BPROTIC SEMPOA - Free Practice & Flash Anzan Lab
 * Designed by Agent 3 (Engine Dev), Agent 4 (UI/UX) & Agent 8 (User Tester)
 * Sandbox mode for freely using the Soroban and training speed calculations.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { AbacusBoard } from '@/components/abacus/AbacusBoard';
import { RodDigit, abacusRodsToNumber, numberToAbacusRods } from '@/engine/abacusEngine';
import { generateFlashAnzanProblem, generateFriend5Problem, generateFriend10Problem } from '@/engine/generator';
import { Problem } from '@/types/curriculum';
import { sound } from '@/services/sound';

type PracticeMode = 'abacus_free' | 'flash_anzan' | 'drill_generator';

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [activeMode, setActiveMode] = useState<PracticeMode>('abacus_free');
  const [rodCount, setRodCount] = useState<number>(5);
  const [sandboxRods, setSandboxRods] = useState<RodDigit[]>(() => numberToAbacusRods(0, 5));

  const handleSelectRodCount = (r: number) => {
    setRodCount(r);
    setSandboxRods(numberToAbacusRods(0, r));
  };

  // Flash Anzan State
  const [flashSpeed, setFlashSpeed] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [flashProblem, setFlashProblem] = useState<Problem | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashCurrentIdx, setFlashCurrentIdx] = useState(0);
  const [showFlashAnswer, setShowFlashAnswer] = useState(false);

  // Drill Generator State
  const [drillProblem, setDrillProblem] = useState<Problem | null>(null);
  const [drillRods, setDrillRods] = useState<RodDigit[]>([]);
  const [drillChecked, setDrillChecked] = useState(false);
  const [drillIsCorrect, setDrillIsCorrect] = useState(false);

  // Start Flash Anzan sequence
  const handleStartFlash = () => {
    const prob = generateFlashAnzanProblem(flashSpeed);
    setFlashProblem(prob);
    setShowFlashAnswer(false);
    setIsFlashing(true);
    setFlashCurrentIdx(0);

    const nums = prob.flashNumbers || [];
    const interval = prob.flashIntervalMs || 1000;
    let idx = 0;

    const timer = setInterval(() => {
      idx++;
      if (idx < nums.length) {
        setFlashCurrentIdx(idx);
        sound.playBeadClick();
      } else {
        clearInterval(timer);
        setIsFlashing(false);
      }
    }, interval);
  };

  // Generate new drill problem
  const handleGenerateDrill = (type: 'kawan5' | 'kawan10') => {
    const prob = type === 'kawan5' ? generateFriend5Problem() : generateFriend10Problem();
    setDrillProblem(prob);
    setDrillChecked(false);
    setDrillRods(numberToAbacusRods(prob.initialBeadValue || 0, 5));
  };

  const handleCheckDrill = () => {
    if (!drillProblem) return;
    const studentAns = abacusRodsToNumber(drillRods);
    const correct = studentAns === drillProblem.expectedAnswer;
    setDrillIsCorrect(correct);
    setDrillChecked(true);
    if (correct) sound.playCorrect();
    else sound.playIncorrect();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Laboratorium Latihan Sempoa</Text>
        <Text style={styles.headerSubtitle}>Latihan bebas & asah kecepatan tanpa batas</Text>
      </View>

      {/* Mode Selector Tabs */}
      <View style={styles.modeTabBar}>
        <TouchableOpacity
          style={[styles.modeTab, activeMode === 'abacus_free' && styles.modeTabActive]}
          onPress={() => setActiveMode('abacus_free')}>
          <Text
            style={[
              styles.modeTabText,
              activeMode === 'abacus_free' && styles.modeTabTextActive,
            ]}>
            Sempoa Bebas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeMode === 'flash_anzan' && styles.modeTabActive]}
          onPress={() => {
            setActiveMode('flash_anzan');
            if (!flashProblem) handleStartFlash();
          }}>
          <Text
            style={[
              styles.modeTabText,
              activeMode === 'flash_anzan' && styles.modeTabTextActive,
            ]}>
            Flash Anzan (Kilat)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeTab,
            activeMode === 'drill_generator' && styles.modeTabActive,
          ]}
          onPress={() => {
            setActiveMode('drill_generator');
            if (!drillProblem) handleGenerateDrill('kawan5');
          }}>
          <Text
            style={[
              styles.modeTabText,
              activeMode === 'drill_generator' && styles.modeTabTextActive,
            ]}>
            Drill Rumus
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: isTablet ? 720 : '100%', alignSelf: 'center', width: '100%' },
        ]}>
        {/* MODE 1: SEMPOA BEBAS */}
        {activeMode === 'abacus_free' && (
          <View style={styles.cardSection}>
            <View style={styles.rodSelectorRow}>
              <Text style={styles.sectionLabel}>Jumlah Tiang:</Text>
              <View style={styles.rodPillsGroup}>
                {[5, 7, 9, 11].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => handleSelectRodCount(r)}
                    style={[styles.rodPill, rodCount === r && styles.rodPillActive]}>
                    <Text
                      style={[
                        styles.rodPillText,
                        rodCount === r && styles.rodPillTextActive,
                      ]}>
                      {r} Tiang
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <AbacusBoard
              rods={sandboxRods}
              onChangeRods={setSandboxRods}
              showDigitLabel={true}
            />

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>💡 Petunjuk Gerakan Jari (Fingering Rule):</Text>
              <Text style={styles.tipsText}>
                • <Text style={{ fontWeight: '800' }}>Jempol:</Text> Dorong manik bawah naik mendekati palang pemisah.
              </Text>
              <Text style={styles.tipsText}>
                • <Text style={{ fontWeight: '800' }}>Telunjuk:</Text> Tarik manik bawah turun & gerakkan manik atas (5).
              </Text>
            </View>
          </View>
        )}

        {/* MODE 2: FLASH ANZAN */}
        {activeMode === 'flash_anzan' && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Tingkat Kecepatan Flash Anzan:</Text>
            <View style={styles.speedPillsRow}>
              {[
                { label: 'Santai (1.0s)', val: 'easy' },
                { label: 'Cepat (0.7s)', val: 'medium' },
                { label: 'Kilat (0.4s)', val: 'hard' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.val}
                  onPress={() => setFlashSpeed(s.val as any)}
                  style={[styles.speedPill, flashSpeed === s.val && styles.speedPillActive]}>
                  <Text
                    style={[
                      styles.speedPillText,
                      flashSpeed === s.val && styles.speedPillTextActive,
                    ]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Flash Screen Display */}
            <View style={styles.flashDisplayContainer}>
              {isFlashing ? (
                <View style={styles.flashNumberBox}>
                  <Text style={styles.bigFlashText}>
                    {flashProblem?.flashNumbers?.[flashCurrentIdx]}
                  </Text>
                  <Text style={styles.flashStepText}>
                    Angka {flashCurrentIdx + 1} / {flashProblem?.flashNumbers?.length}
                  </Text>
                </View>
              ) : (
                <View style={styles.flashReadyBox}>
                  {showFlashAnswer ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.answerLabel}>Jawaban Benar:</Text>
                      <Text style={styles.bigAnswerText}>
                        {flashProblem?.expectedAnswer}
                      </Text>
                      <Text style={styles.answerExplanation}>
                        {flashProblem?.explanation}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.readyPrompt}>
                        Selesai berkedip! Berapakah hasil jumlahnya di pikiranmu?
                      </Text>
                      <TouchableOpacity
                        style={styles.revealBtn}
                        onPress={() => setShowFlashAnswer(true)}>
                        <Text style={styles.revealBtnText}>Buka Kunci Jawaban</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.startFlashBtn, isFlashing && styles.btnDisabled]}
              disabled={isFlashing}
              onPress={handleStartFlash}>
              <Text style={styles.startFlashBtnText}>
                {isFlashing ? 'Sedang Berkedip...' : '⚡ Mulai Flash Baru'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MODE 3: DRILL RUMUS GENERATOR */}
        {activeMode === 'drill_generator' && (
          <View style={styles.cardSection}>
            <View style={styles.drillTypeRow}>
              <TouchableOpacity
                style={styles.drillTypeBtn}
                onPress={() => handleGenerateDrill('kawan5')}>
                <Text style={styles.drillTypeBtnText}>Soal Kawan Kecil (5)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.drillTypeBtn, { backgroundColor: '#FF9600', borderBottomColor: '#CC7800' }]}
                onPress={() => handleGenerateDrill('kawan10')}>
                <Text style={styles.drillTypeBtnText}>Soal Kawan Besar (10)</Text>
              </TouchableOpacity>
            </View>

            {drillProblem && (
              <View style={styles.drillProblemCard}>
                <View style={styles.formulaBadge}>
                  <Text style={styles.formulaBadgeText}>
                    Rumus: {drillProblem.formulaHint}
                  </Text>
                </View>
                <Text style={styles.drillPrompt}>{drillProblem.prompt}</Text>

                <AbacusBoard
                  rods={drillRods}
                  onChangeRods={(r) => {
                    if (!drillChecked) setDrillRods(r);
                  }}
                  showDigitLabel={true}
                />

                {drillChecked ? (
                  <View
                    style={[
                      styles.drillFeedbackBox,
                      drillIsCorrect ? styles.feedbackBoxCorrect : styles.feedbackBoxWrong,
                    ]}>
                    <Text
                      style={[
                        styles.drillFeedbackTitle,
                        { color: drillIsCorrect ? '#58CC02' : '#FF4B4B' },
                      ]}>
                      {drillIsCorrect ? '🎉 Benar Sekali!' : '⚠️ Kurang Tepat!'}
                    </Text>
                    <Text style={styles.drillFeedbackText}>
                      {drillProblem.explanation}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.checkDrillBtn}
                    onPress={handleCheckDrill}>
                    <Text style={styles.checkDrillBtnText}>PERIKSA JAWABAN</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3C3C3C',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
    marginTop: 2,
  },
  modeTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    margin: 12,
    borderRadius: 14,
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
  },
  modeTabTextActive: {
    color: '#1CB0F6',
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
  },
  rodSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B4B4B',
  },
  rodPillsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  rodPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rodPillActive: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1899D6',
  },
  rodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  rodPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tipsBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#444',
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  speedPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  speedPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  speedPillActive: {
    backgroundColor: '#FF4B4B',
    borderColor: '#D83A3A',
  },
  speedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  speedPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  flashDisplayContainer: {
    height: 200,
    backgroundColor: '#1A1D24',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    borderWidth: 4,
    borderColor: '#2D323F',
    padding: 16,
  },
  flashNumberBox: {
    alignItems: 'center',
  },
  bigFlashText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#58CC02',
  },
  flashStepText: {
    fontSize: 12,
    color: '#8A92A6',
    marginTop: 6,
  },
  flashReadyBox: {
    alignItems: 'center',
  },
  readyPrompt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  revealBtn: {
    backgroundColor: '#1CB0F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#1899D6',
  },
  revealBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  answerLabel: {
    color: '#A0AEC0',
    fontSize: 12,
    marginBottom: 4,
  },
  bigAnswerText: {
    color: '#FFD700',
    fontSize: 52,
    fontWeight: '900',
  },
  answerExplanation: {
    color: '#CBD5E0',
    fontSize: 13,
    marginTop: 6,
  },
  startFlashBtn: {
    backgroundColor: '#58CC02',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#46A302',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  startFlashBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  drillTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  drillTypeBtn: {
    flex: 1,
    backgroundColor: '#1CB0F6',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1899D6',
  },
  drillTypeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  drillProblemCard: {
    marginTop: 10,
    alignItems: 'center',
  },
  formulaBadge: {
    backgroundColor: '#FFF4D6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  formulaBadgeText: {
    color: '#B57500',
    fontSize: 12,
    fontWeight: '800',
  },
  drillPrompt: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  checkDrillBtn: {
    backgroundColor: '#58CC02',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#46A302',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  checkDrillBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  drillFeedbackBox: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  feedbackBoxCorrect: {
    backgroundColor: '#D7FFB8',
    borderWidth: 1.5,
    borderColor: '#58CC02',
  },
  feedbackBoxWrong: {
    backgroundColor: '#FFDFE0',
    borderWidth: 1.5,
    borderColor: '#FF4B4B',
  },
  drillFeedbackTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  drillFeedbackText: {
    fontSize: 13,
    color: '#4B4B4B',
    fontWeight: '600',
  },
});
