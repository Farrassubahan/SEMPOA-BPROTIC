/**
 * BPROTIC SEMPOA - Interactive Virtual Soroban Component
 * Designed by Agent 3 (Engine Dev) & Agent 8 (User Experience Tester)
 * Responsive, child-friendly 1:4 Soroban (1 upper bead = 5, 4 lower beads = 1 each)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { RodDigit, digitToRod, rodToDigit, abacusRodsToNumber } from '@/engine/abacusEngine';
import { sound } from '@/services/sound';

interface AbacusBoardProps {
  rods: RodDigit[];
  onChangeRods?: (newRods: RodDigit[]) => void;
  readOnly?: boolean;
  showDigitLabel?: boolean;
  highlightRodIndex?: number;
  highlightUpper?: boolean;
  highlightLowerIndex?: number;
  onReset?: () => void;
}

export function AbacusBoard({
  rods,
  onChangeRods,
  readOnly = false,
  showDigitLabel = true,
  highlightRodIndex,
  highlightUpper,
  highlightLowerIndex,
  onReset,
}: AbacusBoardProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Calculate dynamic dimensions to guarantee comfortable touch targets
  const rodCount = rods.length;
  const maxBoardWidth = Math.min(width - 32, isTablet ? 720 : 480);
  const rodWidth = Math.max(isTablet ? 64 : 44, Math.floor((maxBoardWidth - 28) / rodCount));
  const beadWidth = Math.floor(rodWidth * 0.85);
  const beadHeight = isTablet ? 34 : 26;

  // Toggle upper bead (value 5)
  const handleToggleUpper = (rodIdx: number) => {
    if (readOnly || !onChangeRods) return;
    sound.playBeadClick();
    const updated = rods.map((rod, idx) => {
      if (idx !== rodIdx) return rod;
      return { ...rod, upperActive: !rod.upperActive };
    });
    onChangeRods(updated);
  };

  // Toggle lower beads (0 to 4)
  const handleLowerBeadPress = (rodIdx: number, beadIndex: number) => {
    if (readOnly || !onChangeRods) return;
    sound.playBeadClick();
    const currentActiveCount = rods[rodIdx].lowerCount;
    // beadIndex is 0 (top lower bead) to 3 (bottom lower bead)
    let newCount = 0;
    if (beadIndex < currentActiveCount) {
      // It was already active, deactivating down to beadIndex
      newCount = beadIndex;
    } else {
      // Deactive, activating up to beadIndex + 1
      newCount = beadIndex + 1;
    }

    const updated = rods.map((rod, idx) => {
      if (idx !== rodIdx) return rod;
      return { ...rod, lowerCount: newCount };
    });
    onChangeRods(updated);
  };

  const handleResetBoard = () => {
    if (readOnly || !onChangeRods) return;
    sound.playBeadClick();
    const zeroRods = rods.map(() => digitToRod(0));
    onChangeRods(zeroRods);
    if (onReset) onReset();
  };

  const totalValue = abacusRodsToNumber(rods);

  return (
    <View style={[styles.outerContainer, { maxWidth: maxBoardWidth }]}>
      {/* Abacus Outer Wood Frame */}
      <View style={styles.frame}>
        {/* Top Header / Reset Button */}
        <View style={styles.frameHeader}>
          <Text style={styles.brandBadge}>BPROTIC SOROBAN</Text>
          {!readOnly && (
            <TouchableOpacity
              onPress={handleResetBoard}
              activeOpacity={0.7}
              style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Bersihkan (0)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Rods Container */}
        <View style={styles.rodsContainer}>
          {rods.map((rod, rodIdx) => {
            const digit = rodToDigit(rod);
            const isUnitRod = rodIdx === Math.floor(rodCount / 2);
            const isRodHighlighted = highlightRodIndex === rodIdx;

            return (
              <View
                key={`rod_${rodIdx}`}
                style={[
                  styles.rodColumn,
                  { width: rodWidth },
                  isRodHighlighted && styles.highlightedColumn,
                ]}>
                {/* Upper Deck (Value 5) */}
                <View style={styles.upperDeck}>
                  {/* Metal Rod Line */}
                  <View style={styles.verticalRodLine} />

                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={readOnly}
                    onPress={() => handleToggleUpper(rodIdx)}
                    style={[
                      styles.bead,
                      styles.upperBead,
                      { width: beadWidth, height: beadHeight },
                      rod.upperActive ? styles.upperBeadActive : styles.upperBeadInactive,
                      isRodHighlighted && highlightUpper && styles.beadGlowing,
                    ]}>
                    <View style={styles.beadGloss} />
                    <Text style={styles.beadNumberHint}>{rod.upperActive ? '5' : ''}</Text>
                  </TouchableOpacity>
                </View>

                {/* Beam / Palang Pemisah */}
                <View style={styles.beam}>
                  {isUnitRod && <View style={styles.unitDot} />}
                </View>

                {/* Lower Deck (4 Beads, each 1) */}
                <View style={styles.lowerDeck}>
                  {/* Metal Rod Line */}
                  <View style={styles.verticalRodLine} />

                  {/* 4 Lower Beads */}
                  <View style={styles.lowerBeadsGroup}>
                    {[0, 1, 2, 3].map((beadIdx) => {
                      const isActive = beadIdx < rod.lowerCount;
                      const isBeadGlowing =
                        isRodHighlighted && highlightLowerIndex === beadIdx;

                      return (
                        <TouchableOpacity
                          key={`lower_${beadIdx}`}
                          activeOpacity={0.8}
                          disabled={readOnly}
                          onPress={() => handleLowerBeadPress(rodIdx, beadIdx)}
                          style={[
                            styles.bead,
                            styles.lowerBead,
                            { width: beadWidth, height: beadHeight },
                            isActive ? styles.lowerBeadActive : styles.lowerBeadInactive,
                            isBeadGlowing && styles.beadGlowing,
                          ]}>
                          <View style={styles.beadGloss} />
                          <Text style={styles.beadNumberHint}>{isActive ? '1' : ''}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Digit Display underneath each rod */}
                {showDigitLabel && (
                  <View style={[styles.digitPill, digit > 0 && styles.digitPillActive]}>
                    <Text style={[styles.digitText, digit > 0 && styles.digitTextActive]}>
                      {digit}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Live Total Value Badge */}
      {showDigitLabel && (
        <View style={styles.totalBadgeContainer}>
          <Text style={styles.totalLabel}>Nilai Sempoa:</Text>
          <Text style={styles.totalValue}>{totalValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 12,
  },
  frame: {
    backgroundColor: '#3D2314', // Deep Rich Wood Tone
    borderRadius: 16,
    borderWidth: 6,
    borderColor: '#24140A',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  frameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#53311C',
  },
  brandBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D4AF37', // Gold Leaf Stamp
    letterSpacing: 1.5,
  },
  resetButton: {
    backgroundColor: '#C53030',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#7B1D1D',
    cursor: 'pointer' as any,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rodsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8EE', // Antique ivory interior
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  rodColumn: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  highlightedColumn: {
    backgroundColor: 'rgba(255, 230, 0, 0.25)',
    borderRadius: 8,
  },
  upperDeck: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  lowerDeck: {
    height: 140,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  verticalRodLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#8C929D', // Stainless Steel Metal Rod
    borderRadius: 2,
    zIndex: 1,
  },
  beam: {
    height: 12,
    width: '100%',
    backgroundColor: '#2A180E',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#422718',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  unitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  lowerBeadsGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  bead: {
    borderRadius: 6,
    backgroundColor: '#E07A2E', // Rich Soroban Amber bead
    borderWidth: 1.5,
    borderColor: '#A84C10',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    cursor: 'pointer' as any,
  },
  upperBead: {
    backgroundColor: '#E65100',
  },
  upperBeadActive: {
    transform: [{ translateY: 24 }], // Pushed down to beam
    backgroundColor: '#FF6D00',
  },
  upperBeadInactive: {
    transform: [{ translateY: 2 }], // Up at the top
    opacity: 0.88,
  },
  lowerBead: {
    backgroundColor: '#E07A2E',
  },
  lowerBeadActive: {
    backgroundColor: '#FF8A3D',
    borderColor: '#C04A00',
  },
  lowerBeadInactive: {
    opacity: 0.88,
  },
  beadGlowing: {
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
  beadGloss: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  beadNumberHint: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  digitPill: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#F0ECE1',
  },
  digitPillActive: {
    backgroundColor: '#58CC02', // Duolingo energetic green
  },
  digitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A847A',
  },
  digitTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  totalBadgeContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777777',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2B70C9',
  },
});
