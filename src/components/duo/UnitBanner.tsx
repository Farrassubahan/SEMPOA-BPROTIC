/**
 * BPROTIC SEMPOA - Duolingo Unit Banner
 * Designed by Agent 4 (UI/UX Dev)
 * Visual banner marking the beginning of a thematic Unit.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Unit } from '@/types/curriculum';

interface UnitBannerProps {
  unit: Unit;
}

export function UnitBanner({ unit }: UnitBannerProps) {
  return (
    <View style={[styles.bannerContainer, { backgroundColor: unit.color }]}>
      <View style={styles.topRow}>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeBadgeText}>{unit.gradeTitle}</Text>
        </View>
        <Text style={styles.unitNumber}>UNIT {unit.unitNumber}</Text>
      </View>

      <Text style={styles.unitTitle}>{unit.title}</Text>
      <Text style={styles.unitDesc}>{unit.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 16,
    borderRadius: 18,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gradeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gradeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  unitNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    opacity: 0.9,
  },
  unitTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  unitDesc: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
