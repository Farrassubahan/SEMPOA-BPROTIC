/**
 * BPROTIC SEMPOA - Duolingo-style Header Bar
 * Designed by Agent 4 (UI/UX Dev) & Agent 8 (User Tester)
 * Displays Streak, Gems, Hearts, Active Profile, and Tutor access.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StudentProfile } from '@/types/student';

interface DuoHeaderProps {
  student: StudentProfile;
  unlimitedHearts?: boolean;
  onPressProfile: () => void;
  onPressTutor: () => void;
}

export function DuoHeader({
  student,
  unlimitedHearts = false,
  onPressProfile,
  onPressTutor,
}: DuoHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {/* Student Profile Switcher Button */}
      <TouchableOpacity
        style={styles.profileButton}
        activeOpacity={0.7}
        onPress={onPressProfile}>
        <Text style={styles.avatarEmoji}>{student.avatar || '⭐'}</Text>
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName} numberOfLines={1}>
            {student.name}
          </Text>
          <Text style={styles.profileBadge}>Ganti Murid ▾</Text>
        </View>
      </TouchableOpacity>

      {/* Gamification Stats: Streak, Gems, Hearts */}
      <View style={styles.statsRow}>
        {/* Streak */}
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statValue, { color: '#FF9600' }]}>
            {student.streakDays}
          </Text>
        </View>

        {/* Gems */}
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💎</Text>
          <Text style={[styles.statValue, { color: '#1CB0F6' }]}>
            {student.gems}
          </Text>
        </View>

        {/* Hearts */}
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={[styles.statValue, { color: '#FF4B4B' }]}>
            {unlimitedHearts ? '∞' : student.hearts}
          </Text>
        </View>

        {/* Tutor Portal Button */}
        <TouchableOpacity
          style={styles.tutorButton}
          activeOpacity={0.7}
          onPress={onPressTutor}>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    zIndex: 10,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    maxWidth: 160,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  profileTextContainer: {
    flexShrink: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3C3C3C',
  },
  profileBadge: {
    fontSize: 9,
    color: '#8A8A8A',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  tutorButton: {
    padding: 6,
    backgroundColor: '#F0F0F3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDCE0',
    marginLeft: 4,
  },
  tutorIcon: {
    fontSize: 16,
  },
});
