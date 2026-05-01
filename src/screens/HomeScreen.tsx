import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { Section } from '../components/Section';
import type { RootStackParamList } from '../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <View style={styles.screen}>
      <Section title="Стек (Native Stack)">
        <Text style={styles.p}>
          В браузере маршрут чаще всего задаётся URL. В нативных приложениях
          типичный паттерн — стек экранов: ты «вталкиваешь» новый экран,
          система показывает заголовок и кнопку «назад» (или свайп слева на
          iOS).
        </Text>
        <PrimaryButton
          title="Перейти к экрану «Основы»"
          onPress={() => navigation.navigate('Basics')}
        />
      </Section>

      <Section title="Типизация экранов (по желанию)">
        <Text style={styles.p}>
          Объект <Text style={styles.code}>RootStackParamList</Text> описывает
          имена маршрутов и параметры (<Text style={styles.code}>Basics</Text>{' '}
          пока без params). Так TypeScript подсказывает корректные вызовы{' '}
          <Text style={styles.code}>navigate</Text>.
        </Text>
      </Section>

      <Section title="Нижние табы">
        <Text style={styles.p}>
          Снизу ещё один уровень: переключись на «Ещё» — там свой стек (см.
          типы{' '}
          <Text style={styles.code}>MainTabParamList</Text> и{' '}
          <Text style={styles.code}>ExtrasStackParamList</Text>). Здесь, во
          «Обзоре», стек задаёт{' '}
          <Text style={styles.code}>RootStackParamList</Text>.
        </Text>
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
  code: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 13,
    color: '#1d4ed8',
  },
});
