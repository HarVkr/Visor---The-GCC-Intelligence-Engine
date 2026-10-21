// =====================================================================
// VISOR engine v0.1  (implements VISOR Model Spec v0.1)
// Pure functions. No DOM, no network, no randomness. Same inputs -> same outputs.
// All money is INR internally. Convert for display with toUSD().
// Spec section map: 6 ramp | 7 time-to-operate | 8 TCO | 9 incentives |
// 10 setup model | 11 scoring | 12 filters | 13 ranking | 14 flip points
// =====================================================================

export const HORIZON = 36;
export const CASES = ['optimistic', 'base', 'conservative'];
export const RISK_TO_CASE = { aggressive: 'optimistic', balanced: 'base', conservative: 'conservative' };
export const CONVERT_MONTHS = [6, 9, 12, 18];
export const GOAL_WEIGHTS = {
  balanced: { talent: 0.30, cost: 0.25, speed: 0.20, eco: 0.15, ease: 0.10 },
  speed:    { talent: 0.25, cost: 0.15, speed: 0.35, eco: 0.10, ease: 0.15 },
  tco:      { talent: 0.25, cost: 0.45, speed: 0.10, eco: 0.05, ease: 0.15 },
  talent:   { talent: 0.45, cost: 0.10, speed: 0.10, eco: 0.25, ease: 0.10 },
};
export const DEFAULT_INPUTS = {
  domain: 'cloud_fullstack', h1: 40, h3: 100,
  bandMix: { junior: 0.35, mid: 0.45, senior: 0.20 },
  goal: 'balanced', workspace: 'flex', budgetCapInr: null,
  risk: 'balanced', regulated: false, ipSensitivity: 'low', includeDelay: null,
};

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sum = (a) => a.reduce((s, x) => s + x, 0);
const zeros = () => Array(HORIZON).fill(0);
const lowerBetter = (x, best, worst) => 100 * clamp((worst - x) / (worst - best), 0, 1);
const higherBetter = (x, worst, best) => 100 * clamp((x - worst) / (best - worst), 0, 1);
export const toUSD = (inr, fx) => inr / fx;

// Pick low/base/high from a field envelope. goodHigh = true when a higher value helps the buyer.
export function pick(env, caseName, goodHigh = false) {
  if (typeof env === 'number') return env;
  if (env && env.value !== undefined) return env.value;
  if (caseName === 'base') return env.base;
  const wantHigh = (caseName === 'optimistic') === goodHigh;
  return wantHigh ? env.high : env.low;
}

export function normalizeInputs(raw) {
  const i = { ...DEFAULT_INPUTS, ...raw };
  i.h1 = clamp(Math.round(i.h1), 10, 250);
  i.h3 = clamp(Math.round(i.h3), i.h1, 250);
  const mixSum = sum(Object.values(i.bandMix));
  i.bandMix = Object.fromEntries(Object.entries(i.bandMix).map(([k, v]) => [k, v / mixSum]));
  if (!GOAL_WEIGHTS[i.goal]) throw new Error('unknown goal ' + i.goal);
  if (!RISK_TO_CASE[i.risk]) throw new Error('unknown risk ' + i.risk);
  if (i.includeDelay === null || i.includeDelay === undefined) i.includeDelay = i.goal === 'speed';
  return i;
}

function makeParams(data, caseName, ov) {
  const a = data.assumptions;
  const g = (k, good = false) => (ov[k] !== undefined ? ov[k] : pick(a[k], caseName, good));
  return {
    case: caseName,
    fx: g('fx_inr_per_usd'),
    switchPremium: g('switch_premium'),
    load: g('load_factor'),
    agencyShare: g('agency_share_of_hires'),
    agencyFee: g('agency_fee'),
    attr: (dom) => (ov.attrition !== undefined ? ov.attrition : pick(a.attrition_by_domain[dom], caseName)),
    replacement: g('replacement_cost'),
    deskRatio: g('desk_ratio'),
    sqftSeat: g('sqft_per_seat'),
    eorFeeInr: g('eor_fee_usd_per_head_month') * g('fx_inr_per_usd'),
    capSetup: g('captive_setup_one_time_inr_lakh') * 1e5,
    capMonthly: g('captive_monthly_compliance_inr_lakh') * 1e5,
    capVar: g('captive_variable_compliance_per_head_month_inr'),
    capTP: g('captive_tp_audit_annual_inr_lakh') * 1e5,
    transition: g('eor_to_captive_transition_inr_lakh') * 1e5,
    searchLag: g('search_lag_months'),
    delayFrac: g('cost_of_delay_fraction_of_monthly_payroll_at_H1'),
    training: g('training_spend_per_head_annual_inr'),
    claimScale: ov.claim_scale !== undefined ? ov.claim_scale : 1,
    rampMin: a.ramp_min_months,
    pressureSlope: a.pressure_premium.slope_pts_per_100pct_overshoot,
    pressureCap: a.pressure_premium.cap_pts,
  };
}

// ---------------------------------------------------------------------
// One micro-market x workspace x setup path x cost case -> 36-month simulation
// ---------------------------------------------------------------------
function simulate(inp, data, P, mm, ws, path, startOverride) {
  const cc = P.case;
  const city = data.cities.find((c) => c.id === mm.city);
  const st = data.states[city.state];
  const dom = inp.domain;
  const tal = data.talent[mm.city][dom];
  const mix = inp.bandMix;

  const sal = {}, incr = {};
  for (const b of data.bands) {
    sal[b.id] = pick(data.salary_median_ctc_lpa[mm.city][dom][b.id], cc) * 1e5;
    incr[b.id] = pick(data.salary_increment_pct[dom][b.id], cc) / 100;
  }
  // --- section 6: capacity, pressure premium, ramp
  const cap = pick(tal.hiring_capacity_annual, cc, true);
  const U = inp.h1 / cap;
  const pExtra = clamp(P.pressureSlope * Math.max(0, U - 1), 0, P.pressureCap) / 100;
  const prem = P.switchPremium + pick(tal.switch_premium_adjust_pts, cc) / 100 + pExtra;
  const bandOffer = (y, b) => sal[b] * (1 + incr[b]) ** y * (1 + prem);
  const offerBlend = (y) => sum(data.bands.map((b) => mix[b.id] * bandOffer(y, b.id)));
  const monthlyLoaded = (y) => (offerBlend(y) * (1 + P.load)) / 12;

  // --- section 7: time to operate
  const tLegal = path.type === 'captive'
    ? pick(st.legal_lag_captive_months, cc)
    : pick(st.legal_lag_eor_months, cc);
  const tSpace = ws === 'flex'
    ? pick(mm.space_lead_flex_months, cc)
    : pick(mm.space_lead_traditional_months, cc);
  const noticeM = pick(tal.notice_days_blended, cc) / 30;
  const tOffer = Math.max(tLegal, P.searchLag);
  const tFirst = startOverride !== undefined ? startOverride : Math.max(tOffer + noticeM, tSpace);
  const ramp = Math.max(P.rampMin, 12 * U);
  const tY1 = tFirst + ramp;

  const H = zeros();
  for (let m = 0; m < HORIZON; m++) {
    const t = m + 1;
    H[m] = t <= tY1
      ? inp.h1 * clamp((t - tFirst) / ramp, 0, 1)
      : inp.h1 + (inp.h3 - inp.h1) * clamp((t - tY1) / Math.max(1e-9, HORIZON - tY1), 0, 1);
  }
  const growthJoinsPerMonth = tY1 < HORIZON ? (inp.h3 - inp.h1) / (HORIZON - tY1) : 0;
  const growthOverreach = growthJoinsPerMonth > cap / 12;

  // --- section 8: cost components (monthly arrays, INR)
  const entityStart = path.type === 'captive' ? 0 : path.type === 'convert' ? path.month : Infinity;
  const salary = zeros(), recruit = zeros(), attrition = zeros(), space = zeros(), fitout = zeros(), setup = zeros();
  const rentArr = zeros();
  let prevH = 0;
  for (let m = 0; m < HORIZON; m++) {
    const y = Math.floor(m / 12);
    salary[m] = H[m] * monthlyLoaded(y);
    recruit[m] = Math.max(0, H[m] - prevH) * P.agencyShare * P.agencyFee * offerBlend(y);
    attrition[m] = m >= 12 ? H[m] * (P.attr(dom) / 12) * P.replacement * monthlyLoaded(y) * 12 : 0;
    prevH = H[m];
  }
  let sqft = 0, fitoutTotal = 0;
  if (ws === 'flex') {
    const desk = pick(mm.flex_cost_per_desk_month_inr, cc);
    for (let m = 0; m < HORIZON; m++) if (H[m] > 0) space[m] = Math.ceil(H[m] * P.deskRatio) * desk;
  } else {
    // Traditional: sized for H3 from handover (real over-commitment cost)
    const rate = pick(mm.lease_rate_psf_month_inr, cc);
    sqft = inp.h3 * P.deskRatio * P.sqftSeat;
    fitoutTotal = sqft * pick(mm.fitout_capex_psf_inr, cc);
    fitout[0] = fitoutTotal;
    for (let m = Math.ceil(tSpace); m < HORIZON; m++) { space[m] = sqft * rate; rentArr[m] = sqft * rate; }
  }
  for (let m = 0; m < HORIZON; m++) {
    if (m < entityStart) setup[m] += P.eorFeeInr * H[m];
    if (m >= entityStart) setup[m] += P.capMonthly + P.capVar * H[m] + P.capTP / 12;
  }
  if (isFinite(entityStart) && entityStart < HORIZON) {
    setup[entityStart] += P.capSetup + (path.type === 'convert' ? P.transition : 0);
  }

  // --- section 9: incentives
  const incentives = evalIncentives({ inp, data, P, mm, ws, city, H, bandOffer, rentArr, fitoutTotal, entityStart, mix, tSpace });
  const incExpected = zeros();
  for (const r of incentives) if (r.status === 'claimable') for (let m = 0; m < HORIZON; m++) incExpected[m] += r._receipts[m] * r.claim_probability;
  incentives.forEach((r) => delete r._receipts);

  const net = zeros();
  for (let m = 0; m < HORIZON; m++) net[m] = salary[m] + recruit[m] + attrition[m] + space[m] + fitout[m] + setup[m] - incExpected[m];
  const comp = {
    salary: sum(salary), recruitment: sum(recruit), attrition: sum(attrition),
    workspace: sum(space), fitout: sum(fitout), setup_admin: sum(setup),
    incentives_expected: -sum(incExpected),
  };
  const gross = comp.salary + comp.recruitment + comp.attrition + comp.workspace + comp.fitout + comp.setup_admin;
  const tco = gross + comp.incentives_expected;
  const headMonths = sum(H);
  return {
    path, ws, tLegal, tSpace, noticeM, tFirst, tY1, ramp, U, cap, pExtra, prem, H, net,
    growthOverreach, comp, gross, tco, salaryShare: comp.salary / gross,
    costPerHeadInr: headMonths > 0 ? (tco / headMonths) * 12 : Infinity,
    monthlyLoaded0: monthlyLoaded(0), offerMonthly0: offerBlend(0) / 12,
    incentives,
    incQuoted: sum(incentives.filter((r) => r.status === 'claimable').map((r) => r.quoted_inr)),
    incExpectedTotal: -comp.incentives_expected,
  };
}

function capTotal(acc, capInr) {
  if (capInr == null) return acc;
  const t = sum(acc);
  if (t <= capInr || t === 0) return acc;
  return acc.map((x) => (x * capInr) / t);
}

function evalIncentives(c) {
  const { inp, data, P, mm, ws, city, H, bandOffer, rentArr, fitoutTotal, entityStart, mix } = c;
  const cc = P.case;
  const out = [];
  for (const inc of data.incentives) {
    if (inc.state !== city.state) continue;
    const r = {
      id: inc.id, policy: inc.policy, benefit_type: inc.benefit_type, status: 'excluded', reason: null,
      quoted_inr: 0, expected_inr: 0, beyond_horizon_inr: 0, claim_probability: 0, lag_months: null,
      valid_until: inc.valid_until, confidence: inc.confidence, sources: inc.sources,
      source_conflict: inc.source_conflict || null, notes: inc.notes || '', exclusive_group: inc.exclusive_group || null,
      _receipts: zeros(),
    };
    out.push(r);
    const el = inc.eligibility || {};
    if (!inc.applies_to.includes(mm.id)) {
      r.reason = inc.applies_in_current_dataset === false
        ? 'Zone rule: applies only outside this location (e.g. Beyond Bengaluru)' : 'Not applicable to this micro-market';
      continue;
    }
    if (el.workspace_models && !el.workspace_models.includes(ws)) { r.reason = `Not modelled as claimable with ${ws} space`; continue; }
    if ((el.requires_own_entity || el.requires_own_payroll) && !isFinite(entityStart)) {
      r.reason = 'Requires own entity / own payroll: forfeited under EOR'; continue;
    }
    if (!inc.quantified || inc.value_model.type === 'unquantified' || inc.value_model.type === 'fixed_per_head') {
      r.status = 'unquantified'; r.reason = 'Not quantified in v1 (expected value 0); see notes'; continue;
    }
    const vm = inc.value_model;
    const lag = Math.round(pick(inc.lag_months, cc));
    const p = clamp(pick(inc.claim_probability, cc, true) * P.claimScale, 0, 1);
    r.lag_months = lag; r.claim_probability = p;
    let acc = zeros(); let lump = null;
    if (vm.type === 'pct_of_basis') {
      const rate = pick(vm.rate, cc, true);
      const share = vm.qualifying_share ? pick(vm.qualifying_share, cc, true) : 1;
      if (vm.basis === 'fitout_capex') {
        if (fitoutTotal <= 0) { r.reason = 'No fit-out capex under flex space'; continue; }
        if (entityStart > 0) { r.reason = 'Capex is incurred before an own entity exists (EOR bridge)'; continue; }
        let g = rate * share * fitoutTotal;
        if (vm.cap_inr_crore != null) g = Math.min(g, vm.cap_inr_crore * 1e7);
        lump = g;
      } else if (vm.basis === 'training_spend') {
        for (let m = 0; m < HORIZON; m++) if (m >= entityStart) acc[m] = H[m] * (P.training / 12) * rate * share;
        acc = capTotal(acc, vm.cap_inr_crore != null ? vm.cap_inr_crore * 1e7 : null);
      } else if (vm.basis === 'rent') {
        for (let m = 0; m < HORIZON; m++) if (m >= entityStart) acc[m] = rentArr[m] * rate * share;
        acc = capTotal(acc, vm.cap_inr_crore != null ? vm.cap_inr_crore * 1e7 : null);
      }
    } else if (vm.type === 'pct_above_threshold') {
      const rate = pick(vm.rate, cc, true);
      for (let m = 0; m < HORIZON; m++) {
        if (m < entityStart) continue;
        const y = Math.floor(m / 12);
        const perHead = sum(data.bands.map((b) => mix[b.id] * rate * Math.max(0, bandOffer(y, b.id) / 12 - vm.threshold_inr_per_month)));
        acc[m] = H[m] * perHead;
      }
      const capY = vm.cap_inr_crore_per_year * 1e7;
      for (let blk = 0; blk < HORIZON / 12; blk++) {
        const sl = acc.slice(blk * 12, blk * 12 + 12); const t = sum(sl);
        if (t > capY) for (let m = blk * 12; m < blk * 12 + 12; m++) acc[m] = (acc[m] * capY) / t;
      }
    } else if (vm.type === 'fixed_annual') {
      const amt = pick(vm.amount_inr_crore, cc, true) * 1e7;
      for (let m = Math.ceil(c.tSpace); m < HORIZON; m++) if (m >= entityStart) acc[m] = amt / 12;
    }
    const rec = zeros(); let total = 0;
    if (lump != null) {
      const n = vm.installments || 1;
      total = lump;
      for (let k = 0; k < n; k++) { const idx = lag + 12 * k; if (idx < HORIZON) rec[idx] += lump / n; }
    } else {
      total = sum(acc);
      for (let m = 0; m < HORIZON; m++) { const idx = m + lag; if (idx < HORIZON) rec[idx] += acc[m]; }
    }
    r._receipts = rec;
    r.quoted_inr = sum(rec);
    r.beyond_horizon_inr = Math.max(0, total - r.quoted_inr);
    r.expected_inr = r.quoted_inr * p;
    r.status = 'claimable';
  }
  // exclusive groups: keep best expected value
  const groups = {};
  for (const r of out) if (r.status === 'claimable' && r.exclusive_group) (groups[r.exclusive_group] ||= []).push(r);
  for (const list of Object.values(groups)) {
    list.sort((a, b) => b.expected_inr - a.expected_inr);
    for (const loser of list.slice(1)) {
      loser.status = 'excluded'; loser.reason = `Mutually exclusive with ${list[0].id} (lower expected value)`;
      loser.quoted_inr = 0; loser.expected_inr = 0; loser._receipts = zeros();
    }
  }
  return out;
}

// ---------------------------------------------------------------------
// Section 10: setup-model decision per market
// ---------------------------------------------------------------------
function setupOverrides(inp) {
  const why = [];
  if (inp.h1 > 75) why.push('Year 1 headcount above 75');
  if (inp.regulated) why.push('Regulated sector');
  if (inp.ipSensitivity === 'high') why.push('High IP sensitivity');
  return why;
}
const pathLabel = (p) => (p.type === 'captive' ? 'Captive' : p.type === 'eor' ? 'EOR (no conversion)' : `EOR then convert at month ${p.month}`);

function decideSetup(inp, data, P, mm, ws) {
  const paths = [{ type: 'captive' }, { type: 'eor' }, ...CONVERT_MONTHS.map((m) => ({ type: 'convert', month: m }))];
  // Native sims: each path on its own timeline (used for time metrics and the headline plan).
  const sims = paths.map((p) => simulate(inp, data, P, mm, ws, p));
  const minFirst = Math.min(...sims.map((x) => x.tFirst));
  // Like-for-like sims: every path forced onto the SAME hiring start (the slowest path's),
  // so path costs are compared at equal headcount. Speed is priced separately via delay cost.
  const common = Math.max(...sims.map((x) => x.tFirst));
  const lfl = paths.map((p) => simulate(inp, data, P, mm, ws, p, common));
  sims.forEach((x, i) => {
    x.label = pathLabel(x.path);
    x.likeTco = lfl[i].tco;
    x.netLfl = lfl[i].net;
    x.delayMonths = x.tFirst - minFirst;
    x.delayCostInr = inp.includeDelay ? x.delayMonths * P.delayFrac * inp.h1 * x.monthlyLoaded0 : 0;
    x.decisionCost = x.likeTco + x.delayCostInr;
  });
  const overrides = setupOverrides(inp);
  let chosen, rule;
  if (overrides.length) {
    chosen = sims.find((s) => s.path.type === 'captive'); rule = 'override';
  } else {
    const sorted = [...sims].sort((a, b) => a.decisionCost - b.decisionCost);
    const best = sorted[0];
    const near = sorted.filter((s) => (s.decisionCost - best.decisionCost) / best.decisionCost <= 0.03);
    rule = 'lowest_decision_cost';
    chosen = best;
    if (near.length > 1) {
      // Costs within 3%: goal decides. TCO and Talent prefer control (captive); Speed and Balanced take the faster path.
      if (inp.goal === 'tco' || inp.goal === 'talent') {
        const capt = near.filter((x) => x.path.type === 'captive');
        if (capt.length) { chosen = capt[0]; rule = 'tie_break_control'; }
      } else {
        chosen = [...near].sort((a, b) => a.tFirst - b.tFirst || a.decisionCost - b.decisionCost)[0]; rule = 'tie_break_faster';
      }
    }
  }
  // conversion trigger helper (10.3)
  const eorFeePerHead = P.eorFeeInr;
  const denom = eorFeePerHead - P.capVar;
  const fixedMonthly = P.capMonthly + P.capTP / 12;
  const hStar = denom > 0 ? Math.ceil(fixedMonthly / denom) : null;
  const converts = sims.filter((s) => s.path.type === 'convert').sort((a, b) => a.decisionCost - b.decisionCost);
  const warnings = [];
  if (ws === 'traditional' && chosen.path.type !== 'captive' && inp.h1 < 30) warnings.push('Traditional lease with an EOR path and a small team: lock-in risk');
  return { chosen, sims, rule, overrides, hStar, bestConvertMonth: converts[0].path.month, warnings };
}

// ---------------------------------------------------------------------
// Sections 11-13: score and rank all markets for one cost case
// ---------------------------------------------------------------------
function evalAll(inp, data, caseName, ov = {}) {
  const P = makeParams(data, caseName, ov);
  const W = GOAL_WEIGHTS[inp.goal];
  const B = data.benchmarks;
  const markets = [];
  for (const mm of data.micro_markets) {
    const dec = decideSetup(inp, data, P, mm, inp.workspace);
    const s = dec.chosen;
    const city = data.cities.find((c) => c.id === mm.city);
    const st = data.states[city.state];
    const tal = data.talent[mm.city][inp.domain];
    const avail = pick(tal.availability_score, caseName, true);
    const reach = ((mm.talent_reach_index.value - 1) / 4) * 100;
    const fit = 100 * clamp((B.utilization_fit.worst_u - s.U) / (B.utilization_fit.worst_u - B.utilization_fit.best_u), 0, 1);
    const D1 = 0.5 * avail + 0.3 * reach + 0.2 * fit;
    const D2 = lowerBetter(s.costPerHeadInr / 1e5, B.net_cost_per_head_inr_lakh.best, B.net_cost_per_head_inr_lakh.worst);
    const D3 = 0.6 * lowerBetter(s.tFirst, B.t_first_months.best, B.t_first_months.worst) + 0.4 * lowerBetter(s.tY1, B.t_y1_months.best, B.t_y1_months.worst);
    const hc = sum(mm.anchors.map((a) => a.headcount_est.base));
    const match = mm.anchors.length ? (mm.anchors.filter((a) => a.domains.includes(inp.domain)).length / mm.anchors.length) * 100 : 0;
    const D4 = 0.5 * higherBetter(hc, B.anchor_headcount_total.worst, B.anchor_headcount_total.best)
             + 0.25 * higherBetter(mm.anchors.length, B.anchor_count.worst, B.anchor_count.best) + 0.25 * match;
    const ease = sum(Object.values(st.execution_ease).map((e) => pick(e, caseName))) / 4;
    const D5 = ((ease - 1) / 4) * 100;
    const scores = { talent: D1, cost: D2, speed: D3, eco: D4, ease: D5 };
    const total = sum(Object.keys(W).map((k) => W[k] * scores[k]));

    const reasons = [];
    if (inp.budgetCapInr != null && s.tco > inp.budgetCapInr) reasons.push(`Net 3-year TCO exceeds budget cap by INR ${Math.round(s.tco - inp.budgetCapInr).toLocaleString('en-IN')}`);
    if (s.U > data.assumptions.utilization_exclusion_threshold) reasons.push(`Hiring capacity utilization ${s.U.toFixed(2)} exceeds ${data.assumptions.utilization_exclusion_threshold}`);
    const flags = [...dec.warnings];
    if (s.U > 1 && s.U <= data.assumptions.utilization_exclusion_threshold) flags.push(`Overreach: Year 1 target is ${(s.U * 100).toFixed(0)}% of annual hiring capacity (pressure premium +${(s.pExtra * 100).toFixed(1)} pts, longer ramp)`);
    if (s.growthOverreach) flags.push('Years 2-3 growth exceeds monthly hiring capacity');
    if (city.data_thin) flags.push('Data-thin location (stub)');
    if (pick(st.execution_ease.policy_runway, caseName) <= 2) flags.push('Incentive policy window ending or unclear');
    flags.push('Permanent-establishment and transfer-pricing treatment: take tax advice (not modelled)');

    markets.push({
      id: mm.id, name: mm.name, city: mm.city, state: city.state, excluded: reasons.length > 0, exclusion_reasons: reasons, flags,
      scores, total, setup: { label: s.label, path: s.path, rule: dec.rule, overrides: dec.overrides, hStar: dec.hStar, bestConvertMonth: dec.bestConvertMonth },
      tco_inr: s.tco, tco_min_inr: Math.min(...dec.sims.map((x) => x.tco)),
      cost_per_head_lakh: s.costPerHeadInr / 1e5, t_first: s.tFirst, t_y1: s.tY1, U: s.U,
      _dec: dec,
    });
  }
  const ranking = markets.filter((m) => !m.excluded).sort((a, b) => b.total - a.total);
  return { P, W, markets, ranking };
}

function cityCards(ranking, data) {
  const best = {};
  for (const m of ranking) if (!best[m.city]) best[m.city] = m;
  return Object.values(best).sort((a, b) => b.total - a.total).map((m) => ({
    city: data.cities.find((c) => c.id === m.city).name, best_micro_market: m.name, id: m.id, score: m.total,
    cost_per_head_lakh: m.cost_per_head_lakh, anchors: data.micro_markets.find((x) => x.id === m.id).anchors.map((a) => a.name),
  }));
}

// ---------------------------------------------------------------------
// Section 14: flip points
// ---------------------------------------------------------------------
function topId(inp, data, caseName, ov) { const r = evalAll(inp, data, caseName, ov).ranking; return r.length ? r[0].id : null; }

function computeFlips(inp, data, caseName, ov, baseTop, P) {
  const levers = [];
  const scanNumeric = (key, label, baseVal, grid, run, fmt) => {
    const sorted = [...grid].sort((a, b) => Math.abs(a - baseVal) - Math.abs(b - baseVal));
    for (const x of sorted) {
      if (x === baseVal) continue;
      const t = run(x);
      if (t !== baseTop) { levers.push({ lever: key, label, at: x, from: baseVal, newTop: t, relChange: Math.abs(x - baseVal) / (Math.max(...grid) - Math.min(...grid)), text: fmt(x, t) }); return; }
    }
    levers.push({ lever: key, label, stable: true, relChange: Infinity, text: `Stable across the scanned range for ${label}` });
  };
  const nameOf = (id) => (id ? data.micro_markets.find((m) => m.id === id).name : 'no eligible option');
  const range = (a, b, n) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
  scanNumeric('switch_premium', 'switch premium', P.switchPremium, range(0, 0.6, 25),
    (x) => topId(inp, data, caseName, { ...ov, switch_premium: x }),
    (x, t) => `Switch premium ${(x * 100).toFixed(0)}% (now ${(P.switchPremium * 100).toFixed(0)}%) makes ${nameOf(t)} #1`);
  scanNumeric('h1', 'Year 1 headcount', inp.h1, range(10, 250, 25).map(Math.round),
    (x) => topId({ ...inp, h1: x, h3: Math.max(inp.h3, x) }, data, caseName, ov),
    (x, t) => `Year 1 headcount of ${x} (now ${inp.h1}) makes ${nameOf(t)} #1`);
  scanNumeric('claim_scale', 'incentive claim probability', 1, range(0, 1.5, 25),
    (x) => topId(inp, data, caseName, { ...ov, claim_scale: x }),
    (x, t) => `Incentive claim probability scaled to ${(x * 100).toFixed(0)}% of base makes ${nameOf(t)} #1`);
  for (const g of Object.keys(GOAL_WEIGHTS)) {
    if (g === inp.goal) continue;
    const t = topId({ ...inp, goal: g, includeDelay: inp.includeDelay }, data, caseName, ov);
    if (t !== baseTop) { levers.push({ lever: 'goal', label: 'optimization goal', at: g, newTop: t, relChange: 0.5, text: `Goal "${g}" makes ${nameOf(t)} #1` }); break; }
  }
  const otherWs = inp.workspace === 'flex' ? 'traditional' : 'flex';
  const tw = topId({ ...inp, workspace: otherWs }, data, caseName, ov);
  if (tw !== baseTop) levers.push({ lever: 'workspace', label: 'workspace model', at: otherWs, newTop: tw, relChange: 0.5, text: `${otherWs} space makes ${nameOf(tw)} #1` });
  const flips = levers.filter((l) => !l.stable).sort((a, b) => a.relChange - b.relChange);
  return { top3: flips.slice(0, 3), all: levers };
}

// ---------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------
export function runVisor(rawInputs, data, ov = {}) {
  const inp = normalizeInputs(rawInputs);
  const headCase = RISK_TO_CASE[inp.risk];
  const byCase = Object.fromEntries(CASES.map((c) => [c, evalAll(inp, data, c, ov)]));
  const head = byCase[headCase];
  const ranking = head.ranking.map(({ _dec, ...m }) => m);
  const result = {
    inputs: inp, caseUsed: headCase, weights: head.W, fx: head.P.fx,
    ranking, excluded: head.markets.filter((m) => m.excluded).map(({ _dec, ...m }) => m),
    noResults: ranking.length === 0, closest: null, cities: cityCards(head.ranking, data), top: null,
    margin: null, tie: false, tieDriver: null, robustness: null, flips: null,
    meta: { data_status: data.meta.status, as_of: data.meta.generated },
  };
  if (ranking.length === 0) {
    const sorted = [...head.markets].sort((a, b) => a.tco_inr - b.tco_inr);
    result.closest = { id: sorted[0].id, name: sorted[0].name, gapInr: inp.budgetCapInr != null ? sorted[0].tco_inr - inp.budgetCapInr : null, reasons: sorted[0].exclusion_reasons };
    return result;
  }
  const top = head.ranking[0];
  if (ranking.length > 1) {
    const second = head.ranking[1];
    result.margin = top.total - second.total;
    result.tie = result.margin < 3;
    const diffs = Object.keys(top.scores).map((k) => [k, Math.abs(top.scores[k] - second.scores[k])]).sort((a, b) => b[1] - a[1]);
    result.tieDriver = diffs[0][0];
  }
  // robustness across cost cases
  const tops = CASES.map((c) => (byCase[c].ranking[0] ? byCase[c].ranking[0].id : null));
  const same = tops.filter((t) => t === top.id).length;
  result.robustness = { level: same === 3 ? 'High' : same === 2 ? 'Medium' : 'Low', sameTopInCases: same, topsByCase: Object.fromEntries(CASES.map((c, i) => [c, tops[i]])) };

  // detail for the top location
  const dec = top._dec; const s = dec.chosen;
  const curve = (sim) => { let c = 0; return sim.netLfl.map((x) => (c += x)); };
  const pure = (type) => dec.sims.find((x) => x.path.type === type);
  const conv = dec.sims.find((x) => x.path.type === 'convert' && x.path.month === dec.bestConvertMonth);
  const mmTop = data.micro_markets.find((m) => m.id === top.id);
  result.top = {
    id: top.id, name: top.name, city: top.city, scores: top.scores, total: top.total, flags: top.flags,
    setup: {
      recommended: s.label, rule: dec.rule, overrides: dec.overrides, conversionTrigger: s.path.type === 'convert'
        ? { headcount: dec.hStar, month: s.path.month, text: `Convert when headcount reaches ${dec.hStar} or at month ${s.path.month}, whichever comes first` } : null,
      hStar: dec.hStar, warnings: dec.warnings,
      comparison: dec.sims.map((x) => ({ label: x.label, tco_inr: x.tco, like_for_like_tco_inr: x.likeTco, delay_months: x.delayMonths, delay_cost_inr: x.delayCostInr, decision_cost_inr: x.decisionCost, t_first: x.tFirst, incentives_expected_inr: x.incExpectedTotal })),
      curves: { captive: curve(pure('captive')), eor: curve(pure('eor')), best_convert: curve(conv), best_convert_month: dec.bestConvertMonth },
      eor_forfeited_incentives_inr: Math.max(0, pure('captive').incExpectedTotal - pure('eor').incExpectedTotal),
    },
    tco: {
      net_inr: s.tco, net_usd: toUSD(s.tco, head.P.fx), waterfall_inr: s.comp, gross_inr: s.gross, salary_share: s.salaryShare,
      cost_per_head_lakh: s.costPerHeadInr / 1e5, delay_cost_inr_not_in_tco: s.delayCostInr,
    },
    speed: { t_first: s.tFirst, t_y1: s.tY1, ramp_months: s.ramp, legal: s.tLegal, space: s.tSpace, notice_months: s.noticeM },
    ramp: { headcount_by_month: s.H, utilization: s.U, hiring_capacity: s.cap, pressure_premium_pts: s.pExtra * 100 },
    incentives: { rows: s.incentives, expected_total_inr: s.incExpectedTotal, quoted_total_inr: s.incQuoted, quoted_vs_expected_gap_inr: s.incQuoted - s.incExpectedTotal },
    micro_market: { anchors: mmTop.anchors.map((a) => ({ name: a.name, sector: a.sector, headcount_base: a.headcount_est.base, placement_confidence: a.placement_confidence })), reach_index: mmTop.talent_reach_index.value },
  };
  result.flips = computeFlips(inp, data, headCase, ov, top.id, head.P);
  return result;
}

export { evalAll, makeParams };
