import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../lib/i18n';

const notifications = [
  { id: '1', title: 'New Episode', message: 'Yesu Sang Sawera - new episode available', time: '2 hours ago', read: false },
  { id: '2', title: 'Course Update', message: 'New lesson added to Understanding the Bible', time: '1 day ago', read: false },
  { id: '3', title: 'Live Now', message: 'BTL TV Live stream is currently broadcasting', time: '3 days ago', read: true },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('notifications')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={notifications}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notifItem, !item.read && styles.unread]}>
            <View style={styles.dotContainer}>
              {!item.read && <View style={styles.dot} />}
            </View>
            <View style={styles.content}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifMessage}>{item.message}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  list: { paddingHorizontal: 16, gap: 4 },
  notifItem: { flexDirection: 'row', padding: 16, backgroundColor: '#141420', borderRadius: 8, gap: 12 },
  unread: { borderLeftWidth: 3, borderLeftColor: '#E50914' },
  dotContainer: { width: 12, alignItems: 'center', paddingTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E50914' },
  content: { flex: 1 },
  notifTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  notifMessage: { color: '#B0B0C8', fontSize: 13, marginTop: 2 },
  notifTime: { color: '#606078', fontSize: 11, marginTop: 4 },
});
