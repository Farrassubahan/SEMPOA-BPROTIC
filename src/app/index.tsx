/**
 * BPROTIC SEMPOA - Main Learning Path Screen (Duolingo Style)
 * Orchestrated by the 8-Agent Task Force
 * Offline-first, responsive, gamified Soroban education for SD 1 - SMA 3.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRICULUM_UNITS } from '@/data/curriculum';
import { LessonNode, GradeLevel } from '@/types/curriculum';
import { StudentProfile, TutorConfig } from '@/types/student';
import {
  loadStudents,
  saveStudents,
  getActiveStudentId,
  setActiveStudentId,
  loadTutorConfig,
  saveTutorConfig,
} from '@/services/storage';
import { DuoHeader } from '@/components/duo/DuoHeader';
import { UnitBanner } from '@/components/duo/UnitBanner';
import { PathNode } from '@/components/duo/PathNode';
import { LessonRunnerModal } from '@/components/duo/LessonRunnerModal';
import { StudentSwitcherModal } from '@/components/tutor/StudentSwitcherModal';
import { TutorPortalModal } from '@/components/tutor/TutorPortalModal';
import { HeartRefillModal } from '@/components/duo/HeartRefillModal';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const insets = useSafeAreaInsets();

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [activeStudentId, setActiveId] = useState<string>('');
  const [tutorConfig, setTutorConfig] = useState<TutorConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter grade level
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | GradeLevel>('all');

  // Modals
  const [activeLessonNode, setActiveLessonNode] = useState<LessonNode | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);

  // Load offline data on start
  useEffect(() => {
    async function initData() {
      const loadedStudents = await loadStudents();
      const currentActiveId = await getActiveStudentId();
      const config = await loadTutorConfig();

      setStudents(loadedStudents);
      setActiveId(currentActiveId);
      setTutorConfig(config);
      setIsLoading(false);
    }
    initData();
  }, []);

  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === activeStudentId) || students[0];
  }, [students, activeStudentId]);

  // Handle switching active student profile
  const handleSelectStudent = async (id: string) => {
    setActiveId(id);
    await setActiveStudentId(id);
  };

  // Handle adding new student
  const handleAddStudent = async (newStudent: StudentProfile) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    await saveStudents(updated);
  };

  // Handle deleting student profile
  const handleDeleteStudent = async (id: string) => {
    if (students.length <= 1) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    await saveStudents(updated);

    if (activeStudentId === id && updated.length > 0) {
      const nextId = updated[0].id;
      setActiveId(nextId);
      await setActiveStudentId(nextId);
    }
  };

  // Handle updating tutor config
  const handleUpdateTutorConfig = async (newConfig: TutorConfig) => {
    setTutorConfig(newConfig);
    await saveTutorConfig(newConfig);
  };

  // Handle spending gems (e.g. for instant heart refill)
  const handleSpendGems = async (amount: number) => {
    if (!activeStudent) return;
    const updatedStudent: StudentProfile = {
      ...activeStudent,
      gems: Math.max(0, activeStudent.gems - amount),
    };
    const updatedList = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updatedList);
    await saveStudents(updatedList);
  };

  // Handle refilling student hearts from mini-challenge or gem exchange
  const handleRefillHearts = async (newHearts: number, gemsSpent: number) => {
    if (!activeStudent) return;
    const updatedStudent: StudentProfile = {
      ...activeStudent,
      hearts: newHearts,
      gems: Math.max(0, activeStudent.gems - gemsSpent),
    };
    const updatedList = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updatedList);
    await saveStudents(updatedList);
  };

  // Handle lesson completion
  const handleCompleteLesson = async (result: {
    nodeId: string;
    stars: number;
    accuracy: number;
    xpEarned: number;
    gemEarned: number;
    weakFormulas?: Record<string, number>;
  }) => {
    if (!activeStudent) return;

    // Find next node in sequence to unlock
    let nextNodeIdToUnlock: string | null = null;
    let foundCurrent = false;

    for (const unit of CURRICULUM_UNITS) {
      for (const node of unit.nodes) {
        if (foundCurrent) {
          nextNodeIdToUnlock = node.id;
          break;
        }
        if (node.id === result.nodeId) {
          foundCurrent = true;
        }
      }
      if (nextNodeIdToUnlock) break;
    }

    const updatedUnlocked = [...activeStudent.unlockedNodeIds];
    if (nextNodeIdToUnlock && !updatedUnlocked.includes(nextNodeIdToUnlock)) {
      updatedUnlocked.push(nextNodeIdToUnlock);
    }

    const updatedCompleted = activeStudent.completedNodeIds.includes(result.nodeId)
      ? activeStudent.completedNodeIds
      : [...activeStudent.completedNodeIds, result.nodeId];

    const updatedNodeScores = {
      ...activeStudent.nodeScores,
      [result.nodeId]: {
        stars: Math.max(result.stars, activeStudent.nodeScores[result.nodeId]?.stars || 0),
        accuracy: result.accuracy,
        bestTimeSeconds: 45,
        completedAt: new Date().toISOString(),
      },
    };

    // Merge weak formulas for tutor diagnostics
    const mergedWeakFormulas = { ...(activeStudent.weakFormulas || {}) };
    if (result.weakFormulas) {
      Object.entries(result.weakFormulas).forEach(([code, count]) => {
        mergedWeakFormulas[code] = (mergedWeakFormulas[code] || 0) + count;
      });
    }

    const updatedStudent: StudentProfile = {
      ...activeStudent,
      totalXp: activeStudent.totalXp + result.xpEarned,
      gems: activeStudent.gems + result.gemEarned,
      unlockedNodeIds: updatedUnlocked,
      completedNodeIds: updatedCompleted,
      nodeScores: updatedNodeScores,
      weakFormulas: mergedWeakFormulas,
    };

    const updatedList = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updatedList);
    await saveStudents(updatedList);
  };

  if (isLoading || !activeStudent || !tutorConfig) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58CC02" />
        <Text style={styles.loadingText}>Memuat BPROTIC SEMPOA...</Text>
      </View>
    );
  }

  // Filter units according to grade level selection
  const filteredUnits = CURRICULUM_UNITS.filter((u) => {
    if (selectedGradeFilter === 'all') return true;
    return u.gradeLevel === selectedGradeFilter;
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 10),
        },
      ]}>
      {/* Top Duolingo Gamification Header */}
      <DuoHeader
        student={activeStudent}
        unlimitedHearts={tutorConfig.unlimitedHearts}
        onPressProfile={() => setShowStudentModal(true)}
        onPressTutor={() => setShowTutorModal(true)}
        onPressHearts={() => setShowHeartModal(true)}
      />

      {/* Grade Level Quick Filter Bar */}
      <View style={styles.filterScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}>
          {[
            { label: 'Semua Tingkat', value: 'all' },
            { label: 'SD 1-2 (Dasar)', value: 'sd_rendah' },
            { label: 'SD 3-4 (Menengah)', value: 'sd_tinggi' },
            { label: 'SD 5-6 (Mahir)', value: 'sd_mahir' },
            { label: 'SMP (Kyu 1 - Dan 1)', value: 'smp' },
            { label: 'SMA (Grandmaster)', value: 'sma' },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              activeOpacity={0.7}
              onPress={() => setSelectedGradeFilter(item.value as any)}
              style={[
                styles.filterPill,
                selectedGradeFilter === item.value && styles.filterPillActive,
              ]}>
              <Text
                style={[
                  styles.filterPillText,
                  selectedGradeFilter === item.value && styles.filterPillTextActive,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Path ScrollView */}
      <ScrollView
        contentContainerStyle={[
          styles.pathScroll,
          { maxWidth: isTablet ? 720 : '100%', alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}>
        {filteredUnits.map((unit) => (
          <View key={unit.id} style={styles.unitSection}>
            {/* Thematic Unit Banner */}
            <UnitBanner unit={unit} />

            {/* Alternating Winding Nodes */}
            <View style={styles.nodesContainer}>
              {unit.nodes.map((node, nodeIdx) => {
                // Determine winding offset: center, left, right, center
                const offsets: ('center' | 'left' | 'right')[] = [
                  'center',
                  'left',
                  'center',
                  'right',
                ];
                const offset = offsets[nodeIdx % offsets.length];

                // Determine node status
                const isCompleted = activeStudent.completedNodeIds.includes(node.id);
                const isUnlocked =
                  tutorConfig.unlockAllLevels ||
                  activeStudent.unlockedNodeIds.includes(node.id);

                let status: 'completed' | 'active' | 'locked' = 'locked';
                if (isCompleted) {
                  status = 'completed';
                } else if (isUnlocked) {
                  status = 'active';
                }

                const scoreRecord = activeStudent.nodeScores[node.id];
                const stars = scoreRecord ? scoreRecord.stars : 0;

                return (
                  <PathNode
                    key={node.id}
                    node={node}
                    status={status}
                    stars={stars}
                    offset={offset}
                    unitColor={unit.color}
                    onPress={() => setActiveLessonNode(node)}
                  />
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* Lesson Runner Modal */}
      <LessonRunnerModal
        visible={!!activeLessonNode}
        node={activeLessonNode}
        student={activeStudent}
        unlimitedHearts={tutorConfig.unlimitedHearts}
        onClose={() => setActiveLessonNode(null)}
        onSpendGems={handleSpendGems}
        onCompleteLesson={handleCompleteLesson}
      />

      {/* Student Profile Switcher Modal */}
      <StudentSwitcherModal
        visible={showStudentModal}
        students={students}
        activeStudentId={activeStudent.id}
        onSelectStudent={handleSelectStudent}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        onClose={() => setShowStudentModal(false)}
      />

      {/* Tutor Portal Modal */}
      <TutorPortalModal
        visible={showTutorModal}
        config={tutorConfig}
        student={activeStudent}
        onUpdateConfig={handleUpdateTutorConfig}
        onClose={() => setShowTutorModal(false)}
      />

      {/* Home Screen Heart Refill Challenge Modal (Agent 1 & 2) */}
      <HeartRefillModal
        visible={showHeartModal}
        currentHearts={activeStudent.hearts}
        gems={activeStudent.gems}
        gemCost={20}
        onRefillSuccess={handleRefillHearts}
        onClose={() => setShowHeartModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3C3C3C',
  },
  filterScrollWrapper: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    cursor: 'pointer' as any,
  },
  filterPillActive: {
    backgroundColor: '#58CC02',
    borderColor: '#46A302',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pathScroll: {
    paddingBottom: 80,
  },
  unitSection: {
    marginBottom: 20,
  },
  nodesContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerSpacing: {
    height: 60,
  },
});
