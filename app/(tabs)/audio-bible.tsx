import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { bibleBooks, GBC_AUDIO_MAP } from '../../constants/bible-books';

const { width } = Dimensions.get('window');
type AudioBook = (typeof bibleBooks)[number];

export default function AudioBibleScreen() {
  const insets = useSafeAreaInsets();
  const [testament, setTestament] = useState<'old' | 'new'>('old');
  const [selectedBook, setSelectedBook] = useState<AudioBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
    return () => { if (soundRef.current) { soundRef.current.unloadAsync(); } };
  }, []);

  const getAudioUrl = useCallback((book: AudioBook, chapter: number) => {
    const mappedName = GBC_AUDIO_MAP[book.id];
    if (!mappedName) return null;
    return `https://www.gbcpakistan.org/mp3/urdu_bible/${mappedName}${chapter}.mp3`;
  }, []);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const loadAndPlay = useCallback(async (book: AudioBook, chapter: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const url = getAudioUrl(book, chapter);
      if (!url) return;
      setLoading(true);
      setSelectedBook(book);
      setSelectedChapter(chapter);
      setPosition(0);
      setDuration(0);
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
          if (!status.isPlaying && status.didJustFinish) {
            setPlaying(false);
          }
        }
      });
      setPlaying(true);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [getAudioUrl]);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setPlaying(true);
        }
      }
    } catch {}
  }, []);

  const seekTo = useCallback(async (location: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(location * duration);
    }
  }, [duration]);

  const changeChapter = useCallback(async (dir: 1 | -1) => {
    if (!selectedBook) return;
    const newChapter = selectedChapter + dir;
    if (newChapter < 1 || newChapter > selectedBook.chapters) return;
    setSelectedChapter(newChapter);
    await loadAndPlay(selectedBook, newChapter);
  }, [selectedBook, selectedChapter, loadAndPlay]);

  const stopAndClose = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlaying(false);
    setPosition(0);
    setDuration(0);
    setSelectedBook(null);
  }, []);

  const chapters = Array.from({ length: selectedBook?.chapters || 0 }, (_, i) => i + 1);
  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Urdu Audio Bible</Text>
        <Text style={styles.subtitle}>66 books · Old & New Testament</Text>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, testament === 'old' && styles.activeTab]}
          onPress={() => { setTestament('old'); stopAndClose(); }}
        >
          <Text style={[styles.tabText, testament === 'old' && styles.activeTabText]}>Old Testament</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, testament === 'new' && styles.activeTab]}
          onPress={() => { setTestament('new'); stopAndClose(); }}
        >
          <Text style={[styles.tabText, testament === 'new' && styles.activeTabText]}>New Testament</Text>
        </TouchableOpacity>
      </View>
      {selectedBook ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.backToBooks} onPress={stopAndClose}>
            <Ionicons name="arrow-back" size={20} color="#E50914" />
            <Text style={styles.backText}>Back to books</Text>
          </TouchableOpacity>
          <Text style={styles.bookTitle}>{selectedBook.name} — {selectedBook.nameUrdu}</Text>
          <FlatList
            data={chapters}
            numColumns={4}
            contentContainerStyle={[styles.chapterGrid, { paddingBottom: 140 }]}
            columnWrapperStyle={styles.chapterRow}
            keyExtractor={(ch) => `${ch}`}
            renderItem={({ item: ch }) => {
              const active = selectedBook.id === selectedBook?.id && selectedChapter === ch;
              return (
                <TouchableOpacity
                  style={[styles.chapterBtn, active && styles.chapterActive]}
                  onPress={() => loadAndPlay(selectedBook, ch)}
                >
                  <Text style={[styles.chapterText, active && styles.chapterTextActive]}>{ch}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : (
        <FlatList
          data={bibleBooks.filter(b => b.testament === testament)}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookItem} onPress={() => loadAndPlay(item, 1)}>
              <View style={styles.bookInfo}>
                <Text style={styles.bookName}>{item.name}</Text>
                <Text style={styles.bookNameUrdu}>{item.nameUrdu}</Text>
                <Text style={styles.chapterCount}>{item.chapters} chapters</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#606078" />
            </TouchableOpacity>
          )}
        />
      )}
      {selectedBook && (
        <View style={[styles.player, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.playerClose} onPress={stopAndClose}>
            <Ionicons name="close" size={20} color="#606078" />
          </TouchableOpacity>
          <View style={styles.playerTop}>
            <View style={styles.artwork}>
              <Ionicons name="book" size={32} color="#E50914" />
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerBook}>{selectedBook.name} {selectedChapter}</Text>
              <Text style={styles.playerChapter}>{selectedBook.nameUrdu} — باب {selectedChapter}</Text>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator color="#E50914" style={{ marginVertical: 12 }} />
          ) : (
            <>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity onPress={() => changeChapter(-1)} disabled={selectedChapter <= 1}>
                  <Ionicons name="play-skip-back" size={24} color={selectedChapter <= 1 ? '#2A2A40' : '#FFFFFF'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn}>
                  <Ionicons name={playing ? 'pause' : 'play'} size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeChapter(1)} disabled={selectedChapter >= (selectedBook?.chapters || 0)}>
                  <Ionicons name="play-skip-forward" size={24} color={selectedChapter >= (selectedBook?.chapters || 0) ? '#2A2A40' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#B0B0C8', marginTop: 4 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, marginTop: 12, backgroundColor: '#141420', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  activeTab: { backgroundColor: '#E50914' },
  tabText: { color: '#606078', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#FFFFFF' },
  list: { paddingHorizontal: 16 },
  bookItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#141420', borderRadius: 8, marginBottom: 8 },
  bookInfo: { flex: 1 },
  bookName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  bookNameUrdu: { color: '#B0B0C8', fontSize: 14, marginTop: 2 },
  chapterCount: { color: '#606078', fontSize: 12, marginTop: 4 },
  backToBooks: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backText: { color: '#E50914', fontSize: 15, marginLeft: 6, fontWeight: '500' },
  bookTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', paddingHorizontal: 16, marginBottom: 12 },
  chapterGrid: { paddingHorizontal: 12 },
  chapterRow: { justifyContent: 'flex-start', gap: 8, paddingHorizontal: 4, marginBottom: 8 },
  chapterBtn: { width: '22%', backgroundColor: '#141420', borderRadius: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  chapterActive: { backgroundColor: '#E50914' },
  chapterText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  chapterTextActive: { color: '#FFFFFF' },
  player: { backgroundColor: '#1A1A2E', borderTopWidth: 1, borderTopColor: '#2A2A40', paddingHorizontal: 20, paddingTop: 12 },
  playerClose: { alignSelf: 'flex-end', marginBottom: 4 },
  playerTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  artwork: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#141420', alignItems: 'center', justifyContent: 'center' },
  playerInfo: { flex: 1 },
  playerBook: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  playerChapter: { color: '#B0B0C8', fontSize: 13, marginTop: 2 },
  progressContainer: { marginTop: 12 },
  progressTrack: { height: 4, backgroundColor: '#2A2A40', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#E50914', borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  timeText: { color: '#606078', fontSize: 11 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, paddingVertical: 10 },
  playBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E50914', alignItems: 'center', justifyContent: 'center' },
});
