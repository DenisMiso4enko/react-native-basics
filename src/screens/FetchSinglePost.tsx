import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import type { ExtrasStackParamList } from '../navigation/types';
import type { JsonPlaceholderPost } from './FetchDemoScreen';

type ScreenRouteProp = RouteProp<ExtrasStackParamList, 'ExtrasFetchPost'>;

type ScreenNav = NativeStackNavigationProp<
  ExtrasStackParamList,
  'ExtrasFetchPost'
>;

async function fetchPostById(
  id: number,
  signal: AbortSignal,
): Promise<JsonPlaceholderPost> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { signal },
  );
  if (!res.ok) {
    throw new Error(`Сервер ответил ${res.status}`);
  }
  return (await res.json()) as JsonPlaceholderPost;
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; post: JsonPlaceholderPost };

export function FetchSinglePost() {
  const { params } = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNav>();
  const postId = params.postId;

  const [state, setState] = useState<State>({ status: 'loading' });
  const [retryNonce, setRetryNonce] = useState(0);

  const retry = useCallback(() => setRetryNonce(n => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' });

    fetchPostById(postId, ac.signal)
      .then(post => {
        setState({ status: 'success', post });
        const short = post.title.length > 42 ? `${post.title.slice(0, 42)}…` : post.title;
        navigation.setOptions({ title: short });
      })
      .catch(e => {
        if (e instanceof Error && e.name === 'AbortError') return;
        const message =
          e instanceof Error ? e.message : 'Не удалось загрузить пост';
        setState({ status: 'error', message });
      });

    return () => ac.abort();
  }, [postId, retryNonce]); // eslint-disable-line react-hooks/exhaustive-deps -- navigation намеренно не в зависимостях

  return (
    <View style={styles.root}>
      <Text style={styles.meta}>
        Запрошен id: <Text style={styles.mono}>{postId}</Text>
      </Text>

      {state.status === 'loading' ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.muted}>Загрузка…</Text>
        </View>
      ) : null}

      {state.status === 'error' ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Ошибка</Text>
          <Text style={styles.errorMessage}>{state.message}</Text>
          <PrimaryButton title="Повторить" onPress={retry} />
        </View>
      ) : null}

      {state.status === 'success' ? (
        <View style={styles.card}>
          <Text style={styles.title}>{state.post.title}</Text>
          <Text style={styles.body}>{state.post.body}</Text>
          <Text style={styles.footer}>
            userId: {state.post.userId} · id: {state.post.id}
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
