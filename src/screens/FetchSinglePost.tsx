import React, { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import type { ExtrasStackParamList } from '../navigation/types';
import {
  fetchJsonPlaceholderPost,
  jsonPlaceholderQueryKeys,
} from '../services/jsonPlaceholderApi';

type ScreenRouteProp = RouteProp<ExtrasStackParamList, 'ExtrasFetchPost'>;

type ScreenNav = NativeStackNavigationProp<
  ExtrasStackParamList,
  'ExtrasFetchPost'
>;

export function FetchSinglePost() {
  const { params } = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNav>();
  const postId = params.postId;

  const { data, error, isPending, refetch, isRefetching } = useQuery({
    queryKey: jsonPlaceholderQueryKeys.post(postId),
    queryFn: ({ signal }) => fetchJsonPlaceholderPost(postId, signal),
  });

  const errMessage =
    error instanceof Error ? error.message : 'Не удалось загрузить пост';

  useLayoutEffect(() => {
    if (!data) return;
    const short =
      data.title.length > 42 ? `${data.title.slice(0, 42)}…` : data.title;
    navigation.setOptions({ title: short });
  }, [data, navigation]);

  return (
    <View style={styles.root}>
      <Text style={styles.meta}>
        Запрошен id: <Text style={styles.mono}>{postId}</Text>
      </Text>

      {isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.muted}>Загрузка…</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Ошибка</Text>
          <Text style={styles.errorMessage}>{errMessage}</Text>
          <PrimaryButton
            title="Повторить"
            onPress={() => refetch()}
            disabled={isRefetching}
          />
        </View>
      ) : null}

      {data ? (
        <View style={styles.card}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.body}>{data.body}</Text>
          <Text style={styles.footer}>
            userId: {data.userId} · id: {data.id}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 12,
  },
  meta: {
    fontSize: 13,
    color: '#374151',
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 13,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  muted: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorBox: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b91c1c',
  },
  errorMessage: {
    fontSize: 14,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
  body: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  footer: {
    fontSize: 12,
    color: '#6b7280',
  },
});
