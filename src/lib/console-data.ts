export type Severity = "low" | "mid" | "high";

export type Prediction = {
  label: string;
  confidence: number;
  severity: Severity;
};

export type Analysis = {
  caseId: string;
  finding: string;
  summary: string;
  severity: Severity;
  site: string;
  peakHz: number;
  duration: string;
  sampleRate: string;
  predictions: Prediction[];
  recommendation: string;
};

export type Patient = {
  name: string;
  initials: string;
  mrn: string;
  age: number;
  sex: string;
  phone: string;
  lastVisit: string;
};

export const patient: Patient = {
  name: "Marcus Bell",
  initials: "MB",
  mrn: "4471-02",
  age: 58,
  sex: "M",
  phone: "+1 (415) 208-7743",
  lastVisit: "05 Mar 2025",
};

export const analysis: Analysis = {
  caseId: "RC-2049",
  finding: "Bilateral wheeze, expiratory",
  summary:
    "Continuous expiratory wheeze with prolonged expiration. Consistent with obstructive airway disease.",
  severity: "mid",
  site: "Left mid zone",
  peakHz: 612,
  duration: "4.2s",
  sampleRate: "96 kHz",
  recommendation:
    "Recommend spirometry review and reassessment of controller therapy.",
  predictions: [
    { label: "Wheeze", confidence: 82, severity: "mid" },
    { label: "Asthma exacerbation", confidence: 64, severity: "mid" },
    { label: "COPD", confidence: 31, severity: "low" },
    { label: "Normal", confidence: 8, severity: "low" },
  ],
};

export const pastRecordings = [
  { label: "Crackle · right base", when: "12 Mar · 9:41 AM", confidence: 78, severity: "low" as Severity },
  { label: "Wheeze · bilateral", when: "05 Mar · 2:17 PM", confidence: 71, severity: "mid" as Severity },
  { label: "Normal · clear fields", when: "22 Feb · 11:03 AM", confidence: 94, severity: "low" as Severity },
  { label: "Stridor · upper airway", when: "14 Feb · 4:52 PM", confidence: 66, severity: "high" as Severity },
];

export const severityBar: Record<Severity, string> = {
  low: "bg-sev-low",
  mid: "bg-sev-mid",
  high: "bg-sev-high",
};

export const severityDot: Record<Severity, string> = {
  low: "bg-sev-low",
  mid: "bg-sev-mid",
  high: "bg-sev-high",
};

export const severityText: Record<Severity, string> = {
  low: "text-sev-low",
  mid: "text-sev-mid",
  high: "text-sev-high",
};

export const severityLabel: Record<Severity, string> = {
  low: "Mild",
  mid: "Moderate",
  high: "Severe",
};
