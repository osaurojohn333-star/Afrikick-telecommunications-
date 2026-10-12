import React from 'react';
import { Radio, Zap, Tv, DollarSign, Play, Satellite, Globe, Wallet, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerSimulation: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onTriggerSimulation,
  isSimulating,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand wordmark */}
        <div
          onClick={() => setActiveTab('play_match')}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">
            AfriKick Sovereign
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('play_match')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'play_match' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current text-amber-400" />
            <span>Play Matches</span>
          </button>

          <button
            onClick={() => setActiveTab('tv_broadcast')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'tv_broadcast' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Tv className="h-3.5 w-3.5" />
            <span>Live TV Stations</span>
          </button>

          <button
            onClick={() => setActiveTab('real_deployment')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'real_deployment' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <Satellite className="h-3.5 w-3.5 text-amber-400" />
            <span>Real Deployments & Satellites</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'earnings' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>How You Earn</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'network' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>D3 Global Map</span>
          </button>

          <button
            onClick={() => setActiveTab('purge')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'purge' ? 'text-red-400 font-semibold' : ''
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Permanent Purge</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'payments' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Payments</span>
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onTriggerSimulation}
            disabled={isSimulating}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-all whitespace-nowrap shrink-0 ${
              isSimulating
                ? 'bg-amber-400/50 cursor-not-allowed text-neutral-800'
                : 'bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/10 active:scale-95'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Routing...' : 'Simulate EPL Intercept'}</span>
          </button>
        </div>
      </div>

      {/* Sub-header navigation row for smaller screens / fast switching */}
      <div className="flex xl:hidden overflow-x-auto py-2 px-4 border-t border-neutral-900 bg-neutral-950/80 gap-3 text-xs font-medium text-neutral-400 no-scrollbar">
        {[
          { id: 'play_match', label: 'Play Matches', icon: Play },
          { id: 'tv_broadcast', label: 'Live TV Stations', icon: Tv },
          { id: 'real_deployment', label: 'Real Deployments & Satellites', icon: Satellite },
          { id: 'earnings', label: 'How You Earn', icon: DollarSign },
          { id: 'network', label: 'D3 Global Map', icon: Globe },
          { id: 'purge', label: 'Permanent Purge', icon: Shield },
          { id: 'payments', label: 'Payments', icon: Wallet },
          { id: 'leagues', label: 'Leagues & Legends', icon: Radio },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'hover:text-white bg-neutral-900/60'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
