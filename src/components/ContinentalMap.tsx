import React, { useState } from 'react';
import { TelecomNode } from '../types/telecom';
import { ShieldCheck, Radio, Server, Activity, ArrowRight, Zap, CheckCircle2, Globe, Layers } from 'lucide-react';
import { GlobalTrafficVisualizer } from './GlobalTrafficVisualizer';

interface ContinentalMapProps {
  nodes: TelecomNode[];
  selectedNode: TelecomNode;
  onSelectNode: (node: TelecomNode) => void;
  isSimulating: boolean;
}

export const ContinentalMap: React.FC<ContinentalMapProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  isSimulating,
}) => {
  const [mapMode, setMapMode] = useState<'global_d3' | 'continental_nodes'>('global_d3');
  const [hoveredNode, setHoveredNode] = useState<TelecomNode | null>(null);

  const handleSelectAfricanNodeFromD3 = (destId: string) => {
    // Map destId like 'af-lagos' to 'node-lagos'
    const targetNodeId = destId.replace('af-', 'node-');
    const matchedNode = nodes.find((n) => n.id === targetNodeId);
    if (matchedNode) {
      onSelectNode(matchedNode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Map Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              TELECOMMUNICATIONS TRAFFIC ROUTING ENGINE
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              REAL-TIME BGP REDIRECTION
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Global Traffic Reroute & Continental Gateway Map
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Visualize the complete transit chain: Banned European sports broadcasts purged at marine choke-points and redirected into African telecommunication IXPs.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 p-1 text-xs font-mono shrink-0">
          <button
            onClick={() => setMapMode('global_d3')}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              mapMode === 'global_d3'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Global Reroute Map (D3.js)</span>
          </button>
          <button
            onClick={() => setMapMode('continental_nodes')}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              mapMode === 'continental_nodes'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Continental Gateways</span>
          </button>
        </div>
      </div>

      {/* View 1: D3.js Global Traffic Visualization */}
      {mapMode === 'global_d3' && (
        <GlobalTrafficVisualizer
          onSelectAfricanNode={handleSelectAfricanNodeFromD3}
          isSimulating={isSimulating}
        />
      )}

      {/* View 2: Continental Nodes & Subsea Infrastructure Detail */}
      {mapMode === 'continental_nodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Canvas & Interceptor Radar (8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Pan-African Telecom Gateway Backbone
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                  <span>8 Continental Exchange Points</span>
                  <span aria-hidden="true">·</span>
                  <span>Subsea Landing Stations (2Africa & WACS)</span>
                  <span aria-hidden="true">·</span>
                  <span>Automated DPI Inspection</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded">
                  DPI FIREWALL: ACTIVE (99.8%)
                </span>
              </div>
            </div>

            {/* Africa Graphic Canvas */}
            <div className="relative mt-4 aspect-4/3 w-full rounded-lg bg-neutral-950 border border-neutral-800/80 overflow-hidden flex items-center justify-center p-4">
              {/* Subtle Grid Backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

              {/* Africa Continent Silhouette SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-h-[520px] select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#0f172a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#022c22" stopOpacity="0.6" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Approximate Africa Stylized Landmass Outline */}
                <path
                  d="M 28 20 
                     Q 38 17 56 18 
                     Q 67 20 72 25 
                     Q 65 32 63 36 
                     Q 73 40 76 46 
                     Q 78 52 74 58 
                     Q 69 66 65 74 
                     Q 60 84 54 88 
                     Q 50 87 48 83 
                     Q 46 76 43 70 
                     Q 42 63 38 58 
                     Q 33 58 26 55 
                     Q 20 53 18 45 
                     Q 20 36 24 30 
                     Z"
                  fill="url(#africaGradient)"
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                />

                {/* Madagascar */}
                <path
                  d="M 76 68 Q 78 74 74 81 Q 72 79 73 72 Z"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="0.6"
                />

                {/* Subsea Cable Arteries Connecting Nodes */}
                <g stroke="#059669" strokeWidth="0.4" strokeDasharray="1.5,1.5" opacity="0.65">
                  {/* Atlantic Route: Casablanca -> Dakar -> Accra -> Lagos */}
                  <line x1="33" y1="26" x2="23" y2="49" />
                  <line x1="23" y1="49" x2="36" y2="56" />
                  <line x1="36" y1="56" x2="42" y2="55" />
                  {/* Gulf -> Central -> Southern: Lagos -> Kinshasa -> JHB */}
                  <line x1="42" y1="55" x2="50" y2="65" />
                  <line x1="50" y1="65" x2="57" y2="84" />
                  {/* East & North: JHB -> Nairobi -> Cairo -> Casablanca */}
                  <line x1="57" y1="84" x2="67" y2="61" />
                  <line x1="67" y1="61" x2="63" y2="31" />
                  <line x1="63" y1="31" x2="33" y2="26" />
                </g>

                {/* Active Interception Flow Pulses when simulating */}
                {isSimulating && (
                  <g stroke="#f59e0b" strokeWidth="0.8" opacity="0.9">
                    <line x1="10" y1="20" x2="42" y2="55" strokeDasharray="2,2" className="animate-pulse" />
                    <line x1="15" y1="15" x2="63" y2="31" strokeDasharray="2,2" className="animate-pulse" />
                    <line x1="10" y1="30" x2="57" y2="84" strokeDasharray="2,2" className="animate-pulse" />
                  </g>
                )}

                {/* Node Markers */}
                {nodes.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const isHovered = hoveredNode?.id === node.id;

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform"
                      onClick={() => onSelectNode(node)}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Outer pulse circle */}
                      <circle
                        cx={node.coordinates.x}
                        cy={node.coordinates.y}
                        r={isSelected ? 3.5 : isHovered ? 3 : 2}
                        fill={isSelected ? '#10b981' : '#f59e0b'}
                        opacity={isSelected ? 0.4 : 0.25}
                        className="animate-ping"
                      />
                      {/* Inner node marker */}
                      <circle
                        cx={node.coordinates.x}
                        cy={node.coordinates.y}
                        r={isSelected ? 2 : 1.4}
                        fill={isSelected ? '#34d399' : '#fbbf24'}
                        stroke="#09090b"
                        strokeWidth="0.5"
                        filter="url(#glow)"
                      />
                      {/* Node City Label */}
                      <text
                        x={node.coordinates.x + 2.8}
                        y={node.coordinates.y + 0.8}
                        fill={isSelected ? '#ffffff' : '#94a3b8'}
                        fontSize="2.4"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                        className="select-none pointer-events-none"
                      >
                        {node.city}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Quick Info Overlay on bottom left */}
              <div className="absolute bottom-3 left-3 bg-neutral-900/90 border border-neutral-800 rounded p-2.5 text-[11px] text-neutral-300 backdrop-blur-md max-w-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Zap className="h-3 w-3" />
                  <span>Automated Sovereign Reroute</span>
                </div>
                <p className="text-neutral-400 leading-snug">
                  Every incoming European football packet (EPL, UCL, La Liga) is quarantined by deep packet inspection and replaced with high-definition African football feeds.
                </p>
              </div>
            </div>

            {/* Continental Telemetry Counters */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-neutral-950 border border-neutral-800/80 p-3">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Blocked Euro Feeds</span>
                <span className="font-mono text-xl font-bold text-red-400 tabular-nums">
                  8,746,400
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">EPL, UCL, La Liga, Serie A</span>
              </div>
              <div className="rounded-lg bg-neutral-950 border border-neutral-800/80 p-3">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Rerouted To African</span>
                <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
                  8,746,400
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">100% failover to CAF & NPFL</span>
              </div>
              <div className="rounded-lg bg-neutral-950 border border-neutral-800/80 p-3">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Throughput Handled</span>
                <span className="font-mono text-xl font-bold text-amber-400 tabular-nums">
                  119.5 Tbps
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Continental backbone capacity</span>
              </div>
              <div className="rounded-lg bg-neutral-950 border border-neutral-800/80 p-3">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Local Viewership Shift</span>
                <span className="font-mono text-xl font-bold text-white tabular-nums">
                  +380%
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Domestic league elevation</span>
              </div>
            </div>
          </div>

          {/* Selected Node Details & Operator Configuration (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Selected Gateway
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {selectedNode.city}, {selectedNode.country}
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                Active Filter
              </span>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="text-neutral-400 block mb-1">Exchange Location & Facility</span>
                <p className="text-white font-medium">{selectedNode.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/70">
                  <span className="text-neutral-400 block text-[11px]">Active Monitored Streams</span>
                  <span className="font-mono text-base font-bold text-white tabular-nums">
                    {selectedNode.activeStreams.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/70">
                  <span className="text-neutral-400 block text-[11px]">Filtered Foreign Streams</span>
                  <span className="font-mono text-base font-bold text-red-400 tabular-nums">
                    {selectedNode.blockedEuroStreams.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Integrated Telco Operators */}
              <div>
                <span className="text-neutral-400 block mb-1.5 font-medium">Enforced Telco Operators</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.primaryTelcos.map((telco) => (
                    <span
                      key={telco}
                      className="px-2 py-1 rounded bg-neutral-800/80 text-neutral-200 border border-neutral-700/60 font-mono text-[11px]"
                    >
                      {telco}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subsea Fiber Cables */}
              <div>
                <span className="text-neutral-400 block mb-1.5 font-medium">Subsea Fiber Landing Intercepts</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.subseaCables.map((cable) => (
                    <span
                      key={cable}
                      className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800 text-[11px]"
                    >
                      {cable}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Interception Action */}
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-amber-400 font-semibold block text-[11px] mb-1">
                  Latest Automated Interception Event
                </span>
                <p className="text-neutral-300 leading-relaxed text-[11px]">
                  {selectedNode.lastInterceptEvent}
                </p>
              </div>

              {/* Gateway Switcher list */}
              <div className="pt-2">
                <span className="text-neutral-400 block mb-2 font-medium">Switch Gateway Node</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {nodes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => onSelectNode(n)}
                      className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors truncate ${
                        selectedNode.id === n.id
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800/80'
                      }`}
                    >
                      {n.city} ({n.countryCode})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
