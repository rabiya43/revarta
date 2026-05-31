import { colors } from "@/constants/theme";
import { saveProfile } from "@/lib/storage";
import {
  COMPANY_LABELS,
  COMPANY_TYPES,
  ROLE_LABELS,
  ROLES,
  SENIORITIES,
  SENIORITY_LABELS,
  type CompanyType,
  type OnboardingProfile,
  type Role,
  type Seniority,
} from "@revarta/shared";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function SetupScreen() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [seniority, setSeniority] = useState<Seniority | null>(null);
  const [companyType, setCompanyType] = useState<CompanyType | null>(null);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");

  async function continueFlow() {
    if (!role || !seniority || !companyType) return;
    const profile: OnboardingProfile = {
      role,
      seniority,
      companyType,
      inputMode,
      useStarScaffold: true,
    };
    await saveProfile(profile);
    router.push("/prepare");
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.heading}>Your setup</Text>

      <Text style={styles.label}>Role</Text>
      <View style={styles.row}>
        {ROLES.map((r) => (
          <Chip
            key={r}
            label={ROLE_LABELS[r]}
            selected={role === r}
            onPress={() => setRole(r)}
          />
        ))}
      </View>

      <Text style={styles.label}>Level</Text>
      <View style={styles.row}>
        {SENIORITIES.map((s) => (
          <Chip
            key={s}
            label={SENIORITY_LABELS[s]}
            selected={seniority === s}
            onPress={() => setSeniority(s)}
          />
        ))}
      </View>

      <Text style={styles.label}>Company</Text>
      <View style={styles.row}>
        {COMPANY_TYPES.map((c) => (
          <Chip
            key={c}
            label={COMPANY_LABELS[c]}
            selected={companyType === c}
            onPress={() => setCompanyType(c)}
          />
        ))}
      </View>

      <Text style={styles.label}>Input</Text>
      <View style={styles.row}>
        <Chip label="Voice" selected={inputMode === "voice"} onPress={() => setInputMode("voice")} />
        <Chip label="Text" selected={inputMode === "text"} onPress={() => setInputMode("text")} />
      </View>

      <Pressable
        style={[styles.primary, (!role || !seniority || !companyType) && styles.disabled]}
        onPress={continueFlow}
        disabled={!role || !seniority || !companyType}
      >
        <Text style={styles.primaryText}>Continue</Text>
      </Pressable>

      <Link href="/" style={styles.back}>
        Back
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: "800", color: colors.ink900, marginBottom: 20 },
  label: { fontWeight: "700", color: colors.ink900, marginTop: 12, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 2,
    borderColor: colors.ink100,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  chipSelected: { borderColor: colors.violet500, backgroundColor: colors.violet50 },
  chipText: { fontSize: 13, color: colors.ink500 },
  chipTextSelected: { color: colors.violet500, fontWeight: "700" },
  primary: {
    marginTop: 28,
    backgroundColor: colors.violet500,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  disabled: { opacity: 0.5 },
  primaryText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  back: { marginTop: 16, textAlign: "center", color: colors.ink500 },
});
