import React, { useState, useEffect, useRef } from 'react';
import { AfricanMatch } from '../types/telecom';
import { stadiumAudio } from '../utils/audioSynthesizer';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  VolumeX,
  Radio,
  Flame,
  Award,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Tv,
  Users,
  Camera,
} from 'lucide-react';

interface LiveMatchPlayerProps {
  matches: AfricanMatch[];
  selectedMatch: AfricanMatch;
  onSelectMatch: (match: AfricanMatch) => void;
}

interface PlayerNode {
  id: string;
  name: string;
  number: number;
  team: 'home' | 'away';
  role: 'GK' | 'DF' | 'MF' | 'FW';
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
}

export const LiveMatchPlayer: React.FC<LiveMatchPlayerProps> = ({
  matches,
  selectedMatch,
  onSelectMatch,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [matchMinute, setMatchMinute] = useState<number>(selectedMatch.minute);
  const [matchSeconds, setMatchSeconds] = useState<number>(14);
  const [homeScore, setHomeScore] = useState<number>(selectedMatch.homeScore);
  const [awayScore, setAwayScore] = useState<number>(selectedMatch.awayScore);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [commentaryLang, setCommentaryLang] = useState<string>('English');
  const [viewMode, setViewMode] = useState<'real_human_action' | '2d_pitch'>('real_human_action');

  // Ball & pitch simulation states
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [ballState, setBallState] = useState<'idle' | 'passing' | 'shooting' | 'goal'>('passing');
  const [activeGoalCelebration, setActiveGoalCelebration] = useState<string | null>(null);
  const [activeBanner, setActiveBanner] = useState<string | null>(null);

  // Live in-match dynamic events ticker
  const [liveEvents, setLiveEvents] = useState<
    { minute: number; text: string; type: 'goal' | 'card' | 'save' | 'attack' | 'sub' }[]
  >(selectedMatch.events.map(e => ({ minute: e.minute, text: e.text, type: e.type === 'chance' ? 'attack' : e.type })));

  // Simulated 22 Player Nodes on pitch (0-100 coordinates)
  const [players, setPlayers] = useState<PlayerNode[]>([
    // HOME (Defending left, attacking right)
    { id: 'h1', name: 'Goalkeeper', number: 1, team: 'home', role: 'GK', baseX: 6, baseY: 50, currentX: 6, currentY: 50 },
    { id: 'h2', name: 'RB', number: 2, team: 'home', role: 'DF', baseX: 24, baseY: 20, currentX: 24, currentY: 20 },
    { id: 'h3', name: 'CB', number: 4, team: 'home', role: 'DF', baseX: 20, baseY: 40, currentX: 20, currentY: 40 },
    { id: 'h4', name: 'CB', number: 5, team: 'home', role: 'DF', baseX: 20, baseY: 60, currentX: 20, currentY: 60 },
    { id: 'h5', name: 'LB', number: 3, team: 'home', role: 'DF', baseX: 24, baseY: 80, currentX: 24, currentY: 80 },
    { id: 'h6', name: 'DM', number: 6, team: 'home', role: 'MF', baseX: 36, baseY: 50, currentX: 36, currentY: 50 },
    { id: 'h7', name: 'CM', number: 8, team: 'home', role: 'MF', baseX: 45, baseY: 35, currentX: 45, currentY: 35 },
    { id: 'h8', name: 'AM', number: 10, team: 'home', role: 'MF', baseX: 48, baseY: 65, currentX: 48, currentY: 65 },
    { id: 'h9', name: 'RW', number: 7, team: 'home', role: 'FW', baseX: 62, baseY: 22, currentX: 62, currentY: 22 },
    { id: 'h10', name: 'CF', number: 9, team: 'home', role: 'FW', baseX: 66, baseY: 50, currentX: 66, currentY: 50 },
    { id: 'h11', name: 'LW', number: 11, team: 'home', role: 'FW', baseX: 62, baseY: 78, currentX: 62, currentY: 78 },

    // AWAY (Defending right, attacking left)
    { id: 'a1', name: 'Goalkeeper', number: 1, team: 'away', role: 'GK', baseX: 94, baseY: 50, currentX: 94, currentY: 50 },
    { id: 'a2', name: 'LB', number: 3, team: 'away', role: 'DF', baseX: 76, baseY: 20, currentX: 76, currentY: 20 },
    { id: 'a3', name: 'CB', number: 5, team: 'away', role: 'DF', baseX: 80, baseY: 40, currentX: 80, currentY: 40 },
    { id: 'a4', name: 'CB', number: 4, team: 'away', role: 'DF', baseX: 80, baseY: 60, currentX: 80, currentY: 60 },
    { id: 'a5', name: 'RB', number: 2, team: 'away', role: 'DF', baseX: 76, baseY: 80, currentX: 76, currentY: 80 },
    { id: 'a6', name: 'DM', number: 6, team: 'away', role: 'MF', baseX: 64, baseY: 50, currentX: 64, currentY: 50 },
    { id: 'a7', name: 'CM', number: 8, team: 'away', role: 'MF', baseX: 55, baseY: 35, currentX: 55, currentY: 35 },
    { id: 'a8', name: 'AM', number: 10, team: 'away', role: 'MF', baseX: 52, baseY: 65, currentX: 52, currentY: 65 },
    { id: 'a9', name: 'LW', number: 11, team: 'away', role: 'FW', baseX: 38, baseY: 22, currentX: 38, currentY: 22 },
    { id: 'a10', name: 'CF', number: 9, team: 'away', role: 'FW', baseX: 34, baseY: 50, currentX: 34, currentY: 50 },
    { id: 'a11', name: 'RW', number: 7, team: 'away', role: 'FW', baseX: 38, baseY: 78, currentX: 38, currentY: 78 },
  ]);

  // Synchronize when parent match changes
  useEffect(() => {
    setMatchMinute(selectedMatch.minute);
    setMatchSeconds(14);
    setHomeScore(selectedMatch.homeScore);
    setAwayScore(selectedMatch.awayScore);
    setBallPos(selectedMatch.ballPosition);
    setLiveEvents(selectedMatch.events.map(e => ({ minute: e.minute, text: e.text, type: e.type === 'chance' ? 'attack' : e.type })));
  }, [selectedMatch]);

  // Main match clock ticker
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(250, 1000 / playbackSpeed);
    const clockTimer = setInterval(() => {
      setMatchSeconds((sec) => {
        if (sec >= 59) {
          setMatchMinute((min) => {
            if (min >= 90) return 90;
            return min + 1;
          });
          return 0;
        }
        return sec + 1;
      });

      // Animate players subtle repositioning based on ball possession
      setPlayers((prev) =>
        prev.map((p) => {
          const jitterX = (Math.random() * 4 - 2);
          const jitterY = (Math.random() * 4 - 2);
          return {
            ...p,
            currentX: Math.max(4, Math.min(96, p.baseX + jitterX)),
            currentY: Math.max(10, Math.min(90, p.baseY + jitterY)),
          };
        })
      );

      // Random ball movement
      if (ballState !== 'goal' && ballState !== 'shooting') {
        setBallPos((prev) => {
          const dx = Math.random() * 8 - 4;
          const dy = Math.random() * 8 - 4;
          return {
            x: Math.max(12, Math.min(88, prev.x + dx)),
            y: Math.max(15, Math.min(85, prev.y + dy)),
          };
        });
      }
    }, intervalMs);

    return () => clearInterval(clockTimer);
  }, [isPlaying, playbackSpeed, ballState]);

  // Action: Launch Counter-Attack
  const handleTriggerAttack = (team: 'home' | 'away') => {
    setActiveBanner(`${team === 'home' ? selectedMatch.homeTeam : selectedMatch.awayTeam} launching rapid counter-attack down the wing!`);
    const targetX = team === 'home' ? 82 : 18;
    const targetY = Math.random() > 0.5 ? 30 : 70;
    setBallState('passing');
    setBallPos({ x: targetX, y: targetY });

    // Add commentary
    const text = `${matchMinute}' ⚡ Lightning fast break! ${team === 'home' ? selectedMatch.homeTeam : selectedMatch.awayTeam} breaks through the defensive press!`;
    setLiveEvents((prev) => [{ minute: matchMinute, text, type: 'attack' }, ...prev.slice(0, 8)]);

    setTimeout(() => setActiveBanner(null), 3000);
  };

  // Action: Take a Shot on Goal
  const handleTriggerShot = (team: 'home' | 'away') => {
    setBallState('shooting');
    const targetGoalX = team === 'home' ? 95 : 5;
    const targetGoalY = 50;
    setBallPos({ x: targetGoalX, y: targetGoalY });

    const isGoal = Math.random() > 0.45;

    if (isGoal) {
      setTimeout(() => {
        handleScoreGoal(team);
      }, 700);
    } else {
      setTimeout(() => {
        handleGoalkeeperSave(team === 'home' ? 'away' : 'home');
      }, 700);
    }
  };

  // Action: Goal Scored Celebration
  const handleScoreGoal = (scoringTeam: 'home' | 'away') => {
    setBallState('goal');
    stadiumAudio.playGoalSurge();

    if (scoringTeam === 'home') {
      setHomeScore((s) => s + 1);
    } else {
      setAwayScore((s) => s + 1);
    }

    const teamName = scoringTeam === 'home' ? selectedMatch.homeTeam : selectedMatch.awayTeam;
    const celebrantText = `GOAAALLL! ${teamName} finds the back of the net! Total stadium ecstasy!`;
    setActiveGoalCelebration(celebrantText);

    setLiveEvents((prev) => [
      {
        minute: matchMinute,
        text: `⚽ GOAL! Spectacular strike for ${teamName}! Stadium decibels hit 120 dB!`,
        type: 'goal',
      },
      ...prev.slice(0, 8),
    ]);

    setTimeout(() => {
      setActiveGoalCelebration(null);
      setBallState('idle');
      setBallPos({ x: 50, y: 50 }); // Center kick-off
    }, 4500);
  };

  // Action: Goalkeeper Save
  const handleGoalkeeperSave = (defendingTeam: 'home' | 'away') => {
    setBallState('idle');
    const gkName = defendingTeam === 'home' ? 'Home Goalkeeper' : 'Away Goalkeeper';
    setActiveBanner(`🧤 SENSATIONAL SAVE! What a diving stop by ${gkName}!`);
    stadiumAudio.playWhistle();

    setLiveEvents((prev) => [
      {
        minute: matchMinute,
        text: `🧤 UNBELIEVABLE DIVE! Full-stretch fingertip save tipping the ball around the post!`,
        type: 'save',
      },
      ...prev.slice(0, 8),
    ]);

    setTimeout(() => setActiveBanner(null), 3500);
  };

  // Toggle stadium synthesized audio
  const handleToggleAudio = () => {
    const active = stadiumAudio.toggle();
    setIsAudioOn(active);
  };

  const handleResetMatch = () => {
    setMatchMinute(0);
    setMatchSeconds(0);
    setHomeScore(0);
    setAwayScore(0);
    setBallPos({ x: 50, y: 50 });
    stadiumAudio.playWhistle();
    setActiveBanner('Whistle blown: Match kicked off from 00:00!');
    setTimeout(() => setActiveBanner(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40">
              <Tv className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Live Interactive Match Engine
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  2D Pitch Simulation & Tactical Radar
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-display mt-0.5">
                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </h2>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause Match' : 'Play Match'}</span>
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 p-0.5 text-xs font-mono">
              {[1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={handleResetMatch}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Reset match to 00:00"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => stadiumAudio.playWhistle()}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors"
              title="Blow referee whistle"
            >
              🔔 Whistle
            </button>

            <button
              onClick={handleToggleAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isAudioOn
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              {isAudioOn ? <Volume2 className="h-4 w-4 animate-bounce" /> : <VolumeX className="h-4 w-4" />}
              <span>{isAudioOn ? 'Audio ON' : 'Stadium Sound'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pitch Simulator Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Interactive Soccer Pitch (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border-4 border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden relative">
          {/* Top Scoreboard Bug */}
          <div className="bg-neutral-900/90 px-5 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                ON AIR
              </span>
              <div className="flex items-center gap-2 font-bold font-display text-white text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedMatch.homeColor }} />
                <span>{selectedMatch.homeTeam}</span>
                <span className="text-amber-400 px-1.5 py-0.5 bg-neutral-950 rounded font-mono text-base">
                  {homeScore}
                </span>
                <span className="text-neutral-500">-</span>
                <span className="text-amber-400 px-1.5 py-0.5 bg-neutral-950 rounded font-mono text-base">
                  {awayScore}
                </span>
                <span>{selectedMatch.awayTeam}</span>
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedMatch.awayColor }} />
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <button
                onClick={() => setViewMode((v) => (v === 'real_human_action' ? '2d_pitch' : 'real_human_action'))}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'real_human_action'
                    ? 'bg-amber-400 text-neutral-950 shadow-sm'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700'
                }`}
              >
                <Users className="h-3 w-3" />
                <span>{viewMode === 'real_human_action' ? 'Real Human Action' : 'Switch to Real Humans'}</span>
              </button>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {String(matchMinute).padStart(2, '0')}:{String(matchSeconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-neutral-500">·</span>
              <span className="text-emerald-400 text-[11px] font-semibold">100% FREE-TO-AIR</span>
            </div>
          </div>

          {/* Active Goal Celebration Banner Alert */}
          {activeGoalCelebration && (
            <div className="absolute top-16 inset-x-8 z-30 bg-gradient-to-r from-amber-500 via-emerald-500 to-red-500 p-0.5 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="bg-neutral-950/95 p-4 rounded-[10px] text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-lg font-display uppercase tracking-widest animate-bounce">
                  <Flame className="h-6 w-6 text-red-500" />
                  <span>⚽ GOAL! GOAAALLLL! ⚽</span>
                  <Flame className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-xs text-white font-medium">{activeGoalCelebration}</p>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  CROWD DECIBELS: 120 dB · SOVEREIGN TV CELEBRATION
                </span>
              </div>
            </div>
          )}

          {/* Generic Action Banner Alert */}
          {activeBanner && !activeGoalCelebration && (
            <div className="absolute top-16 inset-x-12 z-20 bg-neutral-900/90 border border-amber-400/50 p-2.5 rounded-lg text-center text-xs text-amber-200 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
              {activeBanner}
            </div>
          )}

          {/* Visual Display: Real Human Photography or 2D Tactical Radar */}
          {viewMode === 'real_human_action' ? (
            <div className="relative aspect-16/9 w-full bg-black select-none overflow-hidden">
              <img
                src="/src/assets/images/human_football_players_1791836472834.jpg"
                alt={`${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} Real Human Football Players in Action`}
                className="w-full h-full object-cover animate-in fade-in duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Real Human Match Overlays */}
              <div className="absolute top-4 left-4 bg-black/80 border border-neutral-700/80 rounded-xl p-3 backdrop-blur-md text-xs font-mono text-white flex flex-col gap-1 shadow-2xl">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Users className="h-3.5 w-3.5 text-amber-400" />
                  <span>REAL HUMAN DERBY ATHLETES</span>
                </div>
                <div className="text-[11px] text-neutral-200">
                  Aerial Duel: <strong className="text-white">{selectedMatch.homeTeam} Attackers</strong> vs <strong className="text-white">{selectedMatch.awayTeam} Defenders</strong>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-emerald-400 mt-0.5">
                  <span>Heart Rate: 172 BPM</span>
                  <span>·</span>
                  <span>Sprint Speed: 34.2 km/h</span>
                </div>
              </div>

              {/* View Switcher Overlay Badge */}
              <div className="absolute top-4 right-4 bg-black/80 border border-neutral-700/80 rounded-lg px-2.5 py-1 backdrop-blur-md text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>PITCH CAM 01 · REAL HUMAN BROADCAST</span>
              </div>

              {/* On-Pitch Bottom Telemetry Overlay */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-[11px] text-white/90 font-mono bg-black/75 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">VENUE:</span>
                  <span>{selectedMatch.stadium} ({selectedMatch.city})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  <span>85,000 FANS IN ATTENDANCE</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-16/9 w-full bg-emerald-950 select-none overflow-hidden p-2">
              <svg
                viewBox="0 0 100 65"
                className="w-full h-full rounded border-2 border-emerald-500/60 shadow-inner"
                style={{
                  background: 'repeating-linear-gradient(90deg, #064e3b 0px, #064e3b 10%, #047857 10%, #047857 20%)',
                }}
              >
                {/* Pitch White Lines */}
                <g stroke="#ffffff" strokeWidth="0.5" fill="none" opacity="0.8">
                  <rect x="2" y="2" width="96" height="61" />
                  <line x1="50" y1="2" x2="50" y2="63" />
                  <circle cx="50" cy="32.5" r="9" />
                  <circle cx="50" cy="32.5" r="0.6" fill="#ffffff" />
                  <rect x="2" y="14" width="16" height="37" />
                  <rect x="2" y="22" width="6" height="21" />
                  <circle cx="12" cy="32.5" r="0.6" fill="#ffffff" />
                  <rect x="82" y="14" width="16" height="37" />
                  <rect x="92" y="22" width="6" height="21" />
                  <circle cx="88" cy="32.5" r="0.6" fill="#ffffff" />
                  <rect x="0.5" y="27" width="1.5" height="11" stroke="#ffffff" fill="#ffffff" fillOpacity="0.2" />
                  <rect x="98" y="27" width="1.5" height="11" stroke="#ffffff" fill="#ffffff" fillOpacity="0.2" />
                </g>

                {/* 22 Moving Player Dots */}
                {players.map((p) => {
                  const isHome = p.team === 'home';
                  const fillColor = isHome ? selectedMatch.homeColor : selectedMatch.awayColor;
                  const textColor = '#ffffff';

                  return (
                    <g
                      key={p.id}
                      className="transition-all duration-700 ease-out cursor-pointer"
                      transform={`translate(${p.currentX}, ${p.currentY * 0.65})`}
                    >
                      <circle r="1.6" fill={fillColor} stroke="#ffffff" strokeWidth="0.3" />
                      <text
                        y="0.5"
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="1.1"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {p.number}
                      </text>
                    </g>
                  );
                })}

                {/* Ball Trajectory & Soccer Ball with Dynamic Glow */}
                <g
                  className="transition-all duration-500 ease-out"
                  transform={`translate(${ballPos.x}, ${ballPos.y * 0.65})`}
                >
                  {ballState === 'shooting' && (
                    <circle r="3.5" fill="#facc15" opacity="0.4" className="animate-ping" />
                  )}
                  <circle r="1.1" fill="#ffffff" stroke="#18181b" strokeWidth="0.3" />
                  <circle r="0.4" fill="#000000" />
                </g>
              </svg>

              {/* On-Pitch Bottom Telemetry Overlay */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-[11px] text-white/90 font-mono bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">VENUE:</span>
                  <span>{selectedMatch.stadium} ({selectedMatch.city})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  <span>AFRICAN SOVEREIGN MATCH ENGINE</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Match Action Trigger Buttons */}
          <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Trigger Live Play Actions:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleTriggerAttack('home')}
                className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
              >
                ⚡ {selectedMatch.homeTeam} Counter
              </button>
              <button
                onClick={() => handleTriggerShot('home')}
                className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors shadow-sm"
              >
                ⚽ Shoot ({selectedMatch.homeTeam})
              </button>
              <button
                onClick={() => handleTriggerShot('away')}
                className="px-2.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-xs font-bold text-neutral-950 transition-colors shadow-sm"
              >
                ⚽ Shoot ({selectedMatch.awayTeam})
              </button>
              <button
                onClick={() => handleGoalkeeperSave('home')}
                className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
              >
                🧤 Epic Diving Save
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Commentary Ticker & Derbies Switcher (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                Match Timeline
              </span>
              <h3 className="text-base font-bold text-white font-display mt-0.5">
                Live Broadcast Events
              </h3>
            </div>
            <select
              value={commentaryLang}
              onChange={(e) => setCommentaryLang(e.target.value)}
              className="rounded bg-neutral-950 border border-neutral-800 px-2 py-1 text-[11px] text-neutral-300 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
              <option value="French">French</option>
              <option value="Pidgin">Pidgin</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>

          {/* Event Feed */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {liveEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-0.5 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-amber-400 font-bold">{evt.minute}&apos;</span>
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                    {evt.type === 'goal'
                      ? '⚽ Goal'
                      : evt.type === 'save'
                      ? '🧤 Great Save'
                      : evt.type === 'card'
                      ? '🟨 Caution'
                      : '⚡ Action'}
                  </span>
                </div>
                <p className="text-neutral-200 leading-snug">{evt.text}</p>
              </div>
            ))}
          </div>

          {/* Derby Switcher Bar */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Switch African Derby to Play:
            </span>
            <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMatch(m)}
                  className={`w-full text-left p-2 rounded text-xs transition-colors truncate flex items-center justify-between ${
                    selectedMatch.id === m.id
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <span className="truncate">{m.homeTeam} vs {m.awayTeam}</span>
                  <span className="font-mono text-[10px] ml-2 opacity-80 shrink-0">
                    {m.homeScore}-{m.awayScore}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
