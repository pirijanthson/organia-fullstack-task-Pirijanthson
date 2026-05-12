import React from 'react';
import StatusBadge from '../../common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import './TaskListItem.css';

function TaskListItem({ task, onDelete }) {
  const navigate = useNavigate();

  return (
    <tr className="task-list-item">
      {/* Task Information Column */}
      <td className="task-cell task-info-cell">
        <div className="task-info">
          <span className="task-title">{task.title}</span>
          <span className="task-description">{task.description}</span>
        </div>
      </td>

      {/* Priority Status Column */}
      <td className="task-cell task-status-cell">
        <StatusBadge status={task.status} />
      </td>

      {/* Timeline Column */}
      <td className="task-cell task-date-cell">
        <div className="task-date">
          <svg className="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="date-text">
            {task.dueDate 
              ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
              : 'No due date'}
          </span>
        </div>
      </td>

      {/* Management Column - Actions */}
      <td className="task-cell task-actions-cell">
        <div className="task-actions">
          <button
            onClick={() => navigate(`/edit-task/${task.id}`)}
            className="action-btn edit-btn"
            title="Edit Task"
          >
            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TaskListItem;