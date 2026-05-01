import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/PrimaryButton';
import type { ExtrasStackParamList } from '../navigation/types';
import {
  fetchJsonPlaceholderPostsPage,
  jsonPlaceholderQueryKeys,
} from '../services/jsonPlaceholderApi';
import type { JsonPlaceholderPost } from '../types/jsonPlaceholder';

type FetchListNav = NativeStackNavigationProp<
  ExtrasStackParamList,
  'ExtrasFetch'
>;

const PAGE_SIZE = 10;

export function FetchDemoScreen() {
  const navigation = useNavigation<FetchListNav>();
  const {
    data,
    error,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: jsonPlaceholderQueryKeys.postsInfinite(PAGE_SIZE),
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchJsonPlaceholderPostsPage({
        signal,
        start: pageParam,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPageParam + PAGE_SIZE;
    },
  });

  const flatPosts = useMemo(
    () => data?.pages.flatMap(p => p) ?? [],
    [data?.pages],
  );

  const errMessage =
    error instanceof Error ? error.message : 'Не удалось загрузить данные';

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoad}>
          <ActivityIndicator color="#2563eb" />
          <Text style={styles.muted}>Ещё посты…</Text>
        </View>
      );
    }
    if (isFetchNextPageError) {
      return (
        <View style={styles.footerError}>
          <Text style={styles.footerErrorText}>Не удалось подгрузить страницу</Text>
          <PrimaryButton title="Повторить" onPress={() => fetchNextPage()} />
        </View>
      );
    }
    if (!hasNextPage && flatPosts.length > 0) {
      return <Text style={styles.endHint}>Все посты загружены</Text>;
    }
    return null;
  }, [
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    flatPosts.length,
    fetchNextPage,
  ]);

  return (
    <View style={styles.root}>
      <Text style={styles.lead}>
        Список через <Text style={styles.mono}>useInfiniteQuery</Text>: при
        долистывании вниз вызывается{' '}
        <Text style={styles.mono}>fetchNextPage</Text> (сервер —{' '}
        <Text style={styles.mono}>_start</Text> +{' '}
        <Text style={styles.mono}>_limit</Text>).
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
            title="Повторить запрос"
            onPress={() => refetch()}
            disabled={isRefetching}
          />
        </View>
      ) : null}

      {data ? (
        <FlatList<JsonPlaceholderPost>
          style={styles.list}
          data={flatPosts}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={PostSeparator}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.35}
          ListFooterComponent={renderFooter}
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
    flexGrow: 1,
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
  footerLoad: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  footerError: {
    paddingVertical: 12,
    gap: 10,
    alignItems: 'stretch',
  },
  footerErrorText: {
    fontSize: 13,
    color: '#b91c1c',
    textAlign: 'center',
  },
  endHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    paddingVertical: 16,
  },
});

function PostSeparator() {
  return <View style={styles.sep} />;
}
