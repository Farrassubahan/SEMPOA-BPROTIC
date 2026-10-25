/**
 * BPROTIC SEMPOA - Duolingo Winding Path Node Component
 * Designed by Agent 4 (UI/UX Dev) & Agent 8 (User Tester)
 * 3D bouncy circular nodes arranged along an adventurous learning path.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LessonNode } from '@/types/curriculum';

interface PathNodeProps {
  node: LessonNode;
  status: 'locked' | 'active' | 'completed';
  stars?: number;
  offset: 'left' | 'center' | 'right';
  unitColor: string;
  onPress: () => void;
}

export function PathNode({
  node,
  status,
  stars = 0,
  offset,
  unitColor,
  onPress,
}: PathNodeProps) {
  // Calculate horizontal offset
  let translateX = 0;
  if (offset === 'left') translateX = -45;
  if (offset === 'right') translateX = 45;

  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  // Determine icon & colors
  let nodeIcon = '⭐';
  if (node.type === 'chest') nodeIcon = isCompleted ? '🎁' : '📦';
  else if (node.type === 'quiz_boss') nodeIcon = isCompleted ? '👑' : '🏆';
  else if (isCompleted) nodeIcon = '✓';

  const baseColor = isLocked ? '#E5E5E5' : isCompleted ? '#FFC800' : unitColor;
  const shadowColor = isLocked ? '#CECECE' : isCompleted ? '#CCA000' : '#46A302';

  return (
    <View style={[styles.nodeWrapper, { transform: [{ translateX }] }]}>
      {/* Active "MULAI" Tooltip Bubble */}
      {isActive && (
        <View style={[styles.activeBubble, { borderColor: unitColor }]}>
          <Text style={[styles.activeBubbleText, { color: unitColor }]}>MULAI</Text>
          <View style={[styles.activeBubbleArrow, { borderTopColor: unitColor }]} />
        </View>
      )}

      {/* Main 3D Node Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isLocked}
        onPress={onPress}
        style={[
          styles.nodeCircle,
          {
            backgroundColor: baseColor,
            borderBottomColor: shadowColor,
          },
          isActive && styles.activeGlow,
        ]}>
        <Text style={[styles.nodeEmoji, isCompleted && styles.completedCheck]}>
          {nodeIcon}
        </Text>
      </TouchableOpacity>

      {/* Node Title & Star Rating */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.nodeTitle, isLocked && styles.lockedText]}
          numberOfLines={1}>
          {node.title}
        </Text>
        {isCompleted && (
          <View style={styles.starsRow}>
            {[1, 2, 3].map((s) => (
              <Text key={`s_${s}`} style={styles.starIcon}>
                {s <= stars ? '★' : '☆'}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nodeWrapper: {
    alignItems: 'center',
    marginVertical: 18,
    position: 'relative',
  },
  activeBubble: {
    position: 'absolute',
    top: -34,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 5,
  },
  activeBubbleText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  activeBubbleArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  nodeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  activeGlow: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  nodeEmoji: {
    fontSize: 30,
  },
  completedCheck: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  titleContainer: {
    marginTop: 8,
    alignItems: 'center',
    maxWidth: 140,
  },
  nodeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B4B4B',
    textAlign: 'center',
  },
  lockedText: {
    color: '#AFAFAF',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  starIcon: {
    fontSize: 12,
    color: '#FFC800',
  },
});
