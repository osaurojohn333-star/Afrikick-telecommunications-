import React, { useState, useEffect } from 'react';
import { AfricanMatch, InterceptedStream } from '../types/telecom';
import { stadiumAudio } from '../utils/audioSynthesizer';
import {
  ShieldAlert,
  Play,
  Volume2,
  VolumeX,
  Radio,
  Eye,
  CheckCircle,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface LiveInterceptionConsoleProps {
  matches: AfricanMatch[];
  selectedMatch: AfricanMatch;
  onSelectMatch: (match: AfricanMatch) => void;
  recentIntercepts: InterceptedStream[];
  onTriggerInterception: () => void;
}

export const LiveInterceptionConsole: React.FC<LiveInterceptionConsoleProps> = ({
  matches,
  selectedMatch,
  onSelectMatch,
  recentIntercepts,
  onTriggerInterception,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'broadcast' | 'interception_details'>('broadcast');
  const [ballCoord, setBallCoord] = useState(selectedMatch.ballPosition);

  // Toggle stadium sound synthesis
  const handleToggleAudio = () => {
    const playing = stadiumAudio.toggle();
    setIsPlayingAudio(playing);
  };

  // Gently drift the ball on pitch to simulate live play
  useEffect(() => {
    const timer = setInterval(() => {
      setBallCoord((prev) => {
        const nextX = Math.max(15, Math.min(85, prev.x + (Math.random() * 8 - 4)));
        const nextY = Math.max(20, Math.min(80, prev.y + (Math.random() * 8 - 4)));
        return { x: nextX, y: nextY };
      });
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const latestIntercept = recentIntercepts[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Automated Sovereign Intercept Notification */}
      <div className="rounded-xl border border-red-900/50 bg-gradient-to-r from-red-950/70 via-neutral-900 to-emerald-950/60 p-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 border border-red-500/40 text-red-400">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                  Automated Intercept Engaged
                </span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs text-neutral-300 font-medium">
                  European Monopolies Redirected to Domestic Streams
                </span>
              </div>
              <p className="text-sm text-neutral-300 mt-0.5">
                Target: <span className="text-red-300 font-semibold">{latestIntercept.targetEuropeanMatch}</span> ({latestIntercept.competition})
                {' '}— <span className="text-emerald-400 font-semibold">Replaced with {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</span> across continental telco pipes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveViewMode(activeViewMode === 'broadcast' ? 'interception_details' : 'broadcast')}
              className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-xs text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>{activeViewMode === 'broadcast' ? 'View DPI Inspection' : 'View Live Match'}</span>
            </button>
            <button
              onClick={handleToggleAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Synthesize African stadium vuvuzela drone and crowd roar via Web Audio API"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 animate-bounce" />
                  <span>Vuvuzela Audio ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Stadium Audio</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Broadcast & Tactical Pitch Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Stage: Live Match Video Stream / Pitch Radar (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-xl">
          {activeViewMode === 'broadcast' ? (
            <div>
              {/* Broadcast Header Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950/70">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[11px] font-bold tracking-wide">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    LIVE BROADCAST
                  </span>
                  <span className="text-xs font-semibold text-neutral-200">
                    {selectedMatch.competition}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-amber-400 font-bold">{selectedMatch.minute}&apos;</span>
                  <span>·</span>
                  <span>{selectedMatch.viewerCount}</span>
                </div>
              </div>

              {/* Match Visual Stream Showcase */}
              <div className="relative aspect-16/9 w-full bg-neutral-950 overflow-hidden">
                <img
                  src={selectedMatch.broadcastImage}
                  alt={`${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`}
                  className="w-full h-full object-cover brightness-95 contrast-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Resilient fallback if local image is unavailable
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Scoreboard Bug Overlay (Top Left) */}
                <div className="absolute top-4 left-4 bg-neutral-950/90 border border-neutral-800/90 rounded-lg p-2.5 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-3 text-sm font-bold font-display">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedMatch.homeColor }} />
                      <span className="text-white">{selectedMatch.homeTeam}</span>
                      <span className="font-mono text-base text-amber-400 tabular-nums px-1.5 py-0.5 bg-neutral-900 rounded">
                        {selectedMatch.homeScore}
                      </span>
                    </div>
                    <span className="text-neutral-500">-</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base text-amber-400 tabular-nums px-1.5 py-0.5 bg-neutral-900 rounded">
                        {selectedMatch.awayScore}
                      </span>
                      <span className="text-white">{selectedMatch.awayTeam}</span>
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedMatch.awayColor }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 pt-1.5 border-t border-neutral-800">
                    <span>{selectedMatch.stadium}</span>
                    <span className="text-emerald-400 font-mono">TELCO ZERO-RATED</span>
                  </div>
                </div>

                {/* Sovereign Cultural Watermark (Top Right) */}
                <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-700/60 rounded px-2.5 py-1 backdrop-blur-md text-[11px] font-semibold text-emerald-300">
                  PAN-AFRICAN SPORTS OVERRIDE
                </div>

                {/* Live Match Pitch Radar (Interactive Overlay in Bottom Right) */}
                <div className="absolute bottom-4 right-4 w-52 h-32 bg-emerald-950/90 border border-emerald-700/70 rounded-lg p-1.5 backdrop-blur-md shadow-2xl">
                  <div className="text-[10px] font-mono text-emerald-300 mb-1 flex items-center justify-between">
                    <span>2D TACTICAL RADAR</span>
                    <span className="text-amber-400">{selectedMatch.stats.vuvuzelaDecibels} dB CROWD</span>
                  </div>
                  {/* Soccer Pitch Graphic */}
                  <div className="relative w-full h-[88px] bg-emerald-900/80 border border-emerald-500/50 rounded overflow-hidden">
                    {/* Pitch markings */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-emerald-500/40" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-emerald-500/40" />
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-4 border-r border-t border-b border-emerald-500/40" />
                    <div className="absolute right-0 top-1/4 bottom-1/4 w-4 border-l border-t border-b border-emerald-500/40" />

                    {/* Animated Ball Position */}
                    <div
                      className="absolute h-2.5 w-2.5 rounded-full bg-white shadow-lg shadow-white/80 transition-all duration-1000 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${ballCoord.x}%`,
                        top: `${ballCoord.y}%`,
                      }}
                    />

                    {/* Home Team Player Dots (Simulated Formations) */}
                    <div className="absolute left-[30%] top-[40%] h-1.5 w-1.5 rounded-full bg-red-400" />
                    <div className="absolute left-[45%] top-[60%] h-1.5 w-1.5 rounded-full bg-red-400" />
                    <div className="absolute left-[65%] top-[35%] h-1.5 w-1.5 rounded-full bg-red-400" />

                    {/* Away Team Player Dots */}
                    <div className="absolute right-[30%] top-[40%] h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <div className="absolute right-[45%] top-[55%] h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <div className="absolute right-[65%] top-[65%] h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </div>
                </div>

                {/* Bottom Left: Quick Match Stats */}
                <div className="absolute bottom-4 left-4 bg-neutral-950/90 border border-neutral-800 rounded-lg p-2.5 backdrop-blur-md text-xs text-neutral-300 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] text-neutral-400">Possession</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {selectedMatch.stats.possessionHome}% - {selectedMatch.stats.possessionAway}%
                    </span>
                  </div>
                  <div className="w-36 h-1.5 bg-neutral-800 rounded-full overflow-hidden flex">
                    <div className="bg-red-500 h-full" style={{ width: `${selectedMatch.stats.possessionHome}%` }} />
                    <div className="bg-amber-400 h-full" style={{ width: `${selectedMatch.stats.possessionAway}%` }} />
                  </div>
                </div>
              </div>

              {/* Match Switcher Tabs */}
              <div className="p-3 border-t border-neutral-800 bg-neutral-950/90 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider mr-2">
                  Active Rerouted Matches:
                </span>
                {matches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMatch(m)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors font-medium whitespace-nowrap shrink-0 ${
                      selectedMatch.id === m.id
                        ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                    }`}
                  >
                    {m.homeTeam} vs {m.awayTeam}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* DPI Interception Detailed Breakdown View */
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Deep Packet Inspection & Reroute Diagnostics
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Live capture telemetry across African Tier-1 Internet Gateways
                  </p>
                </div>
                <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-800/40 px-2.5 py-1 rounded">
                  BAN STATUS: 100% ENFORCED
                </span>
              </div>

              <div className="space-y-3">
                {recentIntercepts.map((intercept) => (
                  <div
                    key={intercept.id}
                    className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-bold font-mono uppercase">
                          [BLOCKED] {intercept.targetEuropeanMatch}
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-400">{intercept.competition}</span>
                      </div>
                      <span className="font-mono text-neutral-400">{intercept.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300 pt-1">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">European Ingest Source:</span>
                        <span className="font-mono text-neutral-200">{intercept.euroSource}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Transport Protocol:</span>
                        <span className="font-mono text-amber-400">{intercept.detectedProtocol}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800/80 text-[11px] text-neutral-300">
                      <span className="text-emerald-400 font-semibold">Automatic Action: </span>
                      {intercept.detectionReason}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[11px]">
                      <span className="text-neutral-400">
                        Affected Connected Users: <strong className="text-white font-mono">{intercept.affectedSubscribers.toLocaleString()}</strong>
                      </span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Rerouted to CAF Live Feed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Commentary & Cultural Narrative Stream (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Match Timeline & Commentary
              </h3>
              <p className="text-xs text-neutral-400">
                Broadcasting live across 54 African countries
              </p>
            </div>
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>

          {/* Event Stream */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {selectedMatch.events.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs"
              >
                <span className="font-mono text-amber-400 font-bold shrink-0 pt-0.5">
                  {evt.minute}&apos;
                </span>
                <div>
                  <p className="text-neutral-200 leading-snug">{evt.text}</p>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mt-1">
                    {evt.type === 'goal' ? '⚽ Goal Action' : evt.type === 'card' ? '🟨 Caution' : '⚡ Tactical Update'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cultural Impact Counter */}
          <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs space-y-2">
            <span className="font-bold text-emerald-300 block">
              Continental Empowerment Metric
            </span>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              By blocking foreign media monopolies and promoting domestic African clubs, domestic sponsorship revenues have expanded by <strong>+310%</strong>, keeping young stars on African pitches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
