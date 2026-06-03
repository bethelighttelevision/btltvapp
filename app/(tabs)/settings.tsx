import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../lib/i18n';

const languages = ['English', 'Dutch', 'Urdu'];
const qualities = ['Auto', 'HD (720p)', 'Full HD (1080p)', '4K'];
const SETTINGS_KEY = '@btltv_settings';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, currentLang, setLang } = useI18n();
  const [quality, setQuality] = useState('Auto');
  const [showLang, setShowLang] = useState(false);
  const [showQual, setShowQual] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(val => {
      if (val) {
        const s = JSON.parse(val);
        if (s.quality) setQuality(s.quality);
      }
    });
  }, []);

  const selectLang = (lang: string) => {
    setLang(lang);
    setShowLang(false);
  };

  const selectQual = async (qual: string) => {
    setQuality(qual);
    setShowQual(false);
    const existing = await AsyncStorage.getItem(SETTINGS_KEY);
    const s = existing ? JSON.parse(existing) : {};
    s.quality = qual;
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('settings')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>{t('language')}</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => setShowLang(!showLang)}>
          <Text style={styles.settingLabel}>{t('language')}</Text>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{currentLang}</Text>
            <Ionicons name={showLang ? 'chevron-up' : 'chevron-down'} size={18} color="#606078" />
          </View>
        </TouchableOpacity>
        {showLang && languages.map(l => (
          <TouchableOpacity key={l} style={styles.optionRow} onPress={() => selectLang(l)}>
            <Text style={[styles.optionText, l === currentLang && styles.optionActive]}>{l}</Text>
            {l === currentLang && <Ionicons name="checkmark" size={18} color="#E50914" />}
          </TouchableOpacity>
        ))}
        <Text style={styles.section}>{t('video_quality')}</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => setShowQual(!showQual)}>
          <Text style={styles.settingLabel}>{t('video_quality')}</Text>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{quality}</Text>
            <Ionicons name={showQual ? 'chevron-up' : 'chevron-down'} size={18} color="#606078" />
          </View>
        </TouchableOpacity>
        {showQual && qualities.map(q => (
          <TouchableOpacity key={q} style={styles.optionRow} onPress={() => selectQual(q)}>
            <Text style={[styles.optionText, q === quality && styles.optionActive]}>{q}</Text>
            {q === quality && <Ionicons name="checkmark" size={18} color="#E50914" />}
          </TouchableOpacity>
        ))}
        <Text style={styles.section}>{t('about')}</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('version')}</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingBottom: 100 },
  section: { color: '#E50914', fontSize: 13, fontWeight: '600', marginTop: 24, marginBottom: 8, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingLabel: { color: '#FFFFFF', fontSize: 15 },
  settingValue: { color: '#606078', fontSize: 15 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#141420', marginBottom: 1 },
  optionText: { color: '#B0B0C8', fontSize: 14 },
  optionActive: { color: '#E50914', fontWeight: '600' },
});
