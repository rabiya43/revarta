import { colors } from "@/constants/theme";
import { fetchFeedback, fetchQuestions, streamInterviewText } from "@/lib/api";
import { appendSessionRecord, loadProfile, loadTailorQuestions } from "@/lib/storage";
import type { CoachingFeedback, Question, SessionRecord, TurnMessage } from "@revarta/shared";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SessionScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [interviewerText, setInterviewerText] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<CoachingFeedback | null>(null);
  const [phase, setPhase] = useState<"load" | "ask" | "feedback">("load");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TurnMessage[]>([]);
  const [feedbackLog, setFeedbackLog] = useState<CoachingFeedback[]>([]);
  const started = useRef<number>(Date.now());

  useEffect(() => {
    (async () => {
      const profile = await loadProfile();
      if (!profile) {
        router.replace("/setup");
        return;
      }
      const tailored = await loadTailorQuestions();
      const qs = tailored?.length ? tailored : await fetchQuestions(profile);
      setQuestions(qs);
      setPhase("ask");
      setLoading(true);
      try {
        const text = await streamInterviewText({
          profile,
          question: qs[0],
          history: [],
          isOpening: true,
        });
        setInterviewerText(text);
        setHistory([{ role: "interviewer", content: text, timestamp: Date.now() }]);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function submit() {
    const profile = await loadProfile();
    if (!profile || !questions[qIndex] || !answer.trim()) return;

    const duration = Math.round((Date.now() - started.current) / 1000);
    setLoading(true);
    try {
      const fb = await fetchFeedback(
        profile,
        questions[qIndex].text,
        answer.trim(),
        duration
      );
      setFeedback(fb);
      setFeedbackLog((log) => [...log, fb]);
      setPhase("feedback");
    } finally {
      setLoading(false);
    }
  }

  async function nextQuestion() {
    const profile = await loadProfile();
    if (!profile) return;

    const next = qIndex + 1;
    if (next >= questions.length) {
      const log =
        feedback && feedbackLog[feedbackLog.length - 1] !== feedback
          ? [...feedbackLog, feedback]
          : feedbackLog;

      if (profile && log.length > 0) {
        const avg = (key: keyof CoachingFeedback["scores"]) =>
          Math.round((log.reduce((s, f) => s + f.scores[key], 0) / log.length) * 10) / 10;
        const record: SessionRecord = {
          id: String(Date.now()),
          completedAt: Date.now(),
          role: profile.role,
          seniority: profile.seniority,
          companyType: profile.companyType,
          questionsAnswered: log.length,
          avgOverall: avg("overall"),
          avgStructure: avg("structure"),
          avgSpecificity: avg("specificity"),
          avgImpact: avg("impactClarity"),
        };
        await appendSessionRecord(record);
      }
      router.replace("/progress");
      return;
    }

    setQIndex(next);
    setAnswer("");
    setFeedback(null);
    setPhase("ask");
    started.current = Date.now();
    setLoading(true);

    try {
      const text = await streamInterviewText({
        profile,
        question: questions[next],
        history,
        isOpening: true,
      });
      setInterviewerText(text);
      setHistory((h) => [...h, { role: "interviewer", content: text, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  if (phase === "load") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.violet500} />
      </View>
    );
  }

  const q = questions[qIndex];

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.meta}>
        Question {qIndex + 1} of {questions.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.who}>Alex</Text>
        {loading && !interviewerText ? (
          <ActivityIndicator color={colors.violet500} />
        ) : (
          <Text style={styles.body}>{interviewerText}</Text>
        )}
      </View>

      {phase === "ask" && (
        <>
          <Text style={styles.label}>Your answer</Text>
          <TextInput
            multiline
            value={answer}
            onChangeText={setAnswer}
            style={styles.input}
            placeholder="Type here..."
            textAlignVertical="top"
          />
          <Pressable style={styles.primary} onPress={submit} disabled={loading || !answer.trim()}>
            <Text style={styles.primaryText}>Submit</Text>
          </Pressable>
        </>
      )}

      {phase === "feedback" && feedback && (
        <>
          <View style={styles.card}>
            <Text style={styles.score}>Overall {feedback.scores.overall}/10</Text>
            <Text style={styles.body}>{feedback.coachingTip}</Text>
          </View>
          <Pressable style={styles.primary} onPress={nextQuestion}>
            <Text style={styles.primaryText}>
              {qIndex + 1 >= questions.length ? "Done" : "Next question"}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  wrap: { padding: 20, paddingBottom: 40 },
  meta: { color: colors.ink500, marginBottom: 12, fontWeight: "600" },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  who: { fontWeight: "700", color: colors.violet500, marginBottom: 8 },
  body: { color: colors.ink900, lineHeight: 22 },
  label: { fontWeight: "700", marginBottom: 8 },
  input: {
    minHeight: 140,
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  primary: {
    backgroundColor: colors.violet500,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: { color: colors.white, fontWeight: "700" },
  score: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
});
