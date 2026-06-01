import { colors } from "@/constants/theme";
import { extractDocumentText, tailorQuestions } from "@/lib/api";
import { loadProfile, saveProfile, saveTailorQuestions } from "@/lib/storage";
import { Link, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
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

const MIN_CHARS = 40;

type Field = "resume" | "jd";

export default function PrepareScreen() {
  const router = useRouter();
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<Field | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile().then((p) => {
      if (!p) router.replace("/setup");
      else {
        if (p.tailor?.resumeText) setResume(p.tailor.resumeText);
        if (p.tailor?.jobDescriptionText) setJd(p.tailor.jobDescriptionText);
      }
    });
  }, [router]);

  async function pickFile(field: Field) {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(field);
    setError(null);
    try {
      const text = await extractDocumentText(
        asset.uri,
        asset.name,
        asset.mimeType ?? undefined
      );
      if (field === "resume") setResume(text);
      else setJd(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function onBuild() {
    const profile = await loadProfile();
    if (!profile) return;
    const resumeText = resume.trim();
    const jobDescriptionText = jd.trim();
    if (resumeText.length < MIN_CHARS || jobDescriptionText.length < MIN_CHARS) {
      setError(`Need ${MIN_CHARS}+ characters in both resume and job description.`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const questions = await tailorQuestions(profile, resumeText, jobDescriptionText);
      await saveTailorQuestions(questions);
      await saveProfile({
        ...profile,
        tailor: {
          resumeText,
          jobDescriptionText,
          generatedAt: Date.now(),
        },
      });
      router.push("/research");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>Resume + job post</Text>
      <Text style={styles.sub}>
        Paste or upload PDF, Word, or text. We tailor questions from both.
      </Text>

      <Text style={styles.label}>Resume</Text>
      <View style={styles.uploadRow}>
        <Pressable
          style={styles.uploadBtn}
          onPress={() => pickFile("resume")}
          disabled={uploading !== null}
        >
          <Text style={styles.uploadBtnText}>
            {uploading === "resume" ? "Reading…" : "Upload resume"}
          </Text>
        </Pressable>
      </View>
      <TextInput
        multiline
        value={resume}
        onChangeText={setResume}
        style={styles.input}
        placeholder="Or paste resume text…"
        textAlignVertical="top"
      />

      <Text style={styles.label}>Job description</Text>
      <View style={styles.uploadRow}>
        <Pressable
          style={styles.uploadBtn}
          onPress={() => pickFile("jd")}
          disabled={uploading !== null}
        >
          <Text style={styles.uploadBtnText}>
            {uploading === "jd" ? "Reading…" : "Upload job post"}
          </Text>
        </Pressable>
      </View>
      <TextInput
        multiline
        value={jd}
        onChangeText={setJd}
        style={styles.input}
        placeholder="Or paste job description…"
        textAlignVertical="top"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.primary} onPress={onBuild} disabled={loading || uploading !== null}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Tailor questions</Text>
        )}
      </Pressable>

      <Link href="/research" asChild>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryText}>Skip tailoring</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: "800", color: colors.ink900 },
  sub: { color: colors.ink500, marginBottom: 16, marginTop: 4, lineHeight: 20 },
  label: { fontWeight: "700", marginTop: 8, marginBottom: 6 },
  uploadRow: { marginBottom: 8 },
  uploadBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.violet500,
  },
  uploadBtnText: { color: colors.violet500, fontWeight: "600", fontSize: 14 },
  input: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
    fontSize: 14,
  },
  error: { color: colors.coral500, marginTop: 12 },
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
