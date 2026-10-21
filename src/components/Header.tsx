import React from 'react';

interface HeaderProps {
  currentState: number;
  onSelectState: (state: number) => void;
  fxRate: number;
  onOpenMemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentState,
  onSelectState,
  fxRate,
  onOpenMemo,
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Brand Zone */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => onSelectState(0)}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[20px]">insights</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-base font-extrabold tracking-tight text-slate-900">
                VISOR
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                v2.4 KERNEL
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block uppercase">
              Global Capability Centre Intelligence Cockpit
            </span>
          </div>
        </button>
      </div>

      {/* State Architecture Switcher */}
      <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 shadow-inner">
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
            currentState === 0
              ? 'font-semibold bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'font-medium text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => onSelectState(0)}
        >
          <span className={`material-symbols-outlined text-[16px] ${currentState === 0 ? 'text-blue-600' : 'text-slate-500'}`}>
            corporate_fare
          </span>
          <span className="font-sans">Overview</span>
        </button>

        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
            currentState === 1
              ? 'font-semibold bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'font-medium text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => onSelectState(1)}
        >
          <span className={`material-symbols-outlined text-[16px] ${currentState === 1 ? 'text-blue-600' : 'text-slate-500'}`}>
            tune
          </span>
          <span className="hidden md:inline font-sans">1. Intake</span> Launchpad
        </button>

        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
            currentState === 2
              ? 'font-semibold bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'font-medium text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => onSelectState(2)}
        >
          <span className={`material-symbols-outlined text-[16px] ${currentState === 2 ? 'text-blue-600' : 'text-slate-500'}`}>
            sync
          </span>
          <span className="hidden md:inline font-sans">2. Engine</span> Sync
        </button>

        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
            currentState === 3
              ? 'font-semibold bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'font-medium text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => onSelectState(3)}
        >
          <span className={`material-symbols-outlined text-[16px] ${currentState === 3 ? 'text-blue-600' : 'text-slate-500'}`}>
            dashboard
          </span>
          <span className="hidden md:inline font-sans">3. Visual</span> Command Center
        </button>
      </div>

      {/* Action Hub & Quick Switches */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-500">FX:</span>
          <span className="text-slate-800 font-semibold tabular-nums">1 USD = ₹{fxRate.toFixed(2)}</span>
        </div>

        <button
          onClick={onOpenMemo}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs tracking-tight shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">description</span>
          <span>Export Board Memo</span>
        </button>
      </div>
    </header>
  );
};
