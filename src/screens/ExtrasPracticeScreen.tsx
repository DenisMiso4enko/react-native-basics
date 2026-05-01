import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { Section } from '../components/Section';
import type { ExtrasStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<ExtrasStackParamList, 'ExtrasPractice'>;

export function ExtrasPracticeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.screen}>
      <Section title="Что ты сейчас видишь">
        <Text style={styles.p}>
          Это <Text style={styles.strong}>второй экран того же стека</Text>, что
          и вкладка «Ещё». Стек живёт «внутри» таба: таб-бар снизу остаётся,
          сверху — шапка этого экрана и кнопка «назад» на первый экран вкладки.
        </Text>
      </Section>

      <Section title="Типизация">
        <Text style={styles.p}>
          Маршруты описаны в{' '}
          <Text style={styles.code}>ExtrasStackParamList</Text>: сюда ты пришёл
          через{' '}
          <Text style={styles.code}>
            navigate(&apos;ExtrasPractice&apos;)
          </Text>{' '}
          с первого экрана «Ещё».
        </Text>
      </Section>

      <Section title="Назад">
        <Text style={styles.p}>
          Можно вернуться жестом / системной кнопкой или программно:
        </Text>
        <PrimaryButton
          title="navigation.goBack()"
          onPress={() => navigation.goBack()}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    gap: 12,
  },
  p: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  strong: {
    fontWeight: '800',
  },
  code: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 13,
    color: '#1d4ed8',
  },
});
