import { useRef, useCallback, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../lib/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { shows, getShowsByCategory } from '../../constants/shows';
import { useWatchStore } from '../../lib/store';

const { width } = Dimensions.get('window');
const heroShows = shows.slice(0, 5);

export default function HomeScreen() {
  const continueWatching = useWatchStore((s) => s.continueWatching);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const renderShowCard = useCallback(({ item }: any) => (
    <TouchableOpacity style={styles.showCard} onPress={() => (router as any).push(`/(tabs)/show/${item.id}`)}>
      <Image source={{ uri: item.thumbnail.startsWith('http') ? item.thumbnail : `https://www.btl-tv.com${item.thumbnail}` }} style={styles.showThumb} />
      <View style={styles.showInfo}>
        <Text style={styles.categoryBadge}>{item.category}</Text>
        <Text style={styles.showTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.episodeCount}>{item.episode_count} {t('episodes')}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} tintColor="#E50914" />}
    >
      <LinearGradient colors={['#1A1A2E', '#0A0A0F']} style={styles.heroSection}>
        <Image source={{ uri: 'https://www.btl-tv.com/images/programs/banner-image.webp' }} style={styles.heroImage} />
        <LinearGradient colors={['transparent', '#0A0A0F']} style={styles.heroOverlay}>
          <View style={styles.heroContent}>
            <Image source={{ uri: 'https://www.btl-tv.com/images/logo/btl-logo.webp' }} style={styles.logo} />
            <Text style={styles.heroTitle}>BTL TV</Text>
            <Text style={styles.heroSubtitle}>Be The Light Television</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/(tabs)/shows')}>
              <Text style={styles.exploreText}>{t('see_all')}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </LinearGradient>

      <View style={styles.quickAccess}>
        <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(tabs)/audio-bible')}>
          <View style={[styles.quickIconWrap, { backgroundColor: '#1A3A1A' }]}>
            <Ionicons name="book" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.quickLabel}>Audio Bible</Text>
          <Text style={styles.quickSub}>66 books</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(tabs)/stichting')}>
          <View style={[styles.quickIconWrap, { backgroundColor: '#2A1A2A' }]}>
            <Ionicons name="business" size={24} color="#FF66AA" />
          </View>
          <Text style={styles.quickLabel}>Stichting</Text>
          <Text style={styles.quickSub}>Foundation Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(tabs)/team')}>
          <View style={[styles.quickIconWrap, { backgroundColor: '#1A2A3A' }]}>
            <Ionicons name="people" size={24} color="#66AAFF" />
          </View>
          <Text style={styles.quickLabel}>Our Team</Text>
          <Text style={styles.quickSub}>Meet the team</Text>
        </TouchableOpacity>
      </View>

      {continueWatching.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('continue_watching')}</Text>
          <FlatList
            data={continueWatching}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.episodeId}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.continueCard} onPress={() => router.push(`/(tabs)/episode/${item.episodeId}` as any)}>
                <Image source={{ uri: item.thumbnail }} style={styles.continueThumb} />
                <Text style={styles.continueTitle} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('trending_now')}</Text>
        <FlatList
          data={shows.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderShowCard}
        />
      </View>

      {['Devotional', 'Talk Shows', 'Drama', 'Documentary'].map((category) => {
        const catShows = getShowsByCategory(category);
        if (catShows.length === 0) return null;
        return (
          <View key={category} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/shows')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={catShows.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderShowCard}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  heroSection: { height: 420, position: 'relative' },
  heroImage: { width, height: 420, position: 'absolute' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 300, justifyContent: 'flex-end' },
  heroContent: { padding: 24, gap: 8 },
  logo: { width: 80, height: 80, resizeMode: 'contain' },
  heroTitle: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
  heroSubtitle: { fontSize: 16, color: '#B0B0C8' },
  exploreButton: { backgroundColor: '#E50914', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, alignSelf: 'flex-start', marginTop: 8 },
  exploreText: { color: '#FFFFFF', fontWeight: '600' },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  seeAll: { color: '#E50914', fontSize: 14, marginBottom: 12 },
  showCard: { width: 160, marginRight: 12 },
  showThumb: { width: 160, height: 90, borderRadius: 8, backgroundColor: '#141420' },
  showInfo: { paddingTop: 8 },
  categoryBadge: { backgroundColor: '#2A2A40', color: '#B0B0C8', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
  showTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  episodeCount: { color: '#606078', fontSize: 11, marginTop: 2 },
  continueCard: { width: 140, marginRight: 12 },
  continueThumb: { width: 140, height: 78, borderRadius: 8, backgroundColor: '#141420' },
  continueTitle: { color: '#B0B0C8', fontSize: 12, marginTop: 4 },
  quickAccess: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 10 },
  quickCard: { flex: 1, backgroundColor: '#141420', borderRadius: 12, padding: 12, alignItems: 'center', gap: 6 },
  quickIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  quickSub: { color: '#606078', fontSize: 10, textAlign: 'center' },
});
