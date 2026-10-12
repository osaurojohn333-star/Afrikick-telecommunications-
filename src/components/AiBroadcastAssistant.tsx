import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, MessageSquare, RefreshCw, Send, Globe, Radio } from 'lucide-react';

export const AiBroadcastAssistant: React.FC = () => {
  const [promptTopic, setPromptTopic] = useState('match_preview');
  const [language, setLanguage] = useState('English');
  const [matchSubject, setMatchSubject] = useState('Al Ahly vs Mamelodi Sundowns');
  const [outputContent, setOutputContent] = useState<string>(
    '🚨 SOVEREIGN CAF MATCHDAY ALERT (20:00 GMT):\nEuropean feeds temporarily quarantined across African Telecom Gateways. Tonight, the continent watches our own giants: Al Ahly SC vs Mamelodi Sundowns in the CAF Champions League Semi-Final!\nZero data charged on MTN, Safaricom, and Vodacom networks. Dial *778# or stream live. Celebrate African Football Greatness!'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateContent = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are the chief editorial director for the Pan-African Sports Sovereignty System (AfriKick). 
Your mission is to produce passionate, culturally proud, high-energy telecommunication push broadcasts and match commentary that celebrates African Football (CAF Champions League, NPFL, PSL, Botola Pro) and explains why African communication systems prioritize domestic African football over European commercial broadcasts. Language: ${language}.`;

        const userPrompt = `Generate a ${
          promptTopic === 'match_preview'
            ? 'high-energy Cell Broadcast push message and match commentary preview'
            : promptTopic === 'sovereign_manifesto'
            ? 'short cultural sovereignty broadcast alert for African telecommunication subscribers'
            : 'scouting and grassroots academy celebration alert'
        } focused on ${matchSubject} in ${language}. Keep it concise, punchy, and uplifting.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        });

        if (response.text) {
          setOutputContent(response.text);
          setIsLoading(false);
          return;
        }
      }

      // High-quality localized fallback if API key is not present
      if (promptTopic === 'sovereign_manifesto') {
        setOutputContent(
          `🌍 PAN-AFRICAN TELECOM DIRECTIVE (Act 2026):\nAfrican airwaves belong to African dreams. As European league streams are filtered at continental landing stations, we reclaim 119 Tbps of bandwidth to broadcast our own champions: TP Mazembe, Raja Casablanca, Enyimba, and Sundowns. We built world football; now we build our own stadiums. Zero-rated everywhere today!`
        );
      } else if (promptTopic === 'grassroots') {
        setOutputContent(
          `🌱 GRASSROOTS SCOUTING ALERT: \nFrom the dusty pitches of Douala, Monrovia, Abidjan, and Ajegunle, African youth carry football magic. Support the next George Weah, Jay-Jay Okocha, and Didier Drogba right here in the NPFL and PSL. Tune in free across all African mobile networks!`
        );
      } else {
        setOutputContent(
          `🔥 LIVE MATCHDAY BROADCAST (${matchSubject}):\nTwo African titans collide under Cairo & Johannesburg floodlights. 80,000 voices singing, vuvuzelas roaring with the heartbeat of Africa! Don't look to Europe for excellence when Africa's greatest football spectacle is playing right now. Free on all African telco networks!`
        );
      }
    } catch {
      setOutputContent(
        `⚡ PAN-AFRICAN MATCHDAY DISPATCH:\nForeign broadcast streams filtered. Today the entire continent stands united for ${matchSubject}. Stream free with zero data on your local SIM card. Proudly African!`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Automated AI Telecom Dispatch Composer</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Synthesize localized push notifications, Cell Broadcasts, and commentary
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">Gemini Powered</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-neutral-400 block mb-1 font-medium">Broadcast Topic</label>
          <select
            value={promptTopic}
            onChange={(e) => setPromptTopic(e.target.value)}
            className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="match_preview">CAF Matchday Push Alert</option>
            <option value="sovereign_manifesto">Sovereignty Telecom Manifesto</option>
            <option value="grassroots">Grassroots Academy Spotlight</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-medium">Featured Match / Subject</label>
          <input
            type="text"
            value={matchSubject}
            onChange={(e) => setMatchSubject(e.target.value)}
            className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            placeholder="e.g. Al Ahly vs Sundowns"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-medium">Language & Dialect</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="English">English</option>
            <option value="Swahili">Swahili (Kiswahili)</option>
            <option value="French">French (Français)</option>
            <option value="Arabic">Arabic (العربية)</option>
            <option value="Yoruba">Yoruba</option>
            <option value="Zulu">Zulu (isiZulu)</option>
          </select>
        </div>
      </div>

      <div className="relative rounded-lg bg-neutral-950 border border-neutral-800 p-4 font-mono text-xs text-neutral-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Radio className="h-3 w-3" />
            <span>DISPATCH BUFFER</span>
          </span>
          <span>Targeting ~240M Connected Devices</span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed">{outputContent}</p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleGenerateContent}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Generating Broadcast...' : 'Generate New Broadcast'}</span>
        </button>
      </div>
    </div>
  );
};
