import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useHydrateStore } from './src/store/useAppStore';
import { useHydrateTheme } from './src/store/useThemeStore';

function App(): React.JSX.Element {
  useHydrateStore();
  useHydrateTheme();

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
