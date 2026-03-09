import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

export interface AppData {
  id: string;
  name: string;
  url: string;
  icon?: string;
  color?: string; // Optional theme color
}

interface AppStore {
  apps: AppData[];
  addApp: (app: AppData) => void;
  removeApp: (id: string) => void;
  updateApp: (id: string, updatedApp: Partial<AppData>) => void;
}

// Initialize MMKV
export const storage = createMMKV({
  id: 'apps-storage',
  encryptionKey: 'super-app-secret-key' // Optional, adds layer of security
});

// Create custom storage object matching Zustand's requirement
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      apps: [
        // A couple of starter apps
        {
          id: '1',
          name: 'Google',
          url: 'https://www.google.com',
          color: '#4285F4',
        },
        {
          id: '2',
          name: 'Wikipedia',
          url: 'https://en.wikipedia.org',
          color: '#000000',
        }
      ],
      addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),
      removeApp: (id) =>
        set((state) => ({ apps: state.apps.filter((a) => a.id !== id) })),
      updateApp: (id, updatedApp) =>
        set((state) => ({
          apps: state.apps.map((a) => (a.id === id ? { ...a, ...updatedApp } : a)),
        })),
    }),
    {
      name: 'super-app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
