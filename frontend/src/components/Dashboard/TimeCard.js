import React, { useState, useEffect } from 'react';

function TimeCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 px-6 py-3 rounded-[1.5rem] shadow-xl group transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="flex flex-col items-end">
        <span className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400 leading-none font-mono">
          {formatTime(time)}
        </span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
          {formatDate(time)}
        </span>
      </div>
      
      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>
      
      <div className="flex flex-col items-center gap-1">
        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Live</span>
      </div>
    </div>
  );
}

export default TimeCard;
