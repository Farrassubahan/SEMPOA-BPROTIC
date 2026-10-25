/**
 * BPROTIC SEMPOA - Duolingo-style Action Validator / Confirmation Modal
 * Designed by Agent 2 (Interactive Validator UI Lead) & Agent 1 (System Architect)
 * Provides tactile, gamified confirmation dialogs replacing ugly browser/native alerts.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { sound } from '@/services/sound';

export interface ConfirmationModalProps {
  visible: boolean;
  type?: 'danger' | 'warning' | 'info' | 'success';
  icon?: string;
  title: string;
  description: string;
  targetBadge?: {
    emoji: string;
    name: string;
    subtitle?: string;
  };
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  type = 'danger',
  icon = '🗑️',
  title,
  description,
  targetBadge,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!visible) return null;

  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  const themeColor = isDanger ? '#FF4B4B' : isWarning ? '#FF9600' : '#1CB0F6';
  const themeBorder = isDanger ? '#DC2626' : isWarning ? '#EA580C' : '#0284C7';
  const themeBgLight = isDanger ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#F0F9FF';

  const handleConfirm = () => {
    sound.playPop();
    onConfirm();
  };

  const handleCancel = () => {
    sound.playPop();
    onCancel();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Top Accent Icon Badge */}
              <View style={[styles.iconCircle, { backgroundColor: themeBgLight, borderColor: themeBorder }]}>
                <Text style={styles.iconEmoji}>{icon}</Text>
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>

              {/* Target Highlight Badge (e.g. Student Card being deleted) */}
              {targetBadge && (
                <View style={styles.targetCard}>
                  <View style={styles.targetAvatarCircle}>
                    <Text style={styles.targetAvatarEmoji}>{targetBadge.emoji}</Text>
                  </View>
                  <View style={styles.targetInfo}>
                    <Text style={styles.targetName} numberOfLines={1}>
                      {targetBadge.name}
                    </Text>
                    {targetBadge.subtitle && (
                      <Text style={styles.targetSub}>{targetBadge.subtitle}</Text>
                    )}
                  </View>
                </View>
              )}

              {/* Warning Micro Note */}
              {isDanger && (
                <View style={styles.warningNoteBox}>
                  <Text style={styles.warningNoteText}>
                    ⚠️ Tindakan ini tidak dapat dibatalkan.
                  </Text>
                </View>
              )}

              {/* 3D Action Buttons Row */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cancelBtn}
                  onPress={handleCancel}>
                  <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.confirmBtn,
                    {
                      backgroundColor: themeColor,
                      borderBottomColor: themeBorder,
                    },
                  ]}
                  onPress={handleConfirm}>
                  <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 99999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D5DB',
    // Elevation & Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  targetCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginBottom: 14,
    gap: 12,
  },
  targetAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  targetAvatarEmoji: {
    fontSize: 24,
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  targetSub: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  warningNoteBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  warningNoteText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
  },
  confirmBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
