/**
 * BPROTIC SEMPOA - Secure Tutor & Teacher Portal Modal
 * Designed by Agent 7 (Security Lead) & Agent 8 (Tutor Persona Tester)
 * Protected by 4-digit PIN for class management and diagnosis.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { TutorConfig, StudentProfile } from '@/types/student';
import { verifyPin } from '@/services/security';

interface TutorPortalModalProps {
  visible: boolean;
  config: TutorConfig;
  student: StudentProfile;
  onUpdateConfig: (newConfig: TutorConfig) => void;
  onClose: () => void;
}

export function TutorPortalModal({
  visible,
  config,
  student,
  onUpdateConfig,
  onClose,
}: TutorPortalModalProps) {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'diagnosis'>('settings');

  // Handle 4-digit keypad entry
  const handleDigitPress = (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        if (verifyPin(nextPin, config.pinHash)) {
          setIsAuthenticated(true);
        } else {
          setPinError(true);
          setTimeout(() => setPinInput(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClose = () => {
    setPinInput('');
    setIsAuthenticated(false);
    setPinError(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Portal Guru BPROTIC</Text>
          <View style={{ width: 30 }} />
        </View>

        {!isAuthenticated ? (
          /* PIN Entry Screen */
          <View style={styles.pinContainer}>
            <Text style={styles.pinIcon}>🔒</Text>
            <Text style={styles.pinPrompt}>Masukkan PIN Pengajar</Text>
            <Text style={styles.pinSubprompt}>PIN Default: 1234</Text>

            {/* PIN Dots */}
            <View style={styles.pinDotsRow}>
              {[0, 1, 2, 3].map((idx) => (
                <View
                  key={idx}
                  style={[
                    styles.pinDot,
                    idx < pinInput.length && styles.pinDotFilled,
                    pinError && styles.pinDotError,
                  ]}
                />
              ))}
            </View>
            {pinError && (
              <Text style={styles.errorText}>PIN Salah! Silakan coba lagi.</Text>
            )}

            {/* Numeric Keypad */}
            <View style={styles.keypadGrid}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadBtn}
                  onPress={() => handleDigitPress(num)}>
                  <Text style={styles.keypadText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.keypadBtnPlaceholder} />
              <TouchableOpacity
                style={styles.keypadBtn}
                onPress={() => handleDigitPress('0')}>
                <Text style={styles.keypadText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadBtn} onPress={handleBackspace}>
                <Text style={styles.keypadText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Authenticated Tutor Dashboard */
          <ScrollView contentContainerStyle={styles.dashboardContent}>
            {/* Tab Switcher */}
            <View style={styles.tabSwitcher}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'settings' && styles.tabBtnActive]}
                onPress={() => setActiveTab('settings')}>
                <Text
                  style={[
                    styles.tabBtnText,
                    activeTab === 'settings' && styles.tabBtnTextActive,
                  ]}>
                  Pengaturan Kelas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'diagnosis' && styles.tabBtnActive]}
                onPress={() => setActiveTab('diagnosis')}>
                <Text
                  style={[
                    styles.tabBtnText,
                    activeTab === 'diagnosis' && styles.tabBtnTextActive,
                  ]}>
                  Raport & Diagnosa
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'settings' ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Kontrol Jam Belajar</Text>

                {/* Unlimited Hearts Toggle */}
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Nyawa Tak Terbatas</Text>
                    <Text style={styles.settingDesc}>
                      Murid tidak kehabisan nyawa saat salah di kelas les
                    </Text>
                  </View>
                  <Switch
                    value={config.unlimitedHearts}
                    onValueChange={(val) =>
                      onUpdateConfig({ ...config, unlimitedHearts: val })
                    }
                    trackColor={{ false: '#767577', true: '#58CC02' }}
                  />
                </View>

                {/* Unlock All Levels Toggle */}
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Buka Semua Materi</Text>
                    <Text style={styles.settingDesc}>
                      Akses bebas ke semua unit untuk demonstrasi guru
                    </Text>
                  </View>
                  <Switch
                    value={config.unlockAllLevels}
                    onValueChange={(val) =>
                      onUpdateConfig({ ...config, unlockAllLevels: val })
                    }
                    trackColor={{ false: '#767577', true: '#1CB0F6' }}
                  />
                </View>

                {/* Sound Effects Toggle */}
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Efek Suara Sempoa</Text>
                    <Text style={styles.settingDesc}>Suara klik manik kayu & lonceng</Text>
                  </View>
                  <Switch
                    value={config.soundEnabled}
                    onValueChange={(val) =>
                      onUpdateConfig({ ...config, soundEnabled: val })
                    }
                    trackColor={{ false: '#767577', true: '#58CC02' }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  Diagnosa Murid: {student.avatar} {student.name}
                </Text>

                <View style={styles.summaryStatsBox}>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryVal}>{student.totalXp}</Text>
                    <Text style={styles.summaryLabel}>Total XP</Text>
                  </View>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryVal}>
                      {student.completedNodeIds.length}
                    </Text>
                    <Text style={styles.summaryLabel}>Node Selesai</Text>
                  </View>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryVal}>{student.streakDays} Hari</Text>
                    <Text style={styles.summaryLabel}>Streak Latihan</Text>
                  </View>
                </View>

                <Text style={styles.subTitle}>Rekap Rumus yang Sering Keliru:</Text>
                {Object.keys(student.weakFormulas || {}).length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyEmoji}>🌟</Text>
                    <Text style={styles.emptyText}>
                      Luar biasa! Murid ini belum mencatat kesalahan rumus.
                    </Text>
                  </View>
                ) : (
                  Object.entries(student.weakFormulas).map(([code, count]) => (
                    <View key={code} style={styles.weakFormulaItem}>
                      <View>
                        <Text style={styles.formulaCodeText}>{code}</Text>
                        <Text style={styles.formulaHelpText}>
                          Perlu bimbingan ulang pada rumus ini
                        </Text>
                      </View>
                      <View style={styles.errorCountBadge}>
                        <Text style={styles.errorCountText}>{count}x Keliru</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#888',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3C3C3C',
  },
  pinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pinIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  pinPrompt: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  pinSubprompt: {
    fontSize: 13,
    color: '#8A8A8A',
    fontWeight: '600',
    marginBottom: 24,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 28,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CCC',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1CB0F6',
  },
  pinDotError: {
    backgroundColor: '#FF4B4B',
    borderColor: '#FF4B4B',
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 260,
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  keypadBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderBottomWidth: 3,
  },
  keypadBtnPlaceholder: {
    width: 68,
    height: 68,
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3C3C3C',
  },
  dashboardContent: {
    padding: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
  },
  tabBtnTextActive: {
    color: '#1CB0F6',
    fontWeight: '900',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#3C3C3C',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3C3C3C',
  },
  settingDesc: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  summaryStatsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1CB0F6',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    fontWeight: '600',
    marginTop: 2,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#555',
    marginBottom: 10,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },
  weakFormulaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  formulaCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EA2B2B',
  },
  formulaHelpText: {
    fontSize: 11,
    color: '#888',
  },
  errorCountBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  errorCountText: {
    color: '#D8000C',
    fontSize: 11,
    fontWeight: '800',
  },
});
