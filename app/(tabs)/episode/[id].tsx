import { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Share, Linking, RefreshControl, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../../lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { useWatchStore } from '../../../lib/store';
import { shows } from '../../../constants/shows';
import { fetchPlaylistItems, searchChannelVideos } from '../../../lib/api';

const { width } = Dimensions.get('window');
const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

interface EpisodeData {
  id: string;
  title: string;
  thumbnail: string;
  youtube_video_id: string;
}

export default function EpisodePlayerScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { id, videoId, showTitle, episodeTitle, showId } = useLocalSearchParams<{ id: string; videoId: string; showTitle: string; episodeTitle: string; showId: string }>();
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const addToHistory = useWatchStore((s) => s.addToHistory);
  const toggleBookmark = useWatchStore((s) => s.toggleBookmark);
  const bookmarks = useWatchStore((s) => s.bookmarks);
  const isBookmarked = bookmarks.includes(id || '');
  const [moreEpisodes, setMoreEpisodes] = useState<EpisodeData[]>([]);
  const [loadingMore, setLoadingMore] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@btltv_settings').then(val => {
      if (val) {
        const s = JSON.parse(val);
        if (s.quality) setQuality(s.quality);
      }
    });
  }, []);

  useEffect(() => {
    if (!showId || !YOUTUBE_API_KEY) { setLoadingMore(false); return; }
    const show = shows.find(s => s.id === showId);
    if (!show) { setLoadingMore(false); return; }

    const fetchMore = async () => {
      try {
        let items: any[];
        if (show.youtube_playlist_id) {
          items = await fetchPlaylistItems(show.youtube_playlist_id);
        } else {
          items = await searchChannelVideos(show.title);
        }
        const mapped = items
          .map((item: any, i: number) => ({
            id: `${showId}-more-${i}`,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
            youtube_video_id: item.snippet.resourceId?.videoId || item.id?.videoId || '',
          }))
          .filter(ep => ep.youtube_video_id !== videoId);
        setMoreEpisodes(mapped);
      } catch {} finally { setLoadingMore(false); }
    };
    fetchMore();
  }, [showId, videoId]);

  const actualVideoId = videoId || '';

  const handleShare = async () => {
    await Share.share({ message: `Watch "${episodeTitle || 'BTL TV'}"`, url: `https://youtube.com/watch?v=${actualVideoId}` });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPlaying(false);
    setTimeout(() => { setPlaying(true); setRefreshing(false); }, 500);
  }, []);

  const onStateChange = useCallback((state: string) => {
    if (state === 'playing') {
      addToHistory({ episodeId: id || '', showId: '', title: episodeTitle || 'Episode', watchedAt: new Date().toISOString() });
    }
  }, []);

  if (!actualVideoId) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <Ionicons name="film-outline" size={48} color="#606078" />
          <Text style={{ color: '#606078', fontSize: 16 }}>{t('video_not_available')}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />}>
      <View style={styles.playerWrap}>
        <YoutubePlayer
          height={width * 0.5625}
          width={width}
          videoId={actualVideoId}
          play={playing}
          onChangeState={onStateChange}
          playerVars={{
            rel: 0,
            ...(quality === 'HD (720p)' && { vq: 'hd720' }),
            ...(quality === 'Full HD (1080p)' && { vq: 'hd1080' }),
            ...(quality === '4K' && { vq: 'highres' }),
          }}
        />
      </View>
      <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
        <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>{showTitle || 'BTL TV'}</Text>
        <Text style={styles.showName}>{episodeTitle || t('now_playing')}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setLiked(!liked)}>
            <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} size={22} color={liked ? '#E50914' : '#B0B0C8'} />
            <Text style={styles.actionText}>{liked ? t('like') : t('like')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL('https://youtube.com/@btltv?sub_confirmation=1')}>
            <Ionicons name="logo-youtube" size={22} color="#E50914" />
            <Text style={styles.actionText}>{t('subscribe')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color="#B0B0C8" />
            <Text style={styles.actionText}>{t('share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => toggleBookmark(id || '')}>
            <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color={isBookmarked ? '#F5A623' : '#B0B0C8'} />
            <Text style={styles.actionText}>{isBookmarked ? t('save') : t('save')}</Text>
          </TouchableOpacity>
        </View>
        {loadingMore ? (
          <ActivityIndicator color="#E50914" style={{ marginVertical: 16 }} />
        ) : moreEpisodes.length > 0 ? (
          <View style={styles.moreSection}>
            <Text style={styles.moreTitle}>More Episodes</Text>
            {moreEpisodes.slice(0, 10).map((ep, i) => (
              <TouchableOpacity key={i} style={styles.moreCard} onPress={() => {
                setPlaying(false);
                router.replace(`/(tabs)/episode/${showId}-${i}?videoId=${ep.youtube_video_id}&showTitle=${encodeURIComponent(showTitle || '')}&episodeTitle=${encodeURIComponent(ep.title)}&showId=${showId}` as any);
              }}>
                <Image source={{ uri: ep.thumbnail }} style={styles.moreThumb} />
                <View style={styles.moreInfo}>
                  <Text style={styles.moreEpTitle} numberOfLines={2}>{ep.title}</Text>
                </View>
                <Ionicons name="play-circle" size={24} color="#E50914" />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  playerWrap: { position: 'relative' },
  backBtn: { position: 'absolute', top: 50, left: 16, zIndex: 10 },
  content: { padding: 16, gap: 8 },
  title: { color: '#E50914', fontSize: 12, fontWeight: '600' },
  showName: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#2A2A40', marginVertical: 12 },
  actionBtn: { alignItems: 'center', gap: 4 },
  actionText: { color: '#B0B0C8', fontSize: 11 },
  moreSection: { marginTop: 8 },
  moreTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  moreCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141420', borderRadius: 8, marginBottom: 8, overflow: 'hidden' },
  moreThumb: { width: 100, height: 56, backgroundColor: '#2A2A40' },
  moreInfo: { flex: 1, paddingHorizontal: 10 },
  moreEpTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
});
