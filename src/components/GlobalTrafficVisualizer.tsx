import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Globe,
  Radio,
  Zap,
  ShieldAlert,
  ArrowRight,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Activity,
  Flame,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { TelecomNode } from '../types/telecom';

interface EuropeanOrigin {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  league: string;
  lat: number;
  lon: number;
  ipPrefix: string;
  cdnProvider: string;
}

interface InterceptionGate {
  id: string;
  name: string;
  subseaLanding: string;
  lat: number;
  lon: number;
  inspectionType: string;
}

interface AfricanDestination {
  id: string;
  city: string;
  country: string;
  flag: string;
  lat: number;
  lon: number;
  ixpName: string;
  africanMatch: string;
  tvStation: string;
}

export interface ReroutePathway {
  id: string;
  originId: string;
  destinationId: string;
  gateId: string;
  competition: string;
  africanAlternative: string;
  bandwidthGbps: number;
  reroutedPacketsPerSec: number;
  status: 'active' | 'filtering' | 'blocked';
  latencyMs: number;
  description: string;
}

const EUROPEAN_ORIGINS: EuropeanOrigin[] = [
  {
    id: 'eu-london',
    name: 'London Broadcast CDN',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    league: 'English Premier League (EPL)',
    lat: 51.5074,
    lon: -0.1278,
    ipPrefix: '195.12.8.0/20 (Sky / TNT Edge)',
    cdnProvider: 'BT Tower Multi-cast IP & Akamai UK',
  },
  {
    id: 'eu-madrid',
    name: 'Madrid Teleport Station',
    city: 'Madrid',
    country: 'Spain',
    flag: '🇪🇸',
    league: 'Spanish La Liga',
    lat: 40.4168,
    lon: -3.7038,
    ipPrefix: '185.120.44.0/22 (DAZN / Movistar)',
    cdnProvider: 'Telefónica Core & Hispasat Uplink',
  },
  {
    id: 'eu-paris',
    name: 'Paris Ingest Exchange',
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    league: 'French Ligue 1',
    lat: 48.8566,
    lon: 2.3522,
    ipPrefix: '194.2.0.0/16 (Canal+ Distribution)',
    cdnProvider: 'Eutelsat Hotbird 13F & Equinix PA4',
  },
  {
    id: 'eu-milan',
    name: 'Milan Media PoP',
    city: 'Milan',
    country: 'Italy',
    flag: '🇮🇹',
    league: 'Italian Serie A',
    lat: 45.4642,
    lon: 9.1900,
    ipPrefix: '212.182.0.0/19 (Sky Italia Feed)',
    cdnProvider: 'MIX Milan Internet eXchange',
  },
  {
    id: 'eu-munich',
    name: 'Munich Astra Uplink',
    city: 'Munich',
    country: 'Germany',
    flag: '🇩🇪',
    league: 'German Bundesliga',
    lat: 48.1351,
    lon: 11.5820,
    ipPrefix: '193.159.0.0/18 (SES Astra Ku-Band)',
    cdnProvider: 'Deutsche Telekom Sports CDN',
  },
  {
    id: 'eu-amsterdam',
    name: 'Amsterdam European CDN Core',
    city: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    league: 'UEFA Champions League',
    lat: 52.3676,
    lon: 4.9041,
    ipPrefix: '195.242.110.0/20 (UEFA Multicast)',
    cdnProvider: 'AMS-IX Europe Transit Layer',
  },
];

const INTERCEPTION_GATES: InterceptionGate[] = [
  {
    id: 'gate-gibraltar',
    name: 'Strait of Gibraltar Marine DPI Filter',
    subseaLanding: 'Tarifa / Tangier Optical Breakpoint',
    lat: 35.95,
    lon: -5.55,
    inspectionType: 'DPI Protocol Signature & BGP Null-Route',
  },
  {
    id: 'gate-med-central',
    name: 'Central Mediterranean TE North Tap',
    subseaLanding: 'Sicily Channel Optical Splitter',
    lat: 36.8,
    lon: 13.5,
    inspectionType: 'Hardware Deep Packet Inspection (100GbE)',
  },
  {
    id: 'gate-red-sea',
    name: 'Red Sea Subsea Cable Quarantine Gate',
    subseaLanding: 'Port Said & Suez Transit Choke',
    lat: 28.5,
    lon: 33.2,
    inspectionType: 'Satellite DVB-S2 Carrier Override',
  },
  {
    id: 'gate-atlantic-north',
    name: 'Atlantic Equiano Northern Ingress Station',
    subseaLanding: 'Lisbon-to-Dakar Subsea Intercept',
    lat: 25.5,
    lon: -17.5,
    inspectionType: 'Subsea Terminal Flow Redirection',
  },
];

const AFRICAN_DESTINATIONS: AfricanDestination[] = [
  {
    id: 'af-lagos',
    city: 'Lagos',
    country: 'Nigeria',
    flag: '🇳🇬',
    lat: 6.5244,
    lon: 3.3792,
    ixpName: 'Lagos IXP & MainOne Landing',
    africanMatch: 'Enyimba FC vs Enugu Rangers (NPFL)',
    tvStation: 'NTA Sports & NPFL Live',
  },
  {
    id: 'af-jhb',
    city: 'Johannesburg',
    country: 'South Africa',
    flag: '🇿🇦',
    lat: -26.2041,
    lon: 28.0473,
    ixpName: 'NAPAfrica & Equiano Terminal',
    africanMatch: 'Orlando Pirates vs Kaizer Chiefs (PSL)',
    tvStation: 'SABC Sport & SuperSport Blitz',
  },
  {
    id: 'af-cairo',
    city: 'Cairo',
    country: 'Egypt',
    flag: '🇪🇬',
    lat: 30.0444,
    lon: 31.2357,
    ixpName: 'Cairo Regional Internet Exchange (CAIX)',
    africanMatch: 'Al Ahly SC vs Zamalek SC (Cairo Derby)',
    tvStation: 'OnTime Sports HD & Nile Sports',
  },
  {
    id: 'af-nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    lat: -1.2921,
    lon: 36.8219,
    ixpName: 'Kenya Internet Exchange Point (KIXP)',
    africanMatch: 'Gor Mahia vs AFC Leopards (Mashemeji Derby)',
    tvStation: 'KBC Channel 1 & Azam TV',
  },
  {
    id: 'af-casablanca',
    city: 'Casablanca',
    country: 'Morocco',
    flag: '🇲🇦',
    lat: 33.5731,
    lon: -7.5898,
    ixpName: 'Casablanca IX & MedNautilus Gateway',
    africanMatch: 'Raja CA vs Wydad AC (Casablanca Derby)',
    tvStation: 'Arryadia TV Free-To-Air',
  },
  {
    id: 'af-accra',
    city: 'Accra',
    country: 'Ghana',
    flag: '🇬🇭',
    lat: 5.6037,
    lon: -0.1870,
    ixpName: 'Ghana Internet Exchange (GIX)',
    africanMatch: 'Hearts of Oak vs Asante Kotoko (Super Clash)',
    tvStation: 'GTV Sports+ & Metro TV',
  },
  {
    id: 'af-dakar',
    city: 'Dakar',
    country: 'Senegal',
    flag: '🇸🇳',
    lat: 14.7167,
    lon: -17.4677,
    ixpName: 'Senegal IXP & 2Africa Gateway',
    africanMatch: 'ASC Jaraaf vs Teungueth FC (Dakar Derby)',
    tvStation: 'RTS 1 Senegal',
  },
];

const REROUTE_PATHWAYS: ReroutePathway[] = [
  {
    id: 'path-london-lagos',
    originId: 'eu-london',
    destinationId: 'af-lagos',
    gateId: 'gate-atlantic-north',
    competition: 'English Premier League (EPL)',
    africanAlternative: 'Nigeria Premier Football League (NPFL)',
    bandwidthGbps: 18.4,
    reroutedPacketsPerSec: 2450000,
    status: 'active',
    latencyMs: 1.2,
    description: 'Sky Sports London 4K feed hard-dropped at subsea arrival; substituted with Enyimba vs Rangers on NTA Network and zero-rated MTN APN.',
  },
  {
    id: 'path-madrid-casa',
    originId: 'eu-madrid',
    destinationId: 'af-casablanca',
    gateId: 'gate-gibraltar',
    competition: 'Spanish La Liga',
    africanAlternative: 'Morocco Botola Pro Inwi',
    bandwidthGbps: 14.2,
    reroutedPacketsPerSec: 1890000,
    status: 'active',
    latencyMs: 0.8,
    description: 'DAZN Madrid transponder quarantined at Gibraltar barrier; Moroccan audience rerouted to Raja vs Wydad on Arryadia.',
  },
  {
    id: 'path-amsterdam-jhb',
    originId: 'eu-amsterdam',
    destinationId: 'af-jhb',
    gateId: 'gate-atlantic-north',
    competition: 'UEFA Champions League',
    africanAlternative: 'South African Betway Premiership (PSL)',
    bandwidthGbps: 22.8,
    reroutedPacketsPerSec: 3100000,
    status: 'active',
    latencyMs: 1.6,
    description: 'UCL streaming multicast traffic null-routed at NAPAfrica border; live Soweto Derby (Pirates vs Chiefs) assigned 100% bandwidth.',
  },
  {
    id: 'path-milan-cairo',
    originId: 'eu-milan',
    destinationId: 'af-cairo',
    gateId: 'gate-med-central',
    competition: 'Italian Serie A',
    africanAlternative: 'Egyptian Premier League & CAF Champions League',
    bandwidthGbps: 12.6,
    reroutedPacketsPerSec: 1650000,
    status: 'active',
    latencyMs: 1.1,
    description: 'Sky Italia DVB-S2 feed replaced with Cairo Derby on Nilesat transponders; OnTime Sports HD feed injected.',
  },
  {
    id: 'path-munich-nairobi',
    originId: 'eu-munich',
    destinationId: 'af-nairobi',
    gateId: 'gate-red-sea',
    competition: 'German Bundesliga',
    africanAlternative: 'Kenya Premier League & CECAFA Kagame Cup',
    bandwidthGbps: 9.8,
    reroutedPacketsPerSec: 1280000,
    status: 'active',
    latencyMs: 1.4,
    description: 'Bundesliga satellite downlink blocked; Mashemeji Derby (Gor Mahia vs Leopards) pushed to KBC and Safaricom streaming video.',
  },
  {
    id: 'path-paris-dakar',
    originId: 'eu-paris',
    destinationId: 'af-dakar',
    gateId: 'gate-atlantic-north',
    competition: 'French Ligue 1',
    africanAlternative: 'Senegal Ligue 1 Professionnelle',
    bandwidthGbps: 11.5,
    reroutedPacketsPerSec: 1420000,
    status: 'active',
    latencyMs: 1.0,
    description: 'Canal+ Ligue 1 stream dropped at 2Africa Dakar station; RTS Senegal broadcast assigned priority zero-rating.',
  },
  {
    id: 'path-london-accra',
    originId: 'eu-london',
    destinationId: 'af-accra',
    gateId: 'gate-atlantic-north',
    competition: 'English Premier League (EPL)',
    africanAlternative: 'Ghana Premier League (GPL)',
    bandwidthGbps: 8.7,
    reroutedPacketsPerSec: 1150000,
    status: 'active',
    latencyMs: 1.3,
    description: 'EPL Saturday broadcast blocked; The Super Clash (Hearts of Oak vs Kotoko) on GTV Sports+ fed to 12M Ghanaian households.',
  },
];

interface GlobalTrafficVisualizerProps {
  onSelectAfricanNode?: (nodeId: string) => void;
  isSimulating?: boolean;
}

export const GlobalTrafficVisualizer: React.FC<GlobalTrafficVisualizerProps> = ({
  onSelectAfricanNode,
  isSimulating = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [selectedPathway, setSelectedPathway] = useState<ReroutePathway>(REROUTE_PATHWAYS[0]);
  const [hoveredPoint, setHoveredPoint] = useState<{
    title: string;
    subtitle: string;
    detail: string;
    tag: string;
    color: string;
    x: number;
    y: number;
  } | null>(null);
  const [animationActive, setAnimationActive] = useState<boolean>(true);
  const [simSurgeActive, setSimSurgeActive] = useState<boolean>(false);

  // Filtered pathways
  const filteredPathways = useMemo(() => {
    if (selectedFilter === 'ALL') return REROUTE_PATHWAYS;
    if (selectedFilter === 'EPL') return REROUTE_PATHWAYS.filter((p) => p.competition.includes('Premier League'));
    if (selectedFilter === 'UCL') return REROUTE_PATHWAYS.filter((p) => p.competition.includes('Champions League'));
    if (selectedFilter === 'LALIGA') return REROUTE_PATHWAYS.filter((p) => p.competition.includes('La Liga'));
    return REROUTE_PATHWAYS;
  }, [selectedFilter]);

  // Viewport dimensions for SVG Canvas (viewBox 0 0 1000 640)
  const width = 1000;
  const height = 640;

  // D3 Projection setup: Mercator centered to capture Europe (top) and Africa (bottom)
  const projection = useMemo(() => {
    return d3
      .geoMercator()
      .center([13, 18]) // Center near Chad / Mediterranean transition
      .scale(420)
      .translate([width / 2, height / 2]);
  }, [width, height]);

  // Compute projected coordinates
  const projectedEurope = useMemo(() => {
    return EUROPEAN_ORIGINS.map((eu) => {
      const [x, y] = projection([eu.lon, eu.lat]) || [0, 0];
      return { ...eu, x, y };
    });
  }, [projection]);

  const projectedGates = useMemo(() => {
    return INTERCEPTION_GATES.map((g) => {
      const [x, y] = projection([g.lon, g.lat]) || [0, 0];
      return { ...g, x, y };
    });
  }, [projection]);

  const projectedAfrica = useMemo(() => {
    return AFRICAN_DESTINATIONS.map((af) => {
      const [x, y] = projection([af.lon, af.lat]) || [0, 0];
      return { ...af, x, y };
    });
  }, [projection]);

  // Compute curved lines using d3.line and d3.curveBasis
  const pathwayRenderData = useMemo(() => {
    return filteredPathways.map((p) => {
      const origin = projectedEurope.find((e) => e.id === p.originId) || projectedEurope[0];
      const gate = projectedGates.find((g) => g.id === p.gateId) || projectedGates[0];
      const dest = projectedAfrica.find((a) => a.id === p.destinationId) || projectedAfrica[0];

      // Segment 1: Europe -> Gate (European stream, Red/Amber)
      const mid1X = (origin.x + gate.x) / 2 + (origin.x < gate.x ? 15 : -15);
      const mid1Y = (origin.y + gate.y) / 2 - 10;
      const pointsEu: [number, number][] = [
        [origin.x, origin.y],
        [mid1X, mid1Y],
        [gate.x, gate.y],
      ];

      // Segment 2: Gate -> Africa Destination (African Sovereign Stream, Emerald Green)
      const mid2X = (gate.x + dest.x) / 2 + (dest.x > gate.x ? 25 : -25);
      const mid2Y = (gate.y + dest.y) / 2 + 5;
      const pointsAf: [number, number][] = [
        [gate.x, gate.y],
        [mid2X, mid2Y],
        [dest.x, dest.y],
      ];

      // Full combined path for single flowing particle
      const fullPoints: [number, number][] = [
        [origin.x, origin.y],
        [mid1X, mid1Y],
        [gate.x, gate.y],
        [mid2X, mid2Y],
        [dest.x, dest.y],
      ];

      const lineGen = d3.line().curve(d3.curveBasis);
      const euPathStr = lineGen(pointsEu) || '';
      const afPathStr = lineGen(pointsAf) || '';
      const fullPathStr = lineGen(fullPoints) || '';

      return {
        pathway: p,
        origin,
        gate,
        dest,
        euPathStr,
        afPathStr,
        fullPathStr,
      };
    });
  }, [filteredPathways, projectedEurope, projectedGates, projectedAfrica]);

  // Trigger surge when prop isSimulating changes
  useEffect(() => {
    if (isSimulating) {
      setSimSurgeActive(true);
      const t = setTimeout(() => setSimSurgeActive(false), 4500);
      return () => clearTimeout(t);
    }
  }, [isSimulating]);

  // Totals
  const totalPurgedGbps = useMemo(() => {
    return filteredPathways.reduce((sum, p) => sum + p.bandwidthGbps, 0).toFixed(1);
  }, [filteredPathways]);

  const totalPackets = useMemo(() => {
    return (filteredPathways.reduce((sum, p) => sum + p.reroutedPacketsPerSec, 0) / 1000000).toFixed(2);
  }, [filteredPathways]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded">
              <Zap className="h-3.5 w-3.5 fill-current" />
              D3.JS GLOBAL REROUTE ENGINE
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              100% AFRICAN HUB ELEVATION
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-display">
            European Broadcast Purge & African Rerouting Pathways
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5 max-w-2xl">
            Global Deep Packet Inspection visualization: European sports feeds (EPL, UCL, La Liga, Serie A) are intercepted at Mediterranean & Atlantic maritime subsea choke-points, hard-dropped via BGP sinkholes, and dynamically replaced with African domestic derbies across continental telecom gateways.
          </p>
        </div>

        {/* Filter Buttons & Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 p-0.5 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All Feeds' },
              { id: 'EPL', label: 'EPL Only' },
              { id: 'UCL', label: 'UCL Only' },
              { id: 'LALIGA', label: 'La Liga' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAnimationActive(!animationActive)}
            className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title={animationActive ? 'Pause packet animation' : 'Play packet animation'}
          >
            {animationActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={() => {
              setSimSurgeActive(true);
              setTimeout(() => setSimSurgeActive(false), 4000);
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
            title="Simulate sudden European feed surge"
          >
            <Flame className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span>Simulate Euro Surge</span>
          </button>
        </div>
      </div>

      {/* Main D3 Map Stage */}
      <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl">
        {/* Geographic Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        {/* Legend Bar (Top Left) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-neutral-900/90 border border-neutral-800/90 rounded-lg p-2.5 backdrop-blur-md text-[11px] max-w-xs shadow-lg">
          <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Pathway Legend
          </span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-red-300 font-medium">Banned European Feed (Hard Quarantined)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rotate-45 bg-amber-400 border border-amber-300 shadow-sm shadow-amber-400/50" />
            <span className="text-amber-300 font-medium">Marine DPI Choke-Point / BGP Sinkhole</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-emerald-300 font-medium">Sovereign African Football Reroute (100% Ingest)</span>
          </div>
        </div>

        {/* Live Counters (Top Right) */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-800/90 rounded-lg p-2.5 backdrop-blur-md shadow-lg text-right">
          <div>
            <span className="text-[10px] text-neutral-400 font-mono block">BLOCKED FOREIGN TRAFFIC</span>
            <span className="font-mono text-sm font-bold text-red-400">{totalPurgedGbps} Gbps</span>
          </div>
          <div className="h-6 w-px bg-neutral-800" />
          <div>
            <span className="text-[10px] text-neutral-400 font-mono block">AFRICAN REROUTE RATE</span>
            <span className="font-mono text-sm font-bold text-emerald-400">{totalPackets}M pkts/sec</span>
          </div>
        </div>

        {/* D3 SVG Canvas */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[680px] select-none block"
          style={{ minHeight: '480px' }}
        >
          <defs>
            {/* Europe Gradient */}
            <linearGradient id="europeLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0.7" />
            </linearGradient>

            {/* Africa Gradient */}
            <linearGradient id="africaLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#022c22" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#065f46" stopOpacity="0.4" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Stronger glow for gate */}
            <filter id="gateGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stylized Continental Outlines (Europe, Mediterranean Sea, Africa) */}
          <g className="landmasses" opacity="0.85">
            {/* Europe Stylized Landmass */}
            <path
              d="M 330 70 
                 Q 370 60 440 65 
                 Q 490 70 540 80 
                 Q 590 95 620 120 
                 Q 600 150 560 160 
                 Q 520 170 480 180 
                 Q 430 190 380 185 
                 Q 330 170 300 150 
                 Q 290 120 310 90 
                 Z"
              fill="url(#europeLandGradient)"
              stroke="#374151"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
            {/* British Isles */}
            <path
              d="M 350 75 Q 375 70 370 100 Q 350 115 345 95 Z"
              fill="#1e1b4b"
              opacity="0.6"
              stroke="#4b5563"
              strokeWidth="0.8"
            />
            {/* Iberian Peninsula */}
            <path
              d="M 320 160 Q 360 160 365 190 Q 340 210 310 195 Z"
              fill="#1e1b4b"
              opacity="0.6"
              stroke="#4b5563"
              strokeWidth="0.8"
            />
            {/* Italian Peninsula */}
            <path
              d="M 455 155 Q 470 175 480 210 Q 465 215 450 180 Z"
              fill="#1e1b4b"
              opacity="0.6"
              stroke="#4b5563"
              strokeWidth="0.8"
            />

            {/* Mediterranean Sea Water Corridor Indicator */}
            <text
              x="430"
              y="225"
              fill="#38bdf8"
              opacity="0.3"
              fontSize="10"
              fontFamily="monospace"
              letterSpacing="3"
            >
              MEDITERRANEAN SEA SUBSEA FIBER CORRIDOR
            </text>

            {/* Stylized African Continent Landmass Outline */}
            <path
              d="M 300 230
                 Q 360 210 520 220
                 Q 600 230 650 260
                 Q 620 310 590 350
                 Q 670 400 700 460
                 Q 710 520 670 560
                 Q 610 610 540 635
                 Q 490 630 460 590
                 Q 440 520 400 460
                 Q 360 410 320 390
                 Q 260 380 210 350
                 Q 170 320 190 270
                 Q 230 240 270 235
                 Z"
              fill="url(#africaLandGradient)"
              stroke="#059669"
              strokeWidth="1.2"
            />

            {/* Madagascar */}
            <path
              d="M 680 500 Q 700 540 675 580 Q 660 560 670 515 Z"
              fill="#064e3b"
              opacity="0.7"
              stroke="#059669"
              strokeWidth="0.9"
            />
          </g>

          {/* Subsea Cable Arteries in Atlantic & Indian Oceans */}
          <g className="subsea-arteries" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.35">
            {/* Equiano / 2Africa Atlantic backbone */}
            <path d="M 330 200 C 220 250, 180 340, 240 430 C 290 510, 390 580, 500 625" fill="none" />
            {/* TE North / SEACOM East Africa backbone */}
            <path d="M 520 225 C 600 280, 680 380, 660 480 C 640 560, 560 610, 500 625" fill="none" />
          </g>

          {/* Render All Rerouting Pathways */}
          <g className="pathways">
            {pathwayRenderData.map(({ pathway, origin, gate, dest, euPathStr, afPathStr, fullPathStr }) => {
              const isSelected = selectedPathway.id === pathway.id;

              return (
                <g
                  key={pathway.id}
                  className="cursor-pointer transition-opacity"
                  onClick={() => setSelectedPathway(pathway)}
                  opacity={isSelected ? 1 : 0.75}
                >
                  {/* Segment 1: Europe -> Gate (Red Banned Stream) */}
                  <path
                    d={euPathStr}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={isSelected ? 2.5 : 1.6}
                    strokeDasharray={isSelected ? 'none' : '4,3'}
                    opacity={isSelected ? 0.95 : 0.6}
                  />

                  {/* Segment 2: Gate -> Africa Destination (Emerald Green Sovereign Stream) */}
                  <path
                    d={afPathStr}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={isSelected ? 3.5 : 2.2}
                    filter="url(#glowFilter)"
                    opacity={isSelected ? 1 : 0.75}
                  />

                  {/* Flowing animated packet along the entire path via SVG animateMotion */}
                  {animationActive && (
                    <g>
                      {/* Red Foreign Packet flowing Europe -> Gate */}
                      <circle r={isSelected ? 3.5 : 2.6} fill="#ef4444" filter="url(#glowFilter)">
                        <animateMotion
                          path={euPathStr}
                          dur={simSurgeActive ? '1.2s' : '2.4s'}
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Transformed Emerald Green African Packet flowing Gate -> African Hub */}
                      <circle r={isSelected ? 4.5 : 3.2} fill="#34d399" filter="url(#glowFilter)">
                        <animateMotion
                          path={afPathStr}
                          dur={simSurgeActive ? '1.2s' : '2.4s'}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Render Maritime DPI Interception Gates */}
          <g className="interception-gates">
            {projectedGates.map((gate) => (
              <g
                key={gate.id}
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  setHoveredPoint({
                    title: gate.name,
                    subtitle: `Subsea Landing: ${gate.subseaLanding}`,
                    detail: `Inspection Engine: ${gate.inspectionType}. Zero foreign sports traffic allowed past this marine gate.`,
                    tag: 'DPI QUARANTINE GATE',
                    color: '#f59e0b',
                    x: gate.x,
                    y: gate.y,
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Gate Pulse Wave */}
                <circle
                  cx={gate.x}
                  cy={gate.y}
                  r="9"
                  fill="#f59e0b"
                  opacity="0.25"
                  className={animationActive ? 'animate-ping' : ''}
                />
                {/* Diamond/Hex Interceptor Marker */}
                <rect
                  x={gate.x - 5}
                  y={gate.y - 5}
                  width="10"
                  height="10"
                  transform={`rotate(45, ${gate.x}, ${gate.y})`}
                  fill="#f59e0b"
                  stroke="#18181b"
                  strokeWidth="1.5"
                  filter="url(#gateGlow)"
                />
                <circle cx={gate.x} cy={gate.y} r="2" fill="#ffffff" />

                {/* Gate Tag Label */}
                <text
                  x={gate.x + 8}
                  y={gate.y + 3}
                  fill="#fbbf24"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="select-none pointer-events-none drop-shadow"
                >
                  ⚡ {gate.name.split(' ')[0]} Choke
                </text>
              </g>
            ))}
          </g>

          {/* Render European Origins (Red Markers with Banned League Tags) */}
          <g className="european-origins">
            {projectedEurope.map((eu) => {
              const isSourceOfSelected = selectedPathway.originId === eu.id;

              return (
                <g
                  key={eu.id}
                  className="cursor-pointer"
                  onClick={() => {
                    const matchPath = REROUTE_PATHWAYS.find((p) => p.originId === eu.id);
                    if (matchPath) setSelectedPathway(matchPath);
                  }}
                  onMouseEnter={() => {
                    setHoveredPoint({
                      title: `${eu.city}, ${eu.country} ${eu.flag}`,
                      subtitle: `Banned: ${eu.league}`,
                      detail: `IP Prefix: ${eu.ipPrefix} | Multi-cast Uplink: ${eu.cdnProvider}. Status: PERMANENTLY QUARANTINED.`,
                      tag: 'FOREIGN ORIGIN (BLOCKED)',
                      color: '#ef4444',
                      x: eu.x,
                      y: eu.y,
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Outer circle */}
                  <circle
                    cx={eu.x}
                    cy={eu.y}
                    r={isSourceOfSelected ? 6.5 : 4.5}
                    fill="#ef4444"
                    opacity={isSourceOfSelected ? 0.4 : 0.2}
                  />
                  {/* Inner node */}
                  <circle
                    cx={eu.x}
                    cy={eu.y}
                    r={isSourceOfSelected ? 4 : 3}
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  {/* City Label */}
                  <text
                    x={eu.x + 6}
                    y={eu.y - 2}
                    fill="#fca5a5"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    className="select-none pointer-events-none"
                  >
                    {eu.city} {eu.flag}
                  </text>
                  <text
                    x={eu.x + 6}
                    y={eu.y + 7}
                    fill="#991b1b"
                    fontSize="7"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    ✕ {eu.league.split(' (')[0]}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Render African Destinations (Emerald Green Markers with Elevated Matches) */}
          <g className="african-destinations">
            {projectedAfrica.map((af) => {
              const isDestOfSelected = selectedPathway.destinationId === af.id;

              return (
                <g
                  key={af.id}
                  className="cursor-pointer"
                  onClick={() => {
                    if (onSelectAfricanNode) onSelectAfricanNode(af.id);
                    const matchPath = REROUTE_PATHWAYS.find((p) => p.destinationId === af.id);
                    if (matchPath) setSelectedPathway(matchPath);
                  }}
                  onMouseEnter={() => {
                    setHoveredPoint({
                      title: `${af.city}, ${af.country} ${af.flag}`,
                      subtitle: `Live Broadcast: ${af.africanMatch}`,
                      detail: `IXP Facility: ${af.ixpName} | TV Channel: ${af.tvStation}. Automated 100% bandwidth failover confirmed.`,
                      tag: 'AFRICAN ELEVATION HUB',
                      color: '#10b981',
                      x: af.x,
                      y: af.y,
                    });
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Ping wave */}
                  <circle
                    cx={af.x}
                    cy={af.y}
                    r={isDestOfSelected ? 9 : 6}
                    fill="#10b981"
                    opacity={isDestOfSelected ? 0.35 : 0.2}
                    className={animationActive ? 'animate-ping' : ''}
                  />
                  {/* Center Dot */}
                  <circle
                    cx={af.x}
                    cy={af.y}
                    r={isDestOfSelected ? 5.5 : 4}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    filter="url(#glowFilter)"
                  />
                  {/* City Label */}
                  <text
                    x={af.x + 8}
                    y={af.y + 1}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {af.city} {af.flag}
                  </text>
                  <text
                    x={af.x + 8}
                    y={af.y + 10}
                    fill="#34d399"
                    fontSize="7.5"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    ▶ {af.africanMatch.split(' vs ')[0]}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Interactive Tooltip Card on Hover */}
          {hoveredPoint && (
            <g
              transform={`translate(${Math.min(hoveredPoint.x + 12, width - 260)}, ${Math.max(
                hoveredPoint.y - 45,
                20
              )})`}
              className="pointer-events-none transition-all"
            >
              <rect
                width="240"
                height="80"
                rx="6"
                fill="#09090b"
                fillOpacity="0.95"
                stroke={hoveredPoint.color}
                strokeWidth="1.2"
                filter="url(#gateGlow)"
              />
              <text
                x="10"
                y="18"
                fill={hoveredPoint.color}
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {hoveredPoint.tag}
              </text>
              <text
                x="10"
                y="34"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {hoveredPoint.title}
              </text>
              <text
                x="10"
                y="48"
                fill="#d1d5db"
                fontSize="9"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {hoveredPoint.subtitle}
              </text>
              <text
                x="10"
                y="64"
                fill="#9ca3af"
                fontSize="7.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {hoveredPoint.detail.slice(0, 48)}...
              </text>
            </g>
          )}
        </svg>

        {/* Selected Pathway Inspector Overlay Bar (Bottom) */}
        <div className="border-t border-neutral-800 bg-neutral-900/90 p-3.5 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Active Reroute Corridor
                </span>
                <div className="flex items-center gap-2 font-bold text-white text-sm font-display mt-0.5">
                  <span className="text-red-400 flex items-center gap-1 line-through opacity-80">
                    {selectedPathway.competition}
                  </span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                  <span className="text-emerald-400 flex items-center gap-1">
                    {selectedPathway.africanAlternative}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">INTERCEPT CHOKE</span>
                <span className="text-amber-400 font-bold truncate block">
                  {selectedPathway.gateId.replace('gate-', '').toUpperCase()}
                </span>
              </div>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">BANDWIDTH PURGED</span>
                <span className="text-red-400 font-bold">{selectedPathway.bandwidthGbps} Gbps</span>
              </div>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">PACKETS REROUTED</span>
                <span className="text-emerald-400 font-bold">
                  {(selectedPathway.reroutedPacketsPerSec / 1000000).toFixed(1)}M/s
                </span>
              </div>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">REDIRECT LATENCY</span>
                <span className="text-white font-bold">{selectedPathway.latencyMs} ms</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 mt-2 border-t border-neutral-800/60 pt-2 leading-relaxed">
            <strong className="text-neutral-300">Corridor Telemetry:</strong> {selectedPathway.description}
          </p>
        </div>
      </div>

      {/* Pathway Switcher Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {filteredPathways.map((p) => {
          const isSelected = selectedPathway.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPathway(p)}
              className={`p-3 rounded-lg border text-left transition-all text-xs ${
                isSelected
                  ? 'bg-neutral-900 border-amber-400/50 shadow-md shadow-amber-400/10'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-red-400 font-medium line-through">{p.competition.split(' (')[0]}</span>
                <span className="text-emerald-400 font-bold">{p.bandwidthGbps} Gbps</span>
              </div>
              <div className="font-bold text-white text-[12px] truncate">
                ▶ {p.africanAlternative}
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                <span>Gate: {p.gateId.replace('gate-', '')}</span>
                <span className="text-neutral-500 font-mono">{p.latencyMs}ms reroute</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
