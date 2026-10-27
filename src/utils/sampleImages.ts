// Realistic embedded SVG data URIs for sample physical forms and proof photos
// Ensures 100% offline and sandbox reliability without external network calls.

export const SAMPLE_PHYSICAL_FORM_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#faf9f5; font-family: monospace, sans-serif;">
  <rect x="20" y="20" width="760" height="1060" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Header Table -->
  <rect x="40" y="40" width="720" height="90" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>
  <text x="60" y="75" font-size="20" font-weight="bold" fill="#0f172a" font-family="sans-serif">ABSCODE QUALITY SYSTEMS</text>
  <text x="60" y="105" font-size="14" font-weight="bold" fill="#334155">FORM-4M-01: SHOP FLOOR 4M CHANGE RECORD</text>
  <rect x="560" y="50" width="180" height="70" fill="#ffffff" stroke="#94a3b8" stroke-dasharray="3,3"/>
  <text x="575" y="75" font-size="11" fill="#64748b">SCAN SLIP REF:</text>
  <text x="575" y="100" font-size="16" font-weight="bold" fill="#0f172a">MC-00101</text>

  <!-- Section 1: Basic Info -->
  <rect x="40" y="145" width="720" height="135" fill="none" stroke="#334155" stroke-width="1.5"/>
  <text x="55" y="170" font-size="12" font-weight="bold" fill="#475569">1. GENERAL INFORMATION</text>
  <line x1="40" y1="180" x2="760" y2="180" stroke="#cbd5e1"/>
  
  <text x="55" y="205" font-size="12" fill="#64748b">Date / Time:</text>
  <text x="160" y="205" font-size="13" font-weight="bold" fill="#0f172a">2026-10-26  08:15 AM</text>
  
  <text x="420" y="205" font-size="12" fill="#64748b">Machine / Line:</text>
  <text x="540" y="205" font-size="13" font-weight="bold" fill="#0f172a">Press-04 (Line B)</text>

  <text x="55" y="240" font-size="12" fill="#64748b">Part Number:</text>
  <text x="160" y="240" font-size="13" font-weight="bold" fill="#0f172a">BRK-204 (Caliper Bracket)</text>

  <text x="420" y="240" font-size="12" fill="#64748b">Shift / Operator:</text>
  <text x="540" y="240" font-size="13" font-weight="bold" fill="#0f172a">Shift A - Rajesh Kumar (EMP-4081)</text>

  <!-- Section 2: 4M Category Matrix -->
  <rect x="40" y="295" width="720" height="150" fill="none" stroke="#334155" stroke-width="1.5"/>
  <text x="55" y="320" font-size="12" font-weight="bold" fill="#475569">2. 4M CATEGORY (TICK APPLICABLE)</text>
  <line x1="40" y1="330" x2="760" y2="330" stroke="#cbd5e1"/>

  <!-- Man -->
  <rect x="60" y="350" width="18" height="18" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
  <text x="90" y="365" font-size="13" fill="#334155">MAN (Operator/Skill)</text>

  <!-- Machine (Ticked) -->
  <rect x="250" y="350" width="18" height="18" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
  <path d="M 253 359 L 258 365 L 266 353" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round"/>
  <text x="280" y="365" font-size="13" font-weight="bold" fill="#1d4ed8">MACHINE (Tool/Equip)</text>

  <!-- Material -->
  <rect x="470" y="350" width="18" height="18" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
  <text x="500" y="365" font-size="13" fill="#334155">MATERIAL (Heat/Lot)</text>

  <!-- Method -->
  <rect x="640" y="350" width="18" height="18" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
  <text x="670" y="365" font-size="13" fill="#334155">METHOD</text>

  <!-- Change Type -->
  <text x="60" y="415" font-size="12" fill="#64748b">Change Type:</text>
  <text x="160" y="415" font-size="13" font-weight="bold" fill="#b91c1c">[X] Unplanned (Breakdown/Insert wear)</text>
  <text x="440" y="415" font-size="12" fill="#64748b">Reason Code:</text>
  <text x="540" y="415" font-size="13" font-weight="bold" fill="#0f172a">Tool / insert wear</text>

  <!-- Section 3: Description & Shop Floor Notes -->
  <rect x="40" y="460" width="720" height="220" fill="none" stroke="#334155" stroke-width="1.5"/>
  <text x="55" y="485" font-size="12" font-weight="bold" fill="#475569">3. DESCRIPTION OF CHANGE (SHOP FLOOR HANDWRITING)</text>
  <line x1="40" y1="495" x2="760" y2="495" stroke="#cbd5e1"/>

  <text x="60" y="530" font-size="14" fill="#0f172a" font-style="italic">"During punching of batch 4B (qty ~450 pcs), operator noticed excessive burr</text>
  <text x="60" y="555" font-size="14" fill="#0f172a" font-style="italic">on piercing hole. Carbide insert punch #3 found chipped at cutting edge.</text>
  <text x="60" y="580" font-size="14" fill="#0f172a" font-style="italic">Line halted at 08:10. Replaced insert with calibrated spare punch (Tool ID: T-04).</text>
  <text x="60" y="605" font-size="14" fill="#0f172a" font-style="italic">Suspect lot segregated into Red bin. Awaiting Quality confirmation."</text>

  <!-- Stamp -->
  <g transform="translate(560, 520) rotate(-8)">
    <rect x="0" y="0" width="160" height="60" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,2" rx="4"/>
    <text x="15" y="25" font-size="12" font-weight="bold" fill="#dc2626">LINE STOPPED</text>
    <text x="15" y="45" font-size="10" fill="#dc2626">TIME: 08:12 AM</text>
  </g>

  <!-- Section 4: Sign-off -->
  <rect x="40" y="695" width="720" height="150" fill="none" stroke="#334155" stroke-width="1.5"/>
  <text x="55" y="720" font-size="12" font-weight="bold" fill="#475569">4. SIGN-OFF &amp; SUBMISSION</text>
  <line x1="40" y1="730" x2="760" y2="730" stroke="#cbd5e1"/>

  <text x="60" y="760" font-size="12" fill="#64748b">Raised By:</text>
  <text x="160" y="760" font-size="13" font-weight="bold" fill="#0f172a">Rajesh Kumar (Supervisor)</text>

  <text x="420" y="760" font-size="12" fill="#64748b">Signature Stamp:</text>
  <text x="540" y="760" font-size="14" font-weight="bold" fill="#1e3a8a" font-style="italic">R. Kumar [Verified]</text>

  <text x="60" y="800" font-size="12" fill="#64748b">Notice:</text>
  <text x="160" y="800" font-size="12" fill="#64748b">Route hardcopy to Quality Lab / Uploaded via Abscode mobile camera</text>

  <!-- Bottom barcode / reference -->
  <line x1="60" y1="900" x2="740" y2="900" stroke="#94a3b8" stroke-width="2"/>
  <text x="320" y="940" font-size="12" fill="#94a3b8">ABSCODE MFG QUALITY - DOC REV 2.4</text>
</svg>
`)}`;

export const SAMPLE_PROOF_PHOTO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" style="background:#0f172a; font-family: sans-serif;">
  <rect x="0" y="0" width="800" height="600" fill="#1e293b"/>
  
  <!-- Machine housing backdrop -->
  <rect x="80" y="60" width="640" height="480" fill="#334155" stroke="#475569" stroke-width="3" rx="8"/>
  <circle cx="400" cy="280" r="140" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
  
  <!-- Tooling / Dial Gauge Measurement -->
  <circle cx="400" cy="280" r="110" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
  <circle cx="400" cy="280" r="8" fill="#dc2626"/>
  <line x1="400" y1="280" x2="440" y2="210" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Dial ticks -->
  <line x1="400" y1="180" x2="400" y2="195" stroke="#0f172a" stroke-width="2"/>
  <line x1="480" y1="230" x2="465" y2="238" stroke="#0f172a" stroke-width="2"/>
  <line x1="500" y1="280" x2="485" y2="280" stroke="#0f172a" stroke-width="2"/>
  <line x1="300" y1="280" x2="315" y2="280" stroke="#0f172a" stroke-width="2"/>
  <text x="375" y="330" font-size="16" font-weight="bold" fill="#0f172a" font-family="monospace">0.002 mm</text>
  <text x="365" y="350" font-size="11" fill="#475569">CALIBRATED MITUTOYO</text>

  <!-- Inspection Tag Overlay -->
  <g transform="translate(110, 90)">
    <rect x="0" y="0" width="280" height="110" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4"/>
    <text x="15" y="25" font-size="12" font-weight="bold" fill="#1d4ed8">PROOF OF IMPLEMENTATION</text>
    <text x="15" y="50" font-size="11" fill="#334155">Tooling Offset Re-check: PASSED</text>
    <text x="15" y="70" font-size="11" fill="#334155">First-off sample (5 pcs): Within 0.05mm</text>
    <text x="15" y="92" font-size="11" font-weight="bold" fill="#059669">Verified on CMM Bench 2</text>
  </g>

  <!-- Timestamp Overlay -->
  <rect x="520" y="470" width="180" height="50" fill="#000000" fill-opacity="0.75" rx="4"/>
  <text x="535" y="492" font-size="12" font-weight="bold" fill="#ffffff" font-family="monospace">2026-10-26 14:22</text>
  <text x="535" y="508" font-size="10" fill="#94a3b8">LINE: INJ-MOULD-03</text>
</svg>
`)}`;
