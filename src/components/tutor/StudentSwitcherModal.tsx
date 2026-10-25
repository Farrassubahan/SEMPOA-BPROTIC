/**
 * BPROTIC SEMPOA - Multi-Student Profile Switcher Modal
 * Designed by Agent 4 (UI/UX Dev), Agent 8 (User Tester) & Audited by Agent 6
 * Playful, Gamified Duolingo-style UI with responsive scrolling & 3D buttons.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudentProfile } from '@/types/student';
import { GradeLevel } from '@/types/curriculum';
import { createNewStudent } from '@/services/storage';
import { sound } from '@/services/sound';

interface StudentSwitcherModalProps {
  visible: boolean;
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddStudent: (student: StudentProfile) => void;
  onDeleteStudent?: (id: string) => void;
  onClose: () => void;
}

interface AvatarItem {
  emoji: string;
  name: string;
  bg: string;
  border: string;
}

const AVATAR_OPTIONS: AvatarItem[] = [
  { emoji: '🦁', name: 'Simba', bg: '#FFF7ED', border: '#FF9600' },
  { emoji: '🐰', name: 'Mochi', bg: '#FDF2F8', border: '#EC4899' },
  { emoji: '🦅', name: 'Altair', bg: '#F0F9FF', border: '#0284C7' },
  { emoji: '🐼', name: 'BaoBao', bg: '#F0FDF4', border: '#16A34A' },
  { emoji: '🦊', name: 'Kitsune', bg: '#FFFBEB', border: '#D97706' },
  { emoji: '🐯', name: 'Tora', bg: '#FEF2F2', border: '#DC2626' },
  { emoji: '🚀', name: 'Cosmo', bg: '#FAF5FF', border: '#9333EA' },
  { emoji: '⭐', name: 'Starry', bg: '#FEFCE8', border: '#CA8A04' },
];

interface GradeOption {
  label: string;
  sub: string;
  icon: string;
  value: GradeLevel;
  color: string;
}

const GRADE_OPTIONS: GradeOption[] = [
  { label: 'SD 1-2', sub: 'Dasar (Kyu 10-8)', icon: '🎒', value: 'sd_rendah', color: '#58CC02' },
  { label: 'SD 3-4', sub: 'Menengah (Kyu 7-5)', icon: '📘', value: 'sd_tinggi', color: '#1CB0F6' },
  { label: 'SD 5-6', sub: 'Mahir (Kyu 4-2)', icon: '📐', value: 'sd_mahir', color: '#FF9600' },
  { label: 'SMP', sub: 'Advance (Kyu 1-Dan 1)', icon: '⚡', value: 'smp', color: '#A855F7' },
  { label: 'SMA', sub: 'Master (Dan 2-5)', icon: '🎓', value: 'sma', color: '#EF4444' },
];

export function StudentSwitcherModal({
  visible,
  students,
  activeStudentId,
  onSelectStudent,
  onAddStudent,
  onDeleteStudent,
  onClose,
}: StudentSwitcherModalProps) {
  const insets = useSafeAreaInsets();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('sd_rendah');

  const handleSelectAvatar = (av: string) => {
    sound.playPop();
    setSelectedAvatar(av);
  };

  const handleSelectGrade = (gr: GradeLevel) => {
    sound.playPop();
    setSelectedGrade(gr);
  };

  const handleSaveNewStudent = () => {
    if (!newName.trim()) return;
    sound.playCorrect();
    const newStudent = createNewStudent(newName, selectedGrade, selectedAvatar);
    onAddStudent(newStudent);
    onSelectStudent(newStudent.id);
    setIsAdding(false);
    setNewName('');
    onClose();
  };

  const handleDelete = (id: string, name: string) => {
    sound.playPop();
    if (students.length <= 1) {
      if (Platform.OS === 'web') {
        window.alert('Minimal harus ada 1 murid di dalam kelas!');
      } else {
        Alert.alert('Perhatian', 'Minimal harus ada 1 murid di dalam kelas!');
      }
      return;
    }

    const doDelete = () => {
      if (onDeleteStudent) {
        onDeleteStudent(id);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Hapus akun murid "${name}"?`)) {
        doDelete();
      }
    } else {
      Alert.alert('Hapus Murid', `Apakah Anda yakin ingin menghapus profil "${name}"?`, [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        {/* Backdrop overlay */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={onClose}
        />

        <View
          style={[
            styles.modalContent,
            {
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          {/* Top handle pill for mobile */}
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.headerEmoji}>{isAdding ? '✨' : '👥'}</Text>
              <View>
                <Text style={styles.modalTitle}>
                  {isAdding ? 'Tambah Murid Baru' : 'Pilih Akun Murid'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isAdding
                    ? 'Buat profil belajar untuk murid baru'
                    : 'Ganti akun untuk melanjutkan progres les'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                sound.playPop();
                if (isAdding) {
                  setIsAdding(false);
                } else {
                  onClose();
                }
              }}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isAdding ? (
            /* FORM: TAMBAH MURID BARU */
            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {/* Section 1: Avatar Kartun */}
              <View style={styles.fieldSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Pilih Avatar Karakter:</Text>
                  <Text style={styles.badgeHint}>8 Pilihan</Text>
                </View>

                <View style={styles.avatarGrid}>
                  {AVATAR_OPTIONS.map((item) => {
                    const isSelected = selectedAvatar === item.emoji;
                    return (
                      <TouchableOpacity
                        key={item.name}
                        activeOpacity={0.8}
                        onPress={() => handleSelectAvatar(item.emoji)}
                        style={[
                          styles.avatarCard,
                          { backgroundColor: item.bg },
                          isSelected && [
                            styles.avatarCardActive,
                            { borderColor: item.border },
                          ],
                        ]}>
                        <Text style={styles.avatarEmoji}>{item.emoji}</Text>
                        <Text
                          style={[
                            styles.avatarName,
                            isSelected && { color: item.border, fontWeight: '800' },
                          ]}
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                        {isSelected && (
                          <View
                            style={[
                              styles.checkmarkBadge,
                              { backgroundColor: item.border },
                            ]}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Section 2: Nama Panggilan */}
              <View style={styles.fieldSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Nama Panggilan Murid:</Text>
                  <Text style={styles.charCountText}>{newName.length}/20</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputPrefixIcon}>👤</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Contoh: Kenzo, Nayla, Bintang..."
                    placeholderTextColor="#A0A0A0"
                    value={newName}
                    onChangeText={setNewName}
                    maxLength={20}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                  {newName.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setNewName('')}
                      style={styles.clearInputBtn}>
                      <Text style={styles.clearInputText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Section 3: Tingkat / Jenjang Sekolah */}
              <View style={styles.fieldSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Tingkat / Jenjang:</Text>
                  <Text style={styles.badgeHint}>Sesuaikan kemampuan</Text>
                </View>

                <View style={styles.gradeGrid}>
                  {GRADE_OPTIONS.map((gr, idx) => {
                    const isSelected = selectedGrade === gr.value;
                    const isFullWidth = idx === GRADE_OPTIONS.length - 1; // SMA full width
                    return (
                      <TouchableOpacity
                        key={gr.value}
                        activeOpacity={0.8}
                        onPress={() => handleSelectGrade(gr.value)}
                        style={[
                          styles.gradeCard,
                          isFullWidth && styles.gradeCardFull,
                          isSelected && [
                            styles.gradeCardActive,
                            { borderColor: gr.color, backgroundColor: `${gr.color}15` },
                          ],
                        ]}>
                        <Text style={styles.gradeIcon}>{gr.icon}</Text>
                        <View style={styles.gradeInfo}>
                          <Text
                            style={[
                              styles.gradeTitle,
                              isSelected && { color: gr.color, fontWeight: '900' },
                            ]}>
                            {gr.label}
                          </Text>
                          <Text style={styles.gradeSub}>{gr.sub}</Text>
                        </View>
                        {isSelected && (
                          <View
                            style={[
                              styles.gradeActiveDot,
                              { backgroundColor: gr.color },
                            ]}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.formActionRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cancelBtn}
                  onPress={() => {
                    sound.playPop();
                    setIsAdding(false);
                  }}>
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.saveBtn,
                    !newName.trim() && styles.saveBtnDisabled,
                  ]}
                  disabled={!newName.trim()}
                  onPress={handleSaveNewStudent}>
                  <Text style={styles.saveBtnText}>✓ Simpan Murid</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            /* LIST: PILIH AKUN MURID */
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.listScrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Classroom Greeting Banner */}
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeEmoji}>🧮</Text>
                <View style={styles.welcomeTextCol}>
                  <Text style={styles.welcomeTitle}>Kelas Les BPROTIC</Text>
                  <Text style={styles.welcomeSub}>
                    Total {students.length} murid terdaftar di perangkat ini
                  </Text>
                </View>
              </View>

              {/* Student Cards List */}
              <View style={styles.cardsContainer}>
                {students.map((item) => {
                  const isActive = item.id === activeStudentId;
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.studentCard,
                        isActive && styles.studentCardActive,
                      ]}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          sound.playPop();
                          onSelectStudent(item.id);
                          onClose();
                        }}
                        style={styles.cardMainTouch}>
                        {/* Avatar with circle frame */}
                        <View
                          style={[
                            styles.avatarFrame,
                            isActive && styles.avatarFrameActive,
                          ]}>
                          <Text style={styles.cardAvatarText}>{item.avatar}</Text>
                        </View>

                        {/* Name & Stats */}
                        <View style={styles.cardInfo}>
                          <View style={styles.nameRow}>
                            <Text style={styles.cardName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            {isActive && (
                              <View style={styles.activePill}>
                                <Text style={styles.activePillText}>Aktif</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.statChipsRow}>
                            <View style={[styles.statChip, { backgroundColor: '#FFF7ED' }]}>
                              <Text style={styles.statChipText}>
                                🔥 {item.streakDays}d
                              </Text>
                            </View>
                            <View style={[styles.statChip, { backgroundColor: '#F0FDF4' }]}>
                              <Text style={styles.statChipText}>
                                ⭐ {item.totalXp} XP
                              </Text>
                            </View>
                            <View style={[styles.statChip, { backgroundColor: '#F0F9FF' }]}>
                              <Text style={styles.statChipText}>
                                💎 {item.gems}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>

                      {/* Delete button (only if > 1 student) */}
                      {students.length > 1 && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handleDelete(item.id, item.name)}
                          style={styles.deleteBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Text style={styles.deleteBtnText}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Add New Student Button */}
              <TouchableOpacity
                style={styles.addNewButton}
                activeOpacity={0.8}
                onPress={() => {
                  sound.playPop();
                  setIsAdding(true);
                }}>
                <Text style={styles.addNewButtonIcon}>➕</Text>
                <Text style={styles.addNewButtonText}>Tambah Murid Baru</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: 20,
    paddingTop: 8,
    // Web shadow & native elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F0F0F0',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerEmoji: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2B2B2B',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  closeText: {
    fontSize: 16,
    color: '#71717A',
    fontWeight: '900',
  },

  /* FORM STYLES */
  formScroll: {
    maxHeight: 520,
  },
  formScrollContent: {
    paddingBottom: 24,
  },
  fieldSection: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  badgeHint: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  charCountText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
  },

  /* AVATAR GRID */
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  avatarCard: {
    width: '22.5%',
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'transparent',
    padding: 4,
    position: 'relative',
    cursor: 'pointer' as any,
  },
  avatarCardActive: {
    transform: [{ scale: 1.05 }],
  },
  avatarEmoji: {
    fontSize: 28,
  },
  avatarName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  checkmarkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  /* INPUT */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 50,
  },
  inputPrefixIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    paddingVertical: 0,
  },
  clearInputBtn: {
    padding: 6,
    cursor: 'pointer' as any,
  },
  clearInputText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '800',
  },

  /* GRADE GRID */
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gradeCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    gap: 8,
    cursor: 'pointer' as any,
  },
  gradeCardFull: {
    width: '100%',
  },
  gradeCardActive: {
    backgroundColor: '#F3FCED',
  },
  gradeIcon: {
    fontSize: 20,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  gradeSub: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 1,
  },
  gradeActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  /* FORM ACTIONS */
  formActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '800',
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#58CC02',
    borderBottomWidth: 4,
    borderBottomColor: '#46A302',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  /* LIST STYLES */
  listScroll: {
    maxHeight: 520,
  },
  listScrollContent: {
    paddingBottom: 24,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  welcomeEmoji: {
    fontSize: 26,
  },
  welcomeTextCol: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  welcomeSub: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 1,
  },
  cardsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    backgroundColor: '#FFFFFF',
  },
  studentCardActive: {
    borderColor: '#58CC02',
    borderBottomColor: '#46A302',
    backgroundColor: '#F7FDF4',
  },
  cardMainTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer' as any,
  },
  avatarFrame: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarFrameActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  cardAvatarText: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  activePill: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  statChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  statChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 6,
    cursor: 'pointer' as any,
  },
  deleteBtnText: {
    fontSize: 18,
    opacity: 0.6,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1CB0F6',
    paddingVertical: 14,
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#1899D6',
    gap: 8,
    cursor: 'pointer' as any,
  },
  addNewButtonIcon: {
    fontSize: 16,
  },
  addNewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
