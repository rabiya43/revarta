import { colors } from "@/constants/theme";
import { fetchFeedback } from "@/lib/api";
import { loadProfile } from "@/lib/storage";
import { selectQuestions } from "@revarta/shared";
import type { CoachingFeedback, OnboardingProfile, Question } from "@revarta/shared";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function DrillsScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<CoachingFeedback | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile().then((p) => {
      if (!p) {
        router.replace("/setup");
        return;
      }
      setProfile(p);
      pick(p);
    });
  }, [router]);

  function pick(p: OnboardingProfile) {
    const pool = selectQuestions(p.role, p.seniority, p.companyType, 8);
    setQuestion(pool[Math.floor(Math.random() * pool.length)] ?? null);
    setAnswer("");
    setFeedback(null);
  }

  async function submit() {
    if (!profile || !question || answer.trim().length < 10) return;
    setLoading(true);
    try {
      const fb = await fetchFeedback(profile, question.text, answer.trim(), 45);
      setFeedback(fb);
    } catch {
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  }

  if (!profile || !question) return null;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.badge}>No timer</Text>
      <Text style={styles.q}>{question.text}</Text>

      {!feedback && (
        <>
          <TextInput
            multiline
            value={answer}
            onChangeText={setAnswer}
            style={styles.input}
            placeholder="Your answer..."
            textAlignVertical="top"
          />
          <Pressable style={styles.primary} onPress={submit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Get feedback</Text>
            )}
          </Pressable>
        </>
      )}

      {feedback && (
        <>
          <View style={styles.card}>
            <Text style={styles.score}>Overall {feedback.scores.overall}/10</Text>
            <Text style={styles.tip}>{feedback.coachingTip}</Text>
          </View>
          <Pressable style={styles.primary} onPress={() => pick(profile)}>
            <Text style={styles.primaryText}>Next drill</Text>
          </Pressable>
        </>
      )}

      <Link href="/progress" style={styles.back}>
        Back to progress
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20 },
  badge: { fontSize: 12, fontWeight: "700", color: colors.mint500, marginBottom: 8 },
  q: { fontSize: 18, fontWeight: "800", marginBottom: 16, lineHeight: 26 },
  input: {
    minHeight: 140,
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
    marginBottom: 12,
  },
  primary: {
    backgroundColor: colors.violet500,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: { color: colors.white, fontWeight: "700" },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  score: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  tip: { color: colors.ink500, lineHeight: 22 },
  back: { textAlign: "center", color: colors.violet500, marginTop: 8 },
});
