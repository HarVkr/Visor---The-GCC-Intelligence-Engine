import React, { useEffect, useState } from 'react';

interface SyncEngineState2Props {
  onComplete: () => void;
}

export const SyncEngineState2: React.FC<SyncEngineState2Props> = ({ onComplete }) => {
  const [percent, setPercent] = useState<number>(20);
  const [logs, setLogs] = useState<string[]>([
    'Compiling NASSCOM & JLL Grade-A flex desk rates for Hyderabad (HITEC City)...',
  ]);

  const allLogs = [
    'Compiling NASSCOM & JLL Grade-A flex desk rates for Hyderabad (HITEC City)...',
    'Calculating Bengaluru ORR commute attrition drag factor (22.4% baseline applied)...',
    'Evaluating Telangana ICT Policy 2021-26 statutory EPF rebate validity: ₹42,00,000 verified.',
    'Solving legal crossover threshold: H* = 48 heads at Month 9 captive transition.',
    'All 5 strategic dimensions converged. Preparing Command Center.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = Math.min(100, prev + 20);
        const logIndex = Math.floor((next / 100) * allLogs.length) - 1;
        if (logIndex >= 0 && logIndex < allLogs.length) {
          setLogs(allLogs.slice(0, logIndex + 1));
        }
        if (next >= 100) {
          clearInterval(interval);
        }
        return next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const circumference = 314;
  const strokeDashoffset = circumference - (circumference * percent) / 100;

  return (
    <section className="flex flex-col items-center justify-center min-h-[750px] w-full py-6 max-w-[1920px] mx-auto animate-in fade-in duration-300">
      <div className="card-pitch-elevated w-full max-w-4xl lg:max-w-5xl p-8 sm:p-10 lg:p-12 rounded-2xl border border-slate-200 flex flex-col items-center text-center mx-auto my-auto shadow-2xl bg-white">
        
        {/* Top Pulse Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>SYNCHRONIZING DECISION KERNEL: MONTE CARLO (10,000 RUNS)</span>
        </div>

        {/* Center Circular Progress Ring */}
        <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#2563EB"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {percent}%
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {percent >= 100 ? 'HARMONIZED' : 'PROCESSING'}
            </span>
          </div>
        </div>

        {/* Live Telemetry Stream Terminal */}
        <div className="w-full bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-left text-xs space-y-2 mb-6 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
            <span>TELEMETRY SUBSYSTEM STREAM</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              INGESTION REAL-TIME
            </span>
          </div>

          {logs.map((log, idx) => {
            const isFinal = idx === allLogs.length - 1;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 ${
                  isFinal ? 'text-emerald-400 font-semibold pt-1' : 'text-slate-300'
                }`}
              >
                {isFinal ? (
                  <span className="material-symbols-outlined text-[15px]">done_all</span>
                ) : (
                  <span className="text-blue-400 font-bold">[OK]</span>
                )}
                <span>{log}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={onComplete}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Enter Executive Command Center</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>

      </div>
    </section>
  );
};
