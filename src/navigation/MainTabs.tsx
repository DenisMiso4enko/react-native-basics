import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExtrasStackNavigator } from './ExtrasStack';
import { MainStackNavigator } from './MainStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}>
      <Tab.Screen
        name="Overview"
        component={MainStackNavigator}
        options={{ tabBarLabel: 'Обзор' }}
      />
      <Tab.Screen
        name="Extras"
        component={ExtrasStackNavigator}
        options={{ tabBarLabel: 'Ещё' }}
      />
    </Tab.Navigator>
  );
}
