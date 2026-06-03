import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWatchStore } from '../../lib/store';
import { useI18n } from '../../lib/i18n';

export default function WatchHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { watchHistory, clearHistory } = useWatchStore();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('watch_history')}</Text>
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      {watchHistory.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={48} color="#606078" />
          <Text style={styles.emptyText}>No watch history yet</Text>
        </View>
      ) : (
        <FlatList
          data={watchHistory}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDate}>{new Date(item.watchedAt).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  clearText: { color: '#E50914', fontSize: 14 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { color: '#606078', fontSize: 16 },
  item: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  itemTitle: { color: '#FFFFFF', fontSize: 14 },
  itemDate: { color: '#606078', fontSize: 12, marginTop: 4 },
});
