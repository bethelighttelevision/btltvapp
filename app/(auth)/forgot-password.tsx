import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    Alert.alert('Check your email', 'We sent a password reset link');
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#606078"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} disabled={loading}>
          <Text style={styles.resetText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#606078', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  input: { backgroundColor: '#141420', borderRadius: 12, padding: 16, color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#2A2A40', marginBottom: 16 },
  resetButton: { backgroundColor: '#E50914', borderRadius: 12, padding: 16, alignItems: 'center' },
  resetText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  backText: { color: '#606078', textAlign: 'center', marginTop: 24, fontSize: 14 },
});
