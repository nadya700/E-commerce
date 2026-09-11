import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSelectGender: (gender: string) => void;
  selectedGender: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectGender, selectedGender }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
      {/* Subtle decorative background circles */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>2026 Mavi Dəb Mövsümü</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Mavi Tonların Zərifliyi və <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-sky-400">
                Premium İtalyan Dəbi
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Kobalt, indiqo, kral mavisi və dəniz tonlarında hazırlanmış zərif pencəklər, ipək donlar, kaşmir sviterlər və premium kətan köynəklər.
            </p>

            {/* Quick Gender Filter Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs text-blue-200 font-medium">Bölmə seçin:</span>
              {[
                { id: '', label: 'Bütün Kolleksiya' },
                { id: 'Qadın', label: 'Qadın Dəbi' },
                { id: 'Kişi', label: 'Kişi Dəbi' },
                { id: 'Uniseks', label: 'Uniseks & Küçə Dəbi' },
              ].map((pill) => {
                const isSelected = selectedGender === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => onSelectGender(pill.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-300'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                    }`}
                  >
                    <span>{pill.label}</span>
                    {isSelected && <ArrowRight className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value Props & Featured Banner Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-blue-900/60 to-slate-900/90 border border-blue-700/40 p-6 backdrop-blur-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-blue-800/60">
                <div>
                  <p className="text-xs text-blue-300 font-medium">Xüsusi Fürsət</p>
                  <p className="text-lg font-bold text-white">Bütün Geyim Məhsullarında</p>
                </div>
                <div className="bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg">
                  -25% ENDİRİM
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/60 border border-blue-800/40">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Sürətli Çatdırılma</p>
                    <p className="text-[11px] text-slate-400">Bakı daxili 24 saat ərzində</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/60 border border-blue-800/40">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">100% Təbii Parçalar</p>
                    <p className="text-[11px] text-slate-400">Yun, kaşmir, pambıq, ipək</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/60 border border-blue-800/40">
                  <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Rahat Dəyişmə</p>
                    <p className="text-[11px] text-slate-400">14 gün qaytarma zəmanəti</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/60 border border-blue-800/40">
                  <div className="w-4 h-4 rounded-full bg-blue-400/20 text-blue-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    AZ
                  </div>
                  <div>
                    <p className="font-semibold text-white">Qapıda Ödəniş</p>
                    <p className="text-[11px] text-slate-400">Nağd və ya posterminal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
