import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExtrasPracticeScreen } from '../screens/ExtrasPracticeScreen';
import { ExtrasScreen } from '../screens/ExtrasScreen';
import type { ExtrasStackParamList } from './types';

const Stack = createNativeStackNavigator<ExtrasStackParamList>();

export function ExtrasStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen
        name="ExtrasHome"
        component={ExtrasScreen}
        options={{ title: 'Ещё' }}
      />
      <Stack.Screen
        name="ExtrasPractice"
        component={ExtrasPracticeScreen}
        options={{ title: 'Стек во вкладке' }}
      />
    </Stack.Navigator>
  );
}
