import React from 'react';

function StatusBadge({ status }) {
  let colorClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  let displayStatus = status;

  if (status === "DONE" || status === "Completed") {
    colorClass = "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50";
    displayStatus = "Completed";
  } else if (status === "IN_PROGRESS" || status === "In Progress") {
    colorClass = "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50";
    displayStatus = "In Progress";
  } else if (status === "TODO" || status === "To Do") {
    colorClass = "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50";
    displayStatus = "To Do";
  }

  return (
    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 ${colorClass}`}>
      {displayStatus}
    </span>
  );
}

export default StatusBadge;
