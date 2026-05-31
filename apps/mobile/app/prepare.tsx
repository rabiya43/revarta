import { colors } from "@/constants/theme";
import { tailorQuestions } from "@/lib/api";
import { loadProfile, saveProfile, saveTailorQuestions } from "@/lib/storage";
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

export default function PrepareScreen() {
  const router = useRouter();
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile().then((p) => {
      if (!p) router.replace("/setup");
    });
  }, [router]);

  async function onBuild() {
    const profile = await loadProfile();
    if (!profile) return;
    if (resume.trim().length < 80 || jd.trim().length < 80) {
      setError("Need more text in both fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const questions = await tailorQuestions(profile, resume.trim(), jd.trim());
      await saveTailorQuestions(questions);
      await saveProfile({
        ...profile,
        tailor: {
          resumeText: resume.trim(),
          jobDescriptionText: jd.trim(),
          generatedAt: Date.now(),
        },
      });
      router.push("/session");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>Resume + job post</Text>
      <Text style={styles.sub}>Optional. Builds custom questions. Not kept on server after use.</Text>

      <Text style={styles.label}>Resume</Text>
      <TextInput
        multiline
        value={resume}
        onChangeText={setResume}
        style={styles.input}
        placeholder="Paste resume..."
        textAlignVertical="top"
      />

      <Text style={styles.label}>Job description</Text>
      <TextInput
        multiline
        value={jd}
        onChangeText={setJd}
        style={styles.input}
        placeholder="Paste job post..."
        textAlignVertical="top"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.primary} onPress={onBuild} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Build questions</Text>
        )}
      </Pressable>

      <Link href="/session" asChild>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryText}>Skip</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "800", color: colors.ink900 },
  sub: { color: colors.ink500, marginBottom: 16, marginTop: 4 },
  label: { fontWeight: "700", marginTop: 8, marginBottom: 6 },
  input: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
    fontSize: 14,
  },
  error: { color: colors.coral500, marginTop: 8 },
  primary: {
    marginTop: 20,
    backgroundColor: colors.violet500,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: { color: colors.white, fontWeight: "700" },
  secondary: { marginTop: 12, padding: 14, alignItems: "center" },
  secondaryText: { color: colors.violet500, fontWeight: "600" },
});
