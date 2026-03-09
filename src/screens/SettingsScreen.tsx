import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info, Github, Shield, Trash2, Moon, Sun, ChevronRight } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { useThemeStore } from '../store/useThemeStore';

export default function SettingsScreen() {
  const { apps } = useAppStore();
  const { colors, mode, toggleTheme } = useThemeStore();

  const handleClearAll = () => {
    apps.forEach((app) => useAppStore.getState().removeApp(app.id));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              {mode === 'dark' ? (
                <Moon color={colors.accent} size={20} />
              ) : (
                <Sun color={colors.accent} size={20} />
              )}
              <View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.actionSublabel, { color: colors.textMuted }]}>
                  {mode === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Data */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Data</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <View style={[styles.actionRow, { borderBottomWidth: 0 }]}>
            <View style={styles.actionLeft}>
              <Trash2 color="#EF4444" size={20} />
              <View>
                <Text style={[styles.actionLabel, { color: '#EF4444' }]}>Clear All Apps</Text>
                <Text style={[styles.actionSublabel, { color: colors.textMuted }]}>
                  Remove all {apps.length} saved app{apps.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClearAll} style={[styles.dangerButton, { borderColor: '#EF4444' }]}>
              <Text style={styles.dangerButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>About</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Linking.openURL('https://github.com/Spargerx/WebApp')}
          >
            <View style={styles.actionLeft}>
              <Github color={colors.accent} size={20} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>GitHub Repository</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={18} />
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Info color="#60A5FA" size={20} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Version</Text>
            </View>
            <Text style={[styles.actionValue, { color: colors.textMuted }]}>1.0.0</Text>
          </View>

          <View style={[styles.actionRow, { borderBottomWidth: 0 }]}>
            <View style={styles.actionLeft}>
              <Shield color="#34D399" size={20} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>License</Text>
            </View>
            <Text style={[styles.actionValue, { color: colors.textMuted }]}>MIT</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionSublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  actionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  dangerButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
});
