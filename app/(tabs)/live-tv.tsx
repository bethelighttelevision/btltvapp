import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Linking, Animated, Easing, RefreshControl, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useI18n } from '../../lib/i18n';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const schedule = [
  { time: '6:00 AM', show: 'Yesu Sang Sawera (Morning Devotional)' },
  { time: '8:00 AM', show: 'Ochtend met Jezus (Dutch Devotional)' },
  { time: '10:00 AM', show: 'Farman-e-Masih / Masihi Zindagi' },
  { time: '12:00 PM', show: 'Talk Shows & Discussions' },
  { time: '2:00 PM', show: 'Drama Series' },
  { time: '4:00 PM', show: 'Aap Ki Sehat (Health Program)' },
  { time: '6:00 PM', show: 'Documentary & Social Issues' },
  { time: '8:00 PM', show: 'Puray Dil Se (Worship)' },
  { time: '10:00 PM', show: 'Debate & Apologetics' },
];

const HLS_URL = 'https://livecdn.live247stream.com/btl/tv/btl/stream2/chunks.m3u8';

export default function LiveTVScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const videoRef = useRef<Video>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      };
    }, [])
  );

  const hasStream = HLS_URL.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} tintColor="#E50914" />}>
      <View style={styles.playerContainer}>
        {hasStream ? (
          <Video
            ref={videoRef}
            source={{ uri: HLS_URL }}
            style={{ width, height: width * 0.5625 }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isMuted={false}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="tv" size={48} color="#606078" />
            <Text style={styles.placeholderText}>Live Stream URL not configured</Text>
            <Text style={styles.placeholderSub}>Watch on YouTube instead</Text>
          </View>
        )}
        <View style={styles.liveIndicator}>
          <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
          <Text style={styles.liveText}>{t('live_now')}</Text>
        </View>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.nowPlaying}>{t('now_playing')}</Text>
        <Text style={styles.showName}>{t('live_stream')}</Text>
        <Text style={styles.showDesc}>24/7 Christian programming in Urdu</Text>
        <TouchableOpacity style={styles.youtubeButton} onPress={() => Linking.openURL('https://youtube.com/@btltv/live')}>
          <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
          <Text style={styles.youtubeBtnText}>{t('watch_on_youtube')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>{t('program_schedule')}</Text>
        {schedule.map((item, i) => (
          <View key={i} style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{item.time}</Text>
            <Text style={styles.scheduleShow}>{item.show}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  playerContainer: { position: 'relative' },
  placeholder: { width, height: width * 0.5625, backgroundColor: '#141420', justifyContent: 'center', alignItems: 'center', gap: 8 },
  placeholderText: { color: '#606078', fontSize: 14 },
  placeholderSub: { color: '#606078', fontSize: 12 },
  liveIndicator: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E50914', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  liveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  infoSection: { padding: 16 },
  nowPlaying: { color: '#E50914', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  showName: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  showDesc: { color: '#B0B0C8', fontSize: 14, marginTop: 4 },
  youtubeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E50914', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, gap: 8, alignSelf: 'flex-start', marginTop: 12 },
  youtubeBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  scheduleSection: { paddingHorizontal: 16, flex: 1 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  scheduleItem: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A40', gap: 12 },
  scheduleTime: { color: '#E50914', fontSize: 14, fontWeight: '600', width: 80 },
  scheduleShow: { color: '#B0B0C8', fontSize: 14, flex: 1 },
});