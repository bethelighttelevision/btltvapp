import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { shows } from '../../constants/shows';
import { useI18n } from '../../lib/i18n';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [query, setQuery] = useState('');

  const results = shows.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, { marginTop: insets.top + 16 }]}>
        <Ionicons name="search" size={20} color="#606078" />
        <TextInput
          style={styles.input}
          placeholder="Search shows, episodes..."
          placeholderTextColor="#606078"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#606078" />
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={results}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => router.push(`/(tabs)/show/${item.id}` as any)}>
            <Image source={{ uri: item.thumbnail.startsWith('http') ? item.thumbnail : `https://www.btl-tv.com${item.thumbnail}` }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={query ? <Text style={styles.empty}>No results found</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, backgroundColor: '#141420', borderRadius: 12, paddingHorizontal: 16, gap: 8, height: 48 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16, height: 48 },
  list: { paddingHorizontal: 16, gap: 12, paddingBottom: 100 },
  resultItem: { flexDirection: 'row', gap: 12 },
  thumb: { width: 80, height: 45, borderRadius: 6, backgroundColor: '#141420' },
  info: { justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  category: { color: '#606078', fontSize: 12, marginTop: 2 },
  empty: { color: '#606078', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
