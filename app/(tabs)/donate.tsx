import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Linking, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../lib/i18n';

const amounts = [10, 25, 50, 100, 250, 500];

export default function DonationScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>{t('donate')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{t('donate')}</Text>
        <Text style={styles.description}>
          Your generous donations help BTL TV continue producing quality Christian content and reaching Urdu-speaking communities worldwide.
        </Text>
        <Text style={styles.amountLabel}>Select Amount (€)</Text>
        <View style={styles.amountRow}>
          {amounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[styles.amountChip, selectedAmount === amount && styles.selectedAmount]}
              onPress={() => { setSelectedAmount(amount); setCustomAmount(''); }}
            >
              <Text style={[styles.amountText, selectedAmount === amount && styles.selectedAmountText]}>€{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.customInput}
          placeholder="Custom amount (€)"
          placeholderTextColor="#606078"
          value={customAmount}
          onChangeText={(t) => { setCustomAmount(t); setSelectedAmount(0); }}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.donateButton} onPress={() => Linking.openURL('https://btl-tv.com/donation')}>
          <Text style={styles.donateText}>{t('donate')} €{selectedAmount || customAmount || '0'}</Text>
        </TouchableOpacity>
        <View style={styles.bankInfo}>
          <Text style={styles.bankTitle}>Bank Transfer</Text>
          <Text style={styles.bankLabel}>Account Name: Stichting BTL TV</Text>
          <Text style={styles.bankLabel}>IBAN: NL06 RABO 0317 1209 80</Text>
          <Text style={styles.bankLabel}>BIC: RABONL2U</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  content: { padding: 16 },
  sectionTitle: { color: '#F5A623', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  description: { color: '#B0B0C8', fontSize: 14, lineHeight: 20, marginBottom: 24 },
  amountLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  amountRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  amountChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, backgroundColor: '#141420', borderWidth: 1, borderColor: '#2A2A40' },
  selectedAmount: { borderColor: '#F5A623', backgroundColor: '#2A2A1A' },
  amountText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  selectedAmountText: { color: '#F5A623' },
  customInput: { backgroundColor: '#141420', borderRadius: 12, padding: 16, color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#2A2A40', marginBottom: 16 },
  donateButton: { backgroundColor: '#F5A623', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24 },
  donateText: { color: '#000000', fontSize: 16, fontWeight: '700' },
  bankInfo: { backgroundColor: '#141420', borderRadius: 12, padding: 16, gap: 8 },
  bankTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  bankLabel: { color: '#B0B0C8', fontSize: 13 },
});
