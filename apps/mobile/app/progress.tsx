import { colors } from "@/constants/theme";
import { loadSessionHistory } from "@/lib/storage";
import { ROLE_LABELS, type SessionRecord } from "@revarta/shared";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProgressScreen() {
  const [history, setHistory] = useState<SessionRecord[]>([]);

  useEffect(() => {
    loadSessionHistory().then(setHistory);
  }, []);

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
});
