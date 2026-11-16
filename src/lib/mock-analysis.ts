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

// Sample walkthroughs shown before a real result loads and for demos.
// Written as study material: what's on the screen and why it matters for
// learning — never instructions about patient care.
export const MOCK_ANALYSES: Record<string, AnalysisResult> = {
  efast: {
    protocolId: "efast",
    protocolName: "eFAST — RUQ View",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Good depth and gain for studying the hepatorenal space. Some shadowing near the inferior pole.",
    confidence: 87,
    alertLevel: "low",
    alertMessage: "Study point: a thin anechoic stripe runs along the hepatorenal space (Morison's pouch).",
    findings: [
      { label: "Liver", value: "Homogeneous parenchyma; hepatic vessels appear as anechoic circles", severity: "normal" },
      { label: "Right Kidney", value: "Cortex, darker medullary pyramids and bright renal sinus visible", severity: "normal" },
      { label: "Morison's Pouch", value: "Thin anechoic stripe between liver and kidney — the classic eFAST finding to learn", severity: "warning" },
      { label: "Diaphragm", value: "Bright curved line deep to the liver", severity: "info" },
    ],
    measurements: [
      { name: "Anechoic stripe width", value: "0.4 cm", reference: "Learning point: any stripe here is notable", status: "borderline" },
      { name: "Kidney length", value: "10.6 cm", reference: "Adult reference 10–12 cm", status: "normal" },
    ],
    summary:
      "This RUQ view shows the liver, the right kidney and the hepatorenal space (Morison's pouch), the most dependent part of the upper abdomen when lying flat. The thin dark stripe along the kidney's upper border is the appearance free fluid has on ultrasound: learning to spot it is a core eFAST skill.",
    recommendations: [
      "Compare this with the LUQ (splenorenal) view next",
      "Sweep through the whole hepatorenal space rather than relying on one frame",
      "Look at the inferior tip of the liver, where small collections are easy to miss",
    ],
    nextViews: ["LUQ (Splenorenal)", "Pelvis", "Subxiphoid Cardiac", "Bilateral Lung"],
    labels: [
      { id: "liver", name: "Liver", x: 35, y: 30, color: "#fbbf24" },
      { id: "kidney", name: "R. Kidney", x: 65, y: 55, color: "#34d399" },
      { id: "pouch", name: "Morison's Pouch", x: 50, y: 45, color: "#f472b6" },
    ],
  },

  "cardiac-plax": {
    protocolId: "cardiac-plax",
    protocolName: "Cardiac: PLAX View",
    timestamp: new Date().toISOString(),
    imageQuality: "excellent",
    imageQualityNote: "Excellent parasternal window — all four key structures are in view.",
    confidence: 92,
    alertLevel: "low",
    alertMessage: "Study point: practice measuring EPSS — the gap between the mitral leaflet and the septum.",
    findings: [
      { label: "Left Ventricle", value: "Septum and posterior wall visible in their long axis", severity: "normal" },
      { label: "Mitral Valve", value: "Anterior leaflet swings toward the septum in diastole", severity: "info" },
      { label: "Aortic Root", value: "Seen in long axis above the LV outflow tract", severity: "normal" },
      { label: "Left Atrium", value: "Posterior to the aortic root — compare its size to the root", severity: "info" },
      { label: "Pericardium", value: "Bright line behind the posterior wall; no dark space between layers in this view", severity: "normal" },
    ],
    measurements: [
      { name: "EPSS", value: "0.6 cm", reference: "Typical: < 0.7–1.0 cm", status: "normal" },
      { name: "Aortic Root", value: "3.1 cm", reference: "Typical adult: 2.0–3.7 cm", status: "normal" },
      { name: "LA Diameter", value: "3.6 cm", reference: "Typical: ≤ 4.0 cm", status: "normal" },
    ],
    summary:
      "A classic parasternal long-axis view: the LV, mitral valve, aortic root and left atrium are all visible. It's the go-to view for practicing EPSS, a quick visual estimate of LV function, and for learning to tell a pericardial from a pleural fluid layer.",
    recommendations: [
      "Freeze in early diastole to measure EPSS at the leaflet tip",
      "Rotate 90° clockwise to practice the short-axis (PSAX) view",
      "Compare LA size with the aortic root — they're roughly equal in this view",
    ],
    nextViews: ["PSAX — Papillary level", "Apical 4-Chamber", "Subxiphoid"],
    labels: [
      { id: "lv", name: "LV", x: 45, y: 55, color: "#f472b6" },
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
    imageQualityNote: "Clear long-axis IVC. Measure about 2 cm from the IVC–right atrium junction.",
    confidence: 83,
    alertLevel: "low",
    alertMessage: "Study point: compare the IVC diameter at end-expiration and end-inspiration.",
    findings: [
      { label: "IVC", value: "Long-axis view entering the right atrium through the liver", severity: "normal" },
      { label: "Hepatic Vein", value: "Joining the IVC just below the atrium — a useful landmark", severity: "info" },
      { label: "Respiratory Variation", value: "Diameter changes with breathing — measure both phases", severity: "info" },
    ],
    measurements: [
      { name: "IVC Max Diameter", value: "1.9 cm", reference: "Typical: < 2.1 cm", status: "normal" },
      { name: "IVC Min Diameter", value: "1.0 cm", reference: "", status: "normal" },
      { name: "Collapsibility Index", value: "47%", reference: "(max − min) ÷ max", status: "normal" },
    ],
    summary:
      "The IVC is seen in long axis as it passes through the liver into the right atrium. Measuring its diameter in both breathing phases and calculating the collapsibility index is a common POCUS skill — and a good exercise in consistent probe positioning.",
    recommendations: [
      "Use M-mode through the IVC to measure both phases on one trace",
      "Keep the probe in the same spot — the IVC can slide out of plane with breathing",
      "Don't confuse the IVC with the aorta: the IVC enters the right atrium",
    ],
    nextViews: ["Subxiphoid Cardiac", "IVC transverse"],
    labels: [
      { id: "ivc", name: "IVC", x: 50, y: 45, color: "#a78bfa" },
      { id: "ra", name: "RA", x: 65, y: 35, color: "#f87171" },
      { id: "liver", name: "Liver", x: 30, y: 40, color: "#fbbf24" },
    ],
  },

  "ob-first-trimester": {
    protocolId: "ob-first-trimester",
    protocolName: "OB: First Trimester Dating",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Good uterine window. For CRL, the embryo should be in a neutral (not flexed) position.",
    confidence: 91,
    alertLevel: "none",
    findings: [
      { label: "Gestational Sac", value: "Round, regular margins within the uterus", severity: "normal" },
      { label: "Yolk Sac", value: "Small bright ring inside the gestational sac", severity: "normal" },
      { label: "Embryo", value: "Measured from crown to rump for dating", severity: "normal" },
      { label: "Uterus", value: "Endometrium surrounds the sac — a key landmark", severity: "info" },
    ],
    measurements: [
      { name: "CRL", value: "22.1 mm", reference: "Used for first-trimester dating", status: "normal" },
      { name: "Gestational Age (CRL)", value: "≈ 9w 0d", reference: "Hadlock formula", status: "normal" },
      { name: "GS Mean Diameter", value: "28.4 mm", reference: "Average of three planes", status: "normal" },
    ],
    summary:
      "This view shows the three structures every first-trimester learner should identify: the gestational sac, the yolk sac and the embryo. The crown–rump length (CRL) is the standard first-trimester dating measurement.",
    recommendations: [
      "Measure CRL in a true mid-sagittal plane with the embryo neutral",
      "Practice the mean sac diameter: average three perpendicular measurements",
      "Scan through both adnexa to complete the standard views",
    ],
    nextViews: ["Adnexa (bilateral)", "Cervix", "M-mode for cardiac activity"],
    labels: [
      { id: "gs", name: "Gestational Sac", x: 48, y: 42, color: "#a78bfa" },
      { id: "embryo", name: "Embryo (CRL)", x: 52, y: 52, color: "#34d399" },
      { id: "ys", name: "Yolk Sac", x: 40, y: 54, color: "#fbbf24" },
      { id: "uterus", name: "Uterus", x: 28, y: 64, color: "#94a3b8" },
    ],
  },

  "lung-blue": {
    protocolId: "lung-blue",
    protocolName: "Lung: BLUE Protocol",
    timestamp: new Date().toISOString(),
    imageQuality: "fair",
    imageQualityNote: "Gain slightly high — lowering it by 2–3 dB makes A-lines easier to see.",
    confidence: 78,
    alertLevel: "low",
    alertMessage: "Study point: tell A-lines (horizontal) from B-lines (vertical) in this zone.",
    findings: [
      { label: "Pleural Line", value: "Bright horizontal line between the rib shadows ('bat sign')", severity: "normal" },
      { label: "Lung Sliding", value: "Shimmering movement along the pleural line on the live clip", severity: "normal" },
      { label: "A-lines", value: "Evenly spaced horizontal reverberations below the pleura", severity: "normal" },
      { label: "B-lines", value: "A few vertical lines from the pleura to the bottom of the screen — learn to count them", severity: "info" },
    ],
    measurements: [
      { name: "B-lines in this zone", value: "2", reference: "Learning point: count per intercostal space", status: "normal" },
    ],
    summary:
      "This lung view shows the pleural line between two rib shadows, the classic 'bat sign'. Below it you can practice the core lung-ultrasound skill: telling horizontal A-lines from vertical B-lines and counting B-lines in each zone.",
    recommendations: [
      "Use M-mode to see the 'seashore sign' of normal lung sliding",
      "Scan each BLUE point on both sides and compare",
      "Lower the gain so the artifacts stand out clearly",
    ],
    nextViews: ["Contralateral BLUE points", "PLAPS point", "M-mode at the pleural line"],
    labels: [
      { id: "pleura", name: "Pleural Line", x: 50, y: 30, color: "#a78bfa" },
      { id: "rib", name: "Rib Shadow", x: 22, y: 40, color: "#94a3b8" },
      { id: "bline", name: "B-line", x: 58, y: 58, color: "#f472b6" },
    ],
  },

  aaa: {
    protocolId: "aaa",
    protocolName: "Aorta: AAA Screening",
    timestamp: new Date().toISOString(),
    imageQuality: "good",
    imageQualityNote: "Adequate window. Some bowel gas at the mid-aorta — gentle graded pressure helps.",
    confidence: 85,
    alertLevel: "none",
    findings: [
      { label: "Aorta", value: "Round, pulsatile vessel anterior to the spine, left of midline", severity: "normal" },
      { label: "IVC", value: "To the patient's right of the aorta; changes shape with breathing", severity: "normal" },
      { label: "Vertebral Body", value: "Bright curve with shadow — the deep landmark", severity: "info" },
    ],
    measurements: [
      { name: "Max AP diameter", value: "2.1 cm", reference: "Typical: < 3.0 cm", status: "normal" },
      { name: "Transverse diameter", value: "2.0 cm", reference: "Typical: < 3.0 cm", status: "normal" },
    ],
    summary:
      "A transverse view of the abdominal aorta sitting just in front of the spine, with the IVC beside it. Measuring outer wall to outer wall is the key technique, and following the aorta all the way to the bifurcation is what makes the scan complete.",
    recommendations: [
      "Measure outer wall to outer wall, not inner lumen",
      "Follow the aorta down to the bifurcation into the iliacs",
      "Use graded pressure to move bowel gas out of the way",
    ],
    nextViews: ["Distal aorta to bifurcation", "Longitudinal aorta", "Iliac arteries"],
    labels: [
      { id: "aorta", name: "Aorta", x: 50, y: 48, color: "#f472b6" },
      { id: "ivc", name: "IVC", x: 62, y: 48, color: "#a78bfa" },
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
      { label: "Structures", value: "The main structures for this view are labeled on the image", severity: "normal" },
    ],
    measurements: [],
    summary:
      "The main structures in this view have been labeled to help you study it. Compare the labels with the protocol's expected views and landmarks.",
    recommendations: [
      "Check each label against the protocol's landmarks",
      "Capture the remaining views on the protocol checklist",
      "Ask a follow-up question about anything you're unsure of",
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
    { id: "scan-001", protocol: "eFAST", date: "2026-03-18 14:32", finding: "Morison's pouch — anechoic stripe study", alertLevel: "low" },
    { id: "scan-002", protocol: "PLAX", date: "2026-03-18 11:15", finding: "EPSS measurement practice", alertLevel: "low" },
    { id: "scan-003", protocol: "OB 1st Tri", date: "2026-03-17 09:44", finding: "CRL 22.1mm — dating practice", alertLevel: "none" },
    { id: "scan-004", protocol: "BLUE Protocol", date: "2026-03-17 08:20", finding: "A-lines vs B-lines", alertLevel: "low" },
    { id: "scan-005", protocol: "IVC", date: "2026-03-16 16:05", finding: "Collapsibility index practice", alertLevel: "low" },
    { id: "scan-006", protocol: "AAA", date: "2026-03-16 13:30", finding: "Aorta 2.1cm — outer-wall measurement", alertLevel: "none" },
  ];
}
