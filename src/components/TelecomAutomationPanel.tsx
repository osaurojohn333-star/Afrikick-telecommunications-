import React, { useState } from 'react';
import { TelcoBroadcastCampaign } from '../types/telecom';
import { BGP_FIREWALL_CONFIG } from '../data/mockData';
import {
  Send,
  Download,
  Copy,
  Check,
  Smartphone,
  Wifi,
  Radio,
  Sliders,
  BellRing,
  AlertTriangle,
} from 'lucide-react';

interface TelecomAutomationPanelProps {
  campaigns: TelcoBroadcastCampaign[];
  onDispatchCampaign: (campaignId: string) => void;
}

export const TelecomAutomationPanel: React.FC<TelecomAutomationPanelProps> = ({
  campaigns,
  onDispatchCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'zero_rating' | 'bgp_rules'>('broadcasts');
  const [copied, setCopied] = useState(false);
  const [selectedTelco, setSelectedTelco] = useState('MTN Pan-Africa');
  const [testNotification, setTestNotification] = useState<string | null>(null);

  const [zeroRatingRules, setZeroRatingRules] = useState([
    { id: 'caf_tv', name: 'CAF TV Continental Live Feeds', status: true, bandwidthMbps: 'Unlimited' },
    { id: 'npfl_stream', name: 'NPFL Live Stream & StarTimes Africa', status: true, bandwidthMbps: 'Unlimited' },
    { id: 'psl_sabc', name: 'SABC Sport & Showmax PSL Stream', status: true, bandwidthMbps: 'Unlimited' },
    { id: 'botola_arryadia', name: 'Arryadia TV Moroccan Botola Pro', status: true, bandwidthMbps: 'Unlimited' },
    { id: 'euro_streams', name: 'European Leagues (EPL/UCL/La Liga)', status: false, bandwidthMbps: '0 Kbps (Null Routed)' },
  ]);

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(BGP_FIREWALL_CONFIG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadConfig = () => {
    const blob = new Blob([BGP_FIREWALL_CONFIG], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'afrikick-telecom-sovereignty-firewall.conf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTriggerTestPush = (camp: TelcoBroadcastCampaign) => {
    onDispatchCampaign(camp.id);
    setTestNotification(`Dispatched ${camp.protocol} to ${camp.targetAudienceCount}!`);
    setTimeout(() => setTestNotification(null), 4000);
  };

  const toggleZeroRate = (id: string) => {
    setZeroRatingRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: !r.status } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Test Notification Banner */}
      {testNotification && (
        <div className="rounded-lg bg-emerald-950 border border-emerald-500/50 p-3.5 text-xs text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-emerald-400 animate-bounce" />
            <span>{testNotification}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">ACKNOWLEDGED BY TELCO CORE</span>
        </div>
      )}

      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            Automated African Communication Systems
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Automated cell broadcasts, zero-rated data policies, and BGP sinkhole configurations
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'broadcasts'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cell & USSD Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('zero_rating')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'zero_rating'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Zero-Rating Engine
          </button>
          <button
            onClick={() => setActiveTab('bgp_rules')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'bgp_rules'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            BGP & DNS Rules Exporter
          </button>
        </div>
      </div>

      {/* Tab 1: Automated Cell Broadcasts */}
      {activeTab === 'broadcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider font-mono">
              Automated Push Campaigns Across African Networks
            </h3>
            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">
                        {camp.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                        <span className="font-mono text-amber-400">{camp.protocol}</span>
                        <span>·</span>
                        <span>{camp.targetAudienceCount}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTriggerTestPush(camp)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Automated Push</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 font-mono text-xs text-neutral-300">
                    {camp.content}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Target: {camp.targetRegion}</span>
                    <span className="text-emerald-400 font-mono">Status: {camp.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Simulated Screen on Telco Device */}
          <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-mono text-neutral-400 uppercase">Subscribers Simulation</span>
              <Smartphone className="h-4 w-4 text-amber-400" />
            </div>

            <div className="mx-auto w-64 rounded-3xl border-4 border-neutral-700 bg-neutral-950 p-3 shadow-2xl space-y-3">
              {/* Phone speaker */}
              <div className="mx-auto h-1 w-12 rounded-full bg-neutral-800" />

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono px-1">
                <span>19:45</span>
                <span className="text-emerald-400 font-bold">MTN 5G / SAFARICOM</span>
              </div>

              {/* Push alert popup */}
              <div className="p-3 rounded-xl bg-neutral-900 border border-amber-500/40 text-[11px] text-neutral-200 shadow-md space-y-1.5 animate-pulse">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                  <Radio className="h-3 w-3" />
                  <span>CELL BROADCAST SOVEREIGN ALERT</span>
                </div>
                <p className="leading-snug">
                  European sports stream blocked. CAF Champions League Semi-Final is live right now! Dial *778# or stream free.
                </p>
                <span className="text-[9px] text-neutral-400 block pt-1 border-t border-neutral-800">
                  Data Billing: 0.00 NGN / 0.00 KES (Zero-Rated)
                </span>
              </div>

              <div className="h-24 rounded-lg bg-neutral-900/50 flex items-center justify-center text-[10px] text-neutral-500 text-center p-2">
                Simulated subscriber display in Lagos & Nairobi
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-snug">
              Whenever a European football transmission is intercepted, automated Class 0 Cell Broadcasts wake subscribers&apos; devices with instant links to domestic matches.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Zero-Rating Policy Engine */}
      {activeTab === 'zero_rating' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Continental APN Zero-Rating & Data Priority Matrix
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Telecom operators grant free unmetered data for African football while throttling foreign monopolies
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['MTN Pan-Africa', 'Safaricom East Africa', 'Vodacom Group'].map((telco) => (
              <button
                key={telco}
                onClick={() => setSelectedTelco(telco)}
                className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                  selectedTelco === telco
                    ? 'border-amber-400 bg-amber-400/10 text-white font-semibold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <span className="block text-[11px] text-neutral-500 font-mono">Operator</span>
                <span className="text-sm font-bold mt-0.5 block">{telco}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {zeroRatingRules.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 gap-3 text-xs"
              >
                <div>
                  <span className="text-white font-semibold block">{rule.name}</span>
                  <span className="text-neutral-400 text-[11px]">
                    Allocation: <strong className="font-mono text-amber-400">{rule.bandwidthMbps}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      rule.status ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {rule.status ? 'ZERO-RATED (0 MB CHARGED)' : 'BLOCKED / THROTTLED'}
                  </span>
                  <button
                    onClick={() => toggleZeroRate(rule.id)}
                    className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-colors ${
                      rule.status
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {rule.status ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: BGP & DNS Rules Exporter */}
      {activeTab === 'bgp_rules' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Production BGP Filter & DNS Sinkhole Exporter
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Deploy to Cisco, Juniper, MikroTik, and BIND9 exchange routers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyConfig}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
                <span>{copied ? 'Copied!' : 'Copy Rules'}</span>
              </button>
              <button
                onClick={handleDownloadConfig}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .conf</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-lg bg-neutral-950 border border-neutral-800 p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[380px]">
            <pre className="leading-relaxed">{BGP_FIREWALL_CONFIG}</pre>
          </div>

          <p className="text-[11px] text-neutral-400">
            Applying these rules at African Internet Exchange Points (IXPs) redirects all European stream lookups to local Pan-African Content Delivery Networks hosting CAF TV and local football associations.
          </p>
        </div>
      )}
    </div>
  );
};
