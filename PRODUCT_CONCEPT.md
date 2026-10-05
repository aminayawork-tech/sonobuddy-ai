# Sonoguide — Complete Product Concept

> **AI-Powered Point-of-Care Ultrasound Guide**
> Version 1.0 Concept Document | March 2026

---

## 1. App Identity

### Name
**Sonoguide**

### Tagline
*"Scan with confidence. Understand in seconds."*

### One-Sentence Value Proposition
Sonoguide is the first protocol-first AI ultrasound interpreter that works with any device, any clinician, anywhere — delivering real-time image analysis, automated measurements, and educational guidance at the point of care.

---

## 2. Problem Statement + Why Now

### The Problem

Point-of-care ultrasound is one of the highest-leverage diagnostic tools in modern medicine, but its adoption is bottlenecked by a critical gap: the gap between **acquiring** an image and **correctly interpreting** it. This gap kills people.

**The numbers are stark:**
- POCUS-capable providers now number in the millions globally, yet formal POCUS training remains inconsistent, under-resourced, and geographically unequal.
- A 2024 ACEP survey found that **62% of emergency physicians** who own or have access to a handheld probe cite "uncertainty in interpretation" as their primary barrier to POCUS use.
- Rural clinicians and midwives in low-resource settings frequently have device access through NGO programs (Butterfly, Vscan) but no on-site expert to validate their reads.
- Medical trainees perform POCUS under supervision — but supervision is not always available at 3 AM.

The existing AI solutions are **locked to proprietary hardware** (Butterfly Compass AI, Philips EPIQ AI), **narrowly focused on cardiology/lung** (Caption Health, EchoGo), or **prohibitively expensive** for individual practitioners. None combine protocol-first guidance, broad anatomical coverage, device independence, and meaningful education in a single mobile app.

### Why 2026 Is the Inflection Point

**AI Capability Maturation:** Vision transformer models fine-tuned on large POCUS datasets (EchoNet-Dynamic, POCUS Atlas, and newly published multi-institutional FAST/OB datasets) now achieve cardiologist-level EF estimation and near-expert fetal biometry at inference speeds under 800ms on modern mobile silicon (Apple A18 Pro, Snapdragon 8 Elite).

**Handheld Probe Proliferation:** The global handheld ultrasound market hit $2.1B in 2025 with Butterfly iQ3, Clarius HD3, Vave, and a dozen sub-$1,000 competitors. Tens of thousands of new probes activated monthly — creating a massive installed base of users who need interpretation help.

**Regulatory Tailwind:** The FDA's 2025 Digital Health Action Plan explicitly supports AI-as-Software-as-Medical-Device (SaMD) frameworks with streamlined 510(k) pathways for AI tools classified as "decision support" when paired with appropriate clinician-in-the-loop safeguards.

**Post-Pandemic Decentralization:** COVID-19 permanently shifted critical care into sub-acute settings, homes, and rural clinics. POCUS followed. The infrastructure to support decentralized interpretation has not kept pace.

**LLM-Native Clinicians:** The cohort of physicians entering practice in 2025-2026 grew up using AI tools as cognitive partners. They expect AI assistance as table stakes.

---

## 3. Target Users & Personas

### Primary Users

| User Type | Estimated Addressable Population (Global) | Willingness to Pay |
|---|---|---|
| Emergency Physicians | 150,000+ | High |
| Critical Care Intensivists | 80,000+ | High |
| OB/GYN & MFM | 120,000+ | Medium-High |
| Family/Rural Medicine | 500,000+ | Medium |
| Medical Students & Residents | 800,000+ | Low-Medium |
| Midwives (Low-Resource Settings) | 2,000,000+ | Low (NGO/subsidy target) |

---

### Persona 1: Dr. Aisha Mensah — Emergency Physician, Accra, Ghana

**Background:** 34 years old. EM attending at a district hospital. Has a Butterfly iQ+ acquired through a WHO NGO grant. Performs FAST, lung, and basic cardiac POCUS daily but had only a 2-week training course. No radiology backup. No formal POCUS fellowship.

**Pain Points:** Uncertainty in distinguishing pericardial effusion from epicardial fat. Estimating cardiac function without echo training. No way to confirm her reads or learn from her mistakes.

**How Sonoguide Helps:** She selects the "Cardiac: Parasternal Long Axis" protocol, photographs her Butterfly screen, and within 3 seconds receives labeled structures (LV, LA, Ao, MV), an estimated EF range ("55-65% — Normal function"), and the suggestion: "Check PSAX view to assess wall motion further." She learns while she works. The PDF export supports her case documentation.

**Subscription:** NGO-subsidized Institutional tier.

---

### Persona 2: Dr. Marcus Webb — PGY-2 Internal Medicine Resident, Chicago, IL

**Background:** 27 years old. Training at a busy urban teaching hospital with a robust POCUS curriculum, but overnight call means no attending POCUS supervision for image interpretation. Has personal Clarius handheld on loan.

**Pain Points:** The POCUS supervisor won't answer a phone call at 2 AM for a "lung check." He's not confident distinguishing B-lines from A-lines on sub-optimal views. He wants feedback that improves his technique — not just a result.

**How Sonoguide Helps:** Marcus uses the BLUE Protocol module. After uploading images from bilateral lung zones, the AI flags "5 confluent B-lines in R anterolateral zone — consider interstitial edema or pneumonia in clinical context." It also tells him: "Image gain is slightly elevated; reduce gain by 2-3 dB and rescan for cleaner A-line pattern." He gets better. His attendings notice.

**Subscription:** Free tier (educational). Upgrades to Individual Pro ($14.99/month) after 3 months.

---

### Persona 3: Sunita Rao — Certified Nurse-Midwife, Rajasthan, India (Rural Clinic)

**Background:** 41 years old. Works at a primary health center with a Vscan Extend. Performs basic OB ultrasound for ANC visits but has limited formal training. The nearest radiologist is 90 km away.

**Pain Points:** Estimating gestational age, confirming intrauterine pregnancy, checking for placenta previa. No reference, no feedback, no confidence.

**How Sonoguide Helps:** She selects "OB: First Trimester — CRL & Dating." She uploads the image. Sonoguide automatically detects the embryo, places measurement calipers on-screen, reports "CRL: 18.4 mm → Estimated GA: 8 weeks 3 days (±5 days)." It also notes: "Gestational sac appears regular. No subchorionic hematoma detected." She exports the report, attaches it to the patient record, and refers appropriately when findings are abnormal.

**Subscription:** Subsidized Community tier ($2/month through partner NGO MobiHealthPlus).

---

## 4. Prioritized Feature Roadmap

### MVP (Launch — Q4 2026)

#### Core Protocol Engine
- [ ] 20 foundational POCUS protocols with standard view definitions, indications, image examples
- [ ] Protocol selector UI: searchable dropdown, categorized by organ system, favorites pinning
- [ ] Each protocol card: Indications, Standard views, Expected findings, Common pitfalls, Educational tips

**Included MVP Protocols:**
1. eFAST (RUQ, LUQ, Pelvic, Cardiac subxiphoid, Bilateral lung)
2. Cardiac: Parasternal Long Axis (PLAX)
3. Cardiac: Parasternal Short Axis (PSAX)
4. Cardiac: Apical 4-Chamber (A4C)
5. Cardiac: Subcostal / Subxiphoid
6. Cardiac: IVC collapsibility (fluid responsiveness)
7. Lung: BLUE Protocol (6 zones bilateral)
8. Lung: Pleural effusion estimation
9. OB: First Trimester (CRL, GS, fetal heart rate)
10. OB: Second Trimester (BPD, HC, AC, FL biometry)
11. Abdominal Aorta (AAA screening)
12. Gallbladder (stones, wall thickness, pericholecystic fluid)
13. Renal (hydronephrosis, kidney size)
14. Bladder volume estimation
15. DVT (femoral/popliteal compression)
16. Optic Nerve Sheath Diameter (ONSD — ICP surrogate)

#### Image Input
- [ ] Camera capture (optimized for photographing ultrasound screens: high contrast, UI guides)
- [ ] Gallery/file import (JPEG, PNG, DICOM viewer export screenshots)
- [ ] Manual annotation tools: circles, arrows, freehand draw, text labels
- [ ] Multi-image capture per session (multiple views of same exam)

#### AI Analysis Engine (MVP)
- [ ] Structure identification & labeled overlay (organ boundaries, key landmarks)
- [ ] Automated measurements for core protocols:
  - IVC AP diameter + collapsibility index (M-mode estimate from 2D)
  - Bladder volume (3-plane ellipsoid formula)
  - Aortic diameter (proximal abdominal)
  - CRL (first trimester)
  - Fetal BPD, HC, AC, FL (second trimester) → EFW calculation
  - EPSS (E-Point Septal Separation → EF estimation)
  - ONSD measurement
  - Pleural effusion depth
- [ ] Anomaly detection alerts (free fluid, B-lines, stones, effusion, IVC dilation)
- [ ] Confidence scores with color-coded indicators (green/yellow/red)
- [ ] Image quality feedback ("Probe angle too steep," "Depth too shallow," "Gain artifacts")
- [ ] Plain-language AI summary per protocol

#### Results & Workflow
- [ ] Annotated result image (overlaid labels + measurement lines)
- [ ] Protocol checklist (views completed / remaining)
- [ ] "Next View" recommendation
- [ ] Findings text summary card
- [ ] Mandatory disclaimer on every results screen

#### Safety & Compliance
- [ ] Prominent disclaimer: "Not FDA-cleared for primary diagnosis. For educational and supportive use only. Clinical decisions require trained clinician review."
- [ ] Clinician review prompt before export: "Has a qualified clinician reviewed these findings?"
- [ ] No PHI stored without explicit opt-in
- [ ] HIPAA-compliant cloud processing (AWS HealthLake / Azure Health Data Services)
- [ ] Session-level anonymization by default (auto-strip DICOM metadata)

#### History & Export
- [ ] Scan history (locally stored, anonymized)
- [ ] PDF report generation (annotated image + findings + timestamp + protocol used + disclaimer)
- [ ] Share via secure link (time-limited, passcode-protected)

#### Account & Onboarding
- [ ] Role-based onboarding flow (Student / Clinician / Midwife)
- [ ] Skills level self-assessment → adjusts explanation depth
- [ ] Tutorial overlays for first scan
- [ ] Free tier: 15 full AI analyses/month, 16 protocols
- [ ] Pro tier ($14.99/month): Unlimited scans, all protocols, PDF export, priority AI

---

### Version 1.1 (Q1-Q2 2027)

- [ ] **Extended Protocol Library (+10 protocols):**
  - Thyroid (nodule characterization, TIRADS-like scoring)
  - Soft tissue / abscess (cellulitis vs. abscess)
  - MSK: Shoulder (rotator cuff), Knee (effusion)
  - Procedural guidance overlays: CVC placement, thoracentesis, paracentesis, arthrocentesis
  - Hepatic (liver echogenicity, ascites)
  - Testicular (torsion risk indicators)
  - Fetal presentation (3rd trimester)

- [ ] **Hardware SDK Integrations:**
  - Butterfly Network SDK (live frame capture from Butterfly iQ app)
  - Clarius Cast API (screen mirroring integration)
  - Future: USB-C probe direct input

- [ ] **Advanced AI Features:**
  - Automated B-line counting (BLUE Protocol)
  - Cardiac wall motion abnormality detection (regional RWMA)
  - Gestational age from blind sweep video (single 6-second sweep → full biometry)
  - Automated FAST score: structured free fluid grading (0–3+ scale)
  - Tricuspid annular plane systolic excursion (TAPSE) estimation

- [ ] **Collaborative Features:**
  - Secure image sharing for remote expert consultation ("Get a second read")
  - Institution-level accounts (educators assign cases to students)
  - Annotation comparison: side-by-side AI vs. expert markup

- [ ] **Offline Mode (Core):**
  - Downloadable on-device model for 8 core protocols (FAST, Cardiac basics, Lung, OB dating)
  - Full function without internet; cloud sync when reconnected

---

### Version 2.0 (2028 Horizon)

- [ ] FDA 510(k) submission for select indications (IVC, bladder volume — lower-risk SaMD Class II)
- [ ] Video/cine loop analysis (upload short clip → frame-by-frame AI)
- [ ] LLM-powered conversational interface ("What does this black area mean?")
- [ ] Integrated tele-POCUS platform (proctor sees live stream + adds annotations)
- [ ] CME credit integration (accredited POCUS learning modules)
- [ ] EHR integration (Epic SMART on FHIR, Cerner Millennium)
- [ ] Research mode (de-identified dataset contribution with consent)

---

## 5. Detailed User Flows

### Flow A: eFAST Exam (Trauma Bay, Emergency Setting)

**Context:** 32-year-old male, MVC, BP 88/60. Physician needs rapid free fluid assessment.

---

**Step 1 — App Launch & Protocol Selection**
> Screen: Home dashboard with search bar and recent protocols.
> Action: Tap "eFAST" from recents (or search "FAST").
> UI: Protocol card expands — shows 5-view checklist: RUQ (Morison's Pouch), LUQ (Splenorenal), Pelvis, Subxiphoid Cardiac, Bilateral Lung.
> AI Prep: Protocol context loaded into inference engine → optimized for free fluid + pneumothorax detection.

**Step 2 — First Image: RUQ (Hepatorenal Space)**
> Action: Tap "Add Image — RUQ View." Camera opens with overlay guide showing correct probe orientation and expected anatomy diagram.
> Capture: Physician photographs screen of Clarius probe display.
> Processing: AI engine runs in ~700ms.
> Result: Annotated image appears.
> - Labels: "Liver," "Right Kidney," "Morison's Pouch" highlighted.
> - Detection: "**FREE FLUID DETECTED** — Anechoic stripe >1cm at hepatorenal interface."
> - Confidence: 🔴 **High Suspicion (87%)** — "This finding in trauma context is highly significant. Immediate surgical consultation recommended."
> - Quality note: "Good depth and gain. Consider slight posterior angulation to visualize inferior pole of kidney."

**Step 3 — Continue Protocol**
> UI: RUQ view checks off. Green checkmark. "Next: LUQ (Splenorenal)" auto-suggested.
> Action: Physician taps next, photographs LUQ.
> Result: "No free fluid detected in splenorenal space. Confidence: 79%."

**Step 4 — Subxiphoid Cardiac**
> Result: "Pericardial space: No effusion detected. Limited window — subcostal view acceptable. Consider apical 4C if clinical concern."
> EPSS estimate: "EPSS ~8mm → Suggests preserved EF. Verify clinically."

**Step 5 — Bilateral Lung Zones**
> Result: Both sides — "A-lines present bilaterally. No B-lines. No sliding lung sign loss detected. Pneumothorax: Low probability."

**Step 6 — Results Summary Screen**
> Top: "eFAST COMPLETE — 5/5 views captured."
> Free fluid status: **POSITIVE — RUQ** (red badge)
> Structured summary:
> ```
> eFAST Summary — [timestamp]
> Protocol: eFAST (Extended FAST)
>
> RUQ:        FREE FLUID (+++) — Morison's Pouch
> LUQ:        No free fluid detected
> Pelvis:     Not captured
> Cardiac:    No pericardial effusion | EPSS ~8mm
> Lung R:     No PTX signs
> Lung L:     No PTX signs
>
> ⚠️ CLINICAL NOTE: Positive FAST in hemodynamically
> unstable trauma patient — strongly consider immediate
> operative intervention per ATLS guidelines.
>
> [DISCLAIMER: Not FDA-cleared. Clinician review required.]
> ```
> Action buttons: [Export PDF] [Share Securely] [Retake View] [New Exam]

**Step 7 — Export**
> PDF generated in 4 seconds. Contains annotated image, summary, protocol checklist, timestamp, provider role, and mandatory disclaimer block.
> Share: Generates passcode-protected link valid 24 hours. Can be sent to trauma surgery via secure message.

---

### Flow B: OB First Trimester Dating (Rural Clinic / ANC Visit)

**Context:** 24-year-old woman, LMP uncertain, referred for dating scan. Vscan Extend available.

---

**Step 1 — Protocol Selection**
> Screen: Midwife opens Sonoguide. Selects "OB" category.
> Options shown: First Trimester (CRL / Dating), Second Trimester (Biometry), Fetal Presentation, OB FAST.
> Selects: "OB: First Trimester — CRL & Dating."
> Protocol card shows: Indications ("GA confirmation, viable IUP, ectopic exclusion"), Standard views ("Longitudinal GS, Embryo with CRL, Fetal heart motion"), and a diagram of normal first trimester anatomy.

**Step 2 — Image Upload**
> Midwife selects "Upload from Gallery" — imports JPG screenshot from Vscan app.
> AI runs: 1.1 seconds (cloud model).

**Step 3 — AI Analysis: CRL Measurement**
> Annotated image displayed:
> - Gestational sac outlined in blue
> - Embryo identified, CRL calipers placed automatically (crown to rump)
> - Measurement: **CRL = 22.1 mm**
> - Gestational Age: **9 weeks 0 days (±5 days)** — Hadlock 1992 table
> - EDD: **[Calculated date]**
> - Fetal Heart Rate: "Cardiac motion detected — M-mode estimation not possible from still image. Confirm FHR with probe."
> - Yolk sac: "Visible — Normal appearance"
> - Subchorionic finding: "No hematoma detected"

**Step 4 — Checklist Guidance**
> Protocol checklist:
> ✅ Gestational sac visualized
> ✅ Embryo identified
> ✅ CRL measured
> ⬜ FHR confirmed (still image — recommend live M-mode)
> ⬜ Adnexa assessed (upload additional view)
> ⬜ Cervix / placenta location noted

> "Next recommended view: Transverse view to assess adnexa for ectopic exclusion."

**Step 5 — Adnexa Image**
> Midwife uploads second image (transverse pelvic view).
> Result: "No adnexal mass detected. Free fluid: Physiologic amount only. Ectopic pregnancy: Low probability in this image. Clinical correlation required."

**Step 6 — Summary**
> ```
> OB First Trimester Summary — [timestamp]
>
> IUP:          Confirmed
> CRL:          22.1 mm
> GA (by CRL):  9 weeks 0 days (±5 days)
> EDD:          [Date]
> Fetal Cardiac Motion: Detected (confirm FHR live)
> Adnexa:       No mass detected
> Subchorionic Hematoma: None
>
> Recommendations:
> • Confirm FHR with real-time M-mode (normal 6-10w: 100-170 bpm)
> • Follow-up anatomy scan at 18-20 weeks
> • Refer if discordance >2 weeks between LMP and CRL
>
> [DISCLAIMER: For supportive use only. Not a replacement
> for formal obstetric ultrasound. Clinician review required.]
> ```

**Step 7 — Report & Referral**
> PDF exported: Includes annotated image with CRL caliper overlay, GA/EDD summary, checklist, and referral note section (pre-populated, editable).
> Midwife adds clinical notes, exports, and attaches to patient's antenatal record.

---

## 6. Competitive Landscape

### Competitor Matrix

| Product | Device Dependency | Protocols Covered | AI Features | Education Layer | Standalone App | Price |
|---|---|---|---|---|---|---|
| **Butterfly Compass AI** | Butterfly iQ only | Cardiac, Lung, Vascular | Auto-labeling, EF, B-lines | Minimal | No | Included w/ device |
| **Caption Health / GE AI** | GE probes | Cardiac (focused) | Guided acquisition, EF | Moderate | No | Enterprise license |
| **Philips EPIQ AI** | Philips systems | Cardiac, Vascular | Auto-measurements | None | No | $100k+ system |
| **Exo Iris AI** | Exo probe | Cardiac, FAST | Acquisition guidance | Moderate | No | Device bundle |
| **Fujifilm PIV Assist** | Fujifilm probes | Cardiac | Auto EF, wall motion | Minimal | No | Device bundle |
| **SonoAI (startup)** | Any (photo) | Cardiac only | Classification | None | Yes | $29.99/month |
| **CliniSonics** | Any | FAST, Cardiac | Basic labeling | Minimal | Yes | $19.99/month |
| **Sonoguide** | **Any device / photo** | **26+ protocols (MVP)** | **Full suite: measurements, detection, quality feedback** | **Deep integration** | **Yes** | **Free / $14.99 Pro** |

### Sonoguide's Unique Selling Points

**1. Protocol-First Intelligence**
No competitor ties the AI context to a user-selected protocol before analysis. Sonoguide's protocol-aware inference engine optimizes for the specific anatomy, measurements, and pathologies relevant to the selected exam — dramatically reducing false positives and improving relevance of findings.

**2. True Device Independence**
Every AI tool on the market is anchored to proprietary hardware. Sonoguide works with a photograph of any screen. This is not a technical limitation — it's a deliberate design philosophy that unlocks the 90% of clinicians who don't use Butterfly or GE.

**3. Breadth: Beyond Cardiology**
The market's fixation on cardiac AI reflects data availability bias, not clinical need. OB, FAST, MSK, procedural, and renal POCUS are all high-volume, high-stakes applications with enormous unmet interpretation needs. Sonoguide is the first to cover them all in one app.

**4. Educational-Interpretive Hybrid**
Butterfly tells you what it found. Sonoguide tells you what it found, why it matters, what you might be missing, how to improve your technique, and what to learn next. This creates clinician growth, not just task completion.

**5. Privacy-First Architecture**
Offline capability for 8 core protocols means no image ever leaves a device for the most sensitive cases. HIPAA compliance is built-in, not bolted on. De-identification is automatic. This matters enormously to risk-averse hospital IT departments.

**6. Freemium Accessibility**
The $0 entry point with 15 free AI analyses/month enables massive grassroots adoption among residents, students, and low-resource clinicians — the users who will become the next generation of POCUS champions.

---

## 7. Risks & Challenges

### 7.1 AI Accuracy on Poor-Quality Images

**Risk:** POCUS image quality varies enormously by operator skill, patient habitus, equipment quality, and probe position. Models trained on clean research datasets may fail on real-world clinic photos.

**Mitigation Strategy:**
- Implement an **image quality classifier** as the first model in the pipeline. Images below quality threshold receive quality coaching first, not a diagnosis attempt.
- Use **uncertainty quantification** (Monte Carlo dropout or Bayesian inference) to generate honest confidence intervals. A low-confidence result returns "Insufficient image quality — improve probe positioning" rather than a wrong answer.
- Aggressive **data augmentation** during training: simulate low-gain, high-artifact, oblique-angle, and mobile-photography noise conditions.
- **Red-teaming** with deliberately poor images from field partners before launch.
- Confidence thresholds: If model uncertainty > threshold → refuse measurement, provide coaching, do not generate numerical result.

### 7.2 Regulatory Pathway

**Risk:** FDA classification of AI diagnostic tools is complex and evolving. Wrong classification delays launch; over-promising capabilities creates liability.

**Mitigation Strategy:**
- Launch as **Class I** (if feasible) or **Class II SaMD** under FDA's "clinical decision support software" exemption where the software merely displays/calculates, with clinician interpretation explicitly required.
- Leverage FDA's **Pre-Submission Program (Q-Sub)** to clarify intended use and classification before development completion.
- Explicit scope: MVP is positioned as educational/supportive CDS, not primary diagnostic — avoiding the higher-risk pathway.
- Disclaimer engineering: Every results screen, every PDF export, every share contains the disclaimer in full. Log timestamp of clinician review confirmation.
- Engage **notified bodies in EU** in parallel (MDR Class IIa pathway) for European launch.
- Track FDA's **2025 AI/ML SaMD action plan** updates — regulatory environment is actively evolving in our favor.

### 7.3 Data Bias & Generalization

**Risk:** Training on predominantly Western, high-income datasets creates a model that fails on patient populations with different body habitus, common pathology patterns, or equipment used in low-resource settings.

**Mitigation Strategy:**
- Formal **bias audit** across: patient demographics, probe type, image quality distribution, disease prevalence (e.g., tropical diseases affecting echo appearance).
- Partner with institutions in Sub-Saharan Africa, South Asia, and Latin America for training data via IRB-approved de-identified datasets.
- Clearly document **model training demographics** in the app's AI transparency disclosure.
- Ongoing **federated learning** pipeline: users who opt in contribute anonymized cases to improve models for their population.

### 7.4 Clinician Over-Reliance

**Risk:** "Automation bias" — clinicians defer to AI results rather than applying independent judgment, especially trainees. An incorrect AI result becomes a patient harm event.

**Mitigation Strategy:**
- **Mandatory review prompt** before any PDF export. Users must tap "I have reviewed these findings and applied clinical judgment" — creating an intentional cognitive pause.
- **Never use diagnostic language.** All AI outputs use hedged phrasing: "consistent with," "findings may suggest," "high suspicion for — clinical correlation required."
- **Educational mode:** Option to see AI findings only after the user has made their own assessment (removes AI crutch for deliberate learning).
- **Incident reporting button** on every results screen ("Report AI Error") — builds trust and improves model.

### 7.5 Privacy & Security

**Risk:** Ultrasound images, even without patient names, can be re-identified in certain contexts. Cloud transmission of clinical images in foreign jurisdictions creates legal exposure.

**Mitigation Strategy:**
- End-to-end encryption (AES-256) in transit and at rest.
- US-only data residency for Pro accounts by default; EU data stored in EU (GDPR).
- **Zero-knowledge processing option:** Image sent to cloud inference, result returned, image immediately purged — no storage.
- Offline mode for highest-sensitivity cases.
- Annual **third-party security penetration testing**.
- SOC 2 Type II certification within 18 months of launch.

### 7.6 Monetization vs. Mission Tension

**Risk:** The users who most need Sonoguide (low-resource clinicians, midwives in LMICs) have the least ability to pay.

**Mitigation Strategy:**
- NGO/institutional subsidy program from Day 1.
- Partner with organizations (MSF, Partners in Health, USAID) to provide sponsored access.
- Data sharing agreements with research institutions as alternative value exchange for free access.
- Premium features monetize high-income markets; free tier sustains mission-critical users.

---

## 8. Monetization Strategy

### Freemium Architecture

#### Free Tier — "Sonoguide Basic"
- 15 full AI analyses per month (resets monthly)
- 16 core protocols
- Structure labeling and anomaly detection
- Standard text summary
- Manual annotations
- Scan history (30 days)
- No PDF export
- Watermarked images

**Target:** Students, occasional users, LMIC clinicians, app evaluation.

---

#### Pro Tier — "Sonoguide Pro" — $14.99/month or $119/year
- Unlimited AI analyses
- All 26+ protocols (including advanced OB biometry, procedural, thyroid)
- Full automated measurements suite
- PDF report export (professional, unbranded)
- Secure sharing with time-limited links
- Scan history (unlimited)
- Priority AI queue (faster processing)
- Offline mode for 8 core protocols
- Early access to new protocols

**Target:** Practicing clinicians, residents in high-income settings.

---

#### Team Tier — "Sonoguide Team" — $49/month (up to 5 users) / $89/month (up to 15 users)
- All Pro features for all seats
- Admin dashboard (usage analytics, case review)
- Educator tools: Assign cases to trainees, compare AI vs. student annotation
- Institution branding on PDF reports
- Dedicated support channel

**Target:** Residency programs, fellowship directors, urgent care groups, hospitalist teams.

---

#### Institutional / Enterprise — Custom pricing ($500–$5,000/month)
- Unlimited seats
- EHR integration (SMART on FHIR — v2.0)
- Custom protocol creation
- Federated model fine-tuning on institutional data (with consent)
- SLA with 99.9% uptime guarantee
- HIPAA BAA included
- Dedicated account manager
- API access for workflow embedding

**Target:** Hospital systems, health networks, medical schools, NGOs, government health ministries.

---

### Additional Revenue Streams

**CME Module Marketplace (v1.1+)**
Accredited POCUS learning modules within the app. $29–$79 per 2-credit module. Partnerships with ACEP, ACOG, SCCM for accreditation.

**Research Data Licensing**
De-identified, consented datasets (with robust IRB oversight) licensed to medical AI researchers and pharmaceutical companies for training purposes. Revenue share with contributing institutional partners.

**White-Label Licensing (2028)**
License Sonoguide's AI engine and protocol framework to probe manufacturers seeking software differentiation without building it themselves.

---

### Financial Projections (Conservative)

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Total Downloads | 80,000 | 250,000 | 600,000 |
| Free Users | 72,000 | 215,000 | 510,000 |
| Pro Subscribers | 5,500 | 25,000 | 70,000 |
| Team/Institutional | 50 accounts | 300 accounts | 900 accounts |
| ARR | $1.1M | $5.8M | $16.2M |

*Break-even estimated at month 18–22 depending on AI infrastructure costs and team scaling.*

---

## 9. App Store Description

### Title
**Sonoguide — AI Ultrasound Guide**

### Subtitle
**Point-of-Care Ultrasound Interpreter**

### Keywords
POCUS AI, ultrasound AI analyzer, point of care ultrasound, ultrasound interpretation, FAST exam, fetal biometry, cardiac ultrasound, emergency ultrasound, medical imaging AI, bedside ultrasound, echo AI, lung ultrasound, ultrasound education, clinical AI assistant

---

### Description (322 words)

**Sonoguide: The AI ultrasound assistant built for clinicians who need answers now.**

Whether you're a seasoned emergency physician, an OB/GYN fellow, a rural family doctor, or a medical student at 3 AM — Sonoguide gives you AI-powered ultrasound interpretation right when you need it, with any device, for any protocol.

**Point. Capture. Understand.**

Select your exam protocol, photograph your ultrasound screen (or upload from any source), and receive a structured AI analysis in seconds. Sonoguide identifies anatomical structures, places measurement calipers, detects abnormal findings, and provides plain-language summaries — all backed by confidence scores so you always know how much to trust the result.

**26+ Protocols. One App.**

From eFAST and cardiac views to OB dating, lung B-lines, AAA screening, DVT assessment, and procedural guidance — Sonoguide covers the full breadth of point-of-care ultrasound. Not just cardiology. Not just one probe brand. All of it.

**AI That Teaches, Not Just Tells**

Every analysis includes image quality feedback, learning tips, protocol checklists, and suggestions for the next view. Sonoguide doesn't just interpret — it makes you a better sonographer over time.

**Works With Any Probe. No Hardware Required.**

Butterfly. Clarius. Vscan. GE. Philips. Your hospital's cart machine. Sonoguide works with a photograph. Full integration for Butterfly and Clarius users available with Pro.

**Built for Safety. Built for Trust.**

HIPAA-compliant processing. Automatic de-identification. Optional offline mode for sensitive cases. And every result carries clear, prominent language: *Sonoguide is an educational and supportive AI tool. It is not FDA-cleared for primary diagnosis. All findings require qualified clinician review.*

**Free to Start. Powerful When You Need More.**

15 AI analyses free every month. Upgrade to Pro for unlimited scans, PDF reports, advanced protocols, and offline access.

*Sonoguide is not a replacement for clinical training, expert consultation, or formal diagnostic imaging.*

---

## 10. Visual Design Concepts & Screenshot Descriptions

### Screenshot 1 — Protocol Selector (Home Screen)
**Layout:** Dark navy background. Search bar at top: "Search protocols or exams..." Below it, horizontally scrollable category chips: "All | Cardiac | Trauma | OB | Lung | Abdominal | Vascular | Procedural." Below the chips, a vertically scrollable card list. Each protocol card features:
- A subtle ultrasound-mode icon (e.g., heart for cardiac, baby silhouette for OB)
- Protocol name in bold white text
- Subspecialty tag + estimated scan time
- A "favorite" star icon (top right corner)
- Color accent stripe based on category (coral for Cardiac, teal for OB, amber for Trauma)

Selected state: "eFAST" card highlighted with a blue glow. "Analyzing for: Free fluid, Pneumothorax, Pericardial effusion" sub-tag appears below.

**Design Feel:** Clean, clinical-grade dark theme. High-contrast typography. No clutter. Purpose-built, not repurposed from generic UI templates.

---

### Screenshot 2 — Image Capture Screen
**Layout:** Full-screen camera mode. Center frame: a rounded rectangular viewfinder overlay with corner markers (like a camera bracket). Inside the viewfinder: a ghost-image silhouette of the expected ultrasound anatomy for the selected protocol (for eFAST RUQ: liver + kidney shape outline in translucent blue).

Status bar at top: Protocol name (eFAST — RUQ View), view counter (1 of 5).

Bottom panel: Three options side by side — [📷 Camera] [🖼 Gallery] [✏️ Annotate]. Below that: "Tip: Keep phone parallel to screen. Avoid glare. Ensure full image visible in frame."

Capture button: Large circular button, center-bottom. When tapped, shows brief "Analyzing..." shimmer animation before transitioning to results.

**Design Feel:** Camera-native, minimal chrome. The probe guide overlay is the key innovation — it tells users exactly what anatomy to center before they even capture.

---

### Screenshot 3 — AI Analysis Results Screen
**Layout:** Two-pane vertical scroll.

**Top pane (60% of screen):** The captured ultrasound image with AI overlays:
- Color-coded region outlines: Liver (yellow boundary), Right Kidney (green boundary), Morison's Pouch (red highlight with pulsing glow)
- Floating label pills: "Liver ✓", "R. Kidney ✓", "Free Fluid ⚠️"
- Measurement line: Fluid stripe width in mm (displayed as a dotted measurement line with callout)
- Confidence badge: Bottom-right corner — "87% Confidence" with a red/amber/green dot

**Bottom pane (scrollable):** White card with:
- Header: "FREE FLUID DETECTED" in bold red
- Sub-text: "Anechoic collection at hepatorenal interface >1cm. Highly suspicious for hemoperitoneum in trauma context."
- Quality note: "Image quality: Good. Minor acoustic shadowing at inferior pole — not affecting assessment."
- Action row: [Next View →] [Retake] [Add Note]
- Protocol progress: 5-dot progress bar (1 filled, 4 empty) — "1 of 5 views complete"

**Design Feel:** Medical precision meets consumer clarity. Red-coded critical findings are unmissable. The annotated image is the hero — not charts, not graphs.

---

### Screenshot 4 — PDF Report / Export Preview
**Layout:** In-app report preview. Portrait document aesthetic with clean white background and a thin navy header bar.

**Report Header:**
- Sonoguide logo (small) + "Clinical Decision Support Report — For Adjunct Use Only"
- Protocol: eFAST | Date & Time | User Role: Emergency Physician

**Annotated Image Block:** Full-width annotated image (labeled overlay included) with a figure caption: "Figure 1: RUQ view — Free fluid identified at hepatorenal interface."

**Findings Table:**
```
View          | Finding                    | Confidence
RUQ           | FREE FLUID (+++)           | 87%
LUQ           | No free fluid              | 79%
Subxiphoid    | No pericardial effusion    | 82%
Lung R        | No PTX indicators          | 91%
Lung L        | No PTX indicators          | 89%
```

**Clinical Notes Field:** User-editable text block (pre-populated from AI summary, user can modify).

**Footer:** Full disclaimer text in italics. "This report was generated by Sonoguide AI (v1.0). It is not FDA-cleared for primary diagnosis and must be reviewed by a qualified clinician before influencing clinical decisions."

**Action buttons:** [Export PDF] [Share Link] [Save to History]

**Design Feel:** Professional enough to be attached to a clinical record. Clear enough that the disclaimer is read, not buried. The export is a clinical document, not a screenshot.

---

## Appendix A: AI Model Architecture (Technical Overview)

### Pipeline Design

```
Input Image
    ↓
[Quality Classifier] → Reject / coaching if below threshold
    ↓
[Protocol Context Injector] → Embeddings for selected protocol
    ↓
[Segmentation Model] → U-Net variant (protocol-specific decoders)
    Structure boundaries, region proposals
    ↓
[Detection Head] → Anomaly classification (free fluid, B-lines, calculi, etc.)
    ↓
[Measurement Extractor] → Caliper placement, formula application
    ↓
[Confidence Estimator] → MC-Dropout ensemble or conformal prediction
    ↓
[Report Generator] → Structured JSON → Plain language via fine-tuned LLM
    ↓
Output: Annotated image + structured findings + confidence scores
```

### Model Selection Rationale (2026 State of Art)

| Task | Architecture | Training Data | Performance Target |
|---|---|---|---|
| Structure Segmentation | EfficientNet-b4 + U-Net++ | 500k annotated POCUS frames (multi-source) | IoU >0.82 on held-out test |
| Anomaly Detection | Vision Transformer (ViT-B/16) fine-tuned | 200k labeled abnormal/normal pairs | AUC >0.91 for free fluid |
| Fetal Biometry | Cascaded CNN + Heatmap regression | EchoNet + POCUS Atlas OB subset | CRL MAE <2mm |
| Image Quality | MobileNetV3 (on-device) | 50k quality-labeled images | <150ms on iPhone 15 |
| Report Language | Claude 3.5 Haiku (API) / fine-tuned Llama 3.1 8B (offline) | Medical report corpus | Radiologist-grade phrasing |

### Edge vs. Cloud Strategy

| Model | Deployment | Rationale |
|---|---|---|
| Quality Classifier | On-device (CoreML / TFLite) | Sub-100ms latency; no PHI risk |
| Structure Segmentation (core 8 protocols) | On-device (offline mode) | Privacy + low-connectivity support |
| Full protocol suite | Cloud (AWS Inferentia2) | Accuracy priority; model size |
| Report Generator | Cloud (Claude API) | Language quality; context window |
| Offline fallback | Quantized INT8 on-device models | ~15% accuracy reduction acceptable |

---

## Appendix B: Protocol Library — Full MVP List

| # | Protocol | Category | Key AI Tasks |
|---|---|---|---|
| 1 | eFAST — RUQ | Trauma | Free fluid detection, depth measurement |
| 2 | eFAST — LUQ | Trauma | Free fluid detection |
| 3 | eFAST — Pelvic | Trauma | Free fluid, bladder ID |
| 4 | eFAST — Subxiphoid Cardiac | Trauma | Pericardial effusion, tamponade signs |
| 5 | eFAST — Bilateral Lung | Trauma | PTX (A-line absence, lung point) |
| 6 | Cardiac: PLAX | Cardiac | LV, LA, Ao sizing, MV assessment, pericardial effusion |
| 7 | Cardiac: PSAX (mitral level) | Cardiac | Wall motion, LV geometry |
| 8 | Cardiac: Apical 4-Chamber | Cardiac | EF (EPSS), chamber sizing, valve leaflets |
| 9 | Cardiac: Subxiphoid | Cardiac | Pericardial effusion, RV strain signs |
| 10 | IVC Collapsibility | Cardiac/Fluid | IVC AP diameter, CI calculation |
| 11 | Lung: BLUE Protocol | Lung | A-lines, B-lines (count), pleural sliding, consolidation |
| 12 | Lung: Pleural Effusion | Lung | Effusion depth/volume estimation |
| 13 | OB: First Trimester | OB | GS, CRL, FHR motion detection, ectopic signs |
| 14 | OB: Second Trimester Biometry | OB | BPD, HC, AC, FL, EFW (Hadlock) |
| 15 | Aorta: AAA Screening | Vascular | Aortic diameter (AP + transverse), thrombus |
| 16 | Gallbladder | Abdominal | Stones (shadowing), wall thickness, pericholecystic fluid, CBD |
| 17 | Renal | Abdominal | Hydronephrosis grade, kidney length |
| 18 | Bladder Volume | Abdominal | 3-plane dimensions, volume calculation |
| 19 | DVT: Femoral/Popliteal | Vascular | Compressibility, clot echogenicity |
| 20 | ONSD (ICP) | Neuro | Optic nerve sheath diameter (3mm behind globe) |

---

## Appendix C: Safety & Disclaimer Framework

### Disclaimer Text (Full — required on all result screens and exports)

> ⚕️ **IMPORTANT MEDICAL DISCLAIMER**
>
> Sonoguide is an AI-powered educational and clinical decision support tool. It is **not FDA-cleared for primary diagnosis** and does not replace formal diagnostic imaging, radiologist interpretation, or clinical judgment by a qualified healthcare professional.
>
> All findings generated by Sonoguide AI must be reviewed and validated by a licensed clinician before influencing any clinical decision. AI outputs may be inaccurate, incomplete, or not applicable to individual patient circumstances.
>
> By using this tool, you acknowledge that: (1) You are a trained healthcare professional or student acting under appropriate supervision; (2) Sonoguide findings are adjunctive and require clinical correlation; (3) The developers of Sonoguide accept no liability for clinical decisions based on AI-generated findings.
>
> For emergencies, follow your institution's established protocols and contact appropriate specialists.

### Clinician Acknowledgment Gate

Before any PDF is exported or any share link is generated, users must tap:

> [ ] "I confirm that I have reviewed these AI findings with clinical judgment and that a qualified clinician has assessed or will assess this patient."

This is logged with timestamp to the anonymized usage record.

---

*Document prepared: March 2026*
*Version: 1.0 Concept*
*Classification: Product Strategy — Internal*
*Next review: Q2 2026 (pre-development sprint planning)*
