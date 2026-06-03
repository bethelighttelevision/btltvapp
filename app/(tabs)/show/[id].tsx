import { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../../lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import { shows } from '../../../constants/shows';
import { fetchPlaylistItems, searchChannelVideos } from '../../../lib/api';

const { width } = Dimensions.get('window');
const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

interface EpisodeData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtube_video_id: string;
  published_at: string;
}

export default function ShowDetailScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const show = shows.find(s => s.id === id);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const [loading, setLoading] = useState(true);

  const posterUri = episodes.length > 0
    ? episodes[0].thumbnail
    : (show?.thumbnail.startsWith('http') ? show.thumbnail : `https://www.btl-tv.com${show?.thumbnail || ''}`);

  useEffect(() => {
    if (!YOUTUBE_API_KEY || !show) {
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      try {
        if (show.youtube_playlist_id) {
          const items = await fetchPlaylistItems(show.youtube_playlist_id);
          const mapped = items.map((item: any, index: number) => ({
            id: `${show.id}-${index}`,
            title: item.snippet.title,
            description: item.snippet.description?.substring(0, 100) || '',
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
            youtube_video_id: item.snippet.resourceId?.videoId || '',
            published_at: item.snippet.publishedAt || '',
          }));
          setEpisodes(mapped);
        } else {
          const items = await searchChannelVideos(show.title);
          const seen = new Set<string>();
          const mapped = items
            .filter((item: any) => {
              const vId = item.id?.videoId;
              if (!vId || seen.has(vId)) return false;
              seen.add(vId);
              return true;
            })
            .map((item: any, index: number) => ({
              id: `${show.id}-${index}`,
              title: item.snippet.title,
              description: item.snippet.description?.substring(0, 100) || '',
              thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
              youtube_video_id: item.id?.videoId || '',
              published_at: item.snippet.publishedAt || '',
            }));
          setEpisodes(mapped);
        }
      } catch (e) {
        console.warn('Failed to fetch episodes for', show?.id, e);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [id]);

  if (!show) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 100 }}>Show not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
              <Image
                source={{ uri: posterUri }}
                style={styles.coverImage}
              />
              <TouchableOpacity style={[styles.backButton, { top: insets.top + 12 }]} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.category}>{show.category}</Text>
              <Text style={styles.title}>{show.title}</Text>
              <Text style={styles.description}>{show.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{show.episode_count} {t('episodes')}</Text>
                {show.host_name && <Text style={styles.meta}>Host: {show.host_name}</Text>}
              </View>
            </View>
          </View>
        }
        data={loading ? [] : episodes}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color="#E50914" style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.emptyText}>{t('no_episodes')}</Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.episodeCard} onPress={() => router.push(`/(tabs)/episode/${item.id}?videoId=${item.youtube_video_id}&showTitle=${encodeURIComponent(show.title)}&episodeTitle=${encodeURIComponent(item.title)}&showId=${show.id}` as any)}>
            <Image source={{ uri: item.thumbnail || show.thumbnail }} style={styles.episodeThumb} />
            <View style={styles.episodeInfo}>
              <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.episodeDuration}>Watch now</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  coverImage: { width, height: 250 },
  backButton: { position: 'absolute', top: 50, left: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
  info: { padding: 16 },
  category: { backgroundColor: '#2A2A40', color: '#B0B0C8', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  description: { color: '#B0B0C8', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16 },
  meta: { color: '#606078', fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  episodeCard: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#141420', borderRadius: 8, overflow: 'hidden' },
  episodeThumb: { width: 120, height: 68, backgroundColor: '#2A2A40' },
  episodeInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  episodeTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  episodeDuration: { color: '#E50914', fontSize: 12, marginTop: 4 },
  emptyText: { color: '#606078', textAlign: 'center', marginTop: 40, fontSize: 14 },
});
