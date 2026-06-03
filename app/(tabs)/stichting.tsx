import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../lib/i18n';

export default function StichtingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Stichting BTL TV</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('../../assets/anbi-logo.png')} style={styles.anbiLogo} resizeMode="contain" />
        <Text style={styles.heading}>Stichting Be The Light Television</Text>
        <Text style={styles.subtitle}>Registered Foundation — The Netherlands</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foundation Details</Text>
          <View style={styles.row}><Text style={styles.label}>RSIN Number</Text><Text style={styles.value}>857342423</Text></View>
          <View style={styles.row}><Text style={styles.label}>KvK Number</Text><Text style={styles.value}>68202377</Text></View>
          <View style={styles.row}><Text style={styles.label}>IBAN</Text><Text style={styles.value}>NL06 RABO 0317 1209 80</Text></View>
          <View style={styles.row}><Text style={styles.label}>Postal Address</Text><Text style={styles.value}>Westeinde 21, 8064 AJ Zwartsluis, The Netherlands</Text></View>
          <View style={styles.row}><Text style={styles.label}>Established</Text><Text style={styles.value}>March 2, 2017</Text></View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purpose of the Foundation</Text>
          <Text style={styles.bodyText}>Stichting Be The Light Television aims to reach the Urdu-speaking population worldwide with the Gospel of Jesus Christ and to empower them to have a positive influence in their communities.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Achieve Our Goal</Text>
          <Text style={styles.bodyText}>The foundation produces and broadcasts television programs in the form of talk shows, presentations, and dramatized programs via the internet, social media, and (satellite) television.</Text>
          <Text style={styles.bodyText}>BTL-tv also aims to provide a platform for Christian artists, enabling them to use their unique gifts and talents for the Kingdom of God.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income Sources</Text>
          {['Collections in church services', 'Speaking engagements and presentations about BTL-tv\'s work', 'Structural donations from supporting companies and individuals', 'Flyer campaigns to attract new donors', 'Donations made through the donation button on the website'].map((item, i) => (
            <View key={i} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bodyText}>{item}</Text></View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Board Composition</Text>
          {[{ role: 'Chairman', name: 'Mr. J. van der Stouwe' }, { role: 'Secretary', name: 'Mr. D. Ras' }, { role: 'Treasurer / General Board Member', name: 'Mr. W. Bakker' }].map((person, i) => (
            <View key={i} style={styles.boardRow}>
              <Text style={styles.boardName}>{person.name}</Text>
              <Text style={styles.boardRole}>{person.role}</Text>
            </View>
          ))}
          <Text style={styles.note}>Board members are elected for a minimum of two years, with the possibility of re-election. The board meets at least six times a year.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compensation Policy</Text>
          <Text style={styles.bodyText}>None of the board members receive financial compensation for their work with Stichting Be The Light Television. Employees and volunteers of BTL-tv also do not receive a salary for their work.</Text>
          <Text style={styles.bodyText}>BTL-tv relies on the services of various volunteers. Income is used solely for expense reimbursements, such as travel allowances and volunteer contributions.</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Westeinde 21, 8064 AJ Zwartsluis, NL</Text>
          <Text style={styles.footerLink} onPress={() => Linking.openURL('mailto:info@btl-tv.com')}>info@btl-tv.com</Text>
          <Text style={styles.footerSmall}>ANBI RSIN: 857342423 | KvK: 68202377</Text>
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
  anbiLogo: { width: 100, height: 100, alignSelf: 'center', marginTop: 20, marginBottom: 8 },
  heading: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#E50914', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  section: { marginBottom: 24, backgroundColor: '#141420', borderRadius: 12, padding: 16 },
  sectionTitle: { color: '#E50914', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2A2A40' },
  label: { color: '#B0B0C8', fontSize: 13, flex: 1 },
  value: { color: '#FFFFFF', fontSize: 13, flex: 1.5, textAlign: 'right' },
  bodyText: { color: '#B0B0C8', fontSize: 14, lineHeight: 22, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  bullet: { color: '#E50914', fontSize: 16, lineHeight: 22 },
  boardRow: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2A2A40' },
  boardName: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  boardRole: { color: '#E50914', fontSize: 13, marginTop: 2 },
  note: { color: '#606078', fontSize: 12, fontStyle: 'italic', marginTop: 8 },
  footer: { alignItems: 'center', paddingVertical: 20, marginTop: 12 },
  footerText: { color: '#606078', fontSize: 12, textAlign: 'center' },
  footerLink: { color: '#E50914', fontSize: 12, marginTop: 4, textDecorationLine: 'underline' },
  footerSmall: { color: '#606078', fontSize: 11, marginTop: 8 },
});
