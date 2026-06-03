import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useI18n } from '../../../lib/i18n';
import { Ionicons } from '@expo/vector-icons';

const lessonContent = {
  l1: { title: 'Introduction to the Bible', content: 'The Bible is the sacred scripture of Christianity, divided into the Old Testament and New Testament. It contains 66 books written by various authors over centuries.\n\nKey Points:\n• The Bible is inspired by God\n• It reveals God\'s plan for humanity\n• It is divided into two main sections\n• The Old Testament has 39 books\n• The New Testament has 27 books\n\nIn this lesson, we explore how the Bible came to be and why it remains relevant today.' },
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const lesson = lessonContent[id as keyof typeof lessonContent] || { title: t('lesson'), content: t('contentComingSoon') };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{lesson.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.contentText}>{lesson.content}</Text>
        <TouchableOpacity style={styles.quizButton} onPress={() => router.push(`/bible-school/quiz/${id}`)}>
          <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.quizText}>{t('takeQuiz')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.completeButton}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.completeText}>{t('markAsComplete')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2A2A40' },
  title: { flex: 1, color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  contentText: { color: '#B0B0C8', fontSize: 15, lineHeight: 24, marginBottom: 24 },
  quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E50914', borderRadius: 12, padding: 16, marginBottom: 12 },
  quizText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  completeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2ECC71', borderRadius: 12, padding: 16 },
  completeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
