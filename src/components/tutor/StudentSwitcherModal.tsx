/**
 * BPROTIC SEMPOA - Multi-Student Profile Switcher Modal
 * Designed by Agent 4 (UI/UX) & Agent 8 (Child & Tutor Persona Tester)
 * Allows seamless classroom tablet sharing among multiple students.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { StudentProfile } from '@/types/student';
import { GradeLevel } from '@/types/curriculum';
import { createNewStudent } from '@/services/storage';

interface StudentSwitcherModalProps {
  visible: boolean;
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddStudent: (student: StudentProfile) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = ['🦁', '🐰', '🦅', '🐼', '🦊', '🐯', '🚀', '⭐'];

const GRADE_OPTIONS: { label: string; value: GradeLevel }[] = [
  { label: 'Kelas 1-2 SD (Dasar)', value: 'sd_rendah' },
  { label: 'Kelas 3-4 SD (Menengah)', value: 'sd_tinggi' },
  { label: 'Kelas 5-6 SD (Mahir)', value: 'sd_mahir' },
  { label: 'Kelas 1-3 SMP (Advance)', value: 'smp' },
  { label: 'Kelas 1-3 SMA (Master)', value: 'sma' },
];

export function StudentSwitcherModal({
  visible,
  students,
  activeStudentId,
  onSelectStudent,
  onAddStudent,
  onClose,
}: StudentSwitcherModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('sd_rendah');

  const handleSaveNewStudent = () => {
    if (!newName.trim()) return;
    const newStudent = createNewStudent(newName, selectedGrade, selectedAvatar);
    onAddStudent(newStudent);
    onSelectStudent(newStudent.id);
    setIsAdding(false);
    setNewName('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isAdding ? 'Tambah Murid Baru' : 'Pilih Akun Murid'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isAdding ? (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Pilih Avatar Kartun:</Text>
              <View style={styles.avatarRow}>
                {AVATAR_OPTIONS.map((av) => (
                  <TouchableOpacity
                    key={av}
                    onPress={() => setSelectedAvatar(av)}
                    style={[
                      styles.avatarBtn,
                      selectedAvatar === av && styles.avatarBtnActive,
                    ]}>
                    <Text style={styles.avatarText}>{av}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Nama Panggilan Murid:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Kenzo, Bintang, Nayla..."
                value={newName}
                onChangeText={setNewName}
                maxLength={20}
              />

              <Text style={styles.label}>Tingkat / Jenjang:</Text>
              <View style={styles.gradeContainer}>
                {GRADE_OPTIONS.map((gr) => (
                  <TouchableOpacity
                    key={gr.value}
                    onPress={() => setSelectedGrade(gr.value)}
                    style={[
                      styles.gradePill,
                      selectedGrade === gr.value && styles.gradePillActive,
                    ]}>
                    <Text
                      style={[
                        styles.gradePillText,
                        selectedGrade === gr.value && styles.gradePillTextActive,
                      ]}>
                      {gr.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formActionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsAdding(false)}>
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveBtn, !newName.trim() && styles.saveBtnDisabled]}
                  disabled={!newName.trim()}
                  onPress={handleSaveNewStudent}>
                  <Text style={styles.saveBtnText}>Simpan Murid</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isActive = item.id === activeStudentId;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelectStudent(item.id);
                        onClose();
                      }}
                      style={[styles.studentCard, isActive && styles.studentCardActive]}>
                      <Text style={styles.cardAvatar}>{item.avatar}</Text>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <Text style={styles.cardStats}>
                          🔥 {item.streakDays} hari • ⭐ {item.totalXp} XP • 💎 {item.gems}
                        </Text>
                      </View>
                      {isActive && (
                        <View style={styles.activeCheckPill}>
                          <Text style={styles.activeCheckText}>Aktif</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity
                style={styles.addNewButton}
                activeOpacity={0.8}
                onPress={() => setIsAdding(true)}>
                <Text style={styles.addNewButtonText}>+ Tambah Profil Murid Lain</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3C3C3C',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 20,
    color: '#999',
    fontWeight: '800',
  },
  listContainer: {
    maxHeight: 400,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  studentCardActive: {
    borderColor: '#58CC02',
    backgroundColor: '#F3FCED',
  },
  cardAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3C3C3C',
  },
  cardStats: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
    marginTop: 2,
  },
  activeCheckPill: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeCheckText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  addNewButton: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    borderBottomWidth: 4,
    borderBottomColor: '#1899D6',
  },
  addNewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  formContainer: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B4B4B',
    marginBottom: 8,
    marginTop: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarBtnActive: {
    borderColor: '#58CC02',
    backgroundColor: '#E8FADE',
  },
  avatarText: {
    fontSize: 22,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#3C3C3C',
  },
  gradeContainer: {
    gap: 6,
    marginBottom: 16,
  },
  gradePill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
  },
  gradePillActive: {
    borderColor: '#1CB0F6',
    backgroundColor: '#EBF7FE',
  },
  gradePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  gradePillTextActive: {
    color: '#1CB0F6',
    fontWeight: '800',
  },
  formActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#777',
    fontWeight: '800',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#46A302',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '900',
  },
});
