import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import { Section } from '../components/Section';
import type { ExtrasStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<ExtrasStackParamList, 'ExtrasHome'>;

export function ExtrasScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.screen}>
      <Section title="Зачем второй таб">
        <Text style={styles.p}>
          Таб-бар типичен для приложений с несколькими разделами (лента, поиск,
          профиль). Каждый таб часто держит свой вложенный стек: внутри раздела
          экраны открываются поверх друг друга, а переключение таба не сбрасывает
          стек или сбрасывает — в зависимости от настроек.
        </Text>
      </Section>

      <Section title="Стек + табы (как во «Обзоре»)">
        <Text style={styles.p}>
          Таб «Обзор» держит стек <Text style={styles.code}>Home</Text> →{' '}
          <Text style={styles.code}>Basics</Text>. Таб «Ещё» тоже завёл свой
          стек <Text style={styles.code}>ExtrasStackParamList</Text>: ты на
          первом экране <Text style={styles.code}>ExtrasHome</Text>.
        </Text>
        <PrimaryButton
          title="Открыть второй экран стека (ExtrasPractice)"
          onPress={() => navigation.navigate('ExtrasPractice')}
        />
      </Section>

      <Section title="Сеть (fetch)">
        <Text style={styles.p}>
          Простой GET-запрос к публичному API: состояния загрузки, ошибки и{' '}
          <Text style={styles.code}>FlatList</Text> для списка.
        </Text>
        <PrimaryButton
          title="Экран с запросом (ExtrasFetch)"
          onPress={() => navigation.navigate('ExtrasFetch')}
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
