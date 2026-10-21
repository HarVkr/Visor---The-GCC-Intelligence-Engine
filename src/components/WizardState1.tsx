import React, { useState } from 'react';
import { VisorInputs } from '../engine/visorEngine';

interface WizardState1Props {
  inputs: VisorInputs;
  onChangeInputs: (newInputs: Partial<VisorInputs>) => void;
  onRunEngine: () => void;
}

interface RoleItem {
  id: string;
  category: 'ai' | 'cloud' | 'enterprise';
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  defaultChecked: boolean;
}

const ROLES_CATALOG: RoleItem[] = [
  {
    id: 'genai_llm',
    category: 'ai',
    title: 'Generative AI & LLM Systems',
    badge: 'High Demand',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Prompt fine-tuning, RAG frameworks, model evaluation & inference clusters.',
    defaultChecked: true,
  },
  {
    id: 'data_eng',
    category: 'ai',
    title: 'Data Engineering & Analytics',
    description: 'Spark, Snowflake, dbt, real-time streaming pipelines & metadata governance.',
    defaultChecked: false,
  },
  {
    id: 'fullstack_cloud',
    category: 'cloud',
    title: 'Full-Stack Cloud Engineering',
    description: 'Distributed microservices, React/Next.js, Go/Node, event-driven backends.',
    defaultChecked: false,
  },
  {
    id: 'devsecops',
    category: 'cloud',
    title: 'Platform & DevSecOps',
    description: 'Kubernetes mesh, Terraform IaC, automated CI/CD & zero-trust pipelines.',
    defaultChecked: false,
  },
  {
    id: 'cybersecurity',
    category: 'enterprise',
    title: 'Cybersecurity & InfoSec',
    badge: 'SOC2 Type II',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Threat detection, IAM automation, cryptographic HSMs & compliance telemetry.',
    defaultChecked: false,
  },
  {
    id: 'sap_hana',
    category: 'enterprise',
    title: 'Enterprise SAP / S4 HANA',
    description: 'ABAP on HANA, supply chain modules, finance ledger reconciliation cores.',
    defaultChecked: false,
  },
  {
    id: 'embedded_iot',
    category: 'cloud',
    title: 'Embedded Systems & IoT',
    description: 'Edge firmware, C/Rust embedded, telemetry buffering & industrial gateways.',
    defaultChecked: false,
  },
  {
    id: 'quant_modeling',
    category: 'ai',
    title: 'Quantitative Modeling & Risk',
    description: 'Stochastic pricing, risk simulation, latency arbitrage & algorithmic tooling.',
    defaultChecked: false,
  },
  {
    id: 'distributed_sre',
    category: 'cloud',
    title: 'Distributed Storage & Database SRE',
    description: 'Cassandra, CockroachDB, multi-region replication and 99.999% SLA uptime.',
    defaultChecked: false,
  },
];

export const WizardState1: React.FC<WizardState1Props> = ({
  inputs,
  onChangeInputs,
  onRunEngine,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [roleCategory, setRoleCategory] = useState<string>('all');
  const [minRoleWarning, setMinRoleWarning] = useState<boolean>(false);
  const selectedRoles = inputs.selectedRoles && inputs.selectedRoles.length > 0 
    ? inputs.selectedRoles 
    : ['genai_llm'];

  const toggleRole = (id: string) => {
    if (selectedRoles.includes(id)) {
      if (selectedRoles.length <= 1) {
        setMinRoleWarning(true);
        setTimeout(() => setMinRoleWarning(false), 2500);
        return; // Enforce minimum 1 role selection
      }
    }
    setMinRoleWarning(false);
    const updated = selectedRoles.includes(id)
      ? selectedRoles.filter((r) => r !== id)
      : [...selectedRoles, id];

    // Auto-set domain based on roles if appropriate
    const hasAi = updated.some((r) => ['genai_llm', 'data_eng', 'quant_modeling'].includes(r));
    const hasEnterprise = updated.some((r) => ['cybersecurity', 'sap_hana'].includes(r));

    let domain = 'cloud_fullstack';
    if (hasAi) domain = 'genai_ds';
    else if (hasEnterprise) domain = 'enterprise_sys';

    onChangeInputs({ domain, selectedRoles: updated });
  };

  const selectRecommendedRoles = () => {
    onChangeInputs({ domain: 'genai_ds', selectedRoles: ['genai_llm'] });
  };

  const filteredRoles = ROLES_CATALOG.filter(
    (r) => roleCategory === 'all' || r.category === roleCategory
  );

  const juniorSeats = Math.round(inputs.h1 * inputs.bandMix.junior);
  const midSeats = Math.round(inputs.h1 * inputs.bandMix.mid);
  const seniorSeats = Math.max(0, inputs.h1 - juniorSeats - midSeats);

  return (
    <section className="flex flex-col items-center justify-center py-6 lg:py-8 w-full max-w-[1920px] mx-auto">
      <div className="w-full max-w-6xl xl:max-w-7xl card-pitch rounded-2xl p-6 sm:p-10 lg:p-12 flex flex-col shadow-md border border-slate-200 transition-all duration-300">
        
        {/* Stepper Header Bar */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
                State 1 • Intake Launchpad
              </span>
              <span className="text-xs text-slate-400 font-mono">Sequential Architecture Wizard</span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Step <span className="font-bold text-slate-900">{currentStep}</span> of 4
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { num: 1, label: 'Domain & Roles' },
              { num: 2, label: 'Talent Scale' },
              { num: 3, label: 'Priorities' },
              { num: 4, label: 'Real Estate & Gov' },
            ].map(({ num, label }) => {
              const isDone = num < currentStep;
              const isActive = num === currentStep;

              return (
                <button
                  key={num}
                  className="group flex flex-col gap-1.5 text-left focus:outline-none cursor-pointer"
                  onClick={() => setCurrentStep(num)}
                >
                  <div
                    className={`h-1.5 w-full rounded-full transition-all ${
                      isDone
                        ? 'bg-emerald-600'
                        : isActive
                        ? 'bg-blue-600'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isDone ? '✓' : num}
                    </span>
                    <span
                      className={`text-[11px] truncate ${
                        isActive
                          ? 'font-bold text-slate-900'
                          : isDone
                          ? 'font-semibold text-slate-700'
                          : 'font-medium text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Wizard Step Content */}
        <div className="py-6 min-h-[400px] flex flex-col justify-center">
          
          {/* STEP 1: DOMAIN ARCHITECTURE & ROLES */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Domain Architecture &amp; Specialized Capability Selection
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select target engineering practices and specialized roles required for the GCC talent hub
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono font-medium">
                    <span>{selectedRoles.length}</span> Selected
                  </span>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                    onClick={selectRecommendedRoles}
                  >
                    Select Recommended
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Disciplines' },
                  { id: 'ai', label: 'AI / GenAI & Data' },
                  { id: 'cloud', label: 'Cloud & Platform' },
                  { id: 'enterprise', label: 'Enterprise & Cyber' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setRoleCategory(cat.id)}
                    className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                      roleCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {minRoleWarning && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">info</span>
                    <span className="font-semibold">At least 1 specialized role must be selected to model your GCC talent ramp.</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-700 font-bold">1 ROLE MINIMUM</span>
                </div>
              )}

              {/* Roles Interactive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredRoles.map((role) => {
                  const isChecked = selectedRoles.includes(role.id);
                  const isSoleSelection = isChecked && selectedRoles.length === 1;

                  return (
                    <div
                      key={role.id}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={() => toggleRole(role.id)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleRole(role.id);
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-xl flex items-start gap-3.5 cursor-pointer transition-all select-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        isChecked
                          ? 'border-2 border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="accent-blue-600 h-4 w-4 mt-0.5 rounded border-slate-300 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{role.title}</span>
                          <div className="flex items-center gap-1">
                            {isSoleSelection && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                Required
                              </span>
                            )}
                            {role.badge && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${role.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                                {role.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-body">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: TALENT SCALE & SENIORITY RAMP */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Talent Ramp &amp; Seniority Distribution Calibration
                </h2>
                <p className="text-xs text-slate-500">
                  Model headcount scale from Year 1 inception through Year 3 steady-state maturation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* H1 Slider Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-xs font-sans text-slate-700 font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">group_add</span>
                      Year 1 Pod Inception (H1)
                    </span>
                    <span className="text-base font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200">
                      {inputs.h1} Seats
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={250}
                    step={5}
                    value={inputs.h1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      onChangeInputs({ h1: val, h3: Math.max(inputs.h3, val) });
                    }}
                    className="w-full accent-blue-600 bg-slate-200 h-2 rounded cursor-pointer mt-1"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Min 10</span>
                    <span className="text-emerald-600 font-medium">
                      +{(inputs.h1 / 12).toFixed(1)} hires/mo cadence
                    </span>
                    <span>250 Max</span>
                  </div>
                </div>

                {/* H3 Slider Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-xs font-sans text-slate-700 font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">trending_up</span>
                      Year 3 Steady-State (H3)
                    </span>
                    <span className="text-base font-bold text-blue-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                      {inputs.h3} Seats
                    </span>
                  </div>
                  <input
                    type="range"
                    min={inputs.h1}
                    max={250}
                    step={5}
                    value={inputs.h3}
                    onChange={(e) => onChangeInputs({ h3: parseInt(e.target.value) })}
                    className="w-full accent-blue-600 bg-slate-200 h-2 rounded cursor-pointer mt-1"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>H1 Base ({inputs.h1})</span>
                    <span className="text-blue-600 font-medium">
                      +{((inputs.h3 - inputs.h1) / 24).toFixed(1)} hires/mo cadence
                    </span>
                    <span>250 Max</span>
                  </div>
                </div>
              </div>

              {/* Seniority Distribution Bar Section */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Seniority Mix Architecture (100% Target Pool Allocation)</span>
                  <span className="text-[11px] font-mono text-blue-600">Optimal GCC Blend</span>
                </div>

                {/* Stacked Percentage Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                  <div
                    className="bg-slate-400 h-full transition-all"
                    style={{ width: `${Math.round(inputs.bandMix.junior * 100)}%` }}
                    title={`Junior ${Math.round(inputs.bandMix.junior * 100)}%`}
                  ></div>
                  <div
                    className="bg-blue-600 h-full transition-all"
                    style={{ width: `${Math.round(inputs.bandMix.mid * 100)}%` }}
                    title={`Mid-Level ${Math.round(inputs.bandMix.mid * 100)}%`}
                  ></div>
                  <div
                    className="bg-slate-900 h-full transition-all"
                    style={{ width: `${Math.round(inputs.bandMix.senior * 100)}%` }}
                    title={`Senior Principal ${Math.round(inputs.bandMix.senior * 100)}%`}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>Junior Engineers
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                      {Math.round(inputs.bandMix.junior * 100)}% ({juniorSeats} Seats)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-200 flex flex-col">
                    <span className="text-[11px] text-blue-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>Mid-Level Seniors
                    </span>
                    <span className="text-sm font-bold text-blue-700 font-mono mt-0.5">
                      {Math.round(inputs.bandMix.mid * 100)}% ({midSeats} Seats)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-900"></span>Principal &amp; Staff Leads
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                      {Math.round(inputs.bandMix.senior * 100)}% ({seniorSeats} Seats)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STRATEGIC PRIORITIES */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Strategic Optimization Goal &amp; Objective Function
                </h2>
                <p className="text-xs text-slate-500">
                  Configure how the VISOR optimization engine weights talent depth versus financial efficiency
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'balanced',
                    title: 'Balanced Index (Recommended)',
                    badge: 'DEFAULT',
                    badgeColor: 'bg-blue-100 text-blue-700',
                    desc: 'Multi-objective Pareto optimization balancing senior talent availability (40%), 3-year net TCO (35%), and setup acceleration (25%).',
                  },
                  {
                    id: 'speed',
                    title: 'Speed to Market & First Pod',
                    badge: '3.8 Mo Target',
                    badgeColor: 'text-slate-500 font-mono',
                    desc: 'Minimizes legal incorporation cycle by prioritizing turnkey flex space, managed employer of record (EOR), and rapid candidate conversion.',
                  },
                  {
                    id: 'tco',
                    title: 'Lowest 3-Year TCO Arbitrage',
                    badge: '>65% Savings',
                    badgeColor: 'text-emerald-700 bg-emerald-50 font-mono',
                    desc: 'Maximizes cost arbitrage and state incentives (EPF subsidies, tax rebates, low flex seat lease rates) to minimize total capital outflow.',
                  },
                  {
                    id: 'talent',
                    title: 'Elite Talent Depth & Retention',
                    badge: 'Tier-1 Cohorts',
                    badgeColor: 'text-slate-500 font-mono',
                    desc: 'Prioritizes cities with deepest specialization in frontier GenAI & distributed systems, accepting slightly higher compensation premiums.',
                  },
                ].map((item) => {
                  const isSelected = inputs.goal === item.id;
                  return (
                    <label
                      key={item.id}
                      onClick={() => onChangeInputs({ goal: item.id })}
                      className={`p-4 rounded-xl flex flex-col gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-2 border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="opt_goal"
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-blue-600 pointer-events-none"
                          />
                          <span className="text-sm font-bold text-slate-900">{item.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-body">
                        {item.desc}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: REAL ESTATE & GOVERNANCE */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Real Estate Model &amp; Enterprise Governance Constraints
                </h2>
                <p className="text-xs text-slate-500">
                  Determine physical workspace delivery and compliance thresholds before final optimization execution
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Turnkey Managed Flex */}
                <label
                  onClick={() => onChangeInputs({ workspace: 'flex' })}
                  className={`p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    inputs.workspace === 'flex'
                      ? 'border-2 border-blue-500 bg-blue-50/40 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="workspace"
                    checked={inputs.workspace === 'flex'}
                    onChange={() => {}}
                    className="accent-blue-600 mt-1 pointer-events-none"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">Turnkey Managed Flex Space</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        ZERO CAPEX
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-body">
                      45-day pod readiness. Fully serviced, bundled IT/facilities. Ideal for M0-M12 rapid ramp.
                    </p>
                  </div>
                </label>

                {/* Traditional Grade-A Lease */}
                <label
                  onClick={() => onChangeInputs({ workspace: 'traditional' })}
                  className={`p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                    inputs.workspace === 'traditional'
                      ? 'border-2 border-blue-500 bg-blue-50/40 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="workspace"
                    checked={inputs.workspace === 'traditional'}
                    onChange={() => {}}
                    className="accent-blue-600 mt-1 pointer-events-none"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">Traditional Grade-A Lease</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        $180/sq.ft CapEx
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-body">
                      9-year commercial lease lock-in. 6 months fitout lead time. Direct facilities control.
                    </p>
                  </div>
                </label>
              </div>

              {/* Compliance & Governance Checkboxes */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Enterprise Guardrails &amp; Constraints
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() =>
                      onChangeInputs({
                        ipSensitivity: inputs.ipSensitivity === 'high' ? 'low' : 'high',
                      })
                    }
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 cursor-pointer hover:border-blue-300"
                  >
                    <span className="font-medium">High IP Sensitivity (Scheduled Captive Novation)</span>
                    <input
                      type="checkbox"
                      checked={inputs.ipSensitivity === 'high'}
                      onChange={() => {}}
                      className="accent-blue-600 h-4 w-4 rounded border-slate-300 ml-2 pointer-events-none"
                    />
                  </label>

                  <label
                    onClick={() => onChangeInputs({ regulated: !inputs.regulated })}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 cursor-pointer hover:border-blue-300"
                  >
                    <span className="font-medium">Regulated Sector (Strict Audit Logs &amp; SOC2)</span>
                    <input
                      type="checkbox"
                      checked={inputs.regulated}
                      onChange={() => {}}
                      className="accent-blue-600 h-4 w-4 rounded border-slate-300 ml-2 pointer-events-none"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
              currentStep === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Continue to Next Step</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={onRunEngine}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Run VISOR Optimization Engine</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
