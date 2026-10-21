# VISOR • Global Capability Centre (GCC) Intelligence Cockpit

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)

**VISOR** is an institutional Decision Intelligence Platform architected to eliminate information asymmetry in India's Global Capability Centre (GCC) establishment ecosystem. It provides mathematically rigorous, deterministic multi-criteria location optimization, talent ramp simulation, legal transition modeling, and 36-month Net TCO projections for C-suite and board-level decision-makers.

---

## 1. Executive Summary & Core Philosophy

Setting up an Indian GCC (Global Capability Centre) historically required months of fragmented advisory reports, conflicting broker estimates, and subjective location scoring. VISOR operationalizes this process through:

1. **Zero-Hallucination Deterministic Engine**: All scoring, financial compounding, and capacity formulas are pure mathematical functions. The same inputs produce identical, auditable outputs.
2. **Master Dataset Single-Source-of-Truth**: Ingests hyper-local real estate benchmarks (JLL, CBRE), talent depth and attrition baselines (NASSCOM), and statutory state policy incentives (Telangana, Karnataka, Maharashtra, Tamil Nadu).
3. **Legal Novation Threshold ($H^*$)**: Algorithmically calculates the exact headcount and cutover month where the ongoing margin drag of Employer of Record (EOR) hiring exceeds the fixed regulatory cost of maintaining a private limited captive entity.
4. **Resilience & Sensitivity Analysis**: Scans 25 independent levers (salary premiums, attrition drags, headcount ramps) to identify the exact tipping points at which secondary contenders overtake the primary recommendation.

---

## 2. System Architecture & Data Flow

VISOR executes a strict, unidirectional data pipeline from strategic parameter intake to board-level synthesis:

```
┌────────────────────────────────────────────────────────┐
│  1. Strategic Intake (User Launchpad Wizard)           │
│     - Domain & Roles (GenAI, Cloud Core, Enterprise)   │
│     - Headcount Ramp (Year 1 H1 → Year 3 H3)           │
│     - Seniority Band Mix (Junior / Mid / Senior)       │
│     - Optimization Goal (Balanced / Speed / TCO / Tal) │
│     - Workplace Model (Turnkey Flex vs Grade-A Lease)  │
│     - Governance Constraints (IP Sensitivity / SOC2)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  2. Parameter Normalization & Constraint Resolution    │
│     - Clamping & validation (10 <= H1 <= H3 <= 250)    │
│     - Dynamic D1-D5 objective function weight vector   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  3. The Master Dataset (`visor_data_v1.json`)          │
│     - 9 Micro-Markets across 4 States (TG, KA, MH, TN) │
│     - Median salaries & increments by Domain and Band  │
│     - Hiring capacities, notice days, switch premiums  │
│     - Digitized statutory state incentive rules        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  4. Concurrent Pathway Simulation (36-Month Horizon)   │
│     - Path A: Pure EOR (No conversion)                 │
│     - Path B: Pure Captive Private Limited             │
│     - Path C: Hybrid (EOR inception → Captive cutover) │
│     - Cost components: Salary, Flex/Lease, Recruitment,│
│       Attrition replacement, Corporate overhead        │
│     - Incentive offsets: Capex, rent, training, EPF    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  5. Multi-Criteria Scoring & Sensitivity Ranking       │
│     - D1: Talent Reach & Market Availability           │
│     - D2: Net Cost Efficiency                          │
│     - D3: Speed to Operate & Ramp Lead Time            │
│     - D4: Ecosystem Cluster Density                    │
│     - D5: State Policy & Execution Ease                │
│     - Monte Carlo sensitivity scan (10,000 runs)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  6. Executive Command Center & Board Memorandum        │
│     - Top Recommendation Directive & KPI Ribbon        │
│     - Accurate Geospatial Cluster Topology Map         │
│     - 3-City Comparative Showdown Matrix               │
│     - Legal Transition Gantt Ribbon & TCO Waterfall    │
│     - PDF / Print Ready Board Decision Memorandum      │
└────────────────────────────────────────────────────────┘
```

---

## 3. Database Strategy: JSON Master Dataset vs. Production Database

A critical engineering question for VISOR is how data is stored, versioned, and served:

### Why the Prototype Uses a Structured JSON Master Document (`visor_data_v1.json`)
- **Domain Reality**: Unlike transactional B2C apps with millions of user writes, GCC advisory data is **analyst-curated, read-heavy benchmark intelligence** updated on a quarterly or annual cadence (e.g., state budget gazettes, quarterly JLL reports).
- **Auditability & Determinism**: Treating the dataset as a versioned document allows board members, auditors, and advisors to reproduce recommendations for any historical date with zero environmental variance.
- **Zero Latency & Zero Cold-Start Cost**: In-memory JSON evaluation computes complex 36-month compounding across 9 micro-markets and 3 operating models in **< 15 milliseconds**, completely eliminating database round-trips.
- **Portability**: The application runs completely self-contained without requiring external database provisioning.

### Migration Roadmap to a Standard Production Database

When expanding from a prototype to a multi-tenant enterprise SaaS platform, transition through these three architectural phases:

| Phase | Architecture | Storage Engine | When to Use |
| :--- | :--- | :--- | :--- |
| **Phase 1 (Current)** | In-Memory Master Document | Version-controlled JSON (`visor_data_v1.json`) | 0→1 Prototype, Pitch Decks, Isolated Client Engagements |
| **Phase 2 (Collaborative)** | Document Store / NoSQL | MongoDB / Google Firestore | When multiple research analysts need a CMS/Admin UI to update city rents, salaries, and policy gazettes in real time without git commits. |
| **Phase 3 (Enterprise Multi-Tenant)** | Relational Database | PostgreSQL + Drizzle / Prisma ORM | When supporting user authentication, saved company scenarios, customized salary bands per client, team sharing, and audit logging. |

#### Recommended PostgreSQL Schema (for Phase 3)
```sql
-- Cities & States
CREATE TABLE states (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    execution_ease JSONB NOT NULL
);

CREATE TABLE cities (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_code VARCHAR(2) REFERENCES states(code),
    tier VARCHAR(50) NOT NULL
);

-- Micro Markets (Real Estate)
CREATE TABLE micro_markets (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(10) REFERENCES cities(id),
    name VARCHAR(150) NOT NULL,
    flex_cost_desk_monthly NUMERIC NOT NULL,
    lease_rate_psf_monthly NUMERIC NOT NULL,
    fitout_capex_psf NUMERIC NOT NULL,
    vacancy_pct NUMERIC NOT NULL,
    talent_reach_index INT NOT NULL,
    anchors JSONB NOT NULL
);

-- Talent & Compensation Matrices
CREATE TABLE salary_benchmarks (
    id SERIAL PRIMARY KEY,
    city_id VARCHAR(10) REFERENCES cities(id),
    domain VARCHAR(50) NOT NULL,
    seniority_band VARCHAR(20) NOT NULL,
    ctc_median_lpa NUMERIC NOT NULL,
    annual_increment_pct NUMERIC NOT NULL
);

-- State Incentive Policies
CREATE TABLE policy_incentives (
    id VARCHAR(50) PRIMARY KEY,
    state_code VARCHAR(2) REFERENCES states(code),
    policy_name VARCHAR(200) NOT NULL,
    benefit_type VARCHAR(100) NOT NULL,
    value_model JSONB NOT NULL,
    eligibility JSONB NOT NULL,
    claim_probability NUMERIC NOT NULL,
    lag_months INT NOT NULL,
    valid_until VARCHAR(50)
);

-- User Saved Scenarios
CREATE TABLE user_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    parameters JSONB NOT NULL,
    computed_output JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Repository Structure

```
├── package.json                      # Dependencies and scripts (Express, Vite, React 19, Tailwind)
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration with Tailwind CSS v4
├── server.ts                         # Full-stack entry point: Express API + Vite middlewares
├── metadata.json                     # Application metadata and capabilities
├── index.html                        # Application entry point with fonts & meta tags
├── src/
│   ├── main.tsx                      # React root mounter
│   ├── App.tsx                       # Core application state orchestrator
│   ├── index.css                     # Global styles, fonts, dot-grid, print media rules
│   ├── components/
│   │   ├── Header.tsx                # Institutional top bar, state switcher, FX indicator
│   │   ├── WizardState1.tsx          # 4-Step Intake Launchpad (Roles, Scale, Goals, Gov)
│   │   ├── SyncEngineState2.tsx      # Circular SVG progress ring & real-time telemetry log
│   │   ├── CommandCenterState3.tsx   # Executive Dashboard (KPIs, 3-City Showdown, Zone 4)
│   │   ├── GeospatialMap.tsx         # Accurate Peninsular India SVG Vector Radar Map
│   │   └── BoardMemoModal.tsx        # Confidential Board Decision Memorandum with print PDF
│   ├── data/
│   │   └── visorData.ts              # Master dataset loader and typed accessor
│   └── engine/
│       └── visorEngine.ts            # Pure computational scoring, simulation, and flip-point engine
└── public/
    └── assets/aistudio/              # Source datasets, reference scripts, and architectural docs
```

---

## 5. Local Development Setup

### Prerequisites
- Node.js version `>= 18.x`
- npm version `>= 9.x`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/visor-gcc-platform.git
cd visor-gcc-platform

# Install dependencies
npm install

# Start the full-stack development server
npm run dev
```

The application will be live at `http://localhost:3000`.

### Available Scripts
- `npm run dev`: Boots Express server with Vite middleware on port 3000.
- `npm run build`: Compiles TypeScript and creates optimized production client assets in `dist/`.
- `npm run start`: Runs the production server (`node server.ts`).
- `npm run lint`: Validates code for type safety (`tsc --noEmit`).

---

## 6. Deployment Guide

Because VISOR features an Express backend (`server.ts`) serving API endpoints alongside a React SPA client, it can be deployed to any modern containerized or serverless hosting provider:

### Option A: Google Cloud Run (Recommended for Enterprise)
1. **Create a `Dockerfile`**:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:20-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   ENV PORT=3000
   COPY package*.json ./
   RUN npm ci --only=production
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/server.ts ./
   COPY --from=builder /app/src ./src
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/tsconfig.json ./
   RUN npm install -g tsx
   EXPOSE 3000
   CMD ["tsx", "server.ts"]
   ```
2. **Build and Deploy**:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/visor-app
   gcloud run deploy visor-app --image gcr.io/YOUR_PROJECT_ID/visor-app --platform managed --port 3000 --allow-unauthenticated
   ```

### Option B: Render / Railway / Fly.io
1. Connect your GitHub repository.
2. Configure Environment:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx tsx server.ts`
   - **Port**: `3000`

### Option C: Vercel (Serverless Split)
If deploying to Vercel, the pure static frontend can be deployed from `dist/` with the `/api` routes deployed as Vercel Serverless Functions (`api/optimize.ts`, `api/dataset.ts`).

---

## 7. Board Decision Memorandum & Export

VISOR includes built-in board governance reporting:
1. Click **"Export Board Memo"** in the top navigation bar.
2. Review the synthesized executive directive, 3-year normalized financial table, and risk containment matrix.
3. Click **"Print / Save PDF Dossier"** to trigger formatted document printing styled specifically via `@media print` CSS rules.

---

## 8. License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
