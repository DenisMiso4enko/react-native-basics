import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { Section } from '../components/Section';

type TodoItem = { id: string; title: string; done: boolean };

export function LearningBasicsScreen() {
  const insets = useSafeAreaInsets();

  const [count, setCount] = useState(0);
  const [name, setName] = useState('Denis');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', title: 'Открыть App.tsx', done: true },
    { id: '2', title: 'Поменять state через кнопку', done: false },
    { id: '3', title: 'Добавить элемент в FlatList', done: false },
  ]);

  const completedCount = useMemo(
    () => todos.filter(t => t.done).length,
    [todos],
  );

  function addTodo() {
    const title = newTodoTitle.trim();
    if (!title) return;
    setTodos(prev => [
      { id: String(Date.now()), title, done: false },
      ...prev,
    ]);
    setNewTodoTitle('');
  }

  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 12) + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator>
        <View style={styles.header}>
          <Text style={styles.h1}>React Native Basics</Text>
          <Text style={styles.sub}>
            Потрогай state, ввод, список, стили и Platform.
          </Text>
        </View>

        <Section title="1) Компоненты и стили (View/Text/StyleSheet)">
          <Text style={styles.p}>
            Это обычный компонент-функция. Стили — JS-объекты через StyleSheet.
          </Text>
          <View style={styles.row}>
            <View style={[styles.badge, styles.badgeBlue]}>
              <Text style={styles.badgeText}>flex</Text>
            </View>
            <View style={[styles.badge, styles.badgeGreen]}>
              <Text style={styles.badgeText}>gap</Text>
            </View>
            <View style={[styles.badge, styles.badgeGray]}>
              <Text style={styles.badgeText}>{Platform.OS}</Text>
            </View>
          </View>
        </Section>

        <Section title="2) State (useState) + обработчики">
          <Text style={styles.p}>Счётчик: {count}</Text>
          <View style={styles.row}>
            <PrimaryButton title="-1" onPress={() => setCount(c => c - 1)} />
            <PrimaryButton title="+1" onPress={() => setCount(c => c + 1)} />
            <PrimaryButton title="Сброс" onPress={() => setCount(0)} />
          </View>
        </Section>

        <Section title="3) Ввод (TextInput) + derived state (useMemo)">
          <Text style={styles.p}>
            Привет, <Text style={styles.strong}>{name || 'незнакомец'}</Text>!
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Введите имя"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            autoCapitalize="words"
          />
          <Text style={styles.p}>
            TODO выполнено: {completedCount}/{todos.length}
          </Text>
        </Section>

        <Section title="4) Списки (map / для больших данных — FlatList)">
          <View style={styles.row}>
            <TextInput
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              placeholder="Новая задача…"
              placeholderTextColor="#9ca3af"
              style={[styles.input, styles.inputFlex]}
              onSubmitEditing={addTodo}
              returnKeyType="done"
            />
            <View style={styles.addButton}>
              <PrimaryButton
                title="Добавить"
                onPress={addTodo}
                disabled={!newTodoTitle.trim()}
                hint={undefined}
              />
            </View>
          </View>

          <View style={styles.list}>
            {todos.map(item => (
              <View key={item.id} style={styles.todoRow}>
                <Text
                  style={[styles.todoText, item.done ? styles.todoDone : null]}
                  onPress={() => toggleTodo(item.id)}>
                  {item.done ? '✅ ' : '⬜️ '}
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.caption}>
            Нажми на задачу, чтобы переключить done.
          </Text>
        </Section>

        <Section title="5) Platform (чуть разное поведение на iOS/Android)">
          <Text style={styles.p}>
            Сейчас платформа: <Text style={styles.strong}>{Platform.OS}</Text>.
          </Text>
          <Text style={styles.caption}>
            Мы используем KeyboardAvoidingView c behavior="padding" только на iOS.
          </Text>
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 12,
  },
  header: {
    gap: 6,
  },
  h1: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  sub: {
    fontSize: 14,
    color: '#4b5563',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeBlue: { backgroundColor: '#dbeafe' },
  badgeGreen: { backgroundColor: '#dcfce7' },
  badgeGray: { backgroundColor: '#e5e7eb' },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, default: 10 }),
    fontSize: 16,
    color: '#111827',
  },
  inputFlex: {
    flex: 1,
  },
  addButton: {
    minWidth: 120,
  },
  list: {
    gap: 8,
    paddingTop: 6,
  },
  todoRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  todoText: {
    fontSize: 14,
    color: '#111827',
  },
  todoDone: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
  },
});
