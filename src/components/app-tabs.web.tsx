import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1, minHeight: '100%', paddingBottom: 80 }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Belajar</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Latihan</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...(props as any)}
      style={({ pressed }) => [styles.tabPressable, pressed && styles.pressed]}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[styles.tabButtonView, isFocused && styles.tabButtonViewFocused]}>
        <ThemedText
          type="smallBold"
          themeColor={isFocused ? 'text' : 'textSecondary'}
          style={isFocused ? styles.focusedText : undefined}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'fixed' as any,
    bottom: 16,
    left: 0,
    right: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  innerContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    pointerEvents: 'auto',
  },
  tabPressable: {
    cursor: 'pointer' as any,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  tabButtonViewFocused: {
    backgroundColor: '#58CC02',
  },
  focusedText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
