import { create } from 'zustand';
import { useMMKVString } from 'react-native-mmkv';

export interface AppData {
  id: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
}

interface AppStore {
  apps: AppData[];
  _hydrated: boolean;
  setApps: (apps: AppData[]) => void;
  addApp: (app: AppData) => void;
  removeApp: (id: string) => void;
  updateApp: (id: string, updatedApp: Partial<AppData>) => void;
}

const DEFAULT_APPS: AppData[] = [
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
  },
];

export const useAppStore = create<AppStore>()((set) => ({
  apps: DEFAULT_APPS,
  _hydrated: false,
  setApps: (apps) => set({ apps, _hydrated: true }),
  addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),
  removeApp: (id) =>
    set((state) => ({ apps: state.apps.filter((a) => a.id !== id) })),
  updateApp: (id, updatedApp) =>
    set((state) => ({
      apps: state.apps.map((a) => (a.id === id ? { ...a, ...updatedApp } : a)),
    })),
}));

// Hook to sync store with MMKV (call once in App.tsx)
export function useHydrateStore() {
  const [storedApps, setStoredApps] = useMMKVString('apps-data');
  const { apps, _hydrated, setApps } = useAppStore();

  // On mount: load from MMKV into Zustand
  if (!_hydrated && storedApps) {
    try {
      const parsed = JSON.parse(storedApps) as AppData[];
      setApps(parsed);
    } catch {
      setApps(DEFAULT_APPS);
    }
  } else if (!_hydrated) {
    setApps(DEFAULT_APPS);
  }

  // Save to MMKV whenever apps change (after hydration)
  if (_hydrated) {
    const serialized = JSON.stringify(apps);
    if (serialized !== storedApps) {
      setStoredApps(serialized);
    }
  }
}
