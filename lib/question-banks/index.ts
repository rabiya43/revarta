import type { CompanyType, Question, Role, Seniority } from "../types";

type BankEntry = Question & { seniority: Seniority[]; companyTypes?: CompanyType[] };

const swe: BankEntry[] = [
  {
    id: "swe-b1",
    text: "Tell me about a time you had to debug a critical production issue under pressure.",
    category: "behavioral",
    seniority: ["junior", "mid"],
    followUpHints: ["root cause", "communication", "postmortem"],
  },
  {
    id: "swe-b2",
    text: "Describe a technical decision you disagreed with. How did you handle it?",
    category: "behavioral",
    seniority: ["mid", "senior"],
    followUpHints: ["tradeoffs", "data", "outcome"],
  },
  {
    id: "swe-t1",
    text: "Walk me through how you'd design a rate-limited API for a high-traffic service.",
    category: "technical",
    seniority: ["mid", "senior"],
    companyTypes: ["big-tech", "startup"],
    followUpHints: ["scaling", "failure modes", "monitoring"],
  },
  {
    id: "swe-t2",
    text: "Explain a recent project on your resume — what was your specific contribution?",
    category: "technical",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["metrics", "tradeoffs", "lessons learned"],
  },
  {
    id: "swe-s1",
    text: "How do you balance shipping fast with code quality at a startup?",
    category: "situational",
    seniority: ["junior", "mid"],
    companyTypes: ["startup"],
    followUpHints: ["prioritization", "tech debt", "examples"],
  },
];

const product: BankEntry[] = [
  {
    id: "pm-b1",
    text: "Tell me about a product you shipped that failed or underperformed. What did you learn?",
    category: "behavioral",
    seniority: ["mid", "senior"],
    followUpHints: ["metrics", "user research", "iteration"],
  },
  {
    id: "pm-b2",
    text: "Describe how you prioritized a backlog when everything felt urgent.",
    category: "behavioral",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["framework", "stakeholders", "outcome"],
  },
  {
    id: "pm-s1",
    text: "How would you define success for a new feature with no historical data?",
    category: "situational",
    seniority: ["mid", "senior"],
    followUpHints: ["north star", "leading indicators", "experiments"],
  },
  {
    id: "pm-c1",
    text: "Why do you want to work here, and what do you know about our product?",
    category: "culture",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["company research", "user empathy"],
  },
];

const data: BankEntry[] = [
  {
    id: "data-b1",
    text: "Tell me about an analysis that changed a business decision. What was your approach?",
    category: "behavioral",
    seniority: ["mid", "senior"],
    followUpHints: ["methodology", "stakeholders", "impact"],
  },
  {
    id: "data-t1",
    text: "How would you detect and explain a sudden drop in a key metric?",
    category: "technical",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["segmentation", "causality", "communication"],
  },
  {
    id: "data-b2",
    text: "Describe a time you had to push back on a request for misleading analytics.",
    category: "behavioral",
    seniority: ["mid", "senior"],
    followUpHints: ["integrity", "alternatives", "outcome"],
  },
];

const design: BankEntry[] = [
  {
    id: "des-b1",
    text: "Walk me through a design project from research to delivery. What was your role?",
    category: "behavioral",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["constraints", "iteration", "validation"],
  },
  {
    id: "des-s1",
    text: "How do you handle feedback from engineering that your design isn't feasible?",
    category: "situational",
    seniority: ["mid", "senior"],
    followUpHints: ["collaboration", "tradeoffs", "examples"],
  },
  {
    id: "des-c1",
    text: "Critique a popular app — what would you improve and why?",
    category: "culture",
    seniority: ["junior", "mid"],
    followUpHints: ["heuristics", "accessibility", "business goals"],
  },
];

const marketing: BankEntry[] = [
  {
    id: "mkt-b1",
    text: "Tell me about a campaign you ran. How did you measure success?",
    category: "behavioral",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["channels", "ROI", "learnings"],
  },
  {
    id: "mkt-s1",
    text: "You have a limited budget and need pipeline in 30 days. What's your plan?",
    category: "situational",
    seniority: ["mid", "senior"],
    companyTypes: ["startup", "agency"],
    followUpHints: ["ICP", "channels", "metrics"],
  },
];

const finance: BankEntry[] = [
  {
    id: "fin-b1",
    text: "Describe a complex model or analysis you built. What assumptions mattered most?",
    category: "behavioral",
    seniority: ["mid", "senior"],
    followUpHints: ["assumptions", "sensitivity", "presentation"],
  },
  {
    id: "fin-s1",
    text: "How would you explain a variance in quarterly results to a non-finance executive?",
    category: "situational",
    seniority: ["junior", "mid", "senior"],
    followUpHints: ["clarity", "drivers", "recommendations"],
  },
];

const BANKS: Record<Role, BankEntry[]> = {
  swe,
  product,
  data,
  design,
  marketing,
  finance,
};

const COMPANY_MODIFIERS: Record<CompanyType, string> = {
  startup: "Keep in mind they're a fast-moving startup — probe for ownership and scrappiness.",
  "big-tech": "This is big tech — expect structured thinking, scale, and cross-functional impact.",
  government: "Government context — emphasize compliance, process, and public impact.",
  agency: "Agency environment — client management and deadlines matter.",
};

export function getCompanyModifier(companyType: CompanyType): string {
  return COMPANY_MODIFIERS[companyType];
}

export function selectQuestions(
  role: Role,
  seniority: Seniority,
  companyType: CompanyType,
  count = 5
): Question[] {
  const pool = BANKS[role].filter((q) => {
    if (!q.seniority.includes(seniority)) return false;
    if (q.companyTypes && !q.companyTypes.includes(companyType)) return false;
    return true;
  });

  const fallback = BANKS[role].filter((q) => q.seniority.includes(seniority));
  const source = pool.length >= count ? pool : fallback.length ? fallback : BANKS[role];

  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(({ seniority: _, companyTypes: __, ...q }) => q);
}

export async function loadQuestionBank(role: Role): Promise<Question[]> {
  return BANKS[role].map(({ seniority: _, companyTypes: __, ...q }) => q);
}
