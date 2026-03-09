import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AppViewerScreen from '../screens/AppViewerScreen';

export type RootStackParamList = {
  Home: undefined;
  AppViewer: { url: string; name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="AppViewer" 
          component={AppViewerScreen} 
          // Customizing animation to feel like opening an app
          options={{
            animation: 'fade_from_bottom',
            presentation: 'fullScreenModal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
