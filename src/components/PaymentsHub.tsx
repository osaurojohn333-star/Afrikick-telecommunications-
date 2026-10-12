import React, { useState } from 'react';
import {
  ClubPaymentRecord,
  BroadcastRoyaltyDisbursement,
  PaymentMethodType,
  UserPayoutAccount,
  UserWithdrawalRecord,
} from '../types/telecom';
import {
  Wallet,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Receipt,
  Download,
  PlusCircle,
  Banknote,
  Send,
  UserCheck,
  RefreshCw,
  Clock,
  ArrowDownToLine,
} from 'lucide-react';

interface PaymentsHubProps {
  payments: ClubPaymentRecord[];
  disbursements: BroadcastRoyaltyDisbursement[];
  onAddPayment: (payment: ClubPaymentRecord) => void;
  userAccounts: UserPayoutAccount[];
  userWithdrawals: UserWithdrawalRecord[];
  onWithdrawToAccount: (withdrawal: UserWithdrawalRecord) => void;
  onAddUserAccount: (account: UserPayoutAccount) => void;
  userBalanceNgn: number;
}

const CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', provider: 'MTN MoMo / Paystack', country: 'Nigeria', preset: [2000, 5000, 10000, 25000] },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', provider: 'M-Pesa (Safaricom)', country: 'Kenya', preset: [200, 500, 1000, 3000] },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', provider: 'Capitec Pay / Ozow', country: 'South Africa', preset: [50, 100, 250, 500] },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', provider: 'MTN MoMo / Telecel', country: 'Ghana', preset: [30, 60, 120, 300] },
  { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound', provider: 'Vodafone Cash / Fawry', country: 'Egypt', preset: [100, 250, 500, 1500] },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', provider: 'M-Pesa / Tigo Pesa', country: 'Tanzania', preset: [5000, 15000, 35000, 70000] },
  { code: 'XOF', symbol: 'CFA', name: 'West African Franc', provider: 'Wave / Orange Money', country: 'Senegal & CIV', preset: [2000, 5000, 15000, 30000] },
];

const CLUBS = [
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
  'ASEC Mimosas (Côte d\'Ivoire)',
  'Gor Mahia FC (Kenya)',
];

export const PaymentsHub: React.FC<PaymentsHubProps> = ({
  payments,
  disbursements,
  onAddPayment,
  userAccounts,
  userWithdrawals,
  onWithdrawToAccount,
  onAddUserAccount,
  userBalanceNgn,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'my_account_payouts' | 'fan_payments' | 'broadcast_disbursements'>('my_account_payouts');

  // Fan Payment Terminal state
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [selectedClub, setSelectedClub] = useState(CLUBS[0]);
  const [fanAmount, setFanAmount] = useState<number>(5000);
  const [senderName, setSenderName] = useState('John Osauro');
  const [fanPhoneOrAccount, setFanPhoneOrAccount] = useState('+234 803 456 7890');
  const [fanPurpose, setFanPurpose] = useState<ClubPaymentRecord['purpose']>('Club Academy & Facilities');
  const [isProcessingFanPay, setIsProcessingFanPay] = useState(false);
  const [showUssdPrompt, setShowUssdPrompt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<ClubPaymentRecord | null>(null);

  // My Account Payout / Withdrawal state
  const [selectedPayoutAccount, setSelectedPayoutAccount] = useState<UserPayoutAccount>(userAccounts[0]);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(150000);
  const [payoutCategory, setPayoutCategory] = useState<UserWithdrawalRecord['sourceCategory']>('Telecom Interception Dividend');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [lastWithdrawalSuccess, setLastWithdrawalSuccess] = useState<UserWithdrawalRecord | null>(null);

  // Add new account modal/form toggle
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newBankName, setNewBankName] = useState('Access Bank Nigeria');
  const [newAccountNum, setNewAccountNum] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('John Osauro');
  const [newAccountType, setNewAccountType] = useState<'Bank Account' | 'Mobile Money Wallet'>('Bank Account');
  const [newAccountCurrency, setNewAccountCurrency] = useState('NGN');

  // Handle fan payment submission
  const handleInitiateFanPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingFanPay(true);
    setTimeout(() => {
      setIsProcessingFanPay(false);
      setShowUssdPrompt(true);
    }, 800);
  };

  const handleConfirmUssd = () => {
    setShowUssdPrompt(false);
    const newRecord: ClubPaymentRecord = {
      id: `pay-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      clubName: selectedClub.split(' (')[0],
      country: selectedCurrency.country,
      donorName: senderName || 'African Football Supporter',
      amountFormatted: `${selectedCurrency.symbol}${fanAmount.toLocaleString()} ${selectedCurrency.code}`,
      currency: selectedCurrency.code,
      paymentMethod: selectedCurrency.provider as PaymentMethodType,
      purpose: fanPurpose,
      status: 'COMPLETED',
      txHash: `AFRI-PAY-${Math.floor(100000 + Math.random() * 900000)}-${selectedCurrency.code}`,
    };

    onAddPayment(newRecord);
    setLastReceipt(newRecord);
  };

  // Handle direct payout / withdrawal to user account
  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawalAmount <= 0) return;

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      const symbol = selectedPayoutAccount.currency === 'NGN' ? '₦' : selectedPayoutAccount.currency === 'KES' ? 'KSh ' : selectedPayoutAccount.currency === 'ZAR' ? 'R' : '$';
      const withdrawalRecord: UserWithdrawalRecord = {
        id: `wd-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        amountFormatted: `${symbol}${withdrawalAmount.toLocaleString()} ${selectedPayoutAccount.currency}`,
        amountNumber: withdrawalAmount,
        currency: selectedPayoutAccount.currency,
        accountLabel: `${selectedPayoutAccount.bankOrProviderName} (${selectedPayoutAccount.accountNumberOrPhone})`,
        channel: selectedPayoutAccount.accountType === 'Bank Account' ? 'Instant NIBSS Bank Transfer' : 'Instant Mobile Money Push',
        status: 'COMPLETED',
        txRef: `AFRI-PAYOUT-${Math.floor(1000 + Math.random() * 9000)}-${selectedPayoutAccount.currency}`,
        sourceCategory: payoutCategory,
      };

      onWithdrawToAccount(withdrawalRecord);
      setLastWithdrawalSuccess(withdrawalRecord);
    }, 1200);
  };

  // Add new payout account
  const handleSaveNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountNum.trim()) return;

    const newAcct: UserPayoutAccount = {
      id: `usr-acct-${Date.now().toString().slice(-4)}`,
      accountHolderName: newAccountHolder,
      email: 'osaurojohn333@gmail.com',
      accountType: newAccountType,
      bankOrProviderName: newBankName,
      accountNumberOrPhone: newAccountNum,
      currency: newAccountCurrency,
      country: newAccountCurrency === 'NGN' ? 'Nigeria' : newAccountCurrency === 'KES' ? 'Kenya' : 'South Africa',
      isPrimary: false,
    };

    onAddUserAccount(newAcct);
    setSelectedPayoutAccount(newAcct);
    setShowAddAccountModal(false);
    setNewAccountNum('');
  };

  return (
    <div className="space-y-6">
      {/* USSD Mobile Money Prompt Modal */}
      {showUssdPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Smartphone className="h-6 w-6 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                {selectedCurrency.provider}
              </span>
              <h3 className="text-base font-bold text-white font-display mt-0.5">
                Authorize Mobile Money Debit
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Approve payment of <strong className="text-white font-mono">{selectedCurrency.symbol}{fanAmount.toLocaleString()} {selectedCurrency.code}</strong> to{' '}
                <strong className="text-amber-400">{selectedClub.split(' (')[0]}</strong>?
              </p>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-left font-mono text-xs space-y-1">
              <div className="flex justify-between text-neutral-400">
                <span>Account:</span>
                <span className="text-white">{fanPhoneOrAccount}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Purpose:</span>
                <span className="text-white truncate max-w-[170px]">{fanPurpose}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Network Fee:</span>
                <span className="text-emerald-400">0.00 (Zero-Rated Sports Rail)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowUssdPrompt(false)}
                className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUssd}
                className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm PIN & Pay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Add Payout Bank or Mobile Wallet
                </h3>
              </div>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="text-neutral-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Account Type:</label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as 'Bank Account' | 'Mobile Money Wallet')}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Bank Account">Commercial Bank Account</option>
                  <option value="Mobile Money Wallet">Mobile Money Wallet (MoMo / M-Pesa / Wave)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Bank or Provider Name:</label>
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  required
                  placeholder="e.g. Zenith Bank, Access Bank, Kuda, Safaricom M-Pesa"
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                </input>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-medium">Account Number or Mobile Number:</label>
                <input
                  type="text"
                  value={newAccountNum}
                  onChange={(e) => setNewAccountNum(e.target.value)}
                  required
                  placeholder="e.g. 0124891042 or +234 803 555 1234"
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Account Holder Name:</label>
                  <input
                    type="text"
                    value={newAccountHolder}
                    onChange={(e) => setNewAccountHolder(e.target.value)}
                    required
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Payout Currency:</label>
                  <select
                    value={newAccountCurrency}
                    onChange={(e) => setNewAccountCurrency(e.target.value)}
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="flex-1 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md"
                >
                  Save Payout Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Narrative Strip */}
      <div className="rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400">
              <Banknote className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  Personal Payouts & Sovereignty Dividends
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-300 font-medium">
                  Direct Settlements to Your Bank & Mobile Wallet
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">
                Payments to My Account (John Osauro)
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                Withdraw your accumulated telecommunication interception dividends, TV broadcast syndicate revenue, and fan patronage commissions directly into your bank or mobile money account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
              <span className="text-neutral-500 block text-[10px] font-mono">AVAILABLE PAYOUT BALANCE</span>
              <span className="text-emerald-400 font-bold font-mono text-base block mt-0.5">
                ₦{userBalanceNgn.toLocaleString()} NGN
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">≈ ${(userBalanceNgn / 1520).toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs: "Payments to My Account" is primary */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveSubTab('my_account_payouts')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'my_account_payouts'
              ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
          <span>Payments to My Account</span>
        </button>
        <button
          onClick={() => setActiveSubTab('fan_payments')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'fan_payments'
              ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Fan Mobile Money Terminal</span>
        </button>
        <button
          onClick={() => setActiveSubTab('broadcast_disbursements')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'broadcast_disbursements'
              ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Broadcast Royalties Ledger</span>
        </button>
      </div>

      {/* Sub-Tab 1: Payments to My Account */}
      {activeSubTab === 'my_account_payouts' && (
        <div className="space-y-6">
          {/* Recent Payout Banner Alert */}
          {lastWithdrawalSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40 shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">
                    Payout Successful! {lastWithdrawalSuccess.amountFormatted} Disbursed
                  </span>
                  <p className="text-neutral-300 text-[11px] mt-0.5">
                    Sent to {lastWithdrawalSuccess.accountLabel} via {lastWithdrawalSuccess.channel}. Ref: <strong className="font-mono text-emerald-300">{lastWithdrawalSuccess.txRef}</strong>
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 px-2 py-1 rounded bg-emerald-900/60 border border-emerald-700/50 self-start sm:self-auto">
                SETTLED INSTANTLY
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Withdrawal Execution Form (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Withdrawal to Registered Payout Account
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Instant settlement via NIBSS Bank Transfer, M-Pesa, or MoMo
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAccountModal(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Add New Account</span>
                </button>
              </div>

              {/* Account Selector Cards */}
              <div>
                <label className="text-neutral-400 block text-xs font-medium mb-2">
                  1. Select Destination Payout Account:
                </label>
                <div className="space-y-2">
                  {userAccounts.map((acct) => (
                    <div
                      key={acct.id}
                      onClick={() => setSelectedPayoutAccount(acct)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedPayoutAccount.id === acct.id
                          ? 'bg-amber-400/10 border-amber-400 text-white shadow-sm'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                          {acct.accountType === 'Bank Account' ? <Building2 className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{acct.bankOrProviderName}</span>
                            {acct.isPrimary && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                PRIMARY
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400 block">
                            {acct.accountNumberOrPhone} · {acct.accountHolderName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-amber-400">{acct.currency}</span>
                        <span className="text-[10px] text-neutral-500 block">{acct.country}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Details */}
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
                {/* Revenue Source Category */}
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">
                    2. Select Revenue Allocation Source:
                  </label>
                  <select
                    value={payoutCategory}
                    onChange={(e) => setPayoutCategory(e.target.value as UserWithdrawalRecord['sourceCategory'])}
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Telecom Interception Dividend">Telecom Interception Dividend (European Reroute Royalties)</option>
                    <option value="Broadcast Royalties">National TV Syndicate Broadcast Royalties</option>
                    <option value="Fan Patronage Commission">Domestic Club Fan Patronage Commission</option>
                  </select>
                </div>

                {/* Withdrawal Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-neutral-400 font-medium">3. Payout Amount:</label>
                    <span className="font-mono text-amber-400 font-bold">
                      ₦{withdrawalAmount.toLocaleString()} NGN (Max: ₦{userBalanceNgn.toLocaleString()})
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[50000, 100000, 250000, 500000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setWithdrawalAmount(val)}
                        className={`py-2 rounded-lg text-xs font-mono transition-colors ${
                          withdrawalAmount === val
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white'
                        }`}
                      >
                        ₦{val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                    max={userBalanceNgn}
                    min={1000}
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    placeholder="Enter custom payout amount..."
                  />
                </div>

                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Account Beneficiary:</span>
                    <strong className="text-white">{selectedPayoutAccount.accountHolderName} ({selectedPayoutAccount.email})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Target Account:</span>
                    <strong className="font-mono text-amber-400">{selectedPayoutAccount.bankOrProviderName} - {selectedPayoutAccount.accountNumberOrPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Payout Processing Fee:</span>
                    <strong className="text-emerald-400">₦0.00 (Zero Fee Sovereign Wire)</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing || withdrawalAmount > userBalanceNgn || withdrawalAmount <= 0}
                  className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    withdrawalAmount > userBalanceNgn
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20 active:scale-95'
                  }`}
                >
                  <Send className={`h-4 w-4 ${isWithdrawing ? 'animate-spin' : ''}`} />
                  <span>
                    {isWithdrawing
                      ? 'Executing Instant Settlement...'
                      : `Transfer ₦${withdrawalAmount.toLocaleString()} NGN to My Account`}
                  </span>
                </button>
              </form>
            </div>

            {/* Right: Revenue Breakdown & User Settlement History (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-3 text-xs">
                <div className="flex items-center gap-3 pb-2 border-b border-neutral-800">
                  <div className="h-10 w-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm font-display">
                    JO
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">John Osauro</h4>
                    <span className="text-[11px] text-neutral-400 font-mono">osaurojohn333@gmail.com</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sovereign Role:</span>
                    <span className="text-emerald-400 font-semibold">Telecom System Rights Administrator</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Settlement Frequency:</span>
                    <span className="text-white font-mono">Instant 24/7 Real-Time Payout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Lifetime Withdrawn:</span>
                    <strong className="text-white font-mono">₦12,450,000 NGN</strong>
                  </div>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-2.5 text-xs">
                <span className="text-neutral-400 block font-mono text-[11px] uppercase tracking-wider font-semibold">
                  Revenue Source Balance Breakdown
                </span>
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium block">Telecom Interception Dividends</span>
                      <span className="text-[10px] text-neutral-500">From 119 Tbps null-routed foreign streams</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">₦2,650,000</span>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium block">TV Syndicate Broadcast Royalties</span>
                      <span className="text-[10px] text-neutral-500">From NTA, SABC, Azam TV rights</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">₦1,400,000</span>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium block">Fan Patronage Commissions</span>
                      <span className="text-[10px] text-neutral-500">From mobile money micro-patronage</span>
                    </div>
                    <span className="font-mono font-bold text-white">₦800,000</span>
                  </div>
                </div>
              </div>

              {/* User Payout History Ledger */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-bold text-white font-display">
                    Recent Payouts to My Account
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">All Settled</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {userWithdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-[11px] space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-emerald-400 text-xs">{w.amountFormatted}</span>
                        <span className="font-mono text-[10px] text-neutral-500">{w.timestamp}</span>
                      </div>
                      <p className="text-neutral-300 truncate">{w.accountLabel}</p>
                      <div className="flex justify-between text-[10px] text-neutral-400 pt-0.5 border-t border-neutral-900">
                        <span>{w.sourceCategory}</span>
                        <span className="text-amber-400 font-mono">{w.txRef}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Fan Mobile Money Terminal */}
      {activeSubTab === 'fan_payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Payment Terminal Form (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Direct Mobile Money Patronage Terminal
                </h3>
                <p className="text-xs text-neutral-400">
                  Select your country currency and support your domestic football heroes
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                0% TELCO TRANSACTION FEE
              </span>
            </div>

            {/* Currency Selector Pills */}
            <div>
              <span className="text-neutral-400 block text-xs font-medium mb-2">
                1. Select Currency & Regional Payment Rail:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setFanAmount(curr.preset[1]);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedCurrency.code === curr.code
                        ? 'bg-amber-400/10 border-amber-400 text-white font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-amber-400 font-mono text-xs block">{curr.code} ({curr.symbol})</span>
                    <span className="text-[11px] text-neutral-300 block truncate">{curr.provider}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleInitiateFanPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1 font-medium">
                  2. Choose Destination African Club:
                </label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {CLUBS.map((club) => (
                    <option key={club} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-medium">
                  3. Select Support Allocation Target:
                </label>
                <select
                  value={fanPurpose}
                  onChange={(e) => setFanPurpose(e.target.value as ClubPaymentRecord['purpose'])}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Club Academy & Facilities">Club Academy & Training Facilities Modernization</option>
                  <option value="Player Match Bonus">Player Matchday Performance Bonus</option>
                  <option value="Grassroots Scouting Fund">Grassroots Scouting & Free Boot Drive</option>
                  <option value="Matchday Stadium Ticket">Digital VIP Matchday Stadium Ticket</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-neutral-400 font-medium">4. Contribution Amount:</label>
                  <span className="font-mono text-amber-400 font-bold">
                    {selectedCurrency.symbol}{fanAmount.toLocaleString()} {selectedCurrency.code}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {selectedCurrency.preset.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFanAmount(val)}
                      className={`py-2 rounded-lg text-xs font-mono transition-colors ${
                        fanAmount === val
                          ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {selectedCurrency.symbol}{val.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={fanAmount}
                  onChange={(e) => setFanAmount(Number(e.target.value))}
                  min={1}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  placeholder="Or enter custom amount..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Supporter Name:</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-medium">Mobile Money Phone Number:</label>
                  <input
                    type="text"
                    value={fanPhoneOrAccount}
                    onChange={(e) => setFanPhoneOrAccount(e.target.value)}
                    required
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingFanPay}
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Smartphone className={`h-4 w-4 ${isProcessingFanPay ? 'animate-spin' : ''}`} />
                <span>
                  {isProcessingFanPay
                    ? 'Connecting to Mobile Money Gateway...'
                    : `Authorize ${selectedCurrency.symbol}${fanAmount.toLocaleString()} ${selectedCurrency.code} via ${selectedCurrency.provider}`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Fan Proof & Live Receipts (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 overflow-hidden shadow-xl">
              <div className="relative aspect-16/9 w-full">
                <img
                  src="/src/assets/images/african_mobile_payment_fan_1791778093368.jpg"
                  alt="African Fan Paying with Mobile Money at Stadium"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                      Direct Fan Ownership
                    </span>
                    <h4 className="text-sm font-bold font-display leading-tight">
                      Empowering African Stadiums with Digital Currency
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {lastReceipt && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-2 text-xs animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    TRANSACTION VERIFIED
                  </span>
                  <span className="font-mono text-neutral-400 text-[10px]">{lastReceipt.timestamp}</span>
                </div>
                <div className="space-y-1 text-neutral-200">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Club Beneficiary:</span>
                    <strong className="text-white">{lastReceipt.clubName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Amount Paid:</span>
                    <strong className="text-emerald-300 font-mono">{lastReceipt.amountFormatted}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Transaction ID:</span>
                    <span className="font-mono text-amber-400 text-[11px]">{lastReceipt.txHash}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                  Live Continental Micro-Payments
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">Real-time Stream</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{p.clubName}</span>
                      <span className="font-mono text-emerald-400 font-bold">{p.amountFormatted}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{p.donorName}</span>
                      <span className="font-mono text-[10px] text-amber-300">{p.paymentMethod.split(' (')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Broadcast Royalties & Sovereign Club Ledger */}
      {activeSubTab === 'broadcast_disbursements' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Automated Telecom Broadcast Royalty Disbursements
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Revenue collected from telecommunication sports data levies and commercial TV rights distributed directly to domestic African football clubs
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/40">
              LEDGER AUDITED: OCTOBER 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[11px] font-mono">TELCO REVENUE LEVY POOL</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">$84,500,000 USD</span>
              <span className="text-[10px] text-neutral-400 mt-1 block">MTN, Safaricom, Vodacom, Airtel, Orange</span>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[11px] font-mono">TERRESTRIAL TV BROADCAST RIGHTS</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">$58,350,000 USD</span>
              <span className="text-[10px] text-neutral-400 mt-1 block">NTA, SABC, Azam Sports, OnTime, SNRT</span>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block text-[11px] font-mono">DOMESTIC CLUBS BENEFITED</span>
              <span className="text-xl font-bold font-mono text-white mt-0.5 block">216 Professional Clubs</span>
              <span className="text-[10px] text-neutral-400 mt-1 block">Across all 54 African Member Nations</span>
            </div>
          </div>

          {/* Detailed Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Club Beneficiary</th>
                  <th className="py-2.5 px-3">Country / League</th>
                  <th className="py-2.5 px-3">Disbursed Amount</th>
                  <th className="py-2.5 px-3">Funding Rail</th>
                  <th className="py-2.5 px-3">Designated Infrastructure Target</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {disbursements.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{d.recipientClub}</td>
                    <td className="py-3 px-3 text-neutral-300">{d.country} · {d.league.split(' & ')[0]}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{d.amountUsd}</td>
                    <td className="py-3 px-3 font-mono text-neutral-300 text-[11px]">{d.source}</td>
                    <td className="py-3 px-3 text-neutral-300 text-[11px]">{d.utilizationTarget}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                        PAID OUT
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
