# Savitribai Phule Pune University (SPPU) — Live Scopus Intelligence Dashboard

An executive research intelligence, bibliometric surveillance, and accreditation portal for **Savitribai Phule Pune University (SPPU)** (NIRF ID: `IR-O-U-0323`, Scopus Affiliation ID: `60014953`).

---

## 🏛️ Verified Institutional Metrics (MahaSTRIDE & NIRF 2025)

| Metric | Verified Value | Reference Standard |
| :--- | :--- | :--- |
| **Total Scopus Publications** | **21,893** | Official SPPU Diagnostic Report |
| **Total Citations** | **289,817** | Elsevier Scopus Intelligence |
| **Citations Per Paper (CPP)** | **25.30** | Benchmark > 20.0 |
| **Active Publishing Authors** | **6,490** | Multidisciplinary Faculty |
| **Q1 Ranked Publications** | **6,568 (30.0%)** | Top Quartile Scimago / SJR |
| **National Collaboration** | **51.7% (11,319 papers)** | Inter-institutional Co-authorship |
| **Institutional Collaboration** | **28.0% (6,130 papers)** | Intra-university Departments |
| **International Collaboration** | **17.8% (3,897 papers)** | Global Research Linkages |
| **Industry Co-authorship** | **4.8% (1,051 papers)** | Applied Technology Transfer |
| **NAAC Accreditation** | **Grade A++ (CGPA 3.60)** | Cycle 4 Autonomous Verification |
| **NIRF 2024 / 2025 Standing** | **Rank #91 (Score 49.83)** | National Universities Category |

---

## 🚀 How to Open the Dashboard

### Option 1: Instant Browser Launch (Zero Dependencies)
Simply double-click or open **`index.html`** in any web browser (Chrome, Edge, Firefox, Safari).
- Works 100% offline with zero setup required.
- Pre-loaded with full verified institutional datasets and interactive Plotly charts.

### Option 2: High-Speed Node.js Server (Recommended)
Run the dedicated lightweight static server with built-in Scopus API proxy:
```bash
npm run sppu
# Or run directly:
node scripts/serve-sppu.cjs
```
Then visit:
- 👉 **[http://localhost:8000](http://localhost:8000)** (or **[http://localhost:8080](http://localhost:8080)** / **[http://localhost:3000](http://localhost:3000)**)

### Option 3: Next.js Full-Stack App
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** — automatically serves the SPPU Scopus Intelligence Dashboard.

### Option 4: Python One-Liner
```bash
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🛡️ Security & API Key Handling
- Scopus API keys are **never** committed to version control.
- All secret files (`*scopuskey.text`, `.env*`, `*.key`) are strictly ignored via `.gitignore`.
- If a local API key is present (`scopuskey.text`), the server proxies live Scopus queries securely. If no key is provided, the dashboard seamlessly displays the complete verified baseline dataset without failure.

---

## 📁 Repository Structure
```
├── index.html                   # Primary dashboard entrypoint (Root)
├── style.css                    # Institutional theme & styles
├── Savitribai_Phule_Pune_...png # Official SPPU crest
├── ICARE logo.jpeg              # Accreditation logo
├── SPPU ALL CODES/              # Source dashboard files & data assets
├── dashboard/                   # Mirror package
├── public/sppu/                 # Static assets for Next.js routing
├── app/                         # Next.js App Router & API routes
│   └── api/scopus/route.ts      # Server-side Scopus proxy route
├── scripts/
│   └── serve-sppu.cjs           # Multi-port zero-config local server
└── tests/                       # Unit tests & verification suites
```
