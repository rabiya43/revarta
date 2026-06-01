import { colors } from "@/constants/theme";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.logo}>Revarta</Text>
      <Text style={styles.title}>Mock interviews on your phone</Text>
      <Text style={styles.sub}>
        Same practice loop as the website: role setup, tailored questions, voice or text, scored
        feedback.
      </Text>
      <Link href="/setup" asChild>
        <Pressable style={styles.primary}>
          <Text style={styles.primaryText}>Start</Text>
        </Pressable>
      </Link>
      <Link href="/progress" asChild>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryText}>Progress</Text>
        </Pressable>
      </Link>
      <Text style={styles.hint}>Point EXPO_PUBLIC_API_URL at your deployed web API.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: "center" },
  logo: { fontSize: 28, fontWeight: "800", color: colors.violet500, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: colors.ink900, marginBottom: 12 },
  sub: { fontSize: 15, color: colors.ink500, lineHeight: 22, marginBottom: 28 },
  primary: {
    backgroundColor: colors.violet500,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  secondary: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.violet500,
    alignItems: "center",
  },
  secondaryText: { color: colors.violet500, fontWeight: "700" },
  hint: { marginTop: 20, fontSize: 12, color: colors.ink500, textAlign: "center" },
});
