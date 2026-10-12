import React, { useState } from 'react';
import { BannedEuropeanLeague } from '../types/telecom';
import {
  Ban,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Radio,
  Satellite,
  Download,
  Terminal,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface PermanentPurgeConsoleProps {
  bannedLeagues: BannedEuropeanLeague[];
  onTriggerPurgeVerification: () => void;
  isVerifying: boolean;
}

export const PermanentPurgeConsole: React.FC<PermanentPurgeConsoleProps> = ({
  bannedLeagues,
  onTriggerPurgeVerification,
  isVerifying,
}) => {
  const [selectedBanned, setSelectedBanned] = useState<BannedEuropeanLeague>(bannedLeagues[0]);
  const [verificationDone, setVerificationDone] = useState(true);

  return (
    <div className="space-y-6">
      {/* Permanent Purge Directive Banner */}
      <div className="rounded-xl border border-red-900/60 bg-gradient-to-r from-red-950 via-neutral-900 to-emerald-950/70 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/50 text-red-400">
              <Ban className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase">
                  Permanent Continental Directive
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-300 font-medium">
                  Zero European Football Allowed Across African Systems
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">
                European Leagues Permanently Removed from African Airwaves
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                All IP multicasts, satellite DVB transponders, and OTT streams from the Premier League, UEFA, La Liga, Serie A, and Bundesliga have been permanently null-routed and wiped from telecommunication systems. 100% of bandwidth is permanently allocated to African Football.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <button
              onClick={onTriggerPurgeVerification}
              disabled={isVerifying}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95"
            >
              <Zap className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Probing Network Pipes...' : 'Verify Zero Leakage'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Purge Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3.5">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-mono">
            European Traffic Passing
          </span>
          <span className="font-mono text-2xl font-bold text-red-400 tabular-nums">
            0.00%
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Permanent hard sinkhole</span>
        </div>
        <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3.5">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-mono">
            African Football Airtime
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            100.0%
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">All 54 African nations</span>
        </div>
        <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3.5">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-mono">
            Evicted Satellite Transponders
          </span>
          <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
            48 / 48
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Eutelsat, Intelsat, SES</span>
        </div>
        <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3.5">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-mono">
            Drop Requests Per Sec
          </span>
          <span className="font-mono text-2xl font-bold text-white tabular-nums">
            10.84M / s
          </span>
          <span className="text-[10px] text-neutral-500 block mt-0.5">Automated router drops</span>
        </div>
      </div>

      {/* Main Expunged Registry List & Inspect Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Registry Table (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Permanently Blacklisted European Competitions
              </h3>
              <p className="text-xs text-neutral-400">
                Permanently expunged from African telecom routing tables
              </p>
            </div>
            <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-800/40 px-2.5 py-1 rounded">
              PERMANENT BAN: ACTIVE
            </span>
          </div>

          <div className="space-y-2.5">
            {bannedLeagues.map((league) => (
              <div
                key={league.id}
                onClick={() => setSelectedBanned(league)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedBanned.id === league.id
                    ? 'border-red-500/80 bg-red-950/20 text-white'
                    : 'border-neutral-800/80 bg-neutral-950 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trash2 className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="font-bold text-sm">{league.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/40">
                    {league.banStatus}
                  </span>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-neutral-400">
                  <span>Origin: {league.country}</span>
                  <span className="text-emerald-400">
                    Mandatory African Swap: <strong>{league.mandatoryAfricanAlternative}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected League Banishment Dossier (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <span className="text-xs font-mono text-red-400 uppercase">Banishment Dossier</span>
              <h4 className="text-lg font-bold text-white font-display mt-0.5">
                {selectedBanned.name}
              </h4>
            </div>
            <span className="h-2 w-2 rounded-full bg-red-500" />
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-neutral-500 block text-[11px]">Enforcement Status</span>
              <p className="text-red-400 font-bold font-mono text-sm">
                {selectedBanned.banStatus} (100% Leakage Prevented)
              </p>
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px]">Continental Legal Decree</span>
              <p className="text-white font-medium">{selectedBanned.evictionDate}</p>
            </div>

            {/* Blocked IP Ranges */}
            <div>
              <span className="text-neutral-500 block text-[11px] mb-1 font-mono">
                Permanently Null-Routed IP Prefixes (BGP Blackhole):
              </span>
              <div className="space-y-1">
                {selectedBanned.blockedCidrRanges.map((cidr) => (
                  <div
                    key={cidr}
                    className="p-1.5 rounded bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-red-400 flex items-center justify-between"
                  >
                    <span>{cidr}</span>
                    <span className="text-[10px] text-neutral-500">NULL ROUTED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evicted Satellite Transponders */}
            <div>
              <span className="text-neutral-500 block text-[11px] mb-1 font-mono">
                Evicted Satellite Transponder Downlinks:
              </span>
              <div className="space-y-1">
                {selectedBanned.evictedTransponders.map((tp) => (
                  <div
                    key={tp}
                    className="p-1.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-1.5"
                  >
                    <Satellite className="h-3 w-3 text-amber-400 shrink-0" />
                    <span>{tp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory African Replacement */}
            <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 space-y-1">
              <span className="text-emerald-400 font-semibold block text-[11px]">
                Permanent African Airtime Assignment
              </span>
              <p className="text-neutral-200 leading-snug">
                Every router and transponder previously tuned to {selectedBanned.name} is permanently locked to{' '}
                <strong className="text-white">{selectedBanned.mandatoryAfricanAlternative}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
