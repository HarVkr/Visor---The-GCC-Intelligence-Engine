/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WizardState1 } from './components/WizardState1';
import { SyncEngineState2 } from './components/SyncEngineState2';
import { CommandCenterState3 } from './components/CommandCenterState3';
import { BoardMemoModal } from './components/BoardMemoModal';
import { DEFAULT_INPUTS, runVisor, VisorInputs } from './engine/visorEngine';
import visorData from './data/visorData';

export default function App() {
  const [currentState, setCurrentState] = useState<number>(1);
  const [inputs, setInputs] = useState<VisorInputs>({
    ...DEFAULT_INPUTS,
    domain: 'genai_ds',
    selectedRoles: ['genai_llm'],
  });
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);
  const [fxRate, setFxRate] = useState<number>(83.5);
  const [results, setResults] = useState<any>(null);

  // Compute optimization results
  const executeOptimization = async (currentInputs: VisorInputs) => {
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentInputs),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setResults(json.data);
          if (json.data.fx) setFxRate(json.data.fx);
          return;
        }
      }
    } catch {
      // Fallback to local deterministic execution engine
    }
    const local = runVisor(currentInputs, visorData);
    setResults(local);
    if (local.fx) setFxRate(local.fx);
  };

  useEffect(() => {
    executeOptimization(inputs);
  }, [inputs]);

  const handleUpdateInputs = (partial: Partial<VisorInputs>) => {
    setInputs((prev) => ({ ...prev, ...partial }));
  };

  const handleRunEngine = () => {
    executeOptimization(inputs);
    setCurrentState(2);
  };

  return (
    <div className="bg-slate-50 font-sans antialiased text-slate-800 min-h-screen relative flex flex-col justify-between selection:bg-blue-100 selection:text-blue-700">
      {/* Top Institutional Chrome */}
      <Header
        currentState={currentState}
        onSelectState={(state) => setCurrentState(state)}
        fxRate={fxRate}
        onOpenMemo={() => setIsMemoOpen(true)}
      />

      {/* Main Multi-State Workspace */}
      <main className="relative z-10 w-full px-4 lg:px-8 py-5 flex-1 flex flex-col justify-start max-w-[1920px] mx-auto">
        {currentState === 1 && (
          <WizardState1
            inputs={inputs}
            onChangeInputs={handleUpdateInputs}
            onRunEngine={handleRunEngine}
          />
        )}

        {currentState === 2 && (
          <SyncEngineState2
            onComplete={() => setCurrentState(3)}
          />
        )}

        {currentState === 3 && (
          <CommandCenterState3
            result={results || runVisor(inputs, visorData)}
            onAdjustInputs={() => setCurrentState(1)}
            onSelectMarket={(marketId) => console.log('Inspecting cluster:', marketId)}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="w-full border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 font-sans">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-[1920px] mx-auto gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">VISOR</span>
            <span>·</span>
            <span>Global Capability Centre Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>DATA PROVENANCE: JLL &amp; NASSCOM VERIFIED</span>
            <span>·</span>
            <span>TELANGANA ICT POLICY 2021-26</span>
          </div>
        </div>
      </footer>

      {/* Executive Board Decision Memorandum Modal */}
      <BoardMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        result={results || runVisor(inputs, visorData)}
      />
    </div>
  );
}
