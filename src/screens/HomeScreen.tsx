import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore, AppData } from '../store/useAppStore';
import { useThemeStore, APP_COLORS } from '../store/useThemeStore';
import { Plus, Globe, Trash2, X, ExternalLink } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 56) / 3;

export default function HomeScreen() {
  const { apps, addApp, removeApp } = useAppStore();
  const { colors } = useThemeStore();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');

  const handleAddApp = () => {
    if (!newAppName.trim() || !newAppUrl.trim()) return;

    let formattedUrl = newAppUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    addApp({
      id: Date.now().toString(),
      name: newAppName.trim(),
      url: formattedUrl,
      color: APP_COLORS[Math.floor(Math.random() * APP_COLORS.length)],
    });

    setNewAppName('');
    setNewAppUrl('');
    setIsModalVisible(false);
  };

  // Extract initials for the icon
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAppItem = ({ item }: { item: AppData }) => (
    <TouchableOpacity
      style={[styles.appCard, { width: CARD_SIZE }]}
      onPress={() => navigation.navigate('AppViewer', { url: item.url, name: item.name })}
      activeOpacity={0.75}
    >
      {/* Icon with initials */}
      <View style={[styles.iconContainer, { backgroundColor: item.color || '#6C5CE7' }]}>
        <Text style={styles.iconInitials}>{getInitials(item.name)}</Text>
      </View>

      <Text style={[styles.appName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>

      {/* Delete badge */}
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.bgCard }]}
        onPress={() => removeApp(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Trash2 color={colors.textMuted} size={12} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={colors.bg === '#0A0A0F' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerGreeting, { color: colors.textSecondary }]}>Welcome back</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Apps</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus color="#FFF" size={22} />
        </TouchableOpacity>
      </View>

      {/* App count chip */}
      {apps.length > 0 && (
        <View style={styles.chipRow}>
          <View style={[styles.chip, { backgroundColor: colors.accentSoft }]}>
            <ExternalLink color={colors.accent} size={14} />
            <Text style={[styles.chipText, { color: colors.accent }]}>
              {apps.length} app{apps.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      {/* Grid */}
      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={renderAppItem}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.bgCard }]}>
              <Globe color={colors.textMuted} size={48} />
            </View>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No apps yet</Text>
            <Text style={[styles.emptyStateSubText, { color: colors.textMuted }]}>
              Tap the + button to add your favorite websites
            </Text>
          </View>
        }
      />

      {/* Add App Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgModal }]}>
            {/* Drag handle */}
            <View style={styles.dragHandleRow}>
              <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add New App</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={[styles.closeButton, { backgroundColor: colors.bgInput }]}
              >
                <X color={colors.textMuted} size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>App Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bgInput, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g., Twitter"
                placeholderTextColor={colors.textMuted}
                value={newAppName}
                onChangeText={setNewAppName}
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Website URL</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bgInput, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g., twitter.com"
                placeholderTextColor={colors.textMuted}
                value={newAppUrl}
                onChangeText={setNewAppUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colors.accent },
                (!newAppName.trim() || !newAppUrl.trim()) && styles.saveButtonDisabled,
              ]}
              onPress={handleAddApp}
              disabled={!newAppName.trim() || !newAppUrl.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Add App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerGreeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  appCard: {
    padding: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconInitials: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    right: 12,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    minHeight: 380,
  },
  dragHandleRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
