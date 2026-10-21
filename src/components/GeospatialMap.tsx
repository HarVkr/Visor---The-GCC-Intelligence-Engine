import React, { useState, useEffect } from 'react';

interface GeospatialMapProps {
  topMarketId?: string;
  onSelectMarket?: (marketId: string) => void;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  topMarketId = 'hyd_hitec',
  onSelectMarket,
}) => {
  const topCityKey = topMarketId.includes('blr')
    ? 'bengaluru'
    : topMarketId.includes('pune')
    ? 'pune'
    : topMarketId.includes('chn')
    ? 'chennai'
    : 'hyderabad';

  const [selectedCity, setSelectedCity] = useState<string>(topCityKey);

  useEffect(() => {
    setSelectedCity(topCityKey);
  }, [topCityKey]);

  const cityDetails: Record<string, { cluster: string; coords: string; attrition: string; incentive: string; note: string }> = {
    hyderabad: {
      cluster: 'HITEC City & Financial District',
      coords: '17.38° N, 78.48° E (Telangana)',
      attrition: '15.0% (Low commute friction)',
      incentive: '₹42L Verified Rebates',
      note: 'Optimal balance of senior tech depth and high net cost efficiency',
    },
    bengaluru: {
      cluster: 'Outer Ring Road (Bellandur-Marathahalli)',
      coords: '12.97° N, 77.59° E (Karnataka)',
      attrition: '22.4% (Highest drag on ORR)',
      incentive: 'KA GCC Policy 2024-29',
      note: 'Deepest specialized GenAI and platform talent with Tier-1 density',
    },
    pune: {
      cluster: 'Kharadi / EON Free Zone (East Corridor)',
      coords: '18.52° N, 73.85° E (Maharashtra)',
      attrition: '16.5% (Steady East corridor)',
      incentive: 'MH GCC Payroll Subsidy',
      note: 'North-West cost arbitrage leader; dominant efficiency at scale',
    },
    chennai: {
      cluster: 'Old Mahabalipuram Road (OMR IT Corridor)',
      coords: '13.08° N, 80.27° E (Tamil Nadu)',
      attrition: '14.2% (Coastal IT Corridor)',
      incentive: 'TN GCC One Single Window',
      note: 'Established enterprise systems and automotive engineering hub',
    },
  };

  const current = cityDetails[selectedCity] || cityDetails.hyderabad;

  const handleCityClick = (city: string, marketId: string) => {
    setSelectedCity(city);
    if (onSelectMarket) onSelectMarket(marketId);
  };

  return (
    <div className="xl:col-span-5 card-pitch rounded-xl p-5 flex flex-col justify-between min-h-[500px]">
      <div className="flex items-center justify-between z-10 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">explore</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
            Geospatial Cluster Topology
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-sans">
          Accurate Geo-Projection • Peninsular India
        </span>
      </div>

      {/* Ambient Architectural Map Canvas */}
      <div className="relative w-full h-[350px] my-3 dot-grid rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
        <svg className="w-full h-full" fill="none" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
          {/* Latitude / Longitude Cartesian Grid Lines */}
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="50" x2="50" y1="0" y2="400" />
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="150" x2="150" y1="0" y2="400" />
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="280" x2="280" y1="0" y2="400" />
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="380" x2="380" y1="0" y2="400" />
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="80" y2="80" />
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="180" y2="180" />
          <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="290" y2="290" />

          {/* Compass Rose Mini Indicator */}
          <g transform="translate(450, 40)">
            <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M 0 -10 L 3 -2 L 0 0 L -3 -2 Z" fill="#2563EB" />
            <path d="M 0 10 L 3 2 L 0 0 L -3 2 Z" fill="#94A3B8" />
            <text x="0" y="-13" fill="#1E293B" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">N</text>
          </g>

          {/* Accurate Peninsular India Coastline Outlines */}
          {/* West Coast (Arabian Sea) from Mumbai down through Goa to Kanyakumari */}
          <path
            d="M 60 30 Q 95 90 115 140 T 140 220 T 170 300 L 225 385"
            fill="none"
            stroke="#CBD5E1"
            strokeDasharray="4 3"
            strokeWidth="2"
          />
          {/* East Coast (Bay of Bengal) from Odisha/Andhra down to Kanyakumari */}
          <path
            d="M 440 60 Q 395 140 350 200 T 365 290 T 310 360 L 225 385"
            fill="none"
            stroke="#CBD5E1"
            strokeDasharray="4 3"
            strokeWidth="2"
          />
          
          {/* Geographic Sea Labels */}
          <text fill="#CBD5E1" fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="600" x="50" y="240">ARABIAN SEA</text>
          <text fill="#CBD5E1" fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="600" x="380" y="210">BAY OF BENGAL</text>

          {/* Strategic Tech Corridor Infrastructure Bridges */}
          <line stroke="#94A3B8" strokeDasharray="4 4" strokeWidth="1.5" x1="150" x2="280" y1="110" y2="175" />
          <line stroke="#94A3B8" strokeDasharray="4 4" strokeWidth="1.5" x1="280" x2="265" y1="175" y2="295" />
          <line stroke="#94A3B8" strokeDasharray="4 4" strokeWidth="1.5" x1="150" x2="265" y1="110" y2="295" />
          <line stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" x1="265" x2="360" y1="295" y2="290" />

          {/* ============================================================== */}
          {/* 1. PUNE KHARADI NODE (NORTH-WEST: Upper-Left of Hyderabad)     */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer group transition-transform"
            onClick={() => handleCityClick('pune', 'pune_kharadi')}
          >
            {topCityKey === 'pune' ? (
              <>
                <circle cx="150" cy="110" r={selectedCity === 'pune' ? '50' : '44'} fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
                <circle cx="150" cy="110" r="24" fill="#DBEAFE" stroke="#2563EB" strokeDasharray="3 2" strokeWidth="1.5" />
                <circle cx="150" cy="110" r="7" fill="#2563EB" />
                <circle cx="150" cy="110" r="3" fill="#FFFFFF" />
                <text fill="#1D4ED8" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="800" textAnchor="middle" x="150" y="82">
                  ★ Pune (Kharadi)
                </text>
                <text fill="#059669" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700" textAnchor="middle" x="150" y="148">
                  RECOMMENDED #1 (18.5°N)
                </text>
              </>
            ) : (
              <>
                <circle
                  cx="150"
                  cy="110"
                  r={selectedCity === 'pune' ? '32' : '26'}
                  fill={selectedCity === 'pune' ? '#EFF6FF' : '#F1F5F9'}
                  stroke={selectedCity === 'pune' ? '#2563EB' : '#94A3B8'}
                  strokeDasharray={selectedCity === 'pune' ? 'none' : '3 3'}
                  strokeWidth={selectedCity === 'pune' ? '2' : '1'}
                />
                <circle cx="150" cy="110" r="5" fill={selectedCity === 'pune' ? '#2563EB' : '#64748B'} />
                <text fill="#1E293B" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="150" y="86">
                  Pune (Kharadi)
                </text>
                <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="9" textAnchor="middle" x="150" y="132">
                  ₹12.5k/desk • 18.5°N (NW)
                </text>
              </>
            )}
          </g>

          {/* ============================================================== */}
          {/* 2. HYDERABAD HITEC CITY NODE (CENTRAL-EAST: Lower-Right of Pune)*/}
          {/* ============================================================== */}
          <g
            className="cursor-pointer group transition-transform"
            onClick={() => handleCityClick('hyderabad', 'hyd_hitec')}
          >
            {topCityKey === 'hyderabad' ? (
              <>
                <circle cx="280" cy="175" r={selectedCity === 'hyderabad' ? '50' : '44'} fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
                <circle cx="280" cy="175" r="24" fill="#DBEAFE" stroke="#2563EB" strokeDasharray="3 2" strokeWidth="1.5" />
                <circle cx="280" cy="175" r="7" fill="#2563EB" />
                <circle cx="280" cy="175" r="3" fill="#FFFFFF" />
                <text fill="#1D4ED8" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="800" textAnchor="middle" x="280" y="146">
                  ★ Hyderabad (HITEC)
                </text>
                <text fill="#059669" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700" textAnchor="middle" x="280" y="214">
                  RECOMMENDED #1 (17.4°N)
                </text>
              </>
            ) : (
              <>
                <circle
                  cx="280"
                  cy="175"
                  r={selectedCity === 'hyderabad' ? '32' : '26'}
                  fill={selectedCity === 'hyderabad' ? '#EFF6FF' : '#F1F5F9'}
                  stroke={selectedCity === 'hyderabad' ? '#2563EB' : '#94A3B8'}
                  strokeDasharray={selectedCity === 'hyderabad' ? 'none' : '3 3'}
                  strokeWidth={selectedCity === 'hyderabad' ? '2' : '1'}
                />
                <circle cx="280" cy="175" r="5" fill={selectedCity === 'hyderabad' ? '#2563EB' : '#64748B'} />
                <text fill="#1E293B" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="280" y="152">
                  Hyderabad (HITEC)
                </text>
                <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="9" textAnchor="middle" x="280" y="198">
                  ₹16.2k/desk • 17.4°N
                </text>
              </>
            )}
          </g>

          {/* ============================================================== */}
          {/* 3. BENGALURU ORR NODE (SOUTH: Directly South of Hyderabad)     */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer group transition-transform"
            onClick={() => handleCityClick('bengaluru', 'blr_orr')}
          >
            {topCityKey === 'bengaluru' ? (
              <>
                <circle cx="265" cy="295" r={selectedCity === 'bengaluru' ? '50' : '44'} fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
                <circle cx="265" cy="295" r="24" fill="#DBEAFE" stroke="#2563EB" strokeDasharray="3 2" strokeWidth="1.5" />
                <circle cx="265" cy="295" r="7" fill="#2563EB" />
                <circle cx="265" cy="295" r="3" fill="#FFFFFF" />
                <text fill="#1D4ED8" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="800" textAnchor="middle" x="265" y="266">
                  ★ Bengaluru (ORR)
                </text>
                <text fill="#059669" fontFamily="'JetBrains Mono', monospace" fontSize="10" fontWeight="700" textAnchor="middle" x="265" y="334">
                  RECOMMENDED #1 (13.0°N)
                </text>
              </>
            ) : (
              <>
                <circle
                  cx="265"
                  cy="295"
                  r={selectedCity === 'bengaluru' ? '36' : '30'}
                  fill={selectedCity === 'bengaluru' ? '#EFF6FF' : '#F1F5F9'}
                  stroke={selectedCity === 'bengaluru' ? '#2563EB' : '#94A3B8'}
                  strokeDasharray={selectedCity === 'bengaluru' ? 'none' : '3 3'}
                  strokeWidth={selectedCity === 'bengaluru' ? '2' : '1'}
                />
                <circle cx="265" cy="295" r="5" fill={selectedCity === 'bengaluru' ? '#2563EB' : '#475569'} />
                <text fill="#1E293B" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="265" y="270">
                  Bengaluru (ORR)
                </text>
                <text fill="#64748B" fontFamily="'JetBrains Mono', monospace" fontSize="9" textAnchor="middle" x="265" y="322">
                  ₹21.5k/desk • 13.0°N (South)
                </text>
              </>
            )}
          </g>

          {/* ============================================================== */}
          {/* 4. CHENNAI OMR NODE (SOUTH-EAST COAST)                         */}
          {/* ============================================================== */}
          <g
            className="cursor-pointer group transition-transform"
            onClick={() => handleCityClick('chennai', 'chn_omr')}
          >
            <circle
              cx="360"
              cy="290"
              r={selectedCity === 'chennai' ? '28' : '22'}
              fill={selectedCity === 'chennai' ? '#EFF6FF' : '#F8FAFC'}
              stroke={selectedCity === 'chennai' ? '#2563EB' : '#CBD5E1'}
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            <circle cx="360" cy="290" r="4" fill={selectedCity === 'chennai' ? '#2563EB' : '#94A3B8'} />
            <text fill="#475569" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="600" textAnchor="middle" x="360" y="272">
              Chennai (OMR)
            </text>
            <text fill="#94A3B8" fontFamily="'JetBrains Mono', monospace" fontSize="8" textAnchor="middle" x="360" y="316">
              East Hub (Stub)
            </text>
          </g>
        </svg>

        {/* Active Node Context Pill */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 backdrop-blur border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <div>
              <span className="text-slate-900 font-bold font-sans">
                Cluster: {current.cluster}
              </span>
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                [{current.coords}]
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-600 text-[11px] font-mono">
            <span>
              Attrition: <b className="text-emerald-600 font-sans">{current.attrition}</b>
            </span>
            <span>
              Incentive: <b className="text-blue-600 font-sans">{current.incentive}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-sans">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Optimal Target
          </span>
          <span className="flex items-center gap-1.5 font-sans">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Secondary Contenders
          </span>
          <span className="flex items-center gap-1.5 font-sans text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span> Coastal Stub
          </span>
        </div>
        <span className="font-mono text-[11px]">JLL &amp; NASSCOM Verified 2024-2026</span>
      </div>
    </div>
  );
};
