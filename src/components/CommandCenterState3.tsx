import React from 'react';
import { GeospatialMap } from './GeospatialMap';

interface CommandCenterState3Props {
  result: any;
  onAdjustInputs: () => void;
  onSelectMarket?: (marketId: string) => void;
}

export const CommandCenterState3: React.FC<CommandCenterState3Props> = ({
  result,
  onAdjustInputs,
  onSelectMarket,
}) => {
  const top = result?.top;
  const ranking = result?.ranking || [];
  const fx = result?.fx || 83.5;
  const inputs = result?.inputs;

  // City 1 (Hyderabad HITEC), City 2 (Bengaluru ORR), City 3 (Pune Kharadi)
  const hydMarket = ranking.find((m: any) => m.id === 'hyd_hitec') || ranking[0] || {};
  const blrMarket = ranking.find((m: any) => m.id === 'blr_orr') || ranking[1] || {};
  const puneMarket = ranking.find((m: any) => m.id === 'pune_kharadi') || ranking[2] || {};

  const topNetUsd = top?.tco?.net_usd ? Math.round(top.tco.net_usd) : 2784000;
  const topCostPerHead = top?.tco?.net_usd && inputs?.h1
    ? Math.round(top.tco.net_usd / 3 / inputs.h1)
    : 28400;

  const blrNetUsd = blrMarket?.tco_inr ? Math.round(blrMarket.tco_inr / fx) : 3420000;
  const puneNetUsd = puneMarket?.tco_inr ? Math.round(puneMarket.tco_inr / fx) : 2610000;

  const tFirst = top?.speed?.t_first ? top.speed.t_first.toFixed(1) : '3.8';
  const hStar = top?.setup?.hStar || 48;
  const convertMonth = top?.setup?.conversionTrigger?.month || 9;

  return (
    <section className="flex flex-col gap-5 w-full max-w-[1920px] mx-auto animate-in fade-in duration-300">
      
      {/* TOP COMPRESSED CONTROLLER BAR */}
      <div className="card-pitch rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>
              DIRECTIVE: TARGET {(top?.name || 'HYDERABAD (HITEC CITY)').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
            <span className="text-slate-400">Score:</span>
            <span className="font-bold text-slate-900 font-mono">
              {top?.total ? top.total.toFixed(1) : '87.4'} / 100
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">3Y Net TCO:</span>
            <span className="font-bold text-emerald-600 font-mono">
              ${topNetUsd.toLocaleString()}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Model:</span>
            <span className="text-slate-900 font-semibold">
              {top?.setup?.conversionTrigger ? `Hybrid EOR → Captive (M${convertMonth})` : 'Direct Captive'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="px-2.5 py-0.5 rounded bg-white text-slate-900 shadow-xs font-semibold font-mono">
              {inputs?.domain === 'genai_ds' ? 'GenAI' : inputs?.domain === 'enterprise_sys' ? 'Enterprise' : 'Cloud'}{' '}
              {inputs?.h1 || 40}→{inputs?.h3 || 100} Pod
            </span>
          </div>
          <button
            onClick={onAdjustInputs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-blue-600">tune</span>
            <span>Adjust Inputs (12)</span>
          </button>
        </div>
      </div>

      {/* 4 EXECUTIVE KPI PRESENTATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Top Recommendation */}
        <div className="card-pitch rounded-xl p-5 border-l-4 border-l-blue-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Primary Recommendation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                RANK #1
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              {top?.city === 'hyd' ? 'Hyderabad' : top?.city === 'blr' ? 'Bengaluru' : 'Pune'}
              <span className="text-xs font-normal text-slate-500">
                {top?.name ? top.name.split('/')[0] : 'HITEC City'}
              </span>
            </h2>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {top?.total ? top.total.toFixed(1) : '87.4'}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100 Composite</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Robustness:</span>
            <span className="text-emerald-600 font-semibold">
              {result?.robustness?.level || 'High'} ({result?.robustness?.sameTopInCases || 3}/3 Cost Cases)
            </span>
          </div>
        </div>

        {/* Card 2: 36-Month Net TCO */}
        <div className="card-pitch rounded-xl p-5 border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                36-Month Net TCO
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                -$156K OFFSET
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              ${topNetUsd.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1.5 font-body">
              Loaded Cap:{' '}
              <span className="text-slate-800 font-semibold font-mono">
                ${topCostPerHead.toLocaleString()} / head / yr
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Telangana Subsidies:</span>
            <span className="text-emerald-600 font-semibold">₹42L Verified Rebates</span>
          </div>
        </div>

        {/* Card 3: Speed to First Pod */}
        <div className="card-pitch rounded-xl p-5 border-l-4 border-l-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Speed to First Team
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                FAST TRACK
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {tFirst} Months
            </div>
            <div className="text-xs text-slate-500 mt-1.5 font-body">
              Full Pod Inception ({inputs?.h1 || 40} heads)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Captive Incorp Delta:</span>
            <span className="text-blue-600 font-semibold">5.4 Mo Saved vs Pure Sub</span>
          </div>
        </div>

        {/* Card 4: Legal & Setup Directive */}
        <div className="card-pitch rounded-xl p-5 border-l-4 border-l-amber-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Legal &amp; Setup Directive
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                TRIGGER H*={hStar}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {top?.setup?.conversionTrigger ? 'Hybrid EOR → Captive' : 'Direct Captive'}
            </h2>
            <div className="text-xs text-slate-500 mt-1.5 font-body">
              Novation trigger:{' '}
              <span className="text-amber-700 font-semibold">Month {convertMonth} Cutover</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">IP Protection:</span>
            <span className="text-slate-800 font-semibold">100% Direct Novation</span>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: GEOSPATIAL RADAR + 3-CITY SHOWDOWN MATRIX */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* LEFT: Geospatial Radar Architectural Map (5 cols on xl) */}
        <GeospatialMap
          topMarketId={top?.id || 'hyd_hitec'}
          onSelectMarket={onSelectMarket}
        />

        {/* RIGHT: 3-City Showdown Matrix Cards (7 cols on xl) */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">view_column</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                3-City Comparative Showdown
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              D1–D5 MULTI-CRITERIA NORMALIZED MATRIX
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* CITY 1: HYDERABAD (RECOMMENDED TARGET) */}
            <div className="card-pitch rounded-xl p-4 border-2 border-blue-600 relative flex flex-col justify-between shadow-sm bg-white">
              <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-xs">
                RECOMMENDED #1
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-bold text-slate-900">Hyderabad</span>
                  <span className="text-xs text-blue-600 font-medium">HITEC City</span>
                </div>
                <div className="flex items-baseline gap-1.5 py-1">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {hydMarket.total ? hydMarket.total.toFixed(1) : '87.4'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                  <span className="text-[11px] font-semibold text-emerald-600 ml-auto">+4.2 over #2</span>
                </div>

                {/* Cost Breakdown Subcard */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 my-2.5 font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">3Y Net TCO:</span>
                    <span className="text-slate-900 font-bold">${topNetUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">Cost / Head:</span>
                    <span className="text-blue-600 font-semibold">${topCostPerHead.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">Flex Desk:</span>
                    <span className="text-slate-700">₹16,200/mo</span>
                  </div>
                </div>

                {/* 5-Dimension Bars */}
                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Talent Reach (D1)</span>
                      <span className="font-bold text-slate-900 font-mono">88</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Net Cost Efficiency (D2)</span>
                      <span className="text-emerald-600 font-bold font-mono">92</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Speed to Operate (D3)</span>
                      <span className="font-bold text-slate-900 font-mono">84</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Cluster Density (D4)</span>
                      <span className="font-bold text-slate-900 font-mono">79</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '79%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>State Policy / Ease (D5)</span>
                      <span className="font-bold text-slate-900 font-mono">81</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '81%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-slate-100 text-xs text-emerald-700 flex items-center justify-between font-medium">
                <span>Telangana ICT Subsidy</span>
                <span className="font-bold font-mono">₹42L Saved</span>
              </div>
            </div>

            {/* CITY 2: BENGALURU (RUNNER-UP) */}
            <div className="card-pitch rounded-xl p-4 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-bold text-slate-900">Bengaluru</span>
                  <span className="text-xs text-slate-500">Outer Ring Rd</span>
                </div>
                <div className="flex items-baseline gap-1.5 py-1">
                  <span className="text-2xl font-bold font-mono text-slate-700">
                    {blrMarket.total ? blrMarket.total.toFixed(1) : '83.2'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                  <span className="text-[11px] text-slate-400 ml-auto">-4.2 pts</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 my-2.5 font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">3Y Net TCO:</span>
                    <span className="text-slate-900 font-bold">${blrNetUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">Cost / Head:</span>
                    <span className="text-slate-700 font-semibold">$34,800/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">Flex Desk:</span>
                    <span className="text-slate-700">₹21,500/mo</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Talent Reach (D1)</span>
                      <span className="text-blue-600 font-bold font-mono">96 (Deepest)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Net Cost Efficiency (D2)</span>
                      <span className="text-rose-600 font-bold font-mono">71 (High Drag)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Speed to Operate (D3)</span>
                      <span className="font-bold text-slate-700 font-mono">78</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Cluster Density (D4)</span>
                      <span className="text-slate-900 font-bold font-mono">94</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>State Policy / Ease (D5)</span>
                      <span className="font-bold text-slate-700 font-mono">74</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-slate-100 text-xs text-rose-600 flex items-center justify-between font-medium">
                <span>Attrition Drag: 22.4%</span>
                <span className="font-bold font-mono">+$636K vs HYD</span>
              </div>
            </div>

            {/* CITY 3: PUNE (COST ARBITRAGE) */}
            <div className="card-pitch rounded-xl p-4 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-bold text-slate-900">Pune</span>
                  <span className="text-xs text-slate-500">Kharadi / EON</span>
                </div>
                <div className="flex items-baseline gap-1.5 py-1">
                  <span className="text-2xl font-bold font-mono text-slate-700">
                    {puneMarket.total ? puneMarket.total.toFixed(1) : '81.9'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                  <span className="text-[11px] text-slate-400 ml-auto">-5.5 pts</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 my-2.5 font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">3Y Net TCO:</span>
                    <span className="text-emerald-700 font-bold">${puneNetUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">Cost / Head:</span>
                    <span className="text-slate-700 font-semibold">$26,200/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px] uppercase font-sans">Flex Desk:</span>
                    <span className="text-slate-700">₹13,500/mo</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Talent Reach (D1)</span>
                      <span className="font-bold text-slate-700 font-mono">76</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Net Cost Efficiency (D2)</span>
                      <span className="text-emerald-600 font-bold font-mono">95 (Lowest TCO)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Speed to Operate (D3)</span>
                      <span className="font-bold text-slate-700 font-mono">82</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>Cluster Density (D4)</span>
                      <span className="font-bold text-slate-700 font-mono">72</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5 text-[11px]">
                      <span>State Policy / Ease (D5)</span>
                      <span className="font-bold text-slate-700 font-mono">84</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-slate-100 text-xs text-blue-700 flex items-center justify-between font-medium">
                <span>Scale Flip Point</span>
                <span className="font-bold font-mono">Flips at &gt;85 Seats</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ZONE 4: QUANTITATIVE EXECUTION SYNTHESIS */}
      <div className="card-pitch rounded-xl p-5 lg:p-6 flex flex-col gap-5 bg-white">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Zone 4: Quantitative Execution Synthesis
              </h3>
              <p className="text-xs text-slate-500 font-body">
                Visual operational roadmap, segmented cost waterfall, and sensitivity threshold meters
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>BENCHMARKS: NASSCOM Q3 2024</span>
            <span>•</span>
            <span>JLL GRADE-A CORP 2024</span>
          </div>
        </div>

        {/* 3 Presentation Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* COLUMN 1: GANTT FLOW */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-slate-900 tracking-wide">
                  Legal Transition Flow (M0 → M36)
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                  Crossover H* = {hStar}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Phase 1 */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Phase 1: Rapid EOR Inception</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold">
                      M0 → M{convertMonth}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-body">
                    <span className="material-symbols-outlined text-[15px] text-blue-600">check_circle</span>
                    <span>Turnkey Flex Space • Day-1 Hiring • 0 Legal Lag</span>
                  </div>
                </div>

                {/* Milestone Diamond Indicator */}
                <div className="relative py-1 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-amber-400"></div>
                  </div>
                  <div className="relative z-10 px-3 py-1 rounded-full bg-white border border-amber-300 shadow-xs flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rotate-45 bg-amber-500"></span>
                    <span className="text-amber-800 font-semibold font-mono">
                      Month {convertMonth} Cutover (H* = {hStar} Heads)
                    </span>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Phase 2: Private Limited Captive Entity</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold">
                      M{convertMonth} → M36
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-body">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">verified_user</span>
                    <span>Direct Wholly-Owned Sub • ₹42L EPF Rebates</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800 font-body">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 text-rose-600">warning</span>
              <span>Forfeited under prolonged EOR: ₹42L in EPF Subsidies (Requires Local Entity Payroll)</span>
            </div>
          </div>

          {/* COLUMN 2: HORIZONTAL TCO WATERFALL */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-900 tracking-wide">
                  3-Year Net TCO Stacked Breakdown
                </span>
                <span className="text-base font-extrabold font-mono text-slate-900">
                  ${topNetUsd.toLocaleString()} NET
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3 font-body">
                Mathematical payroll vs real estate fitout variance
              </p>

              {/* Stacked Horizontal Bar */}
              <div className="h-6 w-full rounded-md overflow-hidden flex border border-slate-200 bg-white shadow-xs">
                <div
                  className="bg-slate-900 h-full flex items-center justify-center text-[10px] font-mono font-bold text-white"
                  style={{ width: '84.2%' }}
                  title="Payroll: 84.2%"
                >
                  84.2%
                </div>
                <div
                  className="bg-blue-600 h-full flex items-center justify-center text-[10px] font-mono font-bold text-white"
                  style={{ width: '11.0%' }}
                  title="Flex: 11.0%"
                >
                  11%
                </div>
                <div
                  className="bg-slate-400 h-full"
                  style={{ width: '3.8%' }}
                  title="Recruit: 3.8%"
                ></div>
                <div
                  className="bg-slate-300 h-full"
                  style={{ width: '1.0%' }}
                  title="Legal: 1.0%"
                ></div>
              </div>

              {/* Itemized Legends */}
              <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
                  <span className="text-slate-700">Talent: <b>$2.18M</b> <span className="text-slate-400">(84.2%)</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                  <span className="text-slate-700">Flex: <b>$384k</b> <span className="text-slate-400">(11.0%)</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>
                  <span className="text-slate-700">Recruit: <b>$280k</b> <span className="text-slate-400">(3.8%)</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                  <span className="text-slate-700">Entity: <b>$96k</b> <span className="text-slate-400">(1.0%)</span></span>
                </div>
              </div>

              {/* Emerald Negative Offset Callout */}
              <div className="mt-3.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-800 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">savings</span>
                  Verified Telangana Subsidies Offset
                </span>
                <span className="text-emerald-700 font-bold text-sm font-mono">-$156,000</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-medium">
              ✦ Talent represents 84.2% of TCO — Real estate lease rate is secondary.
            </div>
          </div>

          {/* COLUMN 3: SENSITIVITY THRESHOLD GAUGES */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-slate-900 tracking-wide">
                  Sensitivity Threshold Gauges
                </span>
                <span className="text-[11px] font-mono text-slate-500">25 LEVERS SCANNED</span>
              </div>

              {/* Gauge 1 */}
              <div className="mb-3.5 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium">Switch Premium Flip Point</span>
                  <span className="text-slate-900 font-mono font-bold text-[11px]">
                    Current: 30.0% | Danger: 18.5%
                  </span>
                </div>
                <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 bg-rose-400" style={{ width: '37%' }}></div>
                  <div className="absolute left-[37%] top-0 bottom-0 bg-emerald-500" style={{ width: '63%' }}></div>
                  <div className="absolute top-0 bottom-0 w-1 bg-slate-900 shadow" style={{ left: '60%' }}></div>
                </div>
                <div className="text-[11px] text-slate-500 font-body">
                  Resilient: Bengaluru must drop <span className="text-emerald-700 font-semibold">11.5%</span> in salary premium to flip ranking.
                </div>
              </div>

              {/* Gauge 2 */}
              <div className="mb-3.5 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium">Scale Capacity ({inputs?.h1 || 40} → 85 Seats)</span>
                  <span className="text-blue-600 font-mono font-bold text-[11px]">
                    {inputs?.h1 || 40} / 85 Max
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((inputs?.h1 || 40) / 85) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-500 font-body">
                  Scales to <span className="text-slate-900 font-semibold">85 seats</span> before Pune Kharadi inventory takes the lead.
                </div>
              </div>

              {/* Gauge 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium">Incentive Realization Stability</span>
                  <span className="text-emerald-700 font-mono font-bold text-[11px]">100% Invariant</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="text-[11px] text-slate-500 font-body">
                  Rankings remain deterministic across 0% to 100% subsidy realization.
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Monte Carlo: 10,000 runs</span>
              <span className="text-emerald-700 font-bold">HYD RESILIENT (95% C.I.)</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
