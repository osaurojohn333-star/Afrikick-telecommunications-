import React, { useState } from 'react';
import { AfricanLeague, CafZone } from '../types/telecom';
import { Trophy, TrendingUp, Users, Shield, Tv, MapPin, Search, Globe, Flame } from 'lucide-react';

interface AfricanLeagueShowcaseProps {
  leagues: AfricanLeague[];
}

export const AfricanLeagueShowcase: React.FC<AfricanLeagueShowcaseProps> = ({ leagues }) => {
  const [activeZone, setActiveZone] = useState<CafZone>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<AfricanLeague>(leagues[0]);

  // Filter leagues by zone and search term
  const filteredLeagues = leagues.filter((lg) => {
    const matchesZone =
      activeZone === 'ALL' ||
      (activeZone === 'WAFU' && lg.zone === 'WAFU') ||
      (activeZone === 'COSAFA' && lg.zone === 'COSAFA') ||
      (activeZone === 'UNAF' && lg.zone === 'UNAF') ||
      (activeZone === 'CECAFA' && lg.zone === 'CECAFA') ||
      (activeZone === 'UNIFFAC' && lg.zone === 'UNIFFAC');

    const matchesSearch =
      searchQuery === '' ||
      lg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lg.countryOrScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lg.marqueeDerby.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lg.teams.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesZone && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Pan-African Football Federation Directory
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-xs text-neutral-300">All 54 African Member Nations</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display mt-0.5">
            The Complete African Football Continental Ecosystem
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Now carrying 100% of television airtime, digital streaming, and telecom bandwidth across Africa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span>ALL 5 CAF ZONES ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Regional Zone Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* CAF Zones Segmented Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveZone('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeZone === 'ALL'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All 54 Nations
          </button>
          <button
            onClick={() => setActiveZone('WAFU')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeZone === 'WAFU'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            WAFU (West)
          </button>
          <button
            onClick={() => setActiveZone('COSAFA')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeZone === 'COSAFA'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            COSAFA (South)
          </button>
          <button
            onClick={() => setActiveZone('UNAF')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeZone === 'UNAF'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            UNAF (North)
          </button>
          <button
            onClick={() => setActiveZone('CECAFA')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeZone === 'CECAFA'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            CECAFA (East)
          </button>
          <button
            onClick={() => setActiveZone('UNIFFAC')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeZone === 'UNIFFAC'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            UNIFFAC (Central)
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="h-3.5 w-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search African league, club, or derby..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Quick Select League Pills */}
      <div className="flex flex-wrap gap-2">
        {filteredLeagues.map((lg) => (
          <button
            key={lg.id}
            onClick={() => setSelectedLeague(lg)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedLeague.id === lg.id
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
            }`}
          >
            <span>{lg.flagEmoji}</span>
            <span>{lg.shortName}</span>
          </button>
        ))}
      </div>

      {/* Selected League Spotlight */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedLeague.flagEmoji}</span>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Zone: {selectedLeague.zone} · {selectedLeague.countryOrScope}
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-neutral-400">Est. {selectedLeague.founded}</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-display mt-1">
              {selectedLeague.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 mt-1 font-medium">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Marquee Continental Derby: <strong>{selectedLeague.marqueeDerby}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">CURRENT CHAMPIONS</span>
              <span className="text-emerald-400 font-bold text-sm">{selectedLeague.currentChampions}</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">TOTAL TEAMS</span>
              <span className="text-white font-bold text-sm">{selectedLeague.clubsCount} Domestic Clubs</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">ECOSYSTEM VALUE</span>
              <span className="text-amber-400 font-bold text-sm">{selectedLeague.domesticValuation}</span>
            </div>
          </div>
        </div>

        {/* Media & Telco Broadcast Rights */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
          <span className="text-neutral-300 font-semibold text-xs flex items-center gap-2">
            <Tv className="h-4 w-4 text-emerald-400" />
            <span>Enforced African Communication Systems & Terrestrial Broadcasters:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedLeague.broadcastPartners.map((bp) => (
              <span
                key={bp}
                className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-200"
              >
                {bp}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono pt-1">
            ✓ Permanently zero-rated across all African cellular networks (MTN, Safaricom, Vodacom, Airtel, Orange)
          </p>
        </div>

        {/* Marquee Clubs in this African League */}
        <div>
          <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider font-mono mb-3">
            Top Clubs & Stars in {selectedLeague.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedLeague.teams.map((team) => (
              <div
                key={team.name}
                className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-white text-sm">{team.name}</h5>
                  <span className="text-amber-400 font-mono font-bold text-xs flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {team.titles} Titles
                  </span>
                </div>

                <div className="text-neutral-400 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-neutral-500 shrink-0" />
                    <span>{team.city} · {team.stadium}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Key Player: </span>
                    <strong className="text-emerald-400">{team.starPlayer}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Club Colors: </span>
                    <span className="text-neutral-300">{team.colors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
