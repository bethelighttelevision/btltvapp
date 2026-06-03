import { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { shows, categories } from '../../constants/shows';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - 48) / numColumns;

export default function ShowsScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredShows = shows.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderShow = useCallback(({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => (router as any).push(`/(tabs)/show/${item.id}`)}>
      <Image source={{ uri: item.thumbnail.startsWith('http') ? item.thumbnail : `https://www.btl-tv.com${item.thumbnail}` }} style={styles.thumb} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardBadge}>{item.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardEpisodes}>{item.episode_count} episodes</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderHeader = () => (
    <>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#606078" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search shows..."
          placeholderTextColor="#606078"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#606078" />
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, activeCategory === item && styles.activeCategory]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.categoryText, activeCategory === item && styles.activeCategoryText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>All Shows</Text>
        <Text style={styles.subtitle}>{filteredShows.length} programs available</Text>
      </View>
      <FlatList
        data={filteredShows}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.id}
        renderItem={renderShow}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} tintColor="#E50914" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#B0B0C8', marginTop: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141420', borderRadius: 10, paddingHorizontal: 12, gap: 8, height: 42, marginBottom: 12 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14, height: 42 },
  categoryList: { marginBottom: 16, maxHeight: 36 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#2A2A40', marginRight: 8 },
  activeCategory: { backgroundColor: '#E50914' },
  categoryText: { color: '#B0B0C8', fontSize: 13, fontWeight: '500' },
  activeCategoryText: { color: '#FFFFFF' },
  grid: { paddingHorizontal: 16, paddingBottom: 100 },
  card: { width: cardWidth, marginRight: 8, marginBottom: 16 },
  thumb: { width: cardWidth, height: cardWidth * 0.56, borderRadius: 8, backgroundColor: '#141420' },
  cardInfo: { paddingTop: 8 },
  cardBadge: { backgroundColor: '#2A2A40', color: '#B0B0C8', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
  cardTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  cardEpisodes: { color: '#606078', fontSize: 11, marginTop: 2 },
});
