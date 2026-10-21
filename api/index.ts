import express, { Request, Response } from 'express';
import visorData from '../src/data/visorData.ts';
import { runVisor, DEFAULT_INPUTS } from '../src/engine/visorEngine.ts';

const app = express();
app.use(express.json());

app.get('/api/dataset', (_req: Request, res: Response) => {
  res.json({
    meta: visorData.meta,
    domains: visorData.domains,
    bands: visorData.bands,
    cities: visorData.cities,
    micro_markets: visorData.micro_markets,
    assumptions: visorData.assumptions,
    benchmarks: visorData.benchmarks,
  });
});

app.post('/api/optimize', (req: Request, res: Response) => {
  try {
    const rawInputs = { ...DEFAULT_INPUTS, ...(req.body || {}) };
    const overrides = req.body?.overrides || {};
    const result = runVisor(rawInputs, visorData, overrides);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/markets/:id', (req: Request, res: Response) => {
  const mm = visorData.micro_markets.find((m: any) => m.id === req.params.id);
  if (!mm) {
    return res.status(404).json({ error: 'Micro-market not found' });
  }
  const city = visorData.cities.find((c: any) => c.id === mm.city);
  const state = city ? visorData.states[city.state] : null;
  res.json({ market: mm, city, state });
});

app.post('/api/memo', (req: Request, res: Response) => {
  try {
    const rawInputs = { ...DEFAULT_INPUTS, ...(req.body || {}) };
    const result = runVisor(rawInputs, visorData);
    const top = result.top;
    res.json({
      title: 'Executive Board Decision Memorandum',
      topMarket: top,
      results: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
