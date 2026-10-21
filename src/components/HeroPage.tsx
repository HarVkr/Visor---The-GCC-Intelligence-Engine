import React from 'react';
import { motion } from 'motion/react';

interface HeroPageProps {
  onLaunchCockpit: () => void;
  onOpenMemo: () => void;
  result?: any;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  onLaunchCockpit,
  onOpenMemo,
  result,
}) => {
  const top = result?.top;
  const topScore = top?.total ? top.total.toFixed(1) : '87.4';
  const topName = top?.name ? top.name.split('(')[0].trim() : 'Hyderabad (HITEC City)';
  const tcoDisplay = top?.tco?.net_usd
    ? '$' + Math.round(top.tco.net_usd).toLocaleString()
    : '$2,784,000';

  return (
    <div className="w-full flex flex-col items-center justify-start pb-16">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden">
        
        {/* Subtle Background Glow & Grid Accent */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[800px] h-[400px] bg-gradient-to-tr from-blue-50/50 via-indigo-50/30 to-transparent blur-3xl rounded-full pointer-events-none"></div>
        </div>

        {/* Top Institutional Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-6 text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="font-semibold text-slate-800 tracking-tight font-sans">
            Institutional Decision Engine for India GCC Establishment
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[11px] text-blue-600 font-bold uppercase">
            v2.4 Kernel
          </span>
        </motion.div>

        {/* Sovereign Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl font-sans"
        >
          Precision Decision Intelligence for Global Capability Centres
        </motion.h1>

        {/* High-Conviction Narrative Lead */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-body"
        >
          Eliminate advisory bias and spreadsheet friction. VISOR's deterministic computational engine models 36-month loaded TCO, talent ramp velocity, and legal transition thresholds across India's premier tech clusters.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <button
            onClick={onLaunchCockpit}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Launch Decision Cockpit</span>
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>

          <button
            onClick={onOpenMemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              description
            </span>
            <span>View Sample Board Memo</span>
          </button>
        </motion.div>

        {/* Live Interactive Preview Snippet / Hero Deck Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="w-full max-w-5xl mt-12 card-pitch-elevated rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white text-left shadow-xl relative"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[22px]">insights</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Live Engine Simulation Result
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    DETERMINISTIC
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-body">
                  Synthesized across 9 Micro-Markets • NASSCOM &amp; JLL Benchmarks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onLaunchCockpit}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Adjust Parameters</span>
                <span className="material-symbols-outlined text-[15px] text-blue-600">tune</span>
              </button>
            </div>
          </div>

          {/* Mini Interactive Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                Top Recommendation
              </span>
              <div className="text-lg font-bold text-slate-900 truncate">
                {topName}
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-blue-600 font-mono">{topScore}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                36-Month Net TCO
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {tcoDisplay}
              </div>
              <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check</span>
                <span>State incentives factored</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                Speed to First Team
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {top?.speed?.t_first ? top.speed.t_first.toFixed(1) : '3.8'} Months
              </div>
              <div className="mt-2 text-xs text-blue-600 font-medium">
                Day-1 flex space onboarding
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
                Legal Crossover (H*)
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono">
                H* = {top?.setup?.hStar || 48} Heads
              </div>
              <div className="mt-2 text-xs text-amber-700 font-medium">
                Month {top?.setup?.conversionTrigger?.month || 9} cutover to Captive
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= 4 QUANTITATIVE PROOF STATS ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-y border-slate-200/80 bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              9
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Micro-Markets Modeled
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Hyderabad, Bengaluru, Pune, Chennai</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              25
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Sensitivity Levers
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Monte Carlo stress tested across 10k runs</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tracking-tight">
              &lt; 15ms
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Simulation Latency
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Instant pure functional execution</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight">
              100%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Auditability
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Zero hallucination, deterministic math</p>
          </div>
        </div>
      </section>

      {/* ================= 3 SYSTEM PILLARS ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
            Strategic Value Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 font-sans">
            Engineered for Board-Level Certainty
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-body">
            Replaces arbitrary broker pitches with mathematically sound location, legal, and fiscal intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="card-pitch rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-300 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">analytics</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                Deterministic Multi-Market Scoring
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Evaluates candidates across 5 normalized dimensions: Talent Reach ($D_1$), Net Cost Efficiency ($D_2$), Speed to Operate ($D_3$), Cluster Density ($D_4$), and Policy Ease ($D_5$). No black-box algorithms or AI hallucinations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>Multi-criteria Pareto optimization</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="card-pitch rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-300 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                Algorithmic Legal Novation ($H^*$)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Calculates the exact economic crossover point where the ongoing markup of Employer of Record (EOR) hiring exceeds the regulatory compliance cost of a wholly-owned private limited subsidiary.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>Dynamic Month 6-18 cutover timing</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="card-pitch rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-300 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                Digitized Statutory Policy Arbitrage
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Directly maps eligibility rules from the Telangana ICT Policy, Karnataka GCC Policy 2024-29, and Maharashtra GCC Policy 2025. Proves which subsidies require own-payroll to prevent forfeited capital.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>EPF, skilling, and capex deductions</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3-STAGE WORKFLOW SHOWCASE ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-pitch rounded-2xl p-8 sm:p-10 border border-slate-200 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
            <div>
              <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">
                Workflow Architecture
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 font-sans">
                How the VISOR Decision Cockpit Operates
              </h3>
            </div>
            <button
              onClick={onLaunchCockpit}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span>Try Live in Cockpit</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center font-mono mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">1. Intake Launchpad</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-body">
                Select from 9 specialized capability disciplines, tune Year 1 to Year 3 headcount ramps, adjust seniority mix, and define governance guardrails.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center font-mono mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">2. Synchronization Engine</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-body">
                Executes Monte Carlo sensitivity analysis across 10,000 iterations, simultaneously simulating pure EOR, pure captive, and hybrid conversion curves.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center font-mono mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">3. Command Center &amp; Memo</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-body">
                Access interactive cluster maps, 3-city showdown matrices, TCO waterfalls, and export a confidential, print-ready Board Memorandum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM EXECUTIVE CTA BANNER ================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="card-pitch-elevated rounded-2xl p-8 sm:p-12 border border-slate-200 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          <div className="max-w-xl z-10">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Ready for Evaluation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 font-sans text-white">
              Model your India GCC expansion with mathematical certainty
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-body">
              Launch the prototype now to simulate headcount ramps, inspect micro-market economics, and generate your board dossier.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full sm:w-auto">
            <button
              onClick={onLaunchCockpit}
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Launch Prototype</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                bolt
              </span>
            </button>
          </div>

          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
        </div>
      </section>

    </div>
  );
};
