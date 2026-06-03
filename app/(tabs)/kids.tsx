import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../lib/i18n';

const kidShows = [
  { id: 'prophecies-jesus', title: 'Prophecies About Jesus Christ', episodes: 9, thumbnail: 'https://i.ytimg.com/vi/M_efw5g34gs/hqdefault.jpg' },
  { id: 'kids-stories', title: 'Kids Stories', episodes: 10, thumbnail: 'https://i.ytimg.com/vi/3v5dYvZweHg/hqdefault.jpg' },
  { id: 'kids-bible-study', title: 'Kids Programe | Bible Study', episodes: 16, thumbnail: 'https://i.ytimg.com/vi/j0CU07nX-vg/hqdefault.jpg' },
];

export default function KidsZoneScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>BTL Kids</Text>
        <Text style={styles.subtitle}>Fun and faith-filled programs for children</Text>
      </View>
      <FlatList
        data={kidShows}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.showTitle}>{item.title}</Text>
              <Text style={styles.episodes}>{item.episodes} {t('episodes')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#1A2A1A' },
  title: { fontSize: 28, fontWeight: '700', color: '#2ECC71' },
  subtitle: { fontSize: 14, color: '#B0B0C8', marginTop: 4 },
  list: { padding: 16, gap: 16 },
  card: { flexDirection: 'row', backgroundColor: '#141420', borderRadius: 12, overflow: 'hidden' },
  thumb: { width: 120, height: 80 },
  info: { padding: 12, justifyContent: 'center' },
  showTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  episodes: { color: '#606078', fontSize: 12, marginTop: 4 },
});
