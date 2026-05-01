import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import type { ExtrasStackParamList } from '../navigation/types';

type FetchListNav = NativeStackNavigationProp<
  ExtrasStackParamList,
  'ExtrasFetch'
>;

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=10';

export type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function fetchPosts(signal: AbortSignal): Promise<JsonPlaceholderPost[]> {
  const res = await fetch(POSTS_URL, { signal });
  if (!res.ok) {
    throw new Error(`Сервер ответил ${res.status}`);
  }
  return (await res.json()) as JsonPlaceholderPost[];
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; posts: JsonPlaceholderPost[] };

export function FetchDemoScreen() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [retryNonce, setRetryNonce] = useState(0);
  const navigation = useNavigation<FetchListNav>();

  const retry = useCallback(() => setRetryNonce(n => n + 1), []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' });

    fetchPosts(ac.signal)
      .then(posts => {
        setState({ status: 'success', posts });
      })
      .catch(e => {
        if (e instanceof Error && e.name === 'AbortError') return;
        const message =
          e instanceof Error ? e.message : 'Не удалось загрузить данные';
        setState({ status: 'error', message });
      });

    return () => ac.abort();
  }, [retryNonce]);

  return (
    <View style={styles.root}>
      <Text style={styles.lead}>
        Публичный демо-API JSONPlaceholder (HTTPS). Обрати внимание:{' '}
        <Text style={styles.mono}>loading</Text> →{' '}
        <Text style={styles.mono}>success</Text> или{' '}
        <Text style={styles.mono}>error</Text>, отмена запроса при уходе с
        экрана через <Text style={styles.mono}>AbortController</Text>.
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
          <PrimaryButton title="Повторить запрос" onPress={retry} />
        </View>
      ) : null}

      {state.status === 'success' ? (
        <FlatList
          style={styles.list}
          data={state.posts}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={PostSeparator}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate('ExtrasFetchPost', { postId: item.id });
              }}
            >
              <View style={styles.row}>
                <Text style={styles.rowId}>#{item.id}</Text>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowPreview} numberOfLines={2}>
                    {item.body}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
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
  },
  lead: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 12,
    color: '#1d4ed8',
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  sep: {
    height: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  rowId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    minWidth: 36,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  rowPreview: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
});

function PostSeparator() {
  return <View style={styles.sep} />;
}
