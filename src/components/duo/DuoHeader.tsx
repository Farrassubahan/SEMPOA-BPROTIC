/**
 * BPROTIC SEMPOA - Duolingo-style Header Bar
 * Designed by Agent 4 (UI/UX Dev) & Agent 8 (User Tester)
 * Rich 3D aesthetics, gamified stats, responsive touch targets.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StudentProfile } from '@/types/student';
import { sound } from '@/services/sound';

interface DuoHeaderProps {
  student: StudentProfile;
  unlimitedHearts?: boolean;
  onPressProfile: () => void;
  onPressTutor: () => void;
  onPressHearts?: () => void;
}

export function DuoHeader({
  student,
  unlimitedHearts = false,
  onPressProfile,
  onPressTutor,
  onPressHearts,
}: DuoHeaderProps) {
  const handleProfilePress = () => {
    sound.playPop();
    onPressProfile();
  };

  const handleTutorPress = () => {
    sound.playPop();
    onPressTutor();
  };

  return (
    <View style={styles.headerContainer}>
      {/* Student Profile Switcher Button */}
      <TouchableOpacity
        style={styles.profileButton}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={handleProfilePress}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{student.avatar || '⭐'}</Text>
        </View>
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName} numberOfLines={1}>
            {student.name}
          </Text>
          <View style={styles.switchBadgeRow}>
            <Text style={styles.profileBadge}>Ganti Murid</Text>
            <Text style={styles.chevronIcon}>▾</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Gamification Stats: Streak, Gems, Hearts & Tutor Settings */}
      <View style={styles.statsRow}>
        {/* Streak Flame Pill */}
        <View style={[styles.statPill, styles.streakPill]}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statValue, { color: '#EA580C' }]}>
            {student.streakDays}
          </Text>
        </View>

        {/* Gems Diamond Pill */}
        <View style={[styles.statPill, styles.gemPill]}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={[styles.statValue, { color: '#0284C7' }]}>
            {student.gems}
          </Text>
        </View>

        {/* Hearts Life Pill */}
        <TouchableOpacity
          style={[styles.statPill, styles.heartPill]}
          activeOpacity={0.7}
          onPress={() => {
            sound.playPop();
            if (onPressHearts) onPressHearts();
          }}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={[styles.statValue, { color: '#DC2626' }]}>
            {unlimitedHearts ? '∞' : student.hearts}
          </Text>
        </TouchableOpacity>

        {/* Tutor / Teacher Portal Button */}
        <TouchableOpacity
          style={styles.tutorButton}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={handleTutorPress}>
          <Text style={styles.tutorIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    zIndex: 100,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 3.5,
    borderBottomColor: '#D1D5DB',
    maxWidth: 160,
    cursor: 'pointer' as any,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  profileTextContainer: {
    flexShrink: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  switchBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  profileBadge: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '700',
  },
  chevronIcon: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  streakPill: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  gemPill: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  heartPill: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statIcon: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  tutorButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 3.5,
    borderBottomColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  tutorIcon: {
    fontSize: 16,
  },
});
