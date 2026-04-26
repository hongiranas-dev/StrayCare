import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { 
  Map, 
  Users, 
  HeartPulse, 
  Flame, 
  AlertTriangle, 
  ShieldCheck
} from "lucide-react";
import { zoneData } from "@/data/zones";

function AnimatedCounter({
  value,
  format = "number",
}: {
  value: number;
  format?: "number" | "percent";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });

  const formatValue = (n: number): string => {
    const rounded = Math.round(n);
    if (format === "percent") return `${rounded}%`;
    return rounded.toLocaleString("en-US");
  };

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [springValue, format]);

  return <span ref={ref}>{formatValue(value)}</span>;
}

export function CityInsights() {
  const totalZones = zoneData.length;
  const totalPopulation = zoneData.reduce((sum, z) => sum + z.population, 0);
  const avgNeutered = zoneData.reduce((sum, z) => sum + z.neuteredPercentage, 0) / totalZones;
  
  const highestDensityZone = [...zoneData].sort((a, b) => b.density - a.density)[0];
  const maxPopulation = Math.max(...zoneData.map(z => z.population));

  const highPriorityZones = zoneData.filter(z => z.density > 500 && z.neuteredPercentage < 70);

  const colors = [
    "from-emerald-500/80 to-emerald-400/60",
    "from-lime-500/80 to-lime-400/60",
    "from-amber-500/80 to-amber-400/60",
    "from-orange-500/80 to-orange-400/60",
    "from-rose-500/80 to-rose-400/60",
    "from-fuchsia-500/80 to-fuchsia-400/60",
    "from-sky-500/80 to-sky-400/60",
    "from-teal-500/80 to-teal-400/60"
  ];

  return (
    <div className="mt-16 space-y-10">
      {/* 1) Section header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-emerald-400 font-semibold text-sm tracking-wide uppercase mb-2">Zone Analytics</div>
            <div className="flex items-center gap-4">
              <h2 className="font-admin-serif text-3xl font-bold text-white">City Insights</h2>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full mt-2 mb-2" />
            <p className="text-white/60 text-lg">Zone-level stray dog analysis</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            Live Data
          </div>
        </div>
      </div>

      {/* 2) Summary cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
          <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Map className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Zones</div>
            </div>
            <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={totalZones} /></div>
            <div className="text-sm text-white/50 mt-2">Monitored areas</div>
          </div>
        </div>

        <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
          <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Population</div>
            </div>
            <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={totalPopulation} /></div>
            <div className="text-sm text-white/50 mt-2">Estimated strays</div>
          </div>
        </div>

        <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
          <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Avg Neutered %</div>
            </div>
            <div className="text-5xl font-admin-serif font-bold text-white"><AnimatedCounter value={Number(avgNeutered.toFixed(1))} />%</div>
            <div className="text-sm text-white/50 mt-2">City-wide average</div>
          </div>
        </div>

        <div className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/40 to-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group">
          <div className="relative rounded-2xl p-6 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full transition-colors group-hover:bg-[#0f1117]/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Highest Density Zone</div>
            </div>
            <div className="text-3xl font-admin-serif font-bold text-white truncate" title={highestDensityZone.name}>{highestDensityZone.name}</div>
            <div className="text-sm text-white/50 mt-2">{highestDensityZone.density} strays / km²</div>
          </div>
        </div>
      </div>

      {/* 3 & 4) Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Chart */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
          <h3 className="font-admin-serif text-lg font-semibold text-white mb-6">Population by Zone</h3>
          <div className="space-y-4">
            {zoneData.map((zone, i) => {
              const percent = (zone.population / maxPopulation) * 100;
              const colorClass = colors[i % colors.length];
              return (
                <div key={zone.id} className="flex items-center gap-4">
                  <div className="w-[140px] shrink-0 text-white/80 font-admin-sans font-medium text-sm truncate" title={zone.name}>
                    {zone.name}
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <div className="w-16 shrink-0 text-right text-white/60 text-sm">
                    {zone.population.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Density Chart */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-admin-serif text-lg font-semibold text-white">Stray Density by Zone</h3>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              High density (&gt; 500)
            </div>
          </div>
          <div className="space-y-4">
            {zoneData.map((zone, i) => {
              const maxDensity = Math.max(...zoneData.map(z => z.density));
              const percent = (zone.density / maxDensity) * 100;
              const isHigh = zone.density > 500;
              
              return (
                <div key={zone.id} className="flex items-center gap-4">
                  <div className="w-[140px] shrink-0 text-white/80 font-admin-sans font-medium text-sm flex items-center gap-2">
                    <span className="truncate block" title={zone.name}>{zone.name}</span>
                    {isHigh && (
                      <div className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-r ${isHigh ? 'from-rose-500 to-orange-400' : 'from-emerald-500 to-orange-500'}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                    />
                  </div>
                  <div className="w-12 shrink-0 text-right text-white/60 text-sm">
                    {zone.density}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5) Zone cards grid */}
      <div>
        <div className="mb-6">
          <h2 className="font-admin-serif text-xl font-bold text-white">All Zones</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full mt-2" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {zoneData.map((zone, i) => {
            const isHighDensity = zone.density > 500;
            return (
              <div key={zone.id} className="p-[1px] rounded-[17px] bg-gradient-to-br from-emerald-500/30 to-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)] group cursor-default">
                <div className="relative rounded-2xl p-5 bg-[#0f1117]/80 backdrop-blur border border-white/[0.03] h-full flex flex-col transition-colors group-hover:bg-[#0f1117]/60 group-hover:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-admin-serif text-lg font-semibold text-white/95">{zone.name}</h3>
                    {isHighDensity && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wide">
                        <AlertTriangle className="w-3 h-3" />
                        <span>High Risk</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Population</div>
                      <div className="font-admin-serif font-semibold text-white">{zone.population.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Density</div>
                      <div className="font-admin-serif font-semibold text-white">{zone.density}<span className="text-xs text-white/50 font-normal"> /km²</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Neutered</div>
                      <div className="font-admin-serif font-semibold text-white">{zone.neuteredPercentage}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/60">Neutered Coverage</span>
                      <span className="text-xs font-semibold text-white/80">{zone.neuteredPercentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${zone.neuteredPercentage < 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${zone.neuteredPercentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6) High Priority section */}
      <div>
        <div className="mb-6">
          <h2 className="font-admin-serif text-2xl font-bold text-white">High Priority Zones</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full mt-2 mb-2" />
          <p className="text-white/60">Zones with high density (&gt; 500) AND low neutered coverage (&lt; 70%).</p>
        </div>

        {highPriorityZones.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-white/80 font-medium">All high-risk zones are under control.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highPriorityZones.map((zone, i) => (
              <div key={zone.id} className="relative group cursor-default">
                <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative bg-gradient-to-br from-rose-500/[0.08] to-orange-500/[0.06] border border-rose-500/20 rounded-2xl p-5 h-full flex flex-col transition-all duration-300 group-hover:border-rose-500/40">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-admin-serif text-lg font-semibold text-white/95">{zone.name}</h3>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wide shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                      <AlertTriangle className="w-3 h-3" />
                      <span>High Priority</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-rose-300/60 mb-1">Population</div>
                      <div className="font-admin-serif font-semibold text-white">{zone.population.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-rose-300/60 mb-1">Density</div>
                      <div className="font-admin-serif font-semibold text-white">{zone.density}<span className="text-xs text-white/50 font-normal"> /km²</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-rose-300/60 mb-1">Neutered</div>
                      <div className="font-admin-serif font-semibold text-white">{zone.neuteredPercentage}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-rose-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-rose-200/70">Neutered Coverage</span>
                      <span className="text-xs font-semibold text-rose-300">{zone.neuteredPercentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-rose-500/10 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${zone.neuteredPercentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
