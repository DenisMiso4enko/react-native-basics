import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearningBasicsScreen } from '../screens/LearningBasicsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'RN: навигация' }}
      />
      <Stack.Screen
        name="Basics"
        component={LearningBasicsScreen}
        options={{ title: 'Основы RN' }}
      />
    </Stack.Navigator>
  );
}
