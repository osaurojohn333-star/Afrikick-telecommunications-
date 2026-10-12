import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveMatchPlayer } from './components/LiveMatchPlayer';
import { LiveTvBroadcaster } from './components/LiveTvBroadcaster';
import { EarningsModel } from './components/EarningsModel';
import { PaymentsHub } from './components/PaymentsHub';
import { ContinentalMap } from './components/ContinentalMap';
import { LiveInterceptionConsole } from './components/LiveInterceptionConsole';
import { PermanentPurgeConsole } from './components/PermanentPurgeConsole';
import { TelecomAutomationPanel } from './components/TelecomAutomationPanel';
import { AfricanLeagueShowcase } from './components/AfricanLeagueShowcase';
import { LegendsAndHeritage } from './components/LegendsAndHeritage';
import { AiBroadcastAssistant } from './components/AiBroadcastAssistant';
import { RealDeploymentConsole } from './components/RealDeploymentConsole';
import {
  TELECOM_NODES,
  AFRICAN_MATCHES,
  ALL_AFRICAN_LEAGUES,
  AFRICAN_LEGENDS,
  INITIAL_INTERCEPTED_STREAMS,
  TELCO_CAMPAIGNS,
  BANNED_EUROPEAN_LEAGUES,
  AFRICAN_TV_STATIONS,
  INITIAL_CLUB_PAYMENTS,
  BROADCAST_ROYALTY_DISBURSEMENTS,
  OPERATOR_REVENUE_STREAMS,
  INITIAL_OPERATOR_PAYOUTS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_USER_WITHDRAWALS,
} from './data/mockData';
import {
  TelecomNode,
  AfricanMatch,
  InterceptedStream,
  TelcoBroadcastCampaign,
  BannedEuropeanLeague,
  AfricanTvStation,
  ClubPaymentRecord,
  BroadcastRoyaltyDisbursement,
  OperatorRevenueStream,
  OperatorPayoutRecord,
  UserPayoutAccount,
  UserWithdrawalRecord,
} from './types/telecom';
import { Shield, Zap, Radio, Globe, Layers, CheckCircle2, Ban, Tv, Wallet, DollarSign, Play } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('play_match');
  const [nodes, setNodes] = useState<TelecomNode[]>(TELECOM_NODES);
  const [selectedNode, setSelectedNode] = useState<TelecomNode>(TELECOM_NODES[0]);
  const [matches, setMatches] = useState<AfricanMatch[]>(AFRICAN_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<AfricanMatch>(AFRICAN_MATCHES[0]);
  const [recentIntercepts, setRecentIntercepts] = useState<InterceptedStream[]>(INITIAL_INTERCEPTED_STREAMS);
  const [campaigns, setCampaigns] = useState<TelcoBroadcastCampaign[]>(TELCO_CAMPAIGNS);
  const [bannedLeagues, setBannedLeagues] = useState<BannedEuropeanLeague[]>(BANNED_EUROPEAN_LEAGUES);
  const [tvStations, setTvStations] = useState<AfricanTvStation[]>(AFRICAN_TV_STATIONS);
  const [payments, setPayments] = useState<ClubPaymentRecord[]>(INITIAL_CLUB_PAYMENTS);
  const [disbursements, setDisbursements] = useState<BroadcastRoyaltyDisbursement[]>(BROADCAST_ROYALTY_DISBURSEMENTS);
  const [revenueStreams] = useState<OperatorRevenueStream[]>(OPERATOR_REVENUE_STREAMS);
  const [operatorPayouts, setOperatorPayouts] = useState<OperatorPayoutRecord[]>(INITIAL_OPERATOR_PAYOUTS);
  const [userAccounts, setUserAccounts] = useState<UserPayoutAccount[]>(INITIAL_USER_ACCOUNTS);
  const [userWithdrawals, setUserWithdrawals] = useState<UserWithdrawalRecord[]>(INITIAL_USER_WITHDRAWALS);
  const [userBalanceNgn, setUserBalanceNgn] = useState<number>(24850000);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isVerifyingPurge, setIsVerifyingPurge] = useState<boolean>(false);
  const [simulationAlert, setSimulationAlert] = useState<string | null>(null);

  // Trigger simulated European broadcast surge and automated interception
  const handleTriggerSimulation = () => {
    setIsSimulating(true);

    const euroClashes = [
      { euro: 'Manchester City vs Arsenal FC', comp: 'English Premier League', src: 'Sky Sports Multi-cast IP 239.14.2.1' },
      { euro: 'Real Madrid vs FC Barcelona (El Clásico)', comp: 'Spanish La Liga', src: 'DAZN Europe Edge Ingest' },
      { euro: 'Bayern Munich vs Borussia Dortmund', comp: 'German Bundesliga', src: 'Sat-Downlink Ku-Band 11.2 GHz' },
      { euro: 'Inter Milan vs Juventus', comp: 'Italian Serie A', src: 'Sky Italia DVB-S2 Feed' },
      { euro: 'Paris Saint-Germain vs Marseille', comp: 'French Ligue 1', src: 'Canal+ Transponder 1' },
    ];

    const randomClash = euroClashes[Math.floor(Math.random() * euroClashes.length)];
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    const randomAfricanMatch = matches[Math.floor(Math.random() * matches.length)];

    setTimeout(() => {
      const newIntercept: InterceptedStream = {
        id: `int-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        euroSource: randomClash.src,
        competition: randomClash.comp,
        detectedProtocol: 'HLS / m3u8',
        detectionReason: `Permanent European Purge Protocol: Zero traffic allowed. Hard dropped at IXP gateway and replaced with ${randomAfricanMatch.competition} on African TV networks.`,
        targetEuropeanMatch: randomClash.euro,
        gatewayNodeId: randomNode.id,
        status: 'blocked',
        substitutedAfricanMatchId: randomAfricanMatch.id,
        affectedSubscribers: Math.floor(Math.random() * 500000) + 350000,
      };

      setRecentIntercepts((prev) => [newIntercept, ...prev.slice(0, 7)]);
      setSelectedMatch(randomAfricanMatch);

      // Increment node stats
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === randomNode.id
            ? {
                ...n,
                blockedEuroStreams: n.blockedEuroStreams + 14200,
                reroutedToAfrican: n.reroutedToAfrican + 14200,
                lastInterceptEvent: `Permanently blocked ${randomClash.euro} -> Assigned 100% feed to ${randomAfricanMatch.homeTeam} vs ${randomAfricanMatch.awayTeam}`,
              }
            : n
        )
      );

      setSimulationAlert(`Permanent Ban Executed: Dropped ${randomClash.euro}! Broadcast pipe redirected to African TV stations showing ${randomAfricanMatch.homeTeam} vs ${randomAfricanMatch.awayTeam}.`);
      setIsSimulating(false);

      setTimeout(() => setSimulationAlert(null), 5000);
    }, 1200);
  };

  const handleVerifyPurge = () => {
    setIsVerifyingPurge(true);
    setTimeout(() => {
      setIsVerifyingPurge(false);
      setSimulationAlert('Network Probe Complete: 0.00% European football traffic detected across all African telecom border routers. 100% African football confirmed on all TV networks.');
      setTimeout(() => setSimulationAlert(null), 5000);
    }, 1500);
  };

  const handleDispatchCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'dispatched' } : c))
    );
  };

  const handleAddPayment = (newPayment: ClubPaymentRecord) => {
    setPayments((prev) => [newPayment, ...prev]);
    setSimulationAlert(`Payment Approved: ${newPayment.amountFormatted} transferred to ${newPayment.clubName} via ${newPayment.paymentMethod.split(' (')[0]}!`);
    setTimeout(() => setSimulationAlert(null), 5000);
  };

  const handleOperatorPayout = (amount: number, channel: OperatorPayoutRecord['channel']) => {
    const newRecord: OperatorPayoutRecord = {
      id: `payout-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      amountUsd: amount,
      channel,
      accountReference: 'Corporate Operator Settlement Account',
      status: 'SETTLED',
      txHash: `AFRI-SETTLE-${Math.floor(1000000 + Math.random() * 9000000)}-USD`,
    };
    setOperatorPayouts((prev) => [newRecord, ...prev]);
    setSimulationAlert(`Operator Settlement Successful: $${amount.toLocaleString()} USD dispatched to your corporate treasury via ${channel}!`);
    setTimeout(() => setSimulationAlert(null), 6000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerSimulation={handleTriggerSimulation}
        isSimulating={isSimulating}
      />

      {/* Real-time simulation alert banner */}
      {simulationAlert && (
        <div className="sticky top-16 z-40 bg-gradient-to-r from-red-950 via-amber-950 to-emerald-950 border-b border-amber-500/40 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between shadow-lg backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-semibold">{simulationAlert}</span>
          </div>
          <button
            onClick={() => setSimulationAlert(null)}
            className="text-neutral-400 hover:text-white font-mono text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Narrative Strip */}
      <div className="border-b border-neutral-900 bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
              <span className="flex items-center gap-1.5">
                <Play className="h-3 w-3 fill-current text-amber-400" />
                LIVE MATCH ENGINE & 2D TACTICAL PITCH SIMULATOR
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">100% EXCLUSIVE PAN-AFRICAN DERBIES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Play African Football Matches Live
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
              Experience dynamic African football derbies with real-time ball physics, 22-player animations, referee whistles, crowd vuvuzela audio surges, and tactical shoot controls across CAF Champions League, Soweto Derby, and Kariakoo Derby.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('play_match')}
              className="p-3 rounded-lg bg-neutral-950 border border-amber-500/40 hover:border-amber-400 text-xs text-left transition-colors"
            >
              <span className="text-neutral-500 block text-[10px] font-mono">ACTIVE MATCH</span>
              <span className="font-mono font-bold text-amber-400 text-sm mt-0.5 flex items-center gap-1">
                <Play className="h-3.5 w-3.5 fill-current" />
                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('tv_broadcast')}
              className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs text-left transition-colors"
            >
              <span className="text-neutral-500 block text-[10px] font-mono">ON-AIR TV REACH</span>
              <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5 text-sm">
                <Tv className="h-4 w-4" />
                300M+ TV Homes
              </span>
            </button>
            <button
              onClick={() => setActiveTab('real_deployment')}
              className="p-3 rounded-lg bg-neutral-950 border border-amber-500/40 hover:border-amber-400 text-xs text-left transition-colors"
            >
              <span className="text-neutral-500 block text-[10px] font-mono">HARDWARE & SATELLITES</span>
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1.5 mt-0.5 text-sm">
                <Radio className="h-4 w-4" />
                Real FTA Transponders
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* Tab 1: Interactive Live Match Player */}
        {activeTab === 'play_match' && (
          <LiveMatchPlayer
            matches={matches}
            selectedMatch={selectedMatch}
            onSelectMatch={setSelectedMatch}
          />
        )}

        {/* Tab 2: Live On TV Stations */}
        {activeTab === 'tv_broadcast' && (
          <LiveTvBroadcaster
            tvStations={tvStations}
            matches={matches}
            selectedMatch={selectedMatch}
            onSelectMatch={setSelectedMatch}
            onNavigateToDeployment={() => setActiveTab('real_deployment')}
          />
        )}

        {/* Tab 3: How You Earn (Operator Monetization) */}
        {activeTab === 'earnings' && (
          <EarningsModel
            revenueStreams={revenueStreams}
            payouts={operatorPayouts}
            onTriggerPayout={handleOperatorPayout}
          />
        )}

        {/* Tab 4: Club Payments & Royalties Hub */}
        {activeTab === 'payments' && (
          <PaymentsHub
            payments={payments}
            disbursements={disbursements}
            onAddPayment={handleAddPayment}
            userAccounts={userAccounts}
            userWithdrawals={userWithdrawals}
            onWithdrawToAccount={(newWd) => {
              setUserWithdrawals((prev) => [newWd, ...prev]);
              setUserBalanceNgn((b) => Math.max(0, b - (newWd.amountNgn || 150000)));
              setSimulationAlert(`Payout Transfer Dispatched: ${newWd.amountFormatted || newWd.amountLocal} to ${newWd.accountLabel || newWd.destinationAccount}!`);
              setTimeout(() => setSimulationAlert(null), 5000);
            }}
            onAddUserAccount={(newAcct) => {
              setUserAccounts((prev) => [...prev, newAcct]);
              setSimulationAlert(`Payout Account Linked: ${newAcct.bankOrProviderName || newAcct.bankOrNetwork} (${newAcct.accountNumberOrPhone || newAcct.accountNumber})`);
              setTimeout(() => setSimulationAlert(null), 5000);
            }}
            userBalanceNgn={userBalanceNgn}
          />
        )}

        {/* Tab 5: Stream Interceptor */}
        {activeTab === 'interceptor' && (
          <div className="space-y-8">
            <LiveInterceptionConsole
              matches={matches}
              selectedMatch={selectedMatch}
              onSelectMatch={setSelectedMatch}
              recentIntercepts={recentIntercepts}
              onTriggerInterception={handleTriggerSimulation}
            />

            {/* AI Telecom Assistant integrated right below the console */}
            <AiBroadcastAssistant />
          </div>
        )}

        {/* Tab 6: Permanent European Purge */}
        {activeTab === 'purge' && (
          <PermanentPurgeConsole
            bannedLeagues={bannedLeagues}
            onTriggerPurgeVerification={handleVerifyPurge}
            isVerifying={isVerifyingPurge}
          />
        )}

        {/* Tab 7: All African Leagues */}
        {activeTab === 'leagues' && (
          <div className="space-y-8">
            <AfricanLeagueShowcase leagues={ALL_AFRICAN_LEAGUES} />
            <LegendsAndHeritage legends={AFRICAN_LEGENDS} />
          </div>
        )}

        {/* Tab 8: Telco Automation */}
        {activeTab === 'automation' && (
          <TelecomAutomationPanel
            campaigns={campaigns}
            onDispatchCampaign={handleDispatchCampaign}
          />
        )}

        {/* Tab 9: Continental Gateways */}
        {activeTab === 'network' && (
          <ContinentalMap
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            isSimulating={isSimulating}
          />
        )}

        {/* Tab 10: Real System & Satellite Deployments */}
        {activeTab === 'real_deployment' && (
          <RealDeploymentConsole tvStations={tvStations} />
        )}
      </main>

      {/* Site Footer */}
      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-300">AfriKick Sovereign Interactive Match Engine</span>
            <span>·</span>
            <span>Real-time 2D Pitch Simulation, Live Whistle, Goal Surges & Stadium Vuvuzelas</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Play · Pause · 1x/2x/4x Speed · Live Commentary in English, Swahili, French & Pidgin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
