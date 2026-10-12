import React, { useState, useRef, useEffect } from 'react';
import { AfricanTvStation, AfricanMatch } from '../types/telecom';
import { stadiumAudio } from '../utils/audioSynthesizer';
import {
  Tv,
  Radio,
  Satellite,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  Sliders,
  Eye,
  Signal,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Camera,
  Download,
  Flame,
  Sparkles,
  Users,
  Mic,
  Cpu,
  Award,
} from 'lucide-react';

interface LiveTvBroadcasterProps {
  tvStations: AfricanTvStation[];
  matches: AfricanMatch[];
  selectedMatch: AfricanMatch;
  onSelectMatch: (match: AfricanMatch) => void;
  onNavigateToDeployment?: () => void;
}

export const LiveTvBroadcaster: React.FC<LiveTvBroadcasterProps> = ({
  tvStations,
  matches,
  selectedMatch,
  onSelectMatch,
  onNavigateToDeployment,
}) => {
  const [selectedStation, setSelectedStation] = useState<AfricanTvStation>(tvStations[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'tv_screen' | 'real_humans' | 'mcr_control' | 'frequency_guide'>('tv_screen');

  // Video player modes & states - defaults to real human match action!
  const [videoMode, setVideoMode] = useState<
    'real_human_match' | 'real_human_presenter' | 'real_human_engineer' | 'interactive_stream' | 'real_video'
  >('real_human_match');

  const [cameraAngle, setCameraAngle] = useState<'master' | 'spidercam' | 'steadicam' | 'goalcam'>('master');
  const [volumeLevel, setVolumeLevel] = useState<number>(0.8);
  const [resolution, setResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [customStreamUrl, setCustomStreamUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const tvContainerRef = useRef<HTMLDivElement>(null);

  // Animated broadcast canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleTuneStation = (station: AfricanTvStation) => {
    setSelectedStation(station);
    const match = matches.find((m) => m.id === station.currentlyAiringMatchId) || matches[0];
    onSelectMatch(match);
  };

  const handleToggleAudio = () => {
    const playing = stadiumAudio.toggle();
    setIsPlayingAudio(playing);
  };

  const toggleFullscreen = () => {
    if (!tvContainerRef.current) return;
    if (!document.fullscreenElement) {
      tvContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Canvas animated broadcast stream effect
  useEffect(() => {
    if (videoMode !== 'interactive_stream') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear pitch background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0a2312');
      grad.addColorStop(0.5, '#0f381c');
      grad.addColorStop(1, '#071b0e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Pitch mowing lawn lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < width; i += 60) {
        if (Math.floor(i / 60) % 2 === 0) {
          ctx.fillRect(i, 0, 30, height);
        }
      }

      // Pitch markings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 20, width - 60, height - 40);
      ctx.beginPath();
      ctx.moveTo(width / 2, 20);
      ctx.lineTo(width / 2, height - 20);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
      ctx.stroke();

      const homeColor = selectedMatch.homeColor || '#10b981';
      const awayColor = selectedMatch.awayColor || '#f59e0b';

      // Ball animation
      const ballX = width / 2 + Math.sin(time * 1.5) * (width * 0.35);
      const ballY = height / 2 + Math.cos(time * 2.2) * (height * 0.3);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(ballX, ballY + 6, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw players chasing ball
      for (let i = 0; i < 7; i++) {
        const offset = i * 0.9;
        const px1 = width * 0.3 + Math.sin(time + offset) * 90;
        const py1 = height * 0.4 + Math.cos(time * 1.2 + offset) * 70;

        ctx.fillStyle = homeColor;
        ctx.beginPath();
        ctx.arc(px1, py1, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const px2 = width * 0.7 + Math.sin(time * 0.9 + offset) * 80;
        const py2 = height * 0.5 + Math.cos(time * 1.1 + offset) * 75;

        ctx.fillStyle = awayColor;
        ctx.beginPath();
        ctx.arc(px2, py2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(width - 150, 15, 135, 24);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`CAM: ${cameraAngle.toUpperCase()}`, width - 140, 31);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [videoMode, cameraAngle, selectedMatch]);

  // Download M3U playlist helper
  const handleDownloadM3U = () => {
    let content = `#EXTM3U name="AfriKick Sovereign - 100% African TV Network"\n`;
    tvStations.forEach((st) => {
      content += `#EXTINF:-1 tvg-id="${st.callSign.toLowerCase()}" tvg-name="${st.name}",${st.name} (${st.country}) [${st.broadcastStandard}]\n`;
      content += `http://stream.afrikick.africa/live/${st.callSign.toLowerCase()}/index.m3u8\n\n`;
    });
    const blob = new Blob([content], { type: 'application/x-mpegURL' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'afrikick-tv-stations.m3u8';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Live TV Broadcast Directive Header */}
      <div className="rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-400">
              <Tv className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  Free-To-Air Continental Television Network
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-300 font-medium">
                  Real Human Broadcast Personnel & Athletes
                </span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">
                Live On National Television Stations Across Africa
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                Watch real human African football athletes, studio anchors, and master transmission engineers bringing live sports to 300M+ viewers in unencrypted High-Definition across all 54 national TV networks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleToggleAudio}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="h-4 w-4 animate-bounce" />
                  <span>TV Audio ON (Vuvuzela & Chants)</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  <span>Unmute TV Sound</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadM3U}
              className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-400/20"
            >
              <Download className="h-4 w-4" />
              <span>Export M3U Playlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('tv_screen')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'tv_screen'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Tv className="h-3.5 w-3.5" />
          <span>Live TV Receiver & Tuner</span>
        </button>
        <button
          onClick={() => setActiveTab('real_humans')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'real_humans'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Real Human Personnel & Studio Desk</span>
        </button>
        <button
          onClick={() => setActiveTab('mcr_control')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'mcr_control'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Master Control Room (MCR)</span>
        </button>
        <button
          onClick={() => setActiveTab('frequency_guide')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'frequency_guide'
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Satellite className="h-3.5 w-3.5" />
          <span>Household Satellite & DTT Tuning</span>
        </button>
      </div>

      {/* Tab 1: Virtual Television Screen */}
      {activeTab === 'tv_screen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Virtual Television Screen (8 cols) */}
          <div
            ref={tvContainerRef}
            className="lg:col-span-8 rounded-2xl border-4 border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden relative flex flex-col"
          >
            {/* TV Screen Top Info Header */}
            <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-white">{selectedStation.stationLogoText}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-amber-400">{selectedStation.country}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                <span className="text-emerald-400 font-bold">{selectedStation.broadcastStandard}</span>
                <span>·</span>
                <span>{resolution} {selectedStation.bitrateMbps} Mbps</span>
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-white text-neutral-400 ml-2"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Video Player Display Container */}
            <div className="relative aspect-16/9 w-full bg-black overflow-hidden select-none">
              {/* FEED 1: Real Human Football Players in Action */}
              {videoMode === 'real_human_match' && (
                <div className="relative w-full h-full">
                  <img
                    src="/src/assets/images/human_football_players_1791836472834.jpg"
                    alt="Real Human African Football Players Competing Live"
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 border border-neutral-700/80 px-3 py-1 rounded-full text-[10px] font-mono text-amber-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Users className="h-3 w-3 text-emerald-400" />
                    <span>REAL HUMAN MATCHDAY FEED · 1080p 60FPS</span>
                  </div>
                </div>
              )}

              {/* FEED 2: Real Human TV Studio Presenter & Football Anchor */}
              {videoMode === 'real_human_presenter' && (
                <div className="relative w-full h-full">
                  <img
                    src="/src/assets/images/human_tv_presenter_1791836460501.jpg"
                    alt="Real Human African Football TV Anchor in Studio"
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 border border-neutral-700/80 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Mic className="h-3 w-3 text-cyan-400" />
                    <span>TV STUDIO DESK · LIVE HUMAN ANCHOR & PUNDITRY</span>
                  </div>
                </div>
              )}

              {/* FEED 3: Real Human Master Control Room Broadcast Engineer */}
              {videoMode === 'real_human_engineer' && (
                <div className="relative w-full h-full">
                  <img
                    src="/src/assets/images/human_broadcast_engineer_1791836482901.jpg"
                    alt="Real Human Satellite & MCR Transmission Engineer"
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 border border-neutral-700/80 px-3 py-1 rounded-full text-[10px] font-mono text-emerald-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Satellite className="h-3 w-3 text-emerald-400" />
                    <span>SATELLITE GROUND STATION · REAL HUMAN TRANSMISSION DIRECTORS</span>
                  </div>
                </div>
              )}

              {/* FEED 4: 2D Tactical Pitch Radar */}
              {videoMode === 'interactive_stream' && (
                <div className="relative w-full h-full">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* FEED 5: HTML5 Video Stream */}
              {videoMode === 'real_video' && (
                <div className="relative w-full h-full bg-neutral-950 flex flex-col items-center justify-center">
                  <video
                    src={customStreamUrl || 'https://commondatastream.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* On-screen TV Station Logo Bug (Top Right) */}
              <div className="absolute top-4 right-5 flex flex-col items-end pointer-events-none drop-shadow-md z-10">
                <div
                  className="px-2.5 py-1 rounded font-display font-extrabold text-xs text-white tracking-wider flex items-center gap-1 shadow-lg border border-white/20 backdrop-blur-sm"
                  style={{ backgroundColor: `${selectedStation.themeColor}cc` }}
                >
                  <Tv className="h-3 w-3" />
                  <span>{selectedStation.stationLogoText}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 font-mono text-[9px] text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE ON AIR</span>
                </div>
              </div>

              {/* On-screen Scoreboard Overlay (Top Left) */}
              <div className="absolute top-4 left-5 bg-neutral-950/90 border border-neutral-700/80 rounded-lg p-2.5 backdrop-blur-md shadow-2xl text-xs z-10">
                <div className="flex items-center gap-3 font-bold font-display text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedMatch.homeColor }} />
                    <span>{selectedMatch.homeTeam}</span>
                    <span className="font-mono text-amber-400 px-1 bg-neutral-900 rounded">{selectedMatch.homeScore}</span>
                  </div>
                  <span className="text-neutral-500">-</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-amber-400 px-1 bg-neutral-900 rounded">{selectedMatch.awayScore}</span>
                    <span>{selectedMatch.awayTeam}</span>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedMatch.awayColor }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span className="text-amber-400 font-bold">{selectedMatch.minute}&apos;</span>
                  <span>{selectedMatch.competition}</span>
                </div>
              </div>

              {/* Bottom On-Screen TV Telemetry Ticker */}
              <div className="absolute bottom-3 inset-x-4 bg-black/85 border border-neutral-800 rounded-lg p-2 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-300 font-mono z-10">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">AIRING:</span>
                  <span className="text-white font-sans font-semibold">{selectedStation.currentProgram}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-[10px]">
                  <span>Freq: {selectedStation.frequencyOrTransponder}</span>
                  <span className="text-emerald-400 font-bold">100% FREE-TO-AIR</span>
                </div>
              </div>
            </div>

            {/* In-Player Real Human Feed Switcher Bar */}
            <div className="bg-neutral-950 p-2.5 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                  <Users className="h-3 w-3 text-amber-400" />
                  <span>SHOW REAL HUMAN:</span>
                </span>
                <button
                  onClick={() => setVideoMode('real_human_match')}
                  className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
                    videoMode === 'real_human_match'
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>⚽ Real Players</span>
                </button>
                <button
                  onClick={() => setVideoMode('real_human_presenter')}
                  className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
                    videoMode === 'real_human_presenter'
                      ? 'bg-cyan-400 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>🎙️ TV Studio Anchor</span>
                </button>
                <button
                  onClick={() => setVideoMode('real_human_engineer')}
                  className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
                    videoMode === 'real_human_engineer'
                      ? 'bg-emerald-400 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>📡 Satellite Engineer</span>
                </button>
                <button
                  onClick={() => setVideoMode('interactive_stream')}
                  className={`px-2 py-1 rounded text-[11px] ${
                    videoMode === 'interactive_stream'
                      ? 'bg-neutral-200 text-neutral-950 font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  2D Pitch Radar
                </button>
              </div>

              {/* Resolution Switcher */}
              <div className="flex items-center gap-1">
                {(['1080p', '720p', '480p'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      resolution === res
                        ? 'bg-neutral-200 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* TV Channel Tuner Buttons (Remote Control Bar) */}
            <div className="p-3 bg-neutral-900 border-t border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Channel Tuner — Click to Tune African TV Station:
                </span>
                {onNavigateToDeployment && (
                  <button
                    onClick={onNavigateToDeployment}
                    className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Tune Physical Satellite Dish</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tvStations.map((station, idx) => (
                  <button
                    key={station.id}
                    onClick={() => handleTuneStation(station)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                      selectedStation.id === station.id
                        ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-[10px] text-neutral-500 font-bold">CH {String(idx + 1).padStart(2, '0')}</span>
                    <span>{station.flagEmoji}</span>
                    <span>{station.callSign}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Station Broadcast Dossier & Coverage (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">Station Information</span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {selectedStation.name}
                </h3>
              </div>
              <span className="text-xl">{selectedStation.flagEmoji}</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] font-mono">ESTIMATED REACH</span>
                  <span className="font-mono text-sm font-bold text-white">{selectedStation.coverageHouseholds}</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px] font-mono">BROADCAST STANDARD</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">{selectedStation.broadcastStandard}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px]">Tuning Frequency & Satellite Coordinates</span>
                <p className="font-mono text-white text-[11px] p-2 rounded bg-neutral-950 border border-neutral-800 mt-0.5">
                  {selectedStation.frequencyOrTransponder}
                </p>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px]">Commentary & Language Track</span>
                <p className="text-neutral-200 font-medium">{selectedStation.audioLanguage}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 space-y-1">
                <span className="text-emerald-400 font-semibold block text-[11px]">
                  Free-To-Air Sovereign Guarantee
                </span>
                <p className="text-neutral-300 leading-snug text-[11px]">
                  Under the Pan-African Digital Sovereignty Protocol, {selectedStation.name} broadcasts this match with zero encryption. No smartcards or decoders required.
                </p>
              </div>

              {/* Station List Quick Switcher */}
              <div className="pt-2">
                <span className="text-neutral-500 block text-[11px] mb-2 font-mono uppercase">
                  Stations Airing Live Now:
                </span>
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {tvStations.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => handleTuneStation(st)}
                      className={`p-2 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        selectedStation.id === st.id
                          ? 'bg-amber-400/10 border border-amber-400/40 text-amber-300 font-medium'
                          : 'bg-neutral-950 border border-neutral-800/80 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{st.flagEmoji}</span>
                        <span className="truncate">{st.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono shrink-0">ON AIR</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Real Human Personnel & Studio Desk */}
      {activeTab === 'real_humans' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">
                  Human Broadcasters, Athletes & Engineers
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-0.5">
                  The Real Human Faces Driving African Football
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded">
                100% AUTHENTIC HUMAN PERSONNEL
              </span>
            </div>
            <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">
              Television broadcast is powered by real human talent: the footballers competing on the pitch, the sports studio analysts providing tactical breakdown, and the satellite engineers managing continental downlinks across 54 African capitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Person 1: TV Studio Presenter & Football Anchor */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl flex flex-col">
              <div className="relative aspect-16/9 w-full bg-black">
                <img
                  src="/src/assets/images/human_tv_presenter_1791836460501.jpg"
                  alt="Kwame Babangida - Pan-African Lead TV Anchor"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                  LIVE IN STUDIO
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Mic className="h-3.5 w-3.5" />
                    <span>LEAD TV SPORTS ANCHOR</span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mt-1">
                    Kwame Babangida
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Senior Broadcast Host · Africa Sports Live HD
                  </p>
                  <blockquote className="mt-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 italic leading-relaxed">
                    &ldquo;African football has unmatched passion and tactical flair. Tonight on free-to-air television, over 300 million viewers are watching history unfold with zero subscription fees.&rdquo;
                  </blockquote>
                </div>
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Languages: English, Swahili</span>
                  <span className="text-emerald-400">On Air Now</span>
                </div>
              </div>
            </div>

            {/* Person 2: Real Derby Athletes on Grass */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl flex flex-col">
              <div className="relative aspect-16/9 w-full bg-black">
                <img
                  src="/src/assets/images/human_football_players_1791836472834.jpg"
                  alt="African Derby Athletes in Aerial Header Duel"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                  MATCHDAY ACTION
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>PROFESSIONAL ATHLETES</span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mt-1">
                    Tariq Mensah & Emmanuel Chukwu
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Starting Number 9 & Center-Back · CAF Championship Derby
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between p-2 rounded bg-neutral-900">
                      <span className="text-neutral-400">Sprint Speed:</span>
                      <span className="font-mono text-amber-400 font-bold">34.2 km/h</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-neutral-900">
                      <span className="text-neutral-400">Aerial Duels Won:</span>
                      <span className="font-mono text-emerald-400 font-bold">8 / 11 (73%)</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Stadium Attendance: 85,000</span>
                  <span className="text-amber-400">Full 90 Mins</span>
                </div>
              </div>
            </div>

            {/* Person 3: Satellite Broadcast Engineer */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl flex flex-col">
              <div className="relative aspect-16/9 w-full bg-black">
                <img
                  src="/src/assets/images/human_broadcast_engineer_1791836482901.jpg"
                  alt="Dr. Amina Diallo - Lead Satellite Transmission Director"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-cyan-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                  TELEPORT ACTIVE
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Satellite className="h-3.5 w-3.5" />
                    <span>CHIEF SATELLITE ENGINEER</span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mt-1">
                    Eng. Amina Diallo
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Lead Uplink Controller · Pan-African Satellite Consortium
                  </p>
                  <blockquote className="mt-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 italic leading-relaxed">
                    &ldquo;We monitor 18 satellite transponders across NigComSat, Eutelsat, and SES. Every Ku-band signal is unencrypted so every rooftop dish in Africa gets crystal clear 1080p video.&rdquo;
                  </blockquote>
                </div>
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Downlink SNR: 15.2 dB</span>
                  <span className="text-cyan-400">Lock: 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Master Control Room (MCR) & Uplink Station */}
      {activeTab === 'mcr_control' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Pan-African Television Master Control Room (MCR)
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Automated multi-screen satellite up-linking facility coordinating television broadcast across 54 capitals
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded">
              ALL 54 NATIONAL MUXES CONNECTED
            </span>
          </div>

          <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
            <img
              src="/src/assets/images/human_broadcast_engineer_1791836482901.jpg"
              alt="Real Human Master Transmission Control Room"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white space-y-1">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Lagos & Nairobi Master Transmission Facility
                </span>
                <p className="text-sm font-semibold max-w-2xl">
                  Simultaneous HD feeds routed directly into national television towers (NTA, SABC, Azam, Arryadia, OnTime, GTV, RTS, CRTV, RTNC).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 font-mono text-[11px] block">DTT Terrestrial Towers</span>
              <span className="text-xl font-bold font-mono text-emerald-400">1,240+ Towers</span>
              <p className="text-neutral-400 text-[11px]">
                High-power VHF/UHF transmitters covering cities and rural communities.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 font-mono text-[11px] block">Satellite Transponders</span>
              <span className="text-xl font-bold font-mono text-amber-400">18 Uplinks Active</span>
              <p className="text-neutral-400 text-[11px]">
                Nilesat 201, Eutelsat 16A, Intelsat 20, and SES-5 beaming directly to dishes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 font-mono text-[11px] block">Zero Encryption Standard</span>
              <span className="text-xl font-bold font-mono text-white">100% Free-To-Air</span>
              <p className="text-neutral-400 text-[11px]">
                Guaranteed universal access for every African citizen without monthly subscription charges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Household Satellite & DTT Tuning Guide */}
      {activeTab === 'frequency_guide' && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Household Television Tuning & Satellite Guide
              </h3>
              <p className="text-xs text-neutral-400">
                Instructions for African viewers tuning in via regular rooftop aerials and satellite dishes
              </p>
            </div>
            <Satellite className="h-5 w-5 text-amber-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Station</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">Satellite / Terrestrial</th>
                  <th className="py-2.5 px-3">Frequency / Polarization</th>
                  <th className="py-2.5 px-3">Symbol Rate</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {tvStations.map((station) => (
                  <tr key={station.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                      <span>{station.flagEmoji}</span>
                      <span>{station.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300">{station.country}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-400">{station.broadcastStandard}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-200">{station.frequencyOrTransponder}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-400">27500 / 30000</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                        FREE-TO-AIR
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          handleTuneStation(station);
                          setActiveTab('tv_screen');
                        }}
                        className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[11px] transition-colors"
                      >
                        Tune TV
                      </button>
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
