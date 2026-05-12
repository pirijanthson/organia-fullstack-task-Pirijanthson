import React from 'react';

function MetricCard({ title, value, color, icon }) {
  return (
    <div className={`p-8 rounded-[2rem] text-white shadow-2xl bg-gradient-to-br ${color} relative overflow-hidden group border border-white/10 dark:border-white/5`}>
      {/* Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="absolute right-4 top-4 opacity-10 transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={icon} />
        </svg>
      </div>
      
      <div className="relative z-10 space-y-1">
        <h2 className="text-white/70 font-black text-xs uppercase tracking-[0.2em]">{title}</h2>
        <p className="text-5xl font-black tracking-tighter">{value}</p>
        <div className="pt-4 flex items-center gap-2 text-white/50 text-xs font-bold">
          <span className="w-8 h-[2px] bg-white/20"></span>
          <span>Live Metrics</span>
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
