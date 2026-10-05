import { Protocol } from "./protocols";

export interface Finding {
  label: string;
  value: string;
  severity: "normal" | "warning" | "critical" | "info";
}

export interface Measurement {
  name: string;
  value: string;
  reference: string;
  status: "normal" | "abnormal" | "borderline";
}

export interface AnalysisResult {
  protocolId: string;
  protocolName: string;
  timestamp: string;
  imageQuality: "poor" | "fair" | "good" | "excellent";
  imageQualityNote: string;
  confidence: number;
  findings: Finding[];
  measurements: Measurement[];
  summary: string;
  recommendations: string[];
  nextViews: string[];
  labels: StructureLabel[];
  alertLevel: "none" | "low" | "moderate" | "high" | "critical";
  alertMessage?: string;
}

export interface StructureLabel {
  id: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  color: string;
}

// Mock analysis results per protocol
export const MOCK_ANALYSES: Record<string, AnalysisResult> = {
  efast: {
    protocolId: "efast",
    protocolName: "eFAST — RUQ View",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Good depth and gain. Minor acoustic shadowing at inferior pole — not affecting primary assessment.",
    confidence: 87,
    alertLevel: "critical",
    alertMessage: "FREE FLUID DETECTED — Anechoic collection at hepatorenal interface >1cm. Immediate clinical assessment required.",
    findings: [
      { label: "Free Fluid", value: "DETECTED — Morison's Pouch (>1cm stripe)", severity: "critical" },
      { label: "Liver", value: "Visualized — No laceration signs", severity: "normal" },
      { label: "Right Kidney", value: "Visualized — Normal echogenicity", severity: "normal" },
      { label: "Hepatorenal Interface", value: "Anechoic stripe present", severity: "critical" },
    ],
    measurements: [
      { name: "Free fluid depth", value: "1.4 cm", reference: "Normal: none", status: "abnormal" },
    ],
    summary:
      "Free fluid detected at the hepatorenal interface (Morison's Pouch). In a trauma context, this finding carries high specificity for hemoperitoneum. The anechoic stripe measures approximately 1.4cm at its deepest point.",
    recommendations: [
      "Immediate surgical consultation in hemodynamically unstable patient",
      "Complete remaining eFAST views (LUQ, Pelvic, Cardiac, Lung)",
      "Correlate with mechanism of injury and hemodynamic status",
      "Do not delay operative intervention for CT if patient is unstable",
    ],
    nextViews: ["LUQ (Splenorenal)", "Pelvis", "Subxiphoid Cardiac", "Bilateral Lung"],
    labels: [
      { id: "liver", name: "Liver", x: 35, y: 30, color: "#fbbf24" },
      { id: "kidney", name: "R. Kidney", x: 65, y: 55, color: "#34d399" },
      { id: "fluid", name: "Free Fluid ⚠️", x: 50, y: 45, color: "#ef4444" },
    ],
  },

  "cardiac-plax": {
    protocolId: "cardiac-plax",
    protocolName: "Cardiac: PLAX View",
    timestamp: new Date().toISOString(),
    imageQuality: "excellent",
    imageQualityNote: "Excellent parasternal window. All structures clearly identified.",
    confidence: 92,
    alertLevel: "moderate",
    alertMessage: "EPSS elevated at 1.2cm — suggests reduced LV systolic function. Recommend A4C view for further assessment.",
    findings: [
      { label: "LV Systolic Function", value: "Likely reduced — EPSS 1.2cm (EF estimate ~40–50%)", severity: "warning" },
      { label: "Pericardial Space", value: "No effusion detected", severity: "normal" },
      { label: "Mitral Valve", value: "No gross pathology on 2D", severity: "normal" },
      { label: "Aortic Root", value: "Normal caliber (~3.1cm)", severity: "normal" },
      { label: "Left Atrium", value: "Mildly enlarged — ~4.2cm", severity: "warning" },
    ],
    measurements: [
      { name: "EPSS", value: "1.2 cm", reference: "Normal: <0.8cm", status: "abnormal" },
      { name: "Aortic Root", value: "3.1 cm", reference: "Normal: 2.0–3.7cm", status: "normal" },
      { name: "LA Diameter", value: "4.2 cm", reference: "Normal: ≤4.0cm", status: "borderline" },
      { name: "EF Estimate", value: "~40–50%", reference: "Normal: ≥55%", status: "borderline" },
    ],
    summary:
      "PLAX view demonstrates elevated EPSS of 1.2cm, suggesting reduced LV systolic function (estimated EF 40–50%). Mildly enlarged left atrium noted. No pericardial effusion. Aortic root normal in size.",
    recommendations: [
      "Obtain Apical 4-Chamber view for biplane EF estimate",
      "Assess for regional wall motion abnormality on PSAX",
      "Consider BNP and troponin if new cardiac dysfunction",
      "Echocardiography with formal report recommended",
    ],
    nextViews: ["PSAX — Papillary level", "Apical 4-Chamber", "IVC (volume status)"],
    labels: [
      { id: "lv", name: "LV", x: 45, y: 55, color: "#ef4444" },
      { id: "la", name: "LA", x: 70, y: 40, color: "#f97316" },
      { id: "ao", name: "Aorta", x: 75, y: 25, color: "#fbbf24" },
      { id: "mv", name: "MV", x: 58, y: 48, color: "#a78bfa" },
    ],
  },

  ivc: {
    protocolId: "ivc",
    protocolName: "IVC Collapsibility",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Clear IVC visualization. Measure at 2cm from IVC-RA junction.",
    confidence: 83,
    alertLevel: "low",
    alertMessage: "Low IVC collapsibility suggests volume overload or elevated CVP. Interpret in clinical context.",
    findings: [
      { label: "IVC Max Diameter", value: "2.4 cm (Plethoric)", severity: "warning" },
      { label: "IVC Min Diameter", value: "2.1 cm", severity: "warning" },
      { label: "Collapsibility Index", value: "12.5% (Low)", severity: "warning" },
      { label: "Volume Responsiveness", value: "Unlikely — low CI in spontaneous breathing", severity: "warning" },
    ],
    measurements: [
      { name: "IVC Max Diameter", value: "2.4 cm", reference: "Normal: <2.1cm", status: "abnormal" },
      { name: "IVC Min Diameter", value: "2.1 cm", reference: "", status: "abnormal" },
      { name: "Collapsibility Index", value: "12.5%", reference: "Volume responsive: >50%", status: "abnormal" },
    ],
    summary:
      "Plethoric IVC (2.4cm) with minimal respiratory variation (CI 12.5%). In spontaneously breathing patients, this pattern suggests elevated CVP and is not consistent with volume responsiveness. Consider volume overload or cardiac tamponade.",
    recommendations: [
      "Correlate with clinical exam (JVD, peripheral edema)",
      "Assess for pericardial effusion (subxiphoid view)",
      "Consider cardiac function assessment (PLAX/A4C)",
      "Avoid aggressive fluid resuscitation if circulatory overload suspected",
    ],
    nextViews: ["Subxiphoid Cardiac (effusion)", "PLAX (cardiac function)"],
    labels: [
      { id: "ivc", name: "IVC", x: 50, y: 45, color: "#60a5fa" },
      { id: "ra", name: "RA", x: 65, y: 35, color: "#f87171" },
      { id: "liver", name: "Liver", x: 30, y: 40, color: "#fbbf24" },
    ],
  },

  "ob-first-trimester": {
    protocolId: "ob-first-trimester",
    protocolName: "OB: First Trimester Dating",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Good uterine window. Embryo clearly visualized. Ensure CRL in neutral position (not hyperextended).",
    confidence: 91,
    alertLevel: "none",
    findings: [
      { label: "Intrauterine Pregnancy", value: "CONFIRMED", severity: "normal" },
      { label: "Gestational Sac", value: "Regular margins — normal appearance", severity: "normal" },
      { label: "Yolk Sac", value: "Visible — normal appearance", severity: "normal" },
      { label: "Embryo", value: "Identified — cardiac motion detected", severity: "normal" },
      { label: "Subchorionic Hematoma", value: "None detected", severity: "normal" },
    ],
    measurements: [
      { name: "CRL", value: "22.1 mm", reference: "Normal for GA", status: "normal" },
      { name: "Gestational Age (CRL)", value: "9w 0d (±5 days)", reference: "", status: "normal" },
      { name: "GS Mean Diameter", value: "28.4 mm", reference: "Expected for GA", status: "normal" },
    ],
    summary:
      "Confirmed intrauterine pregnancy. CRL of 22.1mm corresponds to a gestational age of 9 weeks 0 days (Hadlock 1992). Cardiac motion detected. Regular gestational sac with visible yolk sac. No subchorionic hematoma or adnexal pathology detected in this view.",
    recommendations: [
      "Confirm fetal heart rate with real-time M-mode (normal 6–10 weeks: 100–170 bpm)",
      "Assess bilateral adnexa for ectopic exclusion",
      "Follow-up anatomy scan at 18–20 weeks",
      "Refer if CRL-LMP discordance >2 weeks",
    ],
    nextViews: ["Adnexa bilateral (ectopic exclusion)", "Cervical length", "Doppler if concern"],
    labels: [
      { id: "gs", name: "Gestational Sac", x: 48, y: 45, color: "#a78bfa" },
      { id: "embryo", name: "Embryo (CRL)", x: 50, y: 50, color: "#34d399" },
      { id: "ys", name: "Yolk Sac", x: 42, y: 52, color: "#fbbf24" },
      { id: "uterus", name: "Uterus", x: 30, y: 60, color: "#94a3b8" },
    ],
  },

  "lung-blue": {
    protocolId: "lung-blue",
    protocolName: "Lung: BLUE Protocol",
    timestamp: new Date().toISOString(),
    imageQuality: "fair",
    imageQualityNote: "Gain slightly elevated — reduce by 2–3 dB for cleaner A-line pattern. Body habitus limiting posterior access.",
    confidence: 78,
    alertLevel: "high",
    alertMessage: "Multiple B-lines detected (5+ in R anterolateral zone) — consistent with interstitial syndrome. Consider CHF or pneumonia.",
    findings: [
      { label: "R Upper BLUE Point", value: "5+ confluent B-lines — interstitial pattern", severity: "critical" },
      { label: "R Lower BLUE Point", value: "3 B-lines — mild", severity: "warning" },
      { label: "L Upper BLUE Point", value: "A-lines — normal aeration", severity: "normal" },
      { label: "L Lower BLUE Point", value: "A-lines — normal aeration", severity: "normal" },
      { label: "Lung Sliding", value: "Present bilaterally — no PTX signs", severity: "normal" },
      { label: "Pleural Effusion", value: "Small right-sided effusion suspected", severity: "warning" },
    ],
    measurements: [
      { name: "B-line count (R upper)", value: "5+", reference: "Normal: <3/zone", status: "abnormal" },
      { name: "B-line count (R lower)", value: "3", reference: "Normal: <3/zone", status: "borderline" },
      { name: "Pleural effusion depth (R)", value: "~1.5 cm", reference: "Normal: none", status: "abnormal" },
    ],
    summary:
      "BLUE Protocol demonstrates right-sided predominance of B-lines (5+ in upper zone, 3 in lower zone) with small right pleural effusion. Left lung appears normally aerated with A-line pattern. Lung sliding present bilaterally. Pattern is consistent with right-sided interstitial syndrome — differential includes pneumonia (unilateral predominance), early CHF, or interstitial lung disease.",
    recommendations: [
      "Correlate with clinical presentation (fever, cough, dyspnea chronology)",
      "Chest X-ray for further characterization",
      "Consider BNP/pro-BNP if CHF suspected",
      "Assess cardiac function (PLAX/IVC) if bilateral B-lines develop",
      "Re-assess PLAPS point (posterior-lateral) for consolidation",
    ],
    nextViews: ["PLAPS point (bilateral)", "Pleural effusion quantification", "Cardiac PLAX (if CHF suspected)"],
    labels: [
      { id: "blines", name: "B-lines ⚠️", x: 45, y: 40, color: "#ef4444" },
      { id: "pleura", name: "Pleural Line", x: 50, y: 30, color: "#60a5fa" },
      { id: "effusion", name: "Effusion", x: 70, y: 65, color: "#f97316" },
    ],
  },

  aaa: {
    protocolId: "aaa",
    protocolName: "Aorta: AAA Screening",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Adequate window. Some bowel gas shadowing at mid-aorta level. Reposition and apply gentle pressure for better visualization.",
    confidence: 85,
    alertLevel: "none",
    findings: [
      { label: "Aortic Diameter (Proximal)", value: "2.1 cm — Normal", severity: "normal" },
      { label: "Aortic Diameter (Mid)", value: "2.0 cm — Normal", severity: "normal" },
      { label: "Intraluminal Thrombus", value: "None detected", severity: "normal" },
      { label: "Periaortic Fluid", value: "None detected", severity: "normal" },
    ],
    measurements: [
      { name: "Max AP diameter", value: "2.1 cm", reference: "Normal: <3.0cm", status: "normal" },
      { name: "Transverse diameter", value: "2.0 cm", reference: "Normal: <3.0cm", status: "normal" },
    ],
    summary:
      "Aorta visualized from proximal to mid segment. Maximum diameter 2.1cm — within normal limits (aneurysm threshold: 3.0cm). No intraluminal thrombus or periaortic fluid detected. Distal aorta/bifurcation partially limited by bowel gas.",
    recommendations: [
      "Complete distal aorta to bifurcation — reposition patient or apply more pressure",
      "If AAA excluded to bifurcation, standard screening interval: men >65: 10-year rescreening",
      "If symptoms persist despite negative scan, consider CT aortography",
    ],
    nextViews: ["Distal aorta to bifurcation", "Iliac vessels"],
    labels: [
      { id: "aorta", name: "Aorta", x: 50, y: 48, color: "#ef4444" },
      { id: "ivc", name: "IVC", x: 62, y: 48, color: "#60a5fa" },
      { id: "spine", name: "Spine", x: 50, y: 75, color: "#94a3b8" },
    ],
  },
};

export function getMockAnalysis(protocolId: string): AnalysisResult {
  const analysis = MOCK_ANALYSES[protocolId];
  if (analysis) {
    return { ...analysis, timestamp: new Date().toISOString() };
  }
  // Generic fallback
  return {
    protocolId,
    protocolName: "Protocol Analysis",
    timestamp: new Date().toISOString(),
    imageQuality: "fair",
    imageQualityNote: "Analysis complete. Review annotated structures for accuracy.",
    confidence: 74,
    alertLevel: "none",
    findings: [
      { label: "Structures Identified", value: "Primary structures detected and labeled", severity: "normal" },
      { label: "No Acute Pathology", value: "No obvious abnormality detected in this view", severity: "normal" },
    ],
    measurements: [],
    summary:
      "AI analysis complete. Primary anatomical structures have been identified and labeled. No acute pathology detected in this view. Please review the annotated image and correlate with clinical findings.",
    recommendations: [
      "Review labeled structures for accuracy",
      "Capture additional views per protocol checklist",
      "Correlate with clinical presentation",
    ],
    nextViews: ["Additional views per selected protocol"],
    labels: [
      { id: "s1", name: "Structure 1", x: 40, y: 40, color: "#fbbf24" },
      { id: "s2", name: "Structure 2", x: 60, y: 55, color: "#34d399" },
    ],
    alertMessage: undefined,
  };
}

export function getSavedScans(): Array<{ id: string; protocol: string; date: string; finding: string; alertLevel: string }> {
  return [
    { id: "scan-001", protocol: "eFAST", date: "2026-03-18 14:32", finding: "Free fluid — RUQ (Morison's Pouch)", alertLevel: "critical" },
    { id: "scan-002", protocol: "PLAX", date: "2026-03-18 11:15", finding: "EPSS 1.2cm — Reduced EF suspected", alertLevel: "moderate" },
    { id: "scan-003", protocol: "OB 1st Tri", date: "2026-03-17 09:44", finding: "IUP confirmed — CRL 22.1mm → 9w0d", alertLevel: "none" },
    { id: "scan-004", protocol: "BLUE Protocol", date: "2026-03-17 08:20", finding: "B-lines R>L — Interstitial syndrome", alertLevel: "high" },
    { id: "scan-005", protocol: "IVC", date: "2026-03-16 16:05", finding: "IVC 2.4cm, CI 12.5% — Volume overload", alertLevel: "low" },
    { id: "scan-006", protocol: "AAA", date: "2026-03-16 13:30", finding: "Aorta 2.1cm — Normal limits", alertLevel: "none" },
  ];
}
