import React from 'react';
import { AfricanLegend } from '../types/telecom';
import { Award, Quote, Sparkles, MapPin } from 'lucide-react';

interface LegendsAndHeritageProps {
  legends: AfricanLegend[];
}

export const LegendsAndHeritage: React.FC<LegendsAndHeritageProps> = ({ legends }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            African Football Heritage & Academy Pioneers
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Global legends nurtured on African soil — proof that world football greatness starts here
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-1 rounded">
            THE ROOT OF FOOTBALL GENIUS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {legends.map((legend) => (
          <div
            key={legend.id}
            className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm space-y-4 hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl font-display text-base font-bold text-white shadow-lg"
                  style={{ backgroundColor: legend.accentColor }}
                >
                  {legend.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display leading-tight">
                    {legend.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                    <MapPin className="h-3 w-3 text-amber-400" />
                    <span>{legend.country}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Grassroots African Roots:</span>
                  <p className="text-neutral-200 font-medium">{legend.grassrootsClub}</p>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Milestones & Honors:</span>
                  <p className="text-amber-400 font-semibold">{legend.achievements}</p>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Continental Legacy:</span>
                  <p className="text-neutral-300 leading-snug">{legend.careerHighlight}</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 text-[11px] text-neutral-400 italic relative">
              <Quote className="h-3 w-3 text-amber-400/50 absolute top-2 right-2" />
              &ldquo;{legend.quote}&rdquo;
            </div>
          </div>
        ))}
      </div>

      {/* Grassroots Academy Pledge */}
      <div className="rounded-xl border border-emerald-900/50 bg-gradient-to-r from-emerald-950/60 to-neutral-900 p-6 space-y-3">
        <h3 className="text-base font-bold text-emerald-300 font-display flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>The Next Generation Starts in African Academies</span>
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
          By reclaiming African broadcast bandwidth from foreign leagues, domestic television rights are redirected straight into domestic clubs: Right to Dream Academy (Ghana), Génération Foot (Senegal), Kadji Sports (Cameroon), and Mamelodi Sundowns Youth Academy. Africa is not a feeder continent — Africa is football royalty.
        </p>
      </div>
    </div>
  );
};
