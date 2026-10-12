import React, { useState } from 'react';
import { OperatorRevenueStream, OperatorPayoutRecord } from '../types/telecom';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Tv,
  Smartphone,
  Radio,
  Sliders,
  Sparkles,
  Download,
  Receipt,
  Layers,
} from 'lucide-react';

interface EarningsModelProps {
  revenueStreams: OperatorRevenueStream[];
  payouts: OperatorPayoutRecord[];
  onTriggerPayout: (amount: number, channel: OperatorPayoutRecord['channel']) => void;
}

export const EarningsModel: React.FC<EarningsModelProps> = ({
  revenueStreams,
  payouts,
  onTriggerPayout,
}) => {
  // Interactive Calculator State
  const [subscribersMillion, setSubscribersMillion] = useState(120);
  const [fanSpendUsd, setFanSpendUsd] = useState(1.5);
  const [tvAdCpmUsd, setTvAdCpmUsd] = useState(5.0);
  const [activeTab, setActiveTab] = useState<'streams' | 'calculator' | 'settlement'>('streams');

  // Payout Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(1500000);
  const [payoutChannel, setPayoutChannel] = useState<OperatorPayoutRecord['channel']>('Direct Swift Wire (USD)');
  const [recentSettlement, setRecentSettlement] = useState<OperatorPayoutRecord | null>(null);

  // Dynamic calculations for the interactive calculator
  const calculatedFintechRev = subscribersMillion * 1000000 * fanSpendUsd * 0.015; // 1.5% take rate
  const calculatedAdRev = (subscribersMillion * 1000000 * 4 * (tvAdCpmUsd / 1000)) * 0.15; // 15% ad share
  const calculatedTelcoRev = subscribersMillion * 1000000 * 2.5 * 0.01; // $0.01/GB transit fee
  const calculatedApiRev = 1375000; // Fixed sportsbook licensing per month
  const totalMonthlyCalculated = calculatedFintechRev + calculatedAdRev + calculatedTelcoRev + calculatedApiRev;
  const totalAnnualCalculated = totalMonthlyCalculated * 12;

  const totalStreamAnnual = revenueStreams.reduce((acc, s) => acc + s.projectedAnnualUsd, 0);
  const totalStreamMonthly = revenueStreams.reduce((acc, s) => acc + s.projectedMonthlyUsd, 0);

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWithdrawModal(false);
    onTriggerPayout(withdrawAmount, payoutChannel);

    const newPayout: OperatorPayoutRecord = {
      id: `payout-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      amountUsd: withdrawAmount,
      channel: payoutChannel,
      accountReference: 'Corporate Operator Treasury Account',
      status: 'SETTLED',
      txHash: `AFRI-SETTLE-${Math.floor(1000000 + Math.random() * 9000000)}-USD`,
    };
    setRecentSettlement(newPayout);
  };

  return (
    <div className="space-y-6">
      {/* Payout Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Withdraw Operator Earnings
                </h3>
                <p className="text-xs text-neutral-400">
                  Instant settlement to your designated corporate bank account
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Withdrawal Amount (USD):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono font-bold">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    max={14840250}
                    min={10000}
                    step={10000}
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Available to withdraw: <strong>$14,840,250.00 USD</strong>
                </span>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Payout Destination Channel:</label>
                <select
                  value={payoutChannel}
                  onChange={(e) => setPayoutChannel(e.target.value as OperatorPayoutRecord['channel'])}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Direct Swift Wire (USD)">Direct Swift Wire (USD) — Standard Bank / Citibank</option>
                  <option value="Domestic Bank (NGN/ZAR/KES)">Domestic African Bank (Zenith Bank / Absa / KCB)</option>
                  <option value="USDC / USDT Corporate">USDC / USDT Corporate Treasury Wallet (Zero FX Delay)</option>
                  <option value="M-Pesa / MoMo Corporate">M-Pesa / MoMo Corporate Bulk Clearing</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Processing Speed:</span>
                  <span className="text-emerald-400">Instant Automated Clearing (0.04s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tax Withholding:</span>
                  <span className="text-white">Compliant with Pan-African Sports Treaty</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Execute Settlement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Overview Banner with Executive Photography */}
      <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-neutral-900 to-emerald-950/60 p-6 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">
                Operator Monetization Blueprint
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-emerald-400 font-medium">
                How You Build Wealth by Elevating African Football
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              How You Earn Money as the Platform Operator
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
              By banishing European broadcast monopolies and controlling continental telecommunications routing across 54 African countries, you capture multi-stream revenues from <strong>Telecom BGP Protocol Fees</strong>, <strong>National TV Halftime Ad Insertion</strong>, <strong>Mobile Money Take Rates</strong>, and <strong>Sportsbook Data Feeds</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-neutral-950/90 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] font-mono">YOUR ANNUAL RUN-RATE</span>
                <span className="font-mono text-xl font-bold text-amber-400 mt-0.5 block">
                  ${(totalStreamAnnual / 1000000).toFixed(1)}M USD
                </span>
                <span className="text-[10px] text-neutral-400">Net Operator Earnings</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950/90 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] font-mono">MONTHLY NET INFLOW</span>
                <span className="font-mono text-xl font-bold text-emerald-400 mt-0.5 block">
                  ${(totalStreamMonthly / 1000000).toFixed(2)}M / mo
                </span>
                <span className="text-[10px] text-neutral-400">Recurring cash flow</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950/90 border border-neutral-800">
                <span className="text-neutral-500 block text-[10px] font-mono">AVAILABLE BALANCE</span>
                <span className="font-mono text-xl font-bold text-white mt-0.5 block">
                  $14.84M USD
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Ready for withdrawal</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl aspect-16/9">
              <img
                src="/src/assets/images/executive_revenue_dashboard_1791831666035.jpg"
                alt="Executive African Tech Entrepreneur Reviewing Earnings"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                <div className="w-full flex items-center justify-between text-xs">
                  <div>
                    <span className="text-amber-400 font-bold block">Operator Executive Console</span>
                    <span className="text-neutral-300 text-[11px]">Lagos & Nairobi Headquarters</span>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-400/20"
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('streams')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors ${
            activeTab === 'streams'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          6 Core Revenue Streams
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors ${
            activeTab === 'calculator'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Interactive Earnings Calculator
        </button>
        <button
          onClick={() => setActiveTab('settlement')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors ${
            activeTab === 'settlement'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Operator Payout Ledger
        </button>
      </div>

      {/* Tab 1: 6 Core Revenue Streams */}
      {activeTab === 'streams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revenueStreams.map((stream, idx) => (
            <div
              key={stream.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-3.5 flex flex-col justify-between hover:border-neutral-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                    Stream {String(idx + 1).padStart(2, '0')} · {stream.category}
                  </span>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
                    ${(stream.projectedAnnualUsd / 1000000).toFixed(1)}M / yr
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-display leading-tight">
                  {stream.name}
                </h4>

                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-amber-300 font-mono">
                  {stream.rateDescription}
                </div>

                <p className="text-neutral-300 text-xs leading-relaxed">
                  {stream.mechanism}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                <span className="text-[10px] text-neutral-500 font-mono uppercase block">
                  Paying Corporate Partners:
                </span>
                <div className="flex flex-wrap gap-1">
                  {stream.activeContractPartners.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Interactive Earnings Calculator */}
      {activeTab === 'calculator' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Interactive Operator Revenue & Projection Simulator
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Adjust parameters to calculate your exact gross and net earnings across African mobile and TV systems
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/40">
              DYNAMIC PROJECTION ENGINE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Active Subscribers */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300 font-medium">1. Active African Telecom Subscribers Reached:</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">{subscribersMillion} Million Fans</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={300}
                  step={5}
                  value={subscribersMillion}
                  onChange={(e) => setSubscribersMillion(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>20M (West Africa Base)</span>
                  <span>120M (Multi-Regional)</span>
                  <span>300M (Full Continental Airwaves)</span>
                </div>
              </div>

              {/* Slider 2: Average Monthly Fan Micro-Spend */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300 font-medium">2. Average Monthly Fan Micro-Patronage & Tickets:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">${fanSpendUsd.toFixed(2)} USD / fan</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5.0}
                  step={0.1}
                  value={fanSpendUsd}
                  onChange={(e) => setFanSpendUsd(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>$0.50 (Micro tips)</span>
                  <span>$1.50 (Average)</span>
                  <span>$5.00 (Superfans & VIPs)</span>
                </div>
              </div>

              {/* Slider 3: TV Ad Spot CPM */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300 font-medium">3. National TV Halftime Ad Spot CPM (per 1,000 viewers):</span>
                  <span className="font-mono text-white font-bold text-sm">${tvAdCpmUsd.toFixed(2)} CPM</span>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={12.0}
                  step={0.5}
                  value={tvAdCpmUsd}
                  onChange={(e) => setTvAdCpmUsd(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>$1.50 (Standard)</span>
                  <span>$5.00 (Marquee Derbies)</span>
                  <span>$12.00 (AFCON / CAF Final)</span>
                </div>
              </div>
            </div>

            {/* Output Calculation Card (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-amber-500/40 bg-neutral-950 p-5 space-y-4 shadow-xl">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                Calculated Take-Home Earnings
              </span>

              <div className="p-4 rounded-lg bg-amber-400/10 border border-amber-400/30 text-center space-y-1">
                <span className="text-xs text-neutral-400">YOUR PROJECTED ANNUAL NET EARNINGS</span>
                <div className="font-mono text-3xl font-black text-amber-400">
                  ${(totalAnnualCalculated / 1000000).toFixed(2)}M USD
                </div>
                <span className="text-[11px] text-emerald-400 font-mono block">
                  ~ ${(totalMonthlyCalculated / 1000000).toFixed(2)}M USD / month
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono pt-2 border-t border-neutral-800">
                <div className="flex justify-between text-neutral-300">
                  <span>Ad Revenue Share (15%):</span>
                  <strong className="text-white">${(calculatedAdRev * 12 / 1000000).toFixed(2)}M / yr</strong>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Telco Protocol Transit:</span>
                  <strong className="text-white">${(calculatedTelcoRev * 12 / 1000000).toFixed(2)}M / yr</strong>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Mobile Money Take Rate (1.5%):</span>
                  <strong className="text-white">${(calculatedFintechRev * 12 / 1000000).toFixed(2)}M / yr</strong>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Sportsbook API Licensing:</span>
                  <strong className="text-white">${(calculatedApiRev * 12 / 1000000).toFixed(2)}M / yr</strong>
                </div>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Setup Direct Bank Wire Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Operator Payout Settlement Ledger */}
      {activeTab === 'settlement' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Operator Payout Settlement Ledger
              </h3>
              <p className="text-xs text-neutral-400">
                Official wire settlements transferred to the platform owner&apos;s corporate treasury
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Wallet className="h-4 w-4" />
              <span>Withdraw Operator Balance</span>
            </button>
          </div>

          {recentSettlement && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold block">Settlement Dispatched!</span>
                <span>${recentSettlement.amountUsd.toLocaleString()} USD sent via {recentSettlement.channel}</span>
              </div>
              <span className="font-mono text-[10px] text-amber-400">{recentSettlement.txHash}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Settlement ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Disbursed Amount</th>
                  <th className="py-2.5 px-3">Destination Channel</th>
                  <th className="py-2.5 px-3">Account Reference</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{p.id}</td>
                    <td className="py-3 px-3 text-neutral-300">{p.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">
                      ${p.amountUsd.toLocaleString()} USD
                    </td>
                    <td className="py-3 px-3 text-neutral-200">{p.channel}</td>
                    <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">{p.accountReference}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
