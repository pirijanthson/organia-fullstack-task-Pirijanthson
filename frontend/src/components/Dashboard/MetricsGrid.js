import React from 'react';
import MetricCard from './MetricCard';

function MetricsGrid({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "DONE" || task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "TODO" || task.status === "To Do").length;
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS" || task.status === "In Progress").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <MetricCard 
        title="Total Tasks" 
        value={totalTasks} 
        type="blue" 
        icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
      />
      <MetricCard 
        title="Completed" 
        value={completedTasks} 
        type="green" 
        icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
      <MetricCard 
        title="In Progress" 
        value={inProgressTasks} 
        type="indigo" 
        icon="M13 10V3L4 14h7v7l9-11h-7z" 
      />
      <MetricCard 
        title="Pending" 
        value={pendingTasks} 
        type="yellow" 
        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </div>
  );
}

export default MetricsGrid;
