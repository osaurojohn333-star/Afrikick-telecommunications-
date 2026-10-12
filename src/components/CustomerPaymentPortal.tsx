import React, { useState } from 'react';
import { ClubPaymentRecord } from '../types/telecom';
import {
  Smartphone,
  CreditCard,
  QrCode,
  Hash,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Share2,
  Ticket,
  Tv,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  RefreshCw,
} from 'lucide-react';

interface CustomerPaymentPortalProps {
  onAddPayment: (payment: ClubPaymentRecord) => void;
}

interface PaymentOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultAmountNgn: number;
  defaultAmountKes: number;
  defaultAmountZar: number;
  defaultAmountGhs: number;
}

const PAYMENT_ITEMS: PaymentOption[] = [
  {
    id: 'ticket',
    title: 'Matchday Stadium Ticket / Gate Pass',
    description: 'Instant digital QR pass for entry to local stadium stands & VIP pavilions',
    icon: '🎟️',
    defaultAmountNgn: 1500,
    defaultAmountKes: 150,
    defaultAmountZar: 40,
    defaultAmountGhs: 35,
  },
  {
    id: 'club_patron',
    title: 'Support Your Club & Youth Academy',
    description: 'Direct fan contribution funding youth scouting, balls, boots & facilities',
    icon: '🛡️',
    defaultAmountNgn: 3000,
    defaultAmountKes: 300,
    defaultAmountZar: 80,
    defaultAmountGhs: 75,
  },
  {
    id: 'tv_vip',
    title: 'Television VIP Multi-Cam & 4K Pass',
    description: 'Unlock coach tactical drone camera, locker-room audio, and 4K stream on TV',
    icon: '📺',
    defaultAmountNgn: 1000,
    defaultAmountKes: 100,
    defaultAmountZar: 25,
    defaultAmountGhs: 25,
  },
  {
    id: 'player_tip',
    title: 'Tip the Match Player-of-the-Match',
    description: 'Send direct performance tip straight to the domestic league star player',
    icon: '⭐',
    defaultAmountNgn: 500,
    defaultAmountKes: 50,
    defaultAmountZar: 15,
    defaultAmountGhs: 12,
  },
];

const CUSTOMER_CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigeria', flag: '🇳🇬', defaultPhone: '+234 803 123 4567', ussdPrefix: '*737*', rails: ['MTN MoMo', 'OPay', 'PalmPay', 'Paystack'] },
  { code: 'KES', symbol: 'KSh', name: 'Kenya', flag: '🇰🇪', defaultPhone: '+254 712 345 678', ussdPrefix: '*334*', rails: ['M-Pesa Safaricom', 'Airtel Money'] },
  { code: 'ZAR', symbol: 'R', name: 'South Africa', flag: '🇿🇦', defaultPhone: '+27 82 123 4567', ussdPrefix: '*120*', rails: ['Capitec Pay', 'Ozow Instant EFT', 'SnapScan'] },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghana', flag: '🇬🇭', defaultPhone: '+233 24 123 4567', ussdPrefix: '*170*', rails: ['MTN MoMo', 'Telecel Cash'] },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzania', flag: '🇹🇿', defaultPhone: '+255 754 123 456', ussdPrefix: '*150*', rails: ['M-Pesa Vodacom', 'Tigo Pesa'] },
  { code: 'EGP', symbol: 'EGP', name: 'Egypt', flag: '🇪🇬', defaultPhone: '+20 100 123 4567', ussdPrefix: '*9*', rails: ['Vodafone Cash', 'Fawry'] },
  { code: 'XOF', symbol: 'CFA', name: 'Senegal / CIV', flag: '🇸🇳', defaultPhone: '+221 77 123 4567', ussdPrefix: '*144*', rails: ['Wave', 'Orange Money'] },
];

const CLUBS_LIST = [
  'Enyimba International FC (Nigeria)',
  'Enugu Rangers (Nigeria)',
  'Al Ahly SC (Egypt)',
  'Zamalek SC (Egypt)',
  'Orlando Pirates (South Africa)',
  'Kaizer Chiefs (South Africa)',
  'Mamelodi Sundowns (South Africa)',
  'Simba SC (Tanzania)',
  'Young Africans (Yanga) (Tanzania)',
  'Hearts of Oak SC (Ghana)',
  'Asante Kotoko SC (Ghana)',
  'Raja Club Athletic (Morocco)',
  'Wydad AC (Morocco)',
  'TP Mazembe (DR Congo)',
  'ASC Jaraaf (Senegal)',
  'Gor Mahia FC (Kenya)',
];

export const CustomerPaymentPortal: React.FC<CustomerPaymentPortalProps> = ({
  onAddPayment,
}) => {
  const [selectedItem, setSelectedItem] = useState<PaymentOption>(PAYMENT_ITEMS[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CUSTOMER_CURRENCIES[0]);
  const [selectedClub, setSelectedClub] = useState(CLUBS_LIST[0]);
  const [paymentMode, setPaymentMode] = useState<'momo' | 'ussd' | 'qr' | 'card'>('momo');

  const [customerName, setCustomerName] = useState('John Emeka');
  const [customerPhone, setCustomerPhone] = useState(selectedCurrency.defaultPhone);
  const [customAmount, setCustomAmount] = useState<number>(selectedItem.defaultAmountNgn);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<ClubPaymentRecord | null>(null);
  const [copiedUssd, setCopiedUssd] = useState(false);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Update amount when item or currency changes
  const handleItemSelect = (item: PaymentOption) => {
    setSelectedItem(item);
    if (selectedCurrency.code === 'NGN') setCustomAmount(item.defaultAmountNgn);
    else if (selectedCurrency.code === 'KES') setCustomAmount(item.defaultAmountKes);
    else if (selectedCurrency.code === 'ZAR') setCustomAmount(item.defaultAmountZar);
    else if (selectedCurrency.code === 'GHS') setCustomAmount(item.defaultAmountGhs);
    else setCustomAmount(item.defaultAmountNgn);
  };

  const handleCurrencySelect = (curr: typeof CUSTOMER_CURRENCIES[0]) => {
    setSelectedCurrency(curr);
    setCustomerPhone(curr.defaultPhone);
    if (curr.code === 'NGN') setCustomAmount(selectedItem.defaultAmountNgn);
    else if (curr.code === 'KES') setCustomAmount(selectedItem.defaultAmountKes);
    else if (curr.code === 'ZAR') setCustomAmount(selectedItem.defaultAmountZar);
    else if (curr.code === 'GHS') setCustomAmount(selectedItem.defaultAmountGhs);
    else setCustomAmount(1000);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newPayment: ClubPaymentRecord = {
        id: `pay-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        clubName: selectedClub.split(' (')[0],
        country: selectedCurrency.name,
        donorName: customerName || 'African Football Fan',
        amountFormatted: `${selectedCurrency.symbol}${customAmount.toLocaleString()} ${selectedCurrency.code}`,
        currency: selectedCurrency.code,
        paymentMethod: paymentMode === 'momo'
          ? (selectedCurrency.rails[0] as ClubPaymentRecord['paymentMethod'])
          : paymentMode === 'card'
          ? 'Paystack / Flutterwave'
          : (selectedCurrency.rails[0] as ClubPaymentRecord['paymentMethod']),
        purpose: selectedItem.id === 'ticket'
          ? 'Matchday Stadium Ticket'
          : selectedItem.id === 'club_patron'
          ? 'Club Academy & Facilities'
          : selectedItem.id === 'player_tip'
          ? 'Player Match Bonus'
          : 'Club Academy & Facilities',
        status: 'COMPLETED',
        txHash: `AFRI-FAN-${Math.floor(100000 + Math.random() * 900000)}-${selectedCurrency.code}`,
      };

      onAddPayment(newPayment);
      setCompletedReceipt(newPayment);
    }, 1100);
  };

  const handleCopyUssd = () => {
    const ussdString = `${selectedCurrency.ussdPrefix}${customAmount}*54#`;
    navigator.clipboard.writeText(ussdString);
    setCopiedUssd(true);
    setTimeout(() => setCopiedUssd(false), 2000);
  };

  const handleSendSmsReceipt = () => {
    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 4000);
  };

  const ussdDisplay = `${selectedCurrency.ussdPrefix}${customAmount}*54#`;

  return (
    <div className="space-y-6">
      {/* Top Banner: Easy Customer Payment Point */}
      <div className="rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950 via-neutral-900 to-amber-950/60 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
              <Wallet className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  Fast Customer Payment Checkout
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-300 font-medium">
                  Pay with M-Pesa, MTN MoMo, Card, QR or USSD
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                Easy Fan & Customer Payment Station
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                The fastest way for your customers and supporters to buy match tickets, back their local African football club, or purchase VIP TV access using their everyday local phone or mobile money.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800/40 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>0% EXTRA FEE</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Easy 3-Step Payment Terminal (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-6">
          {/* Step 1: What are you paying for? */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
                Step 1: Select What You Want to Pay For
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAYMENT_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemSelect(item)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedItem.id === item.id
                      ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-md'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Country & Destination Club */}
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider block">
              Step 2: Choose Country & Destination African Club
            </span>

            {/* Country Selector */}
            <div className="flex flex-wrap gap-1.5">
              {CUSTOMER_CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleCurrencySelect(curr)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    selectedCurrency.code === curr.code
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{curr.flag}</span>
                  <span>{curr.name} ({curr.code})</span>
                </button>
              ))}
            </div>

            {/* Destination Club */}
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1 font-medium">Beneficiary Club:</label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {CLUBS_LIST.map((club) => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Payment Method Mode & Action Form */}
          <div className="space-y-4 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
                Step 3: Choose Payment Mode & Complete
              </span>
              <span className="text-emerald-400 text-xs font-mono font-bold">
                Amount: {selectedCurrency.symbol}{customAmount.toLocaleString()} {selectedCurrency.code}
              </span>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('momo')}
                className={`p-2.5 rounded-lg border text-center transition-colors ${
                  paymentMode === 'momo'
                    ? 'border-emerald-500 bg-emerald-950/20 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                <span className="text-[11px] block">Mobile Money Push</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('ussd')}
                className={`p-2.5 rounded-lg border text-center transition-colors ${
                  paymentMode === 'ussd'
                    ? 'border-amber-400 bg-amber-950/20 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <Hash className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                <span className="text-[11px] block">USSD Quick Dial</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('qr')}
                className={`p-2.5 rounded-lg border text-center transition-colors ${
                  paymentMode === 'qr'
                    ? 'border-cyan-400 bg-cyan-950/20 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <QrCode className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
                <span className="text-[11px] block">Scan Bank QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('card')}
                className={`p-2.5 rounded-lg border text-center transition-colors ${
                  paymentMode === 'card'
                    ? 'border-purple-400 bg-purple-950/20 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                <span className="text-[11px] block">Card / Transfer</span>
              </button>
            </div>

            {/* Mode A: Mobile Money STK Push Form */}
            {paymentMode === 'momo' && (
              <form onSubmit={handleExecutePayment} className="space-y-3.5 text-xs">
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-neutral-400 text-[11px] block font-mono">Available Mobile Money Networks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCurrency.rails.map((rail) => (
                      <span key={rail} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-emerald-300 font-mono text-[11px]">
                        ✓ {rail}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Customer Name:</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                      placeholder="e.g. John Emeka"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Mobile Money Phone Number:</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Amount ({selectedCurrency.code}):</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    min={10}
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Smartphone className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>
                    {isProcessing
                      ? 'Sending Push to Customer Phone...'
                      : `Pay ${selectedCurrency.symbol}${customAmount.toLocaleString()} ${selectedCurrency.code} with 1-Click`}
                  </span>
                </button>
              </form>
            )}

            {/* Mode B: USSD Quick Dial Form (Offline & Torchlight Phones) */}
            {paymentMode === 'ussd' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-amber-400 font-bold text-xs block">
                    No Internet Required: Quick USSD Dial String
                  </span>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Works on every phone in Africa, from smartphones to basic itel/Nokia torchlight phones with zero data charges.
                  </p>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-amber-400/40 font-mono text-lg font-bold text-amber-300">
                    <span>{ussdDisplay}</span>
                    <button
                      type="button"
                      onClick={handleCopyUssd}
                      className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-sans font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedUssd ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedUssd ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-400/20"
                >
                  <span>{isProcessing ? 'Confirming USSD Session...' : 'I Have Dialed / Confirm Payment'}</span>
                </button>
              </div>
            )}

            {/* Mode C: Scan Bank QR Code Form */}
            {paymentMode === 'qr' && (
              <div className="space-y-4 text-xs text-center">
                <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 inline-block mx-auto space-y-2">
                  <div className="mx-auto w-40 h-40 bg-white rounded-lg p-2 flex items-center justify-center shadow-lg">
                    {/* Stylized QR Code SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corner 1 */}
                      <rect x="10" y="10" width="24" height="24" fill="#000000" />
                      <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="18" width="8" height="8" fill="#000000" />
                      {/* Corner 2 */}
                      <rect x="66" y="10" width="24" height="24" fill="#000000" />
                      <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="74" y="18" width="8" height="8" fill="#000000" />
                      {/* Corner 3 */}
                      <rect x="10" y="66" width="24" height="24" fill="#000000" />
                      <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="74" width="8" height="8" fill="#000000" />
                      {/* Grid noise simulation */}
                      <rect x="42" y="15" width="6" height="6" fill="#000000" />
                      <rect x="52" y="25" width="8" height="8" fill="#000000" />
                      <rect x="42" y="42" width="16" height="16" fill="#059669" />
                      <rect x="15" y="42" width="8" height="6" fill="#000000" />
                      <rect x="66" y="42" width="8" height="10" fill="#000000" />
                      <rect x="78" y="55" width="12" height="6" fill="#000000" />
                      <rect x="42" y="66" width="8" height="8" fill="#000000" />
                      <rect x="55" y="75" width="10" height="15" fill="#000000" />
                      <rect x="75" y="75" width="15" height="15" fill="#000000" />
                    </svg>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold block text-sm">
                    {selectedCurrency.symbol}{customAmount.toLocaleString()} {selectedCurrency.code}
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Scan with OPay, PalmPay, M-Pesa, SnapScan, or Banking App
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isProcessing ? 'Verifying QR Payment...' : 'I Have Scanned & Paid'}</span>
                </button>
              </div>
            )}

            {/* Mode D: Card & Bank Transfer */}
            {paymentMode === 'card' && (
              <form onSubmit={handleExecutePayment} className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Debit Card Number:</label>
                  <input
                    type="text"
                    defaultValue="5399 4100 8821 9904"
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-400"
                    placeholder="Card Number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Expiry:</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">CVV:</label>
                    <input
                      type="password"
                      defaultValue="881"
                      className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay with Card ({selectedCurrency.symbol}{customAmount.toLocaleString()})</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Customer Receipt & TV Living Room Scanning Experience (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* TV Screen QR Code Scanning Experience Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-xl">
            <div className="relative aspect-16/9 w-full">
              <img
                src="/src/assets/images/fan_scanning_tv_payment_qr_1791832463912.jpg"
                alt="African Football Fan Scanning On-Screen Payment QR Code"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                <div className="text-white space-y-0.5">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    Watch TV & Pay on Phone
                  </span>
                  <h4 className="text-sm font-bold font-display leading-tight">
                    On-Screen Live Match QR Code Scanning
                  </h4>
                  <p className="text-[11px] text-neutral-300">
                    Viewers at home scan the television corner QR code to instantly buy passes or donate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Verified Customer Digital Receipt & Gate Ticket Pass */}
          {completedReceipt ? (
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/40 p-5 space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white text-xs block">Payment Successful!</span>
                    <span className="text-[10px] text-emerald-300 font-mono">Instant Receipt & Digital Pass</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">{completedReceipt.txHash}</span>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Pass Item:</span>
                  <span className="font-bold text-white">{selectedItem.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Club Beneficiary:</span>
                  <span className="font-bold text-amber-400">{completedReceipt.clubName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Customer:</span>
                  <span className="text-white">{completedReceipt.donorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Amount Paid:</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">{completedReceipt.amountFormatted}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-[11px] font-mono">
                  <span className="text-neutral-500">Method:</span>
                  <span className="text-neutral-300">{completedReceipt.paymentMethod.split(' (')[0]}</span>
                </div>
              </div>

              {smsSentNotice && (
                <div className="p-2 rounded bg-emerald-900/60 border border-emerald-500 text-[11px] text-emerald-200 text-center font-mono animate-pulse">
                  ✓ SMS & WhatsApp confirmation sent to customer phone!
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSendSmsReceipt}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5 text-emerald-400" />
                  <span>SMS Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompletedReceipt(null)}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>New Payment</span>
                </button>
              </div>
            </div>
          ) : (
            /* Quick Payment Help Card */
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/80 space-y-2 text-xs">
              <span className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Why Customers Love Paying Here:</span>
              </span>
              <ul className="space-y-1.5 text-neutral-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Zero Data Usage:</strong> Telecommunication APNs zero-rate all sports payment traffic.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Instant Confirmation:</strong> Direct integration with M-Pesa, MTN MoMo, Wave, and banks.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>100% Retained in Africa:</strong> Every cent strengthens domestic African stadiums and youth academies.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
