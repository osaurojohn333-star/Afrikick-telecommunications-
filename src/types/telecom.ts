export type InterceptionMode = 'strict' | 'dynamic_redirect' | 'zero_rate_priority' | 'educational_overlay';

export type CafZone = 'ALL' | 'WAFU' | 'COSAFA' | 'UNAF' | 'CECAFA' | 'UNIFFAC';

export interface AfricanTvStation {
  id: string;
  name: string;
  callSign: string;
  country: string;
  flagEmoji: string;
  region: 'West Africa' | 'Southern Africa' | 'East Africa' | 'North Africa' | 'Central Africa' | 'Pan-African';
  broadcastStandard: 'DVB-T2 Terrestrial' | 'DVB-S2 Satellite' | 'Free-To-Air (FTA)' | 'National Network';
  frequencyOrTransponder: string;
  coverageHouseholds: string;
  currentProgram: string;
  currentlyAiringMatchId: string;
  onAirStatus: 'ON_AIR_LIVE' | 'STANDBY';
  bitrateMbps: number;
  audioLanguage: string;
  stationLogoText: string;
  themeColor: string;
}

export type PaymentMethodType =
  | 'M-Pesa (Safaricom / Vodacom)'
  | 'MTN Mobile Money (MoMo)'
  | 'Orange Money'
  | 'Airtel Money'
  | 'Wave (Senegal / Côte d\'Ivoire)'
  | 'Paystack / Flutterwave'
  | 'Vodafone Cash / Fawry'
  | 'Capitec Pay / Ozow Instant EFT';

export interface ClubPaymentRecord {
  id: string;
  timestamp: string;
  clubName: string;
  country: string;
  donorName: string;
  amountFormatted: string;
  currency: string;
  paymentMethod: PaymentMethodType;
  purpose: 'Club Academy & Facilities' | 'Player Match Bonus' | 'Matchday Stadium Ticket' | 'Grassroots Scouting Fund';
  status: 'COMPLETED' | 'PROCESSING';
  txHash: string;
}

export interface BroadcastRoyaltyDisbursement {
  id: string;
  recipientClub: string;
  league: string;
  country: string;
  amountUsd: string;
  source: 'Telco Data Levy (MTN/Safaricom/Vodacom)' | 'Terrestrial TV Rights (NTA/SABC/Azam)' | 'CAF Commercial Sponsorship';
  allocatedDate: string;
  utilizationTarget: string;
}

export interface UserPayoutAccount {
  id: string;
  accountHolderName?: string;
  email?: string;
  type?: 'bank' | 'momo' | 'crypto';
  accountType?: 'Bank Account' | 'Mobile Money Wallet' | string;
  label?: string;
  bankOrProviderName: string;
  accountNumberOrPhone: string;
  bankOrNetwork?: string;
  accountNumber?: string;
  currency: string;
  country?: string;
  isPrimary?: boolean;
  isDefault?: boolean;
}

export interface UserWithdrawalRecord {
  id: string;
  timestamp: string;
  amountFormatted?: string;
  amountNumber?: number;
  amountNgn?: number;
  amountLocal?: string;
  currency?: string;
  accountLabel?: string;
  destinationAccount?: string;
  channel: string;
  status: 'SETTLED' | 'PROCESSING' | 'COMPLETED';
  txRef?: string;
  txHash?: string;
  sourceCategory?: 'Telecom Interception Dividend' | 'Broadcasting Rights Royalty' | 'Fan Sponsorship Margin' | 'BGP Transit Clearing' | string;
}


export interface TelecomNode {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  region: 'West Africa' | 'Southern Africa' | 'East Africa' | 'North Africa' | 'Central Africa';
  coordinates: { x: number; y: number };
  status: 'active' | 'filtering' | 'standby';
  primaryTelcos: string[];
  subseaCables: string[];
  activeStreams: number;
  blockedEuroStreams: number;
  reroutedToAfrican: number;
  throughputTbps: number;
  efficiency: number;
  lastInterceptEvent: string;
}

export interface InterceptedStream {
  id: string;
  timestamp: string;
  euroSource: string;
  competition: string;
  detectedProtocol: 'HLS / m3u8' | 'DASH' | 'RTMP' | 'DVB-S2 Satellite' | 'BGP Anycast';
  detectionReason: string;
  targetEuropeanMatch: string;
  gatewayNodeId: string;
  status: 'intercepted' | 'blocked' | 'rerouted';
  substitutedAfricanMatchId: string;
  affectedSubscribers: number;
}

export interface AfricanMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  competition: string;
  zone: 'Pan-African' | 'WAFU' | 'COSAFA' | 'UNAF' | 'CECAFA' | 'UNIFFAC';
  stadium: string;
  city: string;
  country: string;
  homeColor: string;
  awayColor: string;
  status: 'LIVE' | 'HALFTIME' | 'UPCOMING' | 'FULL_TIME';
  attendance: string;
  viewerCount: string;
  ballPosition: { x: number; y: number };
  events: { minute: number; text: string; type: 'goal' | 'card' | 'sub' | 'chance' }[];
  stats: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    foulsHome: number;
    foulsAway: number;
    vuvuzelaDecibels: number;
  };
  broadcastImage: string;
}

export interface AfricanLeague {
  id: string;
  name: string;
  shortName: string;
  zone: 'Pan-African' | 'WAFU' | 'COSAFA' | 'UNAF' | 'CECAFA' | 'UNIFFAC';
  countryOrScope: string;
  flagEmoji: string;
  founded: number;
  clubsCount: number;
  currentChampions: string;
  broadcastPartners: string[];
  viewershipGrowth: string;
  domesticValuation: string;
  marqueeDerby: string;
  teams: {
    name: string;
    city: string;
    titles: number;
    stadium: string;
    starPlayer: string;
    colors: string;
  }[];
}

export interface BannedEuropeanLeague {
  id: string;
  name: string;
  country: string;
  banStatus: 'PERMANENTLY EXPUNGED' | 'PERMANENT SINKHOLE' | 'TRANSPONDER EVICTED';
  evictionDate: string;
  blockedCidrRanges: string[];
  evictedTransponders: string[];
  mandatoryAfricanAlternative: string;
  trafficAttemptToday: string;
  leakagePreventedPct: number;
}

export interface AfricanLegend {
  id: string;
  name: string;
  country: string;
  grassrootsClub: string;
  achievements: string;
  careerHighlight: string;
  quote: string;
  avatarInitials: string;
  accentColor: string;
}

export interface TelcoBroadcastCampaign {
  id: string;
  title: string;
  targetRegion: string;
  protocol: 'Cell Broadcast Class 0' | 'USSD Push' | 'SMS Blast' | 'APN Zero-Rate Notification';
  scheduledTime: string;
  content: string;
  targetAudienceCount: string;
  status: 'active' | 'queued' | 'dispatched';
}

export interface OperatorRevenueStream {
  id: string;
  name: string;
  category: 'Infrastructure & BGP' | 'Fintech Margins' | 'Advertising' | 'Subscriptions' | 'Data Feeds' | 'Transfer Royalties';
  rateDescription: string;
  projectedAnnualUsd: number;
  projectedMonthlyUsd: number;
  mechanism: string;
  activeContractPartners: string[];
}

export interface OperatorPayoutRecord {
  id: string;
  date: string;
  amountUsd: number;
  channel: 'Direct Swift Wire (USD)' | 'Domestic Bank (NGN/ZAR/KES)' | 'USDC / USDT Corporate' | 'M-Pesa / MoMo Corporate';
  accountReference: string;
  status: 'SETTLED' | 'PROCESSING';
  txHash: string;
}

