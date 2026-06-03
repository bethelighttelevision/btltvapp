import { useState, useRef } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Watch & Worship',
    tagline: 'Stream 40+ Urdu Christian shows, anytime, anywhere',
    gradient: ['#0A0A0F', '#1A1A2E', '#0A0A0F'],
  },
  {
    id: '2',
    title: 'Grow in Faith',
    tagline: 'Learn the Bible through free Urdu courses and earn certificates',
    gradient: ['#0A0A0F', '#1A2A1A', '#0A0A0F'],
  },
  {
    id: '3',
    title: "Hear God's Word",
    tagline: 'Listen to the complete Urdu Bible — 66 books, free forever',
    gradient: ['#0A0A0F', '#2A1A1A', '#0A0A0F'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <LinearGradient colors={item.gradient as any} style={styles.slide}>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.tagline}>{item.tagline}</Text>
            </View>
          </LinearGradient>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
          ))}
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  slide: { width, height: height * 0.85, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 40, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 16 },
  tagline: { fontSize: 16, color: '#B0B0C8', textAlign: 'center', lineHeight: 24 },
  footer: { height: height * 0.15, paddingHorizontal: 24, justifyContent: 'space-between', paddingBottom: 40 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2A2A40' },
  activeDot: { width: 24, backgroundColor: '#E50914' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipText: { color: '#606078', fontSize: 16 },
  nextButton: { backgroundColor: '#E50914', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  nextText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
