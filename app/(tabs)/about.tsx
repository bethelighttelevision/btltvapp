import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../lib/i18n';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('about')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>BTL TV</Text>
        <Text style={styles.tagline}>Be The Light Television</Text>
        <Text style={styles.body}>
          Spreading the Gospel of Jesus Christ to Urdu-speaking communities worldwide through television, digital media, and community outreach.
        </Text>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://btl-tv.com')}>
          <Ionicons name="globe-outline" size={18} color="#E50914" />
          <Text style={styles.linkText}>www.btl-tv.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('mailto:info@btl-tv.com')}>
          <Ionicons name="mail-outline" size={18} color="#E50914" />
          <Text style={styles.linkText}>info@btl-tv.com</Text>
        </TouchableOpacity>
        <Text style={styles.version}>{t('version')} 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  content: { padding: 24, alignItems: 'center' },
  brand: { color: '#FFFFFF', fontSize: 32, fontWeight: '700', marginTop: 20 },
  tagline: { color: '#E50914', fontSize: 16, marginTop: 4 },
  body: { color: '#B0B0C8', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 24 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  linkText: { color: '#E50914', fontSize: 14 },
  version: { color: '#606078', fontSize: 12, marginTop: 40 },
});
