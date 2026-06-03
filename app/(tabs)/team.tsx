import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const teamGroups = [
  {
    title: 'Leadership',
    icon: 'shield-checkmark' as const,
    members: [
      { name: 'Gasper Daniel', role: 'CEO & Founder', image: 'https://www.btl-tv.com/images/team/gasper-daniel-ceo.png' },
      { name: 'Sumble Noreen', role: 'Vice President', image: 'https://www.btl-tv.com/images/team/sumble-noreen-vp.png' },
      { name: 'Sahir Alam', role: 'Head of Audio & Video', image: 'https://www.btl-tv.com/images/team/sahir-alam.webp' },
    ],
  },
  {
    title: 'Office',
    icon: 'briefcase' as const,
    members: [
      { name: 'Karal Yohana', role: 'Head of Department', image: 'https://www.btl-tv.com/images/team/karal-yohana-hod.png' },
      { name: 'Nayyar Noel', role: 'Co-Ordinator', image: 'https://www.btl-tv.com/images/team/nayyar-noel.webp' },
      { name: 'Khisal Daniel', role: 'Director of Photography', image: 'https://www.btl-tv.com/images/team/khisal-daniel-dop.png' },
      { name: 'Minahil Daniel', role: 'Director of Photography', image: 'https://www.btl-tv.com/images/team/minahil-daniel-dop.png' },
    ],
  },
  {
    title: 'Hosts',
    icon: 'mic' as const,
    members: [
      { name: 'Watson Gill', role: 'Host', image: 'https://www.btl-tv.com/images/team/watson-gill.webp' },
    ],
  },
  {
    title: 'Pastors & Predikants',
    icon: 'book' as const,
    members: [
      { name: 'Emmanuel Aftab', role: 'Bishop', image: 'https://www.btl-tv.com/images/team/emmanuel-aftab.webp' },
      { name: 'Douwe Wijmenga', role: 'Predikant', image: 'https://www.btl-tv.com/images/team/douwe-wijmenga.webp' },
      { name: 'Imko Postma', role: 'Predikant', image: 'https://www.btl-tv.com/images/team/imko-postma.webp' },
      { name: 'Terpstra', role: 'Predikant', image: 'https://www.btl-tv.com/images/team/terpstra.webp' },
      { name: 'Imran Gill', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/imran-gill.webp' },
      { name: 'Munawar Virk', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/munawar-virk.webp' },
      { name: 'Nadeem K Dean', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/nadeem-k-dean.webp' },
      { name: 'Parvaiz Iqbal', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/parvaiz-iqbal.webp' },
      { name: 'Robert Slack', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/robert-slack.webp' },
      { name: 'Sarfraz Rehmat', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/sarfraz-rehmat.webp' },
      { name: 'William Paighani', role: 'Pastor', image: 'https://www.btl-tv.com/images/team/william-paighani.webp' },
    ],
  },
  {
    title: 'Legal & Others',
    icon: 'scale' as const,
    members: [
      { name: 'Lazar Allah Rakha', role: 'Advocate', image: 'https://www.btl-tv.com/images/team/lazar-allah-rakha.webp' },
      { name: 'Sooba Bhatti', role: 'Advocate', image: 'https://www.btl-tv.com/images/team/sooba-bhatti.webp' },
      { name: 'Malook Israel', role: 'News Reporter', image: 'https://www.btl-tv.com/images/team/malook-israel.webp' },
    ],
  },
];

export default function TeamScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Our Team</Text>
        <Text style={styles.subtitle}>The people behind BTL TV who make it all possible.</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {teamGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <View style={styles.groupHeader}>
              <View style={styles.groupIcon}>
                <Ionicons name={group.icon} size={20} color="#E50914" />
              </View>
              <Text style={styles.groupTitle}>{group.title}</Text>
            </View>
            <View style={styles.memberGrid}>
              {group.members.map((member) => (
                <View key={member.name} style={styles.memberCard}>
                  <Image
                    source={{ uri: member.image }}
                    style={styles.memberImage}
                    defaultSource={{ uri: 'https://www.btl-tv.com/images/logo/btl-logo.webp' }}
                  />
                  <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
                  <Text style={styles.memberRole} numberOfLines={1}>{member.role}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { paddingHorizontal: 16, paddingBottom: 16, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#B0B0C8', marginTop: 4, textAlign: 'center' },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  group: { marginBottom: 28 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  groupIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#1A0A0A', alignItems: 'center', justifyContent: 'center' },
  groupTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  memberGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  memberCard: { width: '30%', backgroundColor: '#141420', borderRadius: 12, overflow: 'hidden', paddingBottom: 10 },
  memberImage: { width: '100%', aspectRatio: 0.75, backgroundColor: '#2A2A40' },
  memberName: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 6, paddingHorizontal: 4 },
  memberRole: { color: '#E50914', fontSize: 10, textAlign: 'center', marginTop: 2, paddingHorizontal: 4 },
});
