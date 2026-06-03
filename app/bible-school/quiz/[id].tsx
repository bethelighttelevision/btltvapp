import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useI18n } from '../../../lib/i18n';
import { Ionicons } from '@expo/vector-icons';

const quizData: Record<string, any> = {
  l1: {
    questions: [
      { id: 'q1', question: 'How many books are in the Bible?', options: ['66', '27', '39', '73'], correct: 0 },
      { id: 'q2', question: 'The Bible is divided into how many main sections?', options: ['Three', 'Two', 'Four', 'Five'], correct: 1 },
      { id: 'q3', question: 'How many books are in the Old Testament?', options: ['27', '39', '66', '46'], correct: 1 },
    ],
  },
};

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz = quizData[id as keyof typeof quizData];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  if (!quiz) {
    return <View style={styles.container}><Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 100 }}>{t('quizNotFound')}</Text></View>;
  }

  const questions = quiz.questions;
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const score = selectedAnswers.filter((ans, i) => ans === questions[i].correct).length;
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (showResult) {
    const score = selectedAnswers.filter((ans, i) => ans === questions[i].correct).length;
    const passed = score >= questions.length * 0.6;
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons name={passed ? 'trophy' : 'refresh-circle'} size={64} color={passed ? '#F5A623' : '#E74C3C'} />
          <Text style={styles.resultTitle}>{passed ? t('congratulations') : t('keepTrying')}</Text>
          <Text style={styles.resultScore}>You scored {score}/{questions.length}</Text>
          {passed && (
            <TouchableOpacity style={styles.certButton}>
              <Ionicons name="ribbon" size={20} color="#FFFFFF" />
              <Text style={styles.certText}>{t('downloadCertificate')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.retryButton} onPress={() => { setCurrentQuestion(0); setSelectedAnswers([]); setShowResult(false); }}>
            <Text style={styles.retryText}>{t('retryQuiz')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>{t('backToLesson')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('quiz')}</Text>
        <Text style={styles.counter}>{currentQuestion + 1}/{questions.length}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.options}>
          {question.options.map((option: string, i: number) => (
            <TouchableOpacity
              key={i}
              style={[styles.option, selectedAnswers[currentQuestion] === i && styles.selectedOption]}
              onPress={() => handleAnswer(i)}
            >
              <Text style={[styles.optionText, selectedAnswers[currentQuestion] === i && styles.selectedOptionText]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, selectedAnswers[currentQuestion] === undefined && styles.disabledButton]}
          onPress={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
        >
          <Text style={styles.nextText}>{isLastQuestion ? t('finish') : t('next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  counter: { color: '#B0B0C8', fontSize: 14 },
  progressBar: { height: 4, backgroundColor: '#2A2A40', marginHorizontal: 16, borderRadius: 2, marginBottom: 24 },
  progressFill: { height: 4, backgroundColor: '#E50914', borderRadius: 2 },
  questionContainer: { flex: 1, paddingHorizontal: 16 },
  questionText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600', marginBottom: 24 },
  options: { gap: 12 },
  option: { backgroundColor: '#141420', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#2A2A40' },
  selectedOption: { borderColor: '#E50914', backgroundColor: '#1A1A2E' },
  optionText: { color: '#B0B0C8', fontSize: 16 },
  selectedOptionText: { color: '#E50914', fontWeight: '600' },
  nextButton: { backgroundColor: '#E50914', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 32 },
  disabledButton: { opacity: 0.5 },
  nextText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  resultTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  resultScore: { color: '#B0B0C8', fontSize: 16 },
  certButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F5A623', borderRadius: 12, padding: 16, marginTop: 16 },
  certText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  retryButton: { backgroundColor: '#141420', borderRadius: 12, padding: 16, marginTop: 12 },
  retryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  backText: { color: '#606078', fontSize: 14, marginTop: 12 },
});
