import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';

function TaskListItem({ task, onDelete }) {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group border-b border-slate-100 dark:border-slate-800 last:border-0">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.title}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md mt-0.5">{task.description}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={task.status} />
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-semibold italic">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(`/edit-task/${task.id}`)}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
            title="Edit Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* <button
            onClick={() => onDelete(task.id)}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
            title="Delete Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button> */}
        </div>
      </td>
    </tr>
  );
}

export default TaskListItem;
