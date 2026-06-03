import { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../lib/i18n';

function LiveIcon({ color, focused }: { color: string; focused?: boolean }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 0.3, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.15, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={styles.liveWrap}>
      <View style={styles.liveIconInner}>
        <Animated.View style={{ opacity: pulse, transform: [{ scale }] }}>
          <Ionicons name="tv" size={28} color={color} />
        </Animated.View>
        <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
      </View>
      {focused && <View style={styles.liveIndicatorBar} />}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t, currentLang } = useI18n();
  return (
    <Tabs key={currentLang}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#606078',
        tabBarStyle: {
          backgroundColor: '#0A0A0F',
          borderTopColor: '#2A2A40',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 0 },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: t('home'), tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} /> }} />
      <Tabs.Screen name="shows" options={{ title: t('shows'), tabBarIcon: ({ color }) => <Ionicons name="grid" size={22} color={color} /> }} />
      <Tabs.Screen name="live-tv" options={{ title: t('live'), tabBarIcon: ({ color, focused }) => <LiveIcon color={color} focused={focused} /> }} />
      <Tabs.Screen name="bible-school" options={{ title: t('school'), tabBarIcon: ({ color }) => <Ionicons name="book" size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: t('profile'), tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} /> }} />
      <Tabs.Screen name="audio-bible" options={{ href: null }} />
      <Tabs.Screen name="team" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="stichting" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="donate" options={{ href: null }} />
      <Tabs.Screen name="kids" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="watch-history" options={{ href: null }} />
      <Tabs.Screen name="bookmarks" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="show/[id]" options={{ href: null }} />
      <Tabs.Screen name="episode/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  liveWrap: { alignItems: 'center', justifyContent: 'center' },
  liveIconInner: { alignItems: 'center', justifyContent: 'center', position: 'relative', width: 32, height: 28 },
  liveDot: { position: 'absolute', top: -1, right: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E50914' },
  liveIndicatorBar: { position: 'absolute', bottom: -6, width: 20, height: 3, borderRadius: 1.5, backgroundColor: '#E50914' },
});