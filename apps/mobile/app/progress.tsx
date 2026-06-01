import { colors } from "@/constants/theme";
import { joinWaitlist } from "@/lib/api";
import { loadSessionHistory } from "@/lib/storage";
import { ROLE_LABELS, type SessionRecord } from "@revarta/shared";
import { Link } from "expo-router";
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

export default function ProgressScreen() {
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [email, setEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistBusy, setWaitlistBusy] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  useEffect(() => {
    loadSessionHistory().then(setHistory);
  }, []);

  async function saveWaitlist() {
    if (!email.includes("@")) return;
    setWaitlistBusy(true);
    setWaitlistError(null);
    try {
      await joinWaitlist(email, "mobile-progress");
      setWaitlistDone(true);
    } catch (e) {
      setWaitlistError(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setWaitlistBusy(false);
    }
  }

  const avg =
    history.length > 0
      ? Math.round((history.reduce((s, r) => s + r.avgOverall, 0) / history.length) * 10) / 10
      : 0;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>Progress</Text>
      <View style={styles.row}>
        <Stat label="Sessions" value={String(history.length)} />
        <Stat label="Avg" value={history.length ? String(avg) : "-"} />
      </View>

      {history.length === 0 ? (
        <Text style={styles.empty}>Finish a session to see scores here.</Text>
      ) : (
        history.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.role}>{ROLE_LABELS[r.role]}</Text>
            <Text style={styles.score}>{r.avgOverall}/10</Text>
          </View>
        ))
      )}

      <Link href="/drills" asChild>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryText}>Practice drills</Text>
        </Pressable>
      </Link>

      <View style={styles.waitlist}>
        <Text style={styles.waitlistTitle}>Cloud sync (soon)</Text>
        {waitlistDone ? (
          <Text style={styles.waitlistOk}>We will email you when accounts are ready.</Text>
        ) : (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            {waitlistError ? <Text style={styles.waitlistErr}>{waitlistError}</Text> : null}
            <Pressable
              style={[styles.primary, waitlistBusy && styles.disabled]}
              onPress={saveWaitlist}
              disabled={!email.includes("@") || waitlistBusy}
            >
              {waitlistBusy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryText}>Notify me</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  stat: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  statVal: { fontSize: 22, fontWeight: "800", color: colors.violet500 },
  statLabel: { fontSize: 12, color: colors.ink500 },
  empty: { color: colors.ink500, marginBottom: 16 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  role: { fontWeight: "700" },
  score: { fontWeight: "800", color: colors.violet500 },
  secondary: { marginTop: 20, padding: 14, alignItems: "center" },
  secondaryText: { color: colors.violet500, fontWeight: "600" },
  waitlist: {
    marginTop: 28,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  waitlistTitle: { fontWeight: "700", marginBottom: 10, color: colors.ink900 },
  waitlistOk: { fontSize: 14, color: colors.ink500 },
  waitlistErr: { fontSize: 13, color: "#e85d4c", marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  primary: {
    backgroundColor: colors.violet500,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: colors.white, fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
