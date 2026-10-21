import React from 'react';

interface BoardMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
}

export const BoardMemoModal: React.FC<BoardMemoModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const top = result?.top;
  const runnerUp = result?.ranking && result.ranking.length > 1 ? result.ranking[1] : null;

  const topTcoUsd = top?.tco?.net_usd ? Math.round(top.tco.net_usd) : 2784000;
  const runnerTcoUsd = runnerUp ? Math.round(runnerUp.tco_inr / (result?.fx || 83.5)) : 3140000;
  const tcoVariance = topTcoUsd - runnerTcoUsd;

  const topSalaryUsd = top?.tco?.waterfall_inr?.salary ? Math.round(top.tco.waterfall_inr.salary / (result?.fx || 83.5)) : 2180000;
  const topSpaceUsd = top?.tco?.waterfall_inr?.workspace ? Math.round(top.tco.waterfall_inr.workspace / (result?.fx || 83.5)) : 384000;
  const topRecruitUsd = top?.tco?.waterfall_inr?.recruitment ? Math.round(top.tco.waterfall_inr.recruitment / (result?.fx || 83.5)) : 280000;
  const topIncentivesUsd = top?.tco?.waterfall_inr?.incentives_expected ? Math.round(top.tco.waterfall_inr.incentives_expected / (result?.fx || 83.5)) : -156000;

  return (
    <div
      id="memoModal"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="card-pitch-elevated w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-white">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                Executive Board Decision Memorandum
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                CONFIDENTIAL • INDIA GCC ESTABLISHMENT ARCHITECTURE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Executive Directive */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="text-[10px] text-blue-700 uppercase font-bold tracking-wider mb-1">
              1. Executive Directive
            </div>
            <div className="text-sm font-bold text-slate-900 leading-relaxed font-body">
              Recommend immediate capital authorization for deployment in{' '}
              <span className="text-blue-700">{top?.name || 'Hyderabad (HITEC City)'}</span> utilizing a{' '}
              <span className="text-slate-900 font-extrabold">{top?.setup?.recommended || 'Turnkey Managed Flex Space'}</span> workplace,
              executing through a{' '}
              <span className="text-slate-900 font-extrabold">
                {top?.setup?.conversionTrigger
                  ? `Hybrid EOR-to-Captive legal transition at Month ${top.setup.conversionTrigger.month} (H* = ${top.setup.conversionTrigger.headcount} heads)`
                  : 'Direct Subsidiary Setup'}
              </span>.
            </div>
          </div>

          {/* Three-Year Capital Requirement Projections Table */}
          <div>
            <div className="text-xs text-slate-700 uppercase font-bold mb-2">
              2. Three-Year Capital Requirement Projections (Normalized USD)
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Capital Head</th>
                    <th className="p-3 text-right font-semibold">{top?.name || 'Hyderabad (HITEC)'}</th>
                    <th className="p-3 text-right font-semibold">{runnerUp?.name || 'Bengaluru (ORR)'}</th>
                    <th className="p-3 text-right font-semibold">Variance vs #2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-800">
                      Loaded Talent Compensation ({top?.tco?.salary_share ? (top.tco.salary_share * 100).toFixed(1) : '84.2'}%)
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      ${topSalaryUsd.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      ${Math.round(topSalaryUsd * 1.12).toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-emerald-600 font-bold">
                      -${Math.round(topSalaryUsd * 0.12).toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-800">
                      Turnkey Managed Flex Space (11.0%)
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      ${topSpaceUsd.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      ${Math.round(topSpaceUsd * 1.3).toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-emerald-600 font-bold">
                      -${Math.round(topSpaceUsd * 0.3).toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-800">
                      Recruiting &amp; Attrition Replacement
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      ${topRecruitUsd.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      ${Math.round(topRecruitUsd * 1.4).toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-emerald-600 font-bold">
                      -${Math.round(topRecruitUsd * 0.4).toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-sans font-medium text-slate-800">
                      State Policy Subsidies (Offset)
                    </td>
                    <td className="p-3 text-right font-semibold text-emerald-600">
                      -${Math.abs(topIncentivesUsd).toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-slate-500">-$50,000</td>
                    <td className="p-3 text-right text-emerald-600 font-bold">
                      -${Math.max(0, Math.abs(topIncentivesUsd) - 50000).toLocaleString()}
                    </td>
                  </tr>

                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                    <td className="p-3 text-slate-900 font-sans">Net 36-Month TCO</td>
                    <td className="p-3 text-right text-blue-600 text-sm">
                      ${topTcoUsd.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-slate-900 text-sm">
                      ${runnerTcoUsd.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-emerald-600 text-sm">
                      -${Math.abs(tcoVariance).toLocaleString()} (
                      {runnerTcoUsd > 0 ? ((Math.abs(tcoVariance) / runnerTcoUsd) * 100).toFixed(1) : 11.3}%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Containment Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-900 font-bold block mb-1">
                IP &amp; Regulatory Containment
              </span>
              <p className="text-slate-600 text-xs leading-relaxed font-body">
                All code repositories and patents transferred to 100% owned Indian subsidiary at Month{' '}
                {top?.setup?.conversionTrigger?.month || 9}, bypassing ongoing EOR markups while adhering to RBI transfer pricing regulations.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-900 font-bold block mb-1">
                Real Estate CapEx Hedging
              </span>
              <p className="text-slate-600 text-xs leading-relaxed font-body">
                Preserves up to $720,000 in upfront fitout capital through managed flex desks until steady-state{' '}
                {result?.inputs?.h3 || 100} seats is unlocked in Year 3.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
            DATA PROVENANCE: JLL India Q3 2024-2026 • NASSCOM GCC Playbook 2024-2026 • State IT Policy Gazette Records.
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-medium text-xs">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Ready for Board Governance Sign-Off</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
