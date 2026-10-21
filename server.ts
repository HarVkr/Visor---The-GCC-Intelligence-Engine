import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import visorData from './src/data/visorData.ts';
import { runVisor, DEFAULT_INPUTS, toUSD } from './src/engine/visorEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// API: Get Full Dataset or Metadata
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

// API: Run VISOR Optimization Engine
app.post('/api/optimize', (req: Request, res: Response) => {
  try {
    const rawInputs = { ...DEFAULT_INPUTS, ...(req.body || {}) };
    const overrides = req.body?.overrides || {};
    
    // Domain role mapping if provided
    if (req.body?.selectedRoles && req.body.selectedRoles.length > 0) {
      // Keep domain aligned or preserve custom selected role weights
    }

    const result = runVisor(rawInputs, visorData, overrides);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error('Optimization error:', err);
    res.status(500).json({ success: false, error: err.message || 'Optimization failed' });
  }
});

// API: Micro-market detail
app.get('/api/markets/:id', (req: Request, res: Response) => {
  const mm = visorData.micro_markets.find((m: any) => m.id === req.params.id);
  if (!mm) {
    return res.status(404).json({ error: 'Micro-market not found' });
  }
  const city = visorData.cities.find((c: any) => c.id === mm.city);
  const state = city ? visorData.states[city.state] : null;
  res.json({
    market: mm,
    city,
    state,
  });
});

// API: Generate Board Memo Dossier
app.post('/api/memo', (req: Request, res: Response) => {
  try {
    const rawInputs = { ...DEFAULT_INPUTS, ...(req.body || {}) };
    const result = runVisor(rawInputs, visorData);
    const top = result.top;
    
    res.json({
      title: 'Executive Board Decision Memorandum',
      classification: 'CONFIDENTIAL // INDIA GCC ESTABLISHMENT ARCHITECTURE',
      directive: `Recommend immediate capital authorization for deployment in ${top?.name || 'Hyderabad'} utilizing a Turnkey Managed Flex workplace, executing through a ${top?.setup?.recommended || 'Hybrid EOR-to-Captive'} legal transition at Month ${top?.setup?.conversionTrigger?.month || 9} (H* = ${top?.setup?.hStar || 48} heads).`,
      topMarket: top,
      results: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VISOR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
