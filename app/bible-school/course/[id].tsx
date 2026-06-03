import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useI18n } from '../../../lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const courseData: Record<string, any> = {
  '1': {
    id: '1', title: 'Understanding the Bible', description: 'A comprehensive introduction to the Holy Scriptures', instructor: 'Pastor Munawar Virk', lessons: 12, students: 234, image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop',
    lessonsList: [
      { id: 'l1', title: 'Introduction to the Bible', duration: '15 min', completed: true },
      { id: 'l2', title: 'The Old Testament Overview', duration: '20 min', completed: true },
      { id: 'l3', title: 'The Pentateuch', duration: '25 min', completed: false },
      { id: 'l4', title: 'Historical Books', duration: '20 min', completed: false },
      { id: 'l5', title: 'Poetry & Wisdom Literature', duration: '18 min', completed: false },
    ],
  },
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = courseData[id || ''];
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  if (!course) {
    return <View style={styles.container}><Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 100 }}>{t('courseNotFound')}</Text></View>;
  }

  const progress = course.lessonsList.filter((l: any) => l.completed).length / course.lessonsList.length * 100;

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            <Image source={{ uri: course.image }} style={styles.cover} />
            <LinearGradient colors={['transparent', '#0A0A0F']} style={styles.overlay} />
            <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{course.title}</Text>
              <Text style={styles.description}>{course.description}</Text>
              <Text style={styles.instructor}>By {course.instructor}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>{course.lessons} lessons</Text>
                <Text style={styles.stat}>{course.students} students</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
              <TouchableOpacity style={styles.enrollButton}>
                <Text style={styles.enrollText}>{t('enrollNow')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        data={course.lessonsList}
        contentContainerStyle={styles.list}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity style={styles.lessonItem} onPress={() => router.push(`/bible-school/lesson/${item.id}`)}>
            <View style={styles.lessonNumber}>
              <Text style={styles.lessonNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDuration}>{item.duration}</Text>
            </View>
            {item.completed ? (
              <Ionicons name="checkmark-circle" size={22} color="#2ECC71" />
            ) : (
              <Ionicons name="play-circle-outline" size={22} color="#E50914" />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  cover: { width: '100%', height: 200 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  backButton: { position: 'absolute', top: 50, left: 16, zIndex: 10, padding: 8 },
  headerInfo: { padding: 16, gap: 8 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  description: { color: '#B0B0C8', fontSize: 14, lineHeight: 20 },
  instructor: { color: '#E50914', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 16 },
  stat: { color: '#606078', fontSize: 13 },
  progressBar: { height: 6, backgroundColor: '#2A2A40', borderRadius: 3, marginTop: 8 },
  progressFill: { height: 6, backgroundColor: '#2ECC71', borderRadius: 3 },
  progressText: { color: '#2ECC71', fontSize: 12 },
  enrollButton: { backgroundColor: '#E50914', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  enrollText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 8 },
  lessonItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141420', borderRadius: 8, padding: 14, gap: 12 },
  lessonNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2A2A40', alignItems: 'center', justifyContent: 'center' },
  lessonNumberText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  lessonInfo: { flex: 1 },
  lessonTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  lessonDuration: { color: '#606078', fontSize: 12, marginTop: 2 },
});
