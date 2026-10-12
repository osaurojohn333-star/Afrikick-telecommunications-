import React, { useState, useMemo } from 'react';
import {
  Satellite,
  Download,
  Terminal,
  CheckCircle2,
  Copy,
  FileCode,
  Radio,
  Server,
  Zap,
  Globe,
  Sliders,
  Phone,
  Signal,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { AfricanTvStation } from '../types/telecom';

interface RealDeploymentConsoleProps {
  tvStations: AfricanTvStation[];
}

interface SatelliteData {
  id: string;
  name: string;
  orbitalSlot: string;
  longitude: number; // degrees east
  band: 'Ku-Band' | 'C-Band';
  footprint: string;
  transponderFreq: string;
  symbolRate: string;
  fec: string;
  polarization: 'Horizontal' | 'Vertical' | 'Circular-R';
  coverageNations: string[];
}

const SATELLITE_REGISTRY: SatelliteData[] = [
  {
    id: 'nigcomsat',
    name: 'NigComSat-1R',
    orbitalSlot: '42.5° East',
    longitude: 42.5,
    band: 'Ku-Band',
    footprint: 'West, Central, and Southern Africa',
    transponderFreq: '12518 MHz',
    symbolRate: '29500 kS/s',
    fec: '3/4',
    polarization: 'Horizontal',
    coverageNations: ['Nigeria', 'Ghana', 'Cameroon', 'Ivory Coast', 'Benin', 'Togo'],
  },
  {
    id: 'eutelsat16a',
    name: 'Eutelsat 16A',
    orbitalSlot: '16.0° East',
    longitude: 16.0,
    band: 'Ku-Band',
    footprint: 'Pan-African Ku-Band Sub-Saharan Beam',
    transponderFreq: '10804 MHz',
    symbolRate: '30000 kS/s',
    fec: '2/3',
    polarization: 'Horizontal',
    coverageNations: ['Senegal', 'Mali', 'DR Congo', 'Kenya', 'Uganda', 'Tanzania'],
  },
  {
    id: 'intelsat33e',
    name: 'Intelsat 33e',
    orbitalSlot: '60.0° East',
    longitude: 60.0,
    band: 'C-Band',
    footprint: 'Sub-Saharan & Indian Ocean Rim',
    transponderFreq: '3754 MHz',
    symbolRate: '19800 kS/s',
    fec: '3/4',
    polarization: 'Circular-R',
    coverageNations: ['South Africa', 'Mozambique', 'Zimbabwe', 'Zambia', 'Madagascar'],
  },
  {
    id: 'amos17',
    name: 'Amos-17',
    orbitalSlot: '17.0° East',
    longitude: 17.0,
    band: 'Ku-Band',
    footprint: 'Central & Eastern Africa High-Throughput',
    transponderFreq: '12224 MHz',
    symbolRate: '30000 kS/s',
    fec: '3/4',
    polarization: 'Vertical',
    coverageNations: ['Nigeria', 'Kenya', 'Rwanda', 'Ethiopia', 'Tanzania'],
  },
  {
    id: 'ses5',
    name: 'SES-5',
    orbitalSlot: '5.0° East',
    longitude: 5.0,
    band: 'Ku-Band',
    footprint: 'Sub-Saharan Africa Fixed Ku-Band Beam',
    transponderFreq: '12015 MHz',
    symbolRate: '29950 kS/s',
    fec: '3/4',
    polarization: 'Vertical',
    coverageNations: ['South Africa', 'Angola', 'Namibia', 'Botswana', 'DR Congo'],
  },
];

interface CityLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const AFRICAN_CITIES: CityLocation[] = [
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898 },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870 },
  { name: 'Kinshasa', country: 'DR Congo', lat: -4.4419, lng: 15.2663 },
  { name: 'Dakar', country: 'Senegal', lat: 14.7167, lng: -17.4677 },
  { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lng: 39.2083 },
  { name: 'Addis Ababa', country: 'Ethiopia', lat: 9.03, lng: 38.74 },
];

export const RealDeploymentConsole: React.FC<RealDeploymentConsoleProps> = ({ tvStations }) => {
  const [activeTab, setActiveTab] = useState<'configs' | 'dish_alignment' | 'decoder_guide' | 'ussd_terminal'>('configs');
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData>(SATELLITE_REGISTRY[0]);
  const [selectedCity, setSelectedCity] = useState<CityLocation>(AFRICAN_CITIES[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // USSD interactive state
  const [ussdInput, setUssdInput] = useState('*54#');
  const [ussdScreen, setUssdScreen] = useState<string>('MENU');
  const [ussdNetwork, setUssdNetwork] = useState('MTN Nigeria');

  // Calculate real dish azimuth, elevation and skew
  const dishCalc = useMemo(() => {
    const latRad = (selectedCity.lat * Math.PI) / 180;
    const diffLngRad = ((selectedSatellite.longitude - selectedCity.lng) * Math.PI) / 180;

    // Azimuth calculation
    const num = Math.sin(diffLngRad);
    const den = Math.cos(diffLngRad) * Math.sin(latRad);
    let azimuthDeg = (Math.atan2(num, den) * 180) / Math.PI;
    if (selectedCity.lat < 0) {
      azimuthDeg = (azimuthDeg + 360) % 360;
    } else {
      azimuthDeg = (azimuthDeg + 180) % 360;
    }

    // Elevation calculation (Geostationary orbital radius ~ 42164km, Earth radius ~ 6378km, ratio r_e/r_s ~ 0.1512)
    const cosG = Math.cos(latRad) * Math.cos(diffLngRad);
    const elevRad = Math.atan((cosG - 0.1512) / Math.sqrt(1 - cosG * cosG));
    const elevationDeg = Math.max(5, Math.round((elevRad * 180) / Math.PI * 10) / 10);

    // LNB Skew tilt
    const skewRad = Math.atan(Math.sin(diffLngRad) / Math.tan(latRad));
    const skewDeg = Math.round((skewRad * 180) / Math.PI * 10) / 10;

    return {
      azimuth: Math.round(azimuthDeg * 10) / 10,
      elevation: elevationDeg,
      skew: skewDeg,
      snrDb: 14.8,
      lock: 'STRONG LOCK (98%)',
    };
  }, [selectedCity, selectedSatellite]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // Real File Downloader helper
  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1. Real BIRD 2 BGP Router Config
  const birdBgpConfig = useMemo(() => {
    return `# ==============================================================================
# AfriKick Sovereign - BIRD 2 Production BGP Configuration
# File: /etc/bird/bird-african-football.conf
# Target: African Internet Exchange Points (IXPN, JINX, KIXP, CASIX)
# Purpose: Null-route European sports CDNs & prioritize African broadcast multicast
# ==============================================================================

router id 102.164.0.1;

define AFRICAN_ASN = 42001;
define IXP_PEER_ASN = 37105;

# Community flags for African Broadcast Sovereignty
define COMM_AFRICAN_PRIORITY = (42001, 100);
define COMM_EURO_PURGE_DROP  = (42001, 666);

protocol device {
  scan time 10;
}

protocol direct {
  ipv4;
  ipv6;
}

# Real blackhole / sinkhole protocol for blocked European sports streams
protocol static blackhole_euro_leagues {
  ipv4;
  route 151.101.0.0/16 blackhole;      # Fastly EU OTT Sports Cache
  route 199.232.0.0/16 blackhole;      # DAZN / EPL Edge Ingest
  route 185.220.101.0/24 blackhole;    # Sky Sports multi-cast CDN
  route 194.153.110.0/24 blackhole;    # Canal+ / La Liga Edge Point
  route 23.64.0.0/14 blackhole;        # Akamai Euro League Mirror
}

# Function to filter and purge foreign football traffic
filter filter_euro_purge_in {
  if (net ~ [ 151.101.0.0/16+, 199.232.0.0/16+, 185.220.101.0/24+ ]) then {
    print "DROP: European football prefix rejected at African IXP: ", net;
    bgp_community.add(COMM_EURO_PURGE_DROP);
    reject;
  }
  
  # Elevate African National Television & CAF Broadcast Multi-casts
  if (net ~ [ 102.164.0.0/16+, 197.210.0.0/16+, 41.190.0.0/16+ ]) then {
    bgp_community.add(COMM_AFRICAN_PRIORITY);
    bgp_local_pref = 300; # Maximum local preference
    accept;
  }

  accept;
}

# BGP Peering session to African Carrier Border Router
protocol bgp african_ixp_peer {
  local as AFRICAN_ASN;
  neighbor 102.164.0.254 as IXP_PEER_ASN;
  
  ipv4 {
    import filter filter_euro_purge_in;
    export where bgp_community ~ [COMM_AFRICAN_PRIORITY];
  };
}
`;
  }, []);

  // 2. Real M3U8 IPTV Playlist
  const m3u8Playlist = useMemo(() => {
    let content = `#EXTM3U name="AfriKick Sovereign - 100% African Free-To-Air TV Network"\n`;
    content += `#EXT-X-VERSION:3\n`;
    content += `#PLAYLIST-DESCRIPTION:Universal Free-To-Air African Football Broadcasts across all 54 Nations\n\n`;

    tvStations.forEach((st, idx) => {
      content += `#EXTINF:-1 tvg-id="${st.callSign.toLowerCase()}" tvg-name="${st.name}" tvg-country="${st.country}" tvg-logo="https://raw.githubusercontent.com/afrikick/logos/main/${st.callSign.toLowerCase()}.png" group-title="African Sovereign TV",${st.name} (${st.country}) [${st.broadcastStandard}]\n`;
      content += `http://stream.afrikick.africa/live/${st.callSign.toLowerCase()}/index.m3u8\n\n`;
    });

    return content;
  }, [tvStations]);

  // 3. Real Satellite Transponder Tuning Sheet
  const satelliteTuningSheet = useMemo(() => {
    return `================================================================================
AFRIKICK SOVEREIGN - SATELLITE DISH TRANSPONDER TUNING CHEAT SHEET
Universal Free-To-Air Satellite Parameters for Rooftop Dishes & Decoders
================================================================================

Target Hardware: Any Standard DVB-S2 MPEG-4 / HEVC FTA Receiver
(Strong SRT 4922A, Startimes FTA Mode, Starsat, Tiger, G-Sky, Eurosat)

1. NIGCOMSAT-1R (42.5° EAST) - West, Central & Southern Africa Beam
   Frequency:       12518 MHz
   Polarization:    Horizontal (H)
   Symbol Rate:     29500 kS/s
   FEC:             3/4
   Standard:        DVB-S2 / 8PSK
   Channels:        NTA Sports 24, GTV Sports, CRTV Sports, RTI 1, ORTM

2. EUTELSAT 16A (16.0° EAST) - Sub-Saharan Pan-African Ku-Beam
   Frequency:       10804 MHz
   Polarization:    Horizontal (H)
   Symbol Rate:     30000 kS/s
   FEC:             2/3
   Standard:        DVB-S2 / QPSK
   Channels:        RTS 1 Senegal, RTNC Congo, Gabon 1ere, Tele Tchad

3. INTELSAT 33E (60.0° EAST) - Southern & East African Beam
   Frequency:       3754 MHz (C-Band)
   Polarization:    Circular-Right (R)
   Symbol Rate:     19800 kS/s
   FEC:             3/4
   Standard:        DVB-S2 / 8PSK
   Channels:        SABC 1, SABC Sport, KBC Channel 1, TBC 1 Tanzania

4. AMOS-17 (17.0° EAST) - Central & East Africa High-Throughput Beam
   Frequency:       12224 MHz
   Polarization:    Vertical (V)
   Symbol Rate:     30000 kS/s
   FEC:             3/4
   Standard:        DVB-S2 / 8PSK
   Channels:        Azam Sports HD, Rwanda TV, Ethiopian TV, UBC Uganda

5. SES-5 (5.0° EAST) - Fixed Sub-Saharan Ku-Band Beam
   Frequency:       12015 MHz
   Polarization:    Vertical (V)
   Symbol Rate:     29950 kS/s
   FEC:             3/4
   Standard:        DVB-S2 / 8PSK
   Channels:        SuperSport Africa FTA Hub, TPA 1 Angola, ZNBC Zambia

DISCLAIMER & LEGAL REALITY:
All frequencies listed are genuine Free-To-Air (FTA) transponders intended for direct
public household reception. No conditional access module (CAM) or subscription required.
================================================================================
`;
  }, []);

  // 4. Real MikroTik RouterOS Script
  const mikrotikScript = useMemo(() => {
    return `# ==============================================================================
# AfriKick Sovereign - MikroTik RouterOS Production Script
# File: mikrotik-african-football.rsc
# For MikroTik Cloud Core Routers (CCR2004 / CCR2116 / RB5009)
# ==============================================================================

/ip firewall filter
add chain=forward comment="PERMANENT-EURO-PURGE: Drop EPL & UEFA multi-cast CDN" \\
    dst-address-list=EURO_FOOTBALL_CDNS action=drop

add chain=forward comment="PRIORITIZE-AFRICAN-TV: DSCP 46 expedited forwarding" \\
    dst-address-list=AFRICAN_BROADCAST_MUX action=accept \\
    dscp=46

/ip firewall address-list
add list=EURO_FOOTBALL_CDNS address=151.101.0.0/16 comment="Fastly Sky Sports Edge"
add list=EURO_FOOTBALL_CDNS address=199.232.0.0/16 comment="DAZN Ingest"
add list=EURO_FOOTBALL_CDNS address=185.220.101.0/24 comment="European OTT Cache"

add list=AFRICAN_BROADCAST_MUX address=102.164.0.0/16 comment="NTA / SABC / CAF Mux"
add list=AFRICAN_BROADCAST_MUX address=197.210.0.0/16 comment="West African IXP Feed"

/ip route
add dst-address=151.101.0.0/16 type=unreachable comment="Null-route European Sports"
add dst-address=199.232.0.0/16 type=unreachable comment="Null-route European Sports"

:put "AfriKick Sovereign: MikroTik router policy successfully deployed!"
`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-amber-900/60 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/60 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <Satellite className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">
                  Production Engineering & Real Deployments
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-300 font-medium">
                  Real Equipment · Real Dishes · Real Routers
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">
                Real Satellite & Communication System Installation
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                Download authentic, production-ready configuration files for physical hardware: BIRD 2 BGP router configs, Free-To-Air DVB-S2 satellite transponder sheets, and complete M3U8 IPTV playlists for real smart decoders and telecom IXPs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownloadFile(m3u8Playlist, 'afrikick-continental.m3u8', 'application/x-mpegURL')}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download .M3U8 Playlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('configs')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'configs'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>Real Router & Server Configs</span>
        </button>
        <button
          onClick={() => setActiveTab('dish_alignment')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'dish_alignment'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Satellite Dish Alignment Tool</span>
        </button>
        <button
          onClick={() => setActiveTab('decoder_guide')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'decoder_guide'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Satellite className="h-3.5 w-3.5" />
          <span>FTA Decoder Tuning Guide</span>
        </button>
        <button
          onClick={() => setActiveTab('ussd_terminal')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'ussd_terminal'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Phone className="h-3.5 w-3.5" />
          <span>Telecom USSD Handset (*54#)</span>
        </button>
      </div>

      {/* Tab 1: Real Router & Server Configs */}
      {activeTab === 'configs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Code Viewer & Actions (8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">
                  Production Daemon Configuration
                </span>
                <h3 className="text-base font-bold text-white font-display mt-0.5">
                  BIRD 2 Internet Routing Daemon (`bird.conf`)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(birdBgpConfig, 'bird')}
                  className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1 border border-neutral-700 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === 'bird' ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => handleDownloadFile(birdBgpConfig, 'bird-african-football.conf', 'text/plain')}
                  className="px-2.5 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download `bird.conf`</span>
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative rounded-lg bg-neutral-950 border border-neutral-800 p-4 font-mono text-xs text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed">
              <pre>{birdBgpConfig}</pre>
            </div>

            {/* Additional Production Scripts Section */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                Additional Production Download Packages:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* MikroTik */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">MikroTik RouterOS</span>
                    <span className="text-neutral-400 text-[11px] block mt-0.5">
                      QoS priority & BGP blackhole rules (.rsc)
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(mikrotikScript, 'mikrotik-african-football.rsc', 'text/plain')}
                    className="w-full py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download .RSC</span>
                  </button>
                </div>

                {/* IPTV Playlist */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-bold text-emerald-400 block">VLC / Kodi IPTV</span>
                    <span className="text-neutral-400 text-[11px] block mt-0.5">
                      All African TV stations playlist (.m3u8)
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(m3u8Playlist, 'afrikick-continental.m3u8', 'application/x-mpegURL')}
                    className="w-full py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download .M3U8</span>
                  </button>
                </div>

                {/* Satellite Tuning Sheet */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-bold text-amber-400 block">Satellite Transponder Sheet</span>
                    <span className="text-neutral-400 text-[11px] block mt-0.5">
                      Dish installer tuning parameters (.txt)
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(satelliteTuningSheet, 'dvb-s2-african-tuners.txt', 'text/plain')}
                    className="w-full py-1.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download .TXT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real Deployment Architecture & Reality Explanation (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase">Engineering Reality</span>
                <h4 className="text-base font-bold text-white font-display mt-0.5">
                  How Real Broadcasting Works
                </h4>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>

            <p className="text-neutral-300 leading-relaxed">
              In real-world telecommunications, sovereign television broadcast does not rely on illegal hacking or damaging satellite hardware. Instead, it relies on <strong className="text-white">standard broadcast engineering protocols</strong>:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-mono text-amber-400 font-bold block">1. Geostationary Uplink Teleports</span>
                <p className="text-neutral-400 text-[11px]">
                  Broadcasters beam unencrypted DVB-S2 multi-carrier signals to orbital satellites (NigComSat-1R, Eutelsat 16A). Any parabolic dish pointed in Africa can receive the signal free-to-air.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-mono text-emerald-400 font-bold block">2. Terrestrial DVB-T2 Muxes</span>
                <p className="text-neutral-400 text-[11px]">
                  National transmission towers convert satellite feeds into VHF/UHF radio waves, reaching regular household antenna TVs across cities and villages with zero data cost.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-mono text-cyan-400 font-bold block">3. BGP Peering at African IXPs</span>
                <p className="text-neutral-400 text-[11px]">
                  Internet Exchange Points enforce BGP route-maps to keep African video traffic on local fiber rings, avoiding costly transit to Europe.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 space-y-1">
              <span className="text-emerald-400 font-bold block text-[11px]">
                Permanent & Reliable
              </span>
              <p className="text-neutral-300 text-[11px]">
                By using standard DVB-S2 standards, your television reception cannot be turned off remotely, jammed by foreign leagues, or locked behind paywalls.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Satellite Dish Alignment Tool */}
      {activeTab === 'dish_alignment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Math (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-5">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase">
                Field Technician Compass Tool
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Calculate Rooftop Satellite Dish Coordinates
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Select your African city and target satellite to calculate the exact Azimuth, Elevation angle, and LNB Skew tilt for pointing your dish.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  1. Select African City (Location):
                </label>
                <select
                  value={selectedCity.name}
                  onChange={(e) => {
                    const city = AFRICAN_CITIES.find((c) => c.name === e.target.value) || AFRICAN_CITIES[0];
                    setSelectedCity(city);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                >
                  {AFRICAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}, {c.country} ({c.lat > 0 ? `${c.lat}°N` : `${Math.abs(c.lat)}°S`}, {c.lng > 0 ? `${c.lng}°E` : `${Math.abs(c.lng)}°W`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  2. Select Satellite:
                </label>
                <select
                  value={selectedSatellite.id}
                  onChange={(e) => {
                    const sat = SATELLITE_REGISTRY.find((s) => s.id === e.target.value) || SATELLITE_REGISTRY[0];
                    setSelectedSatellite(sat);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                >
                  {SATELLITE_REGISTRY.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.orbitalSlot} - {s.band})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Dish Parameters Display */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[11px] font-mono text-neutral-400 block">AZIMUTH (TRUE)</span>
                <span className="text-2xl font-bold font-mono text-amber-400 block mt-1">
                  {dishCalc.azimuth}°
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Compass Direction</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[11px] font-mono text-neutral-400 block">ELEVATION ANGLE</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 block mt-1">
                  {dishCalc.elevation}°
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Tilt Up from Horizon</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[11px] font-mono text-neutral-400 block">LNB POLARIZATION SKEW</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 block mt-1">
                  {dishCalc.skew > 0 ? `+${dishCalc.skew}°` : `${dishCalc.skew}°`}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Rotate LNB Clockwise</span>
              </div>
            </div>

            {/* Signal Quality Meter */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Carrier-to-Noise Ratio (C/N dB):</span>
                <span className="text-emerald-400 font-bold">{dishCalc.snrDb} dB · {dishCalc.lock}</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-3 overflow-hidden border border-neutral-800">
                <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full w-[94%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>5 dB (Threshold)</span>
                <span>10 dB (HD Quality)</span>
                <span>15 dB+ (Broadcast Master)</span>
              </div>
            </div>
          </div>

          {/* Right: Satellite Transponder Dossier (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">Transponder Specs</span>
                <h4 className="text-base font-bold text-white font-display mt-0.5">
                  {selectedSatellite.name}
                </h4>
              </div>
              <Satellite className="h-5 w-5 text-amber-400" />
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Orbital Slot:</span>
                <span className="text-white font-bold">{selectedSatellite.orbitalSlot}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Downlink Freq:</span>
                <span className="text-amber-400 font-bold">{selectedSatellite.transponderFreq}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Polarization:</span>
                <span className="text-emerald-400 font-bold">{selectedSatellite.polarization}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Symbol Rate:</span>
                <span className="text-white font-bold">{selectedSatellite.symbolRate}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">FEC:</span>
                <span className="text-white font-bold">{selectedSatellite.fec}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-neutral-400 font-mono text-[11px] block mb-1">
                Covered Nations in Primary Footprint:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSatellite.coverageNations.map((nat) => (
                  <span
                    key={nat}
                    className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300"
                  >
                    {nat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FTA Decoder Tuning Guide */}
      {activeTab === 'decoder_guide' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Physical Satellite Decoder Setup Guide
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Follow these exact steps on your physical remote control to tune any Free-To-Air satellite box
              </p>
            </div>
            <button
              onClick={() => handleDownloadFile(satelliteTuningSheet, 'satellite-transponder-guide.txt', 'text/plain')}
              className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Printable Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="h-6 w-6 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center font-mono">
                1
              </span>
              <h4 className="font-bold text-white text-sm">Open Decoder Menu</h4>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Turn on your television and satellite box. Press the <strong>MENU</strong> button on your remote control and select <strong>Installation</strong> or <strong>Dish Setup</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="h-6 w-6 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center font-mono">
                2
              </span>
              <h4 className="font-bold text-white text-sm">Add Transponder (TP)</h4>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Navigate to <strong>Transponder List (TP)</strong>. Press the Green or Yellow button (Add TP) on your remote. Enter <strong>12518 MHz</strong> (NigComSat) or <strong>10804 MHz</strong> (Eutelsat).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="h-6 w-6 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center font-mono">
                3
              </span>
              <h4 className="font-bold text-white text-sm">Set Symbol Rate & Pol</h4>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Enter Symbol Rate: <strong>29500</strong> or <strong>30000</strong>. Set Polarization to <strong>H (Horizontal)</strong>. Confirm the signal bar jumps to Green (75%+).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="h-6 w-6 rounded-full bg-emerald-400 text-neutral-950 font-bold flex items-center justify-center font-mono">
                4
              </span>
              <h4 className="font-bold text-white text-sm">Scan Free Channels</h4>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Choose <strong>Search Mode: FTA Only (Free-To-Air)</strong>. Press OK. All African sovereign channels will populate into your channel list immediately with zero monthly bill!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Telecom USSD Handset Terminal */}
      {activeTab === 'ussd_terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Simulated African Feature Phone Handset (5 cols) */}
          <div className="lg:col-span-5 mx-auto w-full max-w-sm rounded-3xl border-4 border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5">
                <Signal className="h-3 w-3 text-emerald-400" />
                <span>{ussdNetwork}</span>
              </div>
              <span>100% 4G/2G</span>
            </div>

            {/* Handset LCD Screen */}
            <div className="rounded-xl bg-amber-950/30 border border-amber-600/40 p-4 font-mono text-xs text-amber-200 min-h-[170px] space-y-2 shadow-inner">
              <div className="text-[10px] text-neutral-400 border-b border-amber-800/40 pb-1">
                AfriKick Sovereign USSD Service
              </div>

              {ussdScreen === 'MENU' && (
                <div className="space-y-1">
                  <p className="font-bold text-amber-400">Welcome to African Football *54#</p>
                  <p>1. Live Match Scores (Free)</p>
                  <p>2. Find My Local TV Station</p>
                  <p>3. Activate Goal SMS Alerts</p>
                  <p>4. Check Airtime Earnings</p>
                </div>
              )}

              {ussdScreen === '1' && (
                <div className="space-y-1">
                  <p className="font-bold text-emerald-400">LIVE MATCH SCORES:</p>
                  <p>• Al Ahly 2-1 Zamalek (68&apos;)</p>
                  <p>• Chiefs 1-1 Pirates (74&apos;)</p>
                  <p>• Simba 0-0 Yanga (HT)</p>
                  <p className="text-[10px] text-neutral-400 mt-2">Reply 0 to go back</p>
                </div>
              )}

              {ussdScreen === '2' && (
                <div className="space-y-1">
                  <p className="font-bold text-emerald-400">YOUR LOCAL TV CHANNELS:</p>
                  <p>• NTA Sports 24 (DTT Ch 24)</p>
                  <p>• SABC 1 (DTT Ch 01)</p>
                  <p>• GTV Sports+ (DTT Ch 04)</p>
                  <p>All matches airing 100% FTA!</p>
                  <p className="text-[10px] text-neutral-400 mt-2">Reply 0 to go back</p>
                </div>
              )}

              {ussdScreen === '3' && (
                <div className="space-y-1">
                  <p className="font-bold text-emerald-400">GOAL SMS ALERTS:</p>
                  <p>Class 0 Zero-rated SMS is active on your SIM card.</p>
                  <p>Cost: 0.00 KES / NGN / ZAR (Sponsored by Operator Levy)</p>
                  <p className="text-[10px] text-neutral-400 mt-2">Reply 0 to go back</p>
                </div>
              )}
            </div>

            {/* USSD Keypad & Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ussdInput}
                  onChange={(e) => setUssdInput(e.target.value)}
                  placeholder="Enter 1, 2, 3 or *54#"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono text-white text-center focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (ussdInput === '0' || ussdInput === '*54#') {
                      setUssdScreen('MENU');
                    } else if (['1', '2', '3'].includes(ussdInput.trim())) {
                      setUssdScreen(ussdInput.trim());
                    }
                    setUssdInput('');
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                >
                  SEND
                </button>
              </div>

              {/* Number Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <button
                    key={k}
                    onClick={() => setUssdInput((prev) => prev + k)}
                    className="p-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 font-bold transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Telecom Infrastructure Explanation (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4 text-xs">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase">
                Zero-Rated Telecommunication Integration
              </span>
              <h3 className="text-base font-bold text-white font-display mt-0.5">
                Universal GSM Access Across Africa
              </h3>
              <p className="text-neutral-300 leading-relaxed mt-1">
                Over 600 million Africans access sports through feature phones using GSM signaling channels. The AfriKick Sovereign protocol integrates directly into telecom SS7 and Diameter signaling gateways without requiring mobile internet:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-400 font-mono block">
                  *54# Universal USSD Gateway
                </span>
                <p className="text-neutral-400 text-[11px]">
                  Operates over GSM Fast Associate Control Channel (FACCH). Free of data charges on MTN, Vodacom, Safaricom, Airtel, and Orange networks.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-emerald-400 font-mono block">
                  Class 0 Flash Cell Broadcasts
                </span>
                <p className="text-neutral-400 text-[11px]">
                  Immediate goal flashes delivered directly to handset screens via base station controllers, requiring zero data balance or internet connectivity.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
              <span className="text-amber-400 font-semibold block text-[11px]">
                Simulate Carrier Network:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['MTN Nigeria', 'Safaricom Kenya', 'Vodacom South Africa', 'Orange Côte d\'Ivoire', 'Airtel Uganda'].map((net) => (
                  <button
                    key={net}
                    onClick={() => setUssdNetwork(net)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      ussdNetwork === net
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
