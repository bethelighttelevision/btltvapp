import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../lib/i18n';

const courses = [
  { id: '1', title: 'Understanding the Bible', description: 'A comprehensive introduction to the Holy Scriptures', instructor: 'Pastor Munawar Virk', lessons: 12, students: 234, image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop' },
  { id: '2', title: 'Life of Jesus Christ', description: 'Walk through the Gospels and discover Jesus', instructor: 'Pastor Sarfaraz Rehmat', lessons: 8, students: 189, image: 'https://images.unsplash.com/photo-1504052434566-3ad124a8e1e9?q=80&w=1974&auto=format&fit=crop' },
  { id: '3', title: 'Christian Living', description: 'Practical guidance for daily faith', instructor: 'Bishop Emmanuel Aftab', lessons: 10, students: 156, image: 'https://images.unsplash.com/photo-1476146184052-4d1071ed8e15?q=80&w=1974&auto=format&fit=crop' },
];

export default function BibleSchoolScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A2A1A', '#0A0A0F']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>BTL Bible School</Text>
        <Text style={styles.subtitle}>Free Urdu Online Courses</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{courses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{courses.reduce((a, c) => a + c.students, 0)}+</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{courses.reduce((a, c) => a + c.lessons, 0)}+</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>
      </LinearGradient>
      <FlatList
        data={courses}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.courseCard} onPress={() => router.push(`/bible-school/course/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseDesc}>{item.description}</Text>
              <Text style={styles.courseMeta}>{item.instructor} · {item.lessons} lessons</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#B0B0C8', marginTop: 4, marginBottom: 20 },
  stats: { flexDirection: 'row', gap: 24 },
  stat: { alignItems: 'center' },
  statNumber: { color: '#2ECC71', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#606078', fontSize: 12 },
  list: { padding: 16, gap: 16 },
  courseCard: { flexDirection: 'row', backgroundColor: '#141420', borderRadius: 12, overflow: 'hidden' },
  courseImage: { width: 100, height: 100 },
  courseInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  courseTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  courseDesc: { color: '#B0B0C8', fontSize: 12, marginTop: 4 },
  courseMeta: { color: '#606078', fontSize: 11, marginTop: 6 },
});
