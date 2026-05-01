import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  body: {
    gap: 10,
  },
});
