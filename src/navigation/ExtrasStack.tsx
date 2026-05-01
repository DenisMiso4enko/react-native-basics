import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExtrasPracticeScreen } from '../screens/ExtrasPracticeScreen';
import { ExtrasScreen } from '../screens/ExtrasScreen';
import { FetchDemoScreen } from '../screens/FetchDemoScreen';
import { FetchSinglePost } from '../screens/FetchSinglePost';
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
      <Stack.Screen
        name="ExtrasFetch"
        component={FetchDemoScreen}
        options={{ title: 'fetch + данные' }}
      />
      <Stack.Screen
        name="ExtrasFetchPost"
        component={FetchSinglePost}
        options={{ title: 'Один пост' }}
      />
    </Stack.Navigator>
  );
}
