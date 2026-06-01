import type { OnboardingProfile } from "./types";
import { COMPANY_TYPES, ROLES, SENIORITIES } from "./types";

export function normalizeProfile(raw: unknown): OnboardingProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;

  if (!ROLES.includes(p.role as OnboardingProfile["role"])) return null;
  if (!SENIORITIES.includes(p.seniority as OnboardingProfile["seniority"])) return null;
  if (!COMPANY_TYPES.includes(p.companyType as OnboardingProfile["companyType"])) return null;

  return {
    role: p.role as OnboardingProfile["role"],
    seniority: p.seniority as OnboardingProfile["seniority"],
    companyType: p.companyType as OnboardingProfile["companyType"],
    inputMode: p.inputMode === "text" ? "text" : "voice",
    useStarScaffold: typeof p.useStarScaffold === "boolean" ? p.useStarScaffold : true,
    tailor: p.tailor as OnboardingProfile["tailor"],
    companyBrief: p.companyBrief as OnboardingProfile["companyBrief"],
  };
}
