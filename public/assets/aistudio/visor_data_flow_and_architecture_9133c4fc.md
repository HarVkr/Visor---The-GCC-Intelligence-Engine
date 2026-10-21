# VISOR: Architectural Flow & Prototype Documentation

VISOR is an AI-powered Decision Intelligence Platform designed to solve information asymmetry in India's Global Capability Centre (GCC) ecosystem. This document explains the underlying data engine, the input-to-output data flow, and the anatomy of the final Executive Command Center dashboard.

---

## 1. The Data Engine (Backend Core)

The VISOR backend is fully deterministic. It operates entirely without LLM hallucinations during computation, ensuring mathematical accuracy and defensibility for enterprise deployment.

### A. The Master Dataset (`visor_data_v1.json`)
This JSON acts as the single source of truth, structuring previously scattered ecosystem data. It contains:
*   **Talent Matrices:** Hyper-local availability scores, hiring capacities, and domains (GenAI, Cloud Core) across 9 micro-markets.
*   **Real Estate Economics:** Flex space desk rates vs. Traditional Grade-A lease rates, fit-out CapEx, and vacancy trends.
*   **State Policy & Incentives:** Digitized policy gazettes (e.g., Karnataka GCC Policy 2024-29, Maharashtra GCC Policy 2025), explicitly mapping EPF reimbursements, capital subsidies, and eligibility logic.

### B. The Scoring Logic (`visor_engine.mjs`)
*For deep technical details, please refer directly to the `visor_engine.mjs` script.*
At a high level, this pure JavaScript module performs the following:
*   **36-Month Horizon Simulation:** Projects costs and hiring ramps month-by-month.
*   **Multi-Criteria Scoring:** Normalizes options across 5 dimensions: Talent Reach ($D_1$), Net Cost Efficiency ($D_2$), Speed to Operate ($D_3$), Cluster Density ($D_4$), and State Policy Ease ($D_5$).
*   **Legal Novation Engine:** Calculates the exact economic crossover point ($H^*$) where the drag of Employer of Record (EOR) markup exceeds the fixed compliance overhead of establishing a Captive Private Limited entity.
*   **Sensitivity & Flip-Points:** Automatically tests the resilience of the #1 recommendation against 25 variations in salary premiums and scale to define at what exact thresholds the recommendation would change.

---

## 2. Data Flow Architecture (Input to Output)

The prototype operates on a strict, unidirectional data flow:

1.  **Strategic Intake (User Input):** The enterprise user configures their parameters (e.g., Domain: GenAI, Year 1 Headcount: 40, Goal: Balanced, Workspace: Flex Space).
2.  **Parameter Normalization:** The engine parses the inputs, applying specific weightings to the $D_1 - D_5$ dimensions based on the strategic goal.
3.  **Concurrent Pathway Simulation:** For *every* micro-market, the engine concurrently simulates three distinct operating models: Pure EOR, Pure Captive, and Hybrid (EOR converted to Captive).
4.  **Incentive Offset Application:** The engine scans eligibility rules (e.g., "Does this EOR setup forfeit Maharashtra's payroll subsidy?") and deducts expected incentive realizations from the gross TCO.
5.  **Ranking & Output:** The algorithm ranks the locations, extracts the "Flip Points," and pushes a massive, structured JSON object to the frontend state.
6.  **Visual Render:** The React UI strictly maps the values from the JSON object to the Visual Command Center.

---

## 3. UI Anatomy: The Visual Command Center

The final output is rendered in a high-density, low-text executive dashboard (State 3 of the UI). Here is a detailed breakdown of the dashboard elements as seen in the final output:

### A. The Executive KPI Ribbon (Top Row)
*   **Primary Recommendation:** Displays the top-ranked micro-market (e.g., *Hyderabad HITEC City*) with its composite score out of 100 and a robustness indicator across cost stress cases.
*   **36-Month Net TCO:** Shows the fully loaded mathematical projection (e.g., *$2,784,000*) down to the cost per head/year. It highlights verified state subsidy offsets (e.g., *₹42L in Telangana Subsidies*) subtracted from the total.
*   **Speed to First Team:** Projects the exact time-to-operate (e.g., *3.8 Months*). It includes a "Captive Incorp Delta," showing exactly how much time is saved by using the recommended model vs. standard incorporation.
*   **Legal & Setup Directive:** Recommends the exact operational path (e.g., *Hybrid EOR → Captive*). Crucially, it displays the algorithmically derived **Trigger Point ($H^* = 48$)**, indicating the exact month or headcount to novate contracts.

### B. Spatial & Comparative Matrix (Middle Row)
*   **Geospatial Cluster Topology (Left):** A high-contrast map visualizing the top 3 micro-markets. It overlays a 45-minute talent catchment isochrone, displays attrition baselines, and flags local policy incentives directly on the active cluster.
*   **3-City Comparative Showdown (Right):** A side-by-side $D_1-D_5$ visual matrix for the top 3 contenders (e.g., Hyderabad vs. Bengaluru vs. Pune). Instead of text, it uses horizontal progression bars comparing Talent Reach, Net Cost, Speed, Density, and Ease. It clearly tags specific ecosystem drags (e.g., Bengaluru's *High Drag* cost efficiency due to premium salaries).

### C. Zone 4: Quantitative Execution Synthesis (Bottom Row)
*   **Legal Transition Flow (Left):** A visual milestone ribbon mapping the operational phases. Phase 1 details rapid EOR inception, a central diamond marks the "Month 9 Cutover," and Phase 2 establishes the Private Limited Captive. It explicitly warns of forfeited state subsidies if the company delays incorporation.
*   **3-Year Net TCO Stacked Breakdown (Center):** A horizontal waterfall bar displaying the percentage allocation of costs. It visually proves that Talent (e.g., 84.2%) dictates strategy, dwarfing real estate (11%) and recruitment (3.8%). A distinct green bar maps the exact financial offset of state subsidies.
*   **Sensitivity Threshold Gauges (Right):** Translates complex Monte Carlo simulations into visual slider gauges. It proves the stability of the recommendation, stating exactly what must happen to change the rank (e.g., *Bengaluru must drop 11.5% in salary premium to flip ranking*, or *Scales to 85 seats before Pune takes the lead*). 