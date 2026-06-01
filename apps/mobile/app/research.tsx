import { colors } from "@/constants/theme";
import { fetchCompanyBrief } from "@/lib/api";
import { loadProfile, saveCompanyBrief, saveProfile } from "@/lib/storage";
import type { CompanyBrief } from "@revarta/shared";
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

export default function ResearchScreen() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [brief, setBrief] = useState<CompanyBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile().then((p) => {
      if (!p) router.replace("/setup");
    });
  }, [router]);

  async function generate() {
    const profile = await loadProfile();
    if (!profile || company.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const b = await fetchCompanyBrief(profile, company.trim());
      setBrief(b);
      await saveCompanyBrief(b);
      await saveProfile({ ...profile, companyBrief: b });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>Company research</Text>

      {!brief && (
        <>
          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder="Company name"
            style={styles.input}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable style={styles.primary} onPress={generate} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Generate brief</Text>
            )}
          </Pressable>
        </>
      )}

      {brief && (
        <View style={styles.card}>
          <Text style={styles.company}>{brief.companyName}</Text>
          <Section title="Overview" text={brief.overview} />
          <Section title="Culture" text={brief.culture} />
          <Section title="News" text={brief.recentNews} />
          <Section title="Interviews" text={brief.interviewStyle} />
        </View>
      )}

      <Link href="/session" asChild>
        <Pressable style={styles.primary}>
          <Text style={styles.primaryText}>{brief ? "Start interview" : "Skip"}</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  input: {
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  error: { color: colors.coral500, marginBottom: 8 },
  primary: {
    backgroundColor: colors.violet500,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  primaryText: { color: colors.white, fontWeight: "700" },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  company: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  sectionTitle: { fontWeight: "700", marginBottom: 4 },
  sectionBody: { color: colors.ink500, lineHeight: 20 },
});
