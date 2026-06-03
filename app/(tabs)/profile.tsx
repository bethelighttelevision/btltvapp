import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../lib/i18n';
import { useAuthStore, useWatchStore } from '../../lib/store';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { watchHistory, bookmarks } = useWatchStore();

  const menuItems = [
    { icon: 'time-outline', label: t('watch_history'), onPress: () => router.push('/(tabs)/watch-history') },
    { icon: 'bookmark-outline', label: t('bookmarks'), badge: bookmarks.length, onPress: () => router.push('/(tabs)/bookmarks') },
    { icon: 'notifications-outline', label: t('notifications'), onPress: () => router.push('/(tabs)/notifications') },
    { icon: 'settings-outline', label: t('settings'), onPress: () => router.push('/(tabs)/settings') },
    { icon: 'business-outline', label: 'Stichting', onPress: () => router.push('/(tabs)/stichting') },
    { icon: 'information-circle-outline', label: t('about'), onPress: () => router.push('/(tabs)/about') },
    { icon: 'heart-outline', label: t('donate'), onPress: () => router.push('/(tabs)/donate') },
  ];

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} tintColor="#E50914" />}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        {isAuthenticated ? (
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.email?.[0]?.toUpperCase() || 'U'}</Text>
            </View>
            <Text style={styles.name}>{user?.email || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        ) : (
          <View style={styles.profileSection}>
            <View style={styles.avatar}><Ionicons name="person" size={32} color="#606078" /></View>
            <Text style={styles.name}>{t('guest')}</Text>
            <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signInText}>{t('sign_in')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{watchHistory.length}</Text>
          <Text style={styles.statLabel}>Watched</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{bookmarks.length}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
            <Ionicons name={item.icon as any} size={22} color="#B0B0C8" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.badge ? <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View> : null}
            <Ionicons name="chevron-forward" size={18} color="#606078" />
          </TouchableOpacity>
        ))}
      </View>
      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>{t('sign_out')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { paddingHorizontal: 16, paddingBottom: 24, alignItems: 'center' },
  profileSection: { alignItems: 'center', gap: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#141420', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#E50914', fontSize: 28, fontWeight: '700' },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  email: { color: '#606078', fontSize: 14 },
  signInButton: { backgroundColor: '#E50914', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8, marginTop: 8 },
  signInText: { color: '#FFFFFF', fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#2A2A40', marginHorizontal: 16 },
  stat: { alignItems: 'center' },
  statNumber: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#606078', fontSize: 12 },
  menu: { marginTop: 24, marginHorizontal: 16, gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  menuLabel: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  badge: { backgroundColor: '#E50914', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  logoutButton: { marginHorizontal: 16, marginTop: 24, marginBottom: 100, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E50914', alignItems: 'center' },
  logoutText: { color: '#E50914', fontWeight: '600' },
});