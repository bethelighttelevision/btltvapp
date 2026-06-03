import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function OTPVerificationScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the code sent to your email</Text>
      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => { inputRefs.current[i] = ref; }}
            style={styles.codeInput}
            value={digit}
            onChangeText={(t) => handleCodeChange(t, i)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.verifyButton} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#606078', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  codeRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 },
  codeInput: { width: 48, height: 56, backgroundColor: '#141420', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A40', color: '#FFFFFF', fontSize: 24, textAlign: 'center' },
  verifyButton: { backgroundColor: '#E50914', borderRadius: 12, padding: 16, alignItems: 'center' },
  verifyText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
