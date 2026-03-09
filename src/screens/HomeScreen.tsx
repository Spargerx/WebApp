import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore, AppData } from '../store/useAppStore';
import { Plus, Globe, AppWindow, Trash2, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { apps, addApp, removeApp } = useAppStore();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');

  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E24AA', '#F4511E', '#3949AB'];

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
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    setNewAppName('');
    setNewAppUrl('');
    setIsModalVisible(false);
  };

  const renderAppItem = ({ item }: { item: AppData }) => (
    <TouchableOpacity
      style={styles.appCard}
      onPress={() => navigation.navigate('AppViewer', { url: item.url, name: item.name })}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color || '#333' }]}>
        <AppWindow color="white" size={32} />
      </View>
      <Text style={styles.appName} numberOfLines={1}>{item.name}</Text>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => removeApp(item.id)}
      >
        <Trash2 color="#999" size={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Apps</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={renderAppItem}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Globe color="#555" size={64} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyStateText}>No apps added yet.</Text>
            <Text style={styles.emptyStateSubText}>Click the + button to add your favorite websites.</Text>
          </View>
        }
      />

      {/* Add App Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New App</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <X color="#999" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>App Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Twitter"
                placeholderTextColor="#666"
                value={newAppName}
                onChangeText={setNewAppName}
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Website URL</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., twitter.com"
                placeholderTextColor="#666"
                value={newAppUrl}
                onChangeText={setNewAppUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.saveButton, 
                (!newAppName.trim() || !newAppUrl.trim()) && styles.saveButtonDisabled
              ]} 
              onPress={handleAddApp}
              disabled={!newAppName.trim() || !newAppUrl.trim()}
            >
              <Text style={styles.saveButtonText}>Save App</Text>
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
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
  },
  gridContainer: {
    padding: 12,
  },
  appCard: {
    width: '33.33%',
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  appName: {
    color: '#E0E0E0',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    color: '#E0E0E0',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#333333',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
