import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMetrics, getAllTasks, deleteAdminTask } from '../../../services/adminService';
import TimeCard from '../../../components/Dashboard/TimeCard/TimeCard';
import MetricCard from '../../../components/Dashboard/MetricCard/MetricCard';
import StatusBadge from '../../../components/common/StatusBadge';
import './AdminDashboard.css';

const TASKS_PER_PAGE = 6;

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null });
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [metricsData, tasksData] = await Promise.all([
        getAdminMetrics(),
        getAllTasks()
      ]);
      setMetrics(metricsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (deleteModal.taskId) {
      try {
        await deleteAdminTask(deleteModal.taskId);
        setDeleteModal({ show: false, taskId: null });
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = 
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.userName.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-badge">
            <span>📊</span>
            Central Command
          </div>
          <h1 className="header-title">
            System <span className="gradient-text">Analytics</span>
          </h1>
          <p className="header-subtitle">
            Monitoring global system pulse and user operations.
          </p>
        </div>
        <div className="header-right">
          <TimeCard />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard 
          title="Total Users" 
          value={metrics?.totalUsers || 0} 
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
          color="from-blue-600 to-indigo-600" 
        />
        <MetricCard 
          title="Admins" 
          value={metrics?.totalAdmins || 0} 
          icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          color="from-red-600 to-rose-600" 
        />
        <MetricCard 
          title="Total Tasks" 
          value={metrics?.totalTasks || 0} 
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          color="from-indigo-600 to-purple-600" 
        />
        <MetricCard 
          title="Completed" 
          value={metrics?.completedTasks || 0} 
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          color="from-emerald-600 to-teal-600" 
        />
        <MetricCard 
          title="In Progress" 
          value={metrics?.inProgressTasks || 0} 
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          color="from-amber-600 to-orange-600" 
        />
        <MetricCard 
          title="Pending" 
          value={metrics?.pendingTasks || 0} 
          icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          color="from-slate-600 to-zinc-600" 
        />
      </div>

      {/* Tasks Section */}
      <div className="tasks-section">
        <div className="tasks-header">
          <div className="tasks-title">
            <h2>Global Task Monitor</h2>
            <p>Cross-User Task Intelligence</p>
          </div>
          
          <div className="tasks-filters">
            <div className="search-wrapper">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks or users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="">All Statuses</option>
              <option value="TODO">📋 To Do</option>
              <option value="IN_PROGRESS">⚡ In Progress</option>
              <option value="DONE">✅ Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Scanning database...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Tasks Found</h3>
            <p>No tasks matching your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>User Info</th>
                    <th>Task Details</th>
                    <th>Current Status</th>
                    <th>Timeline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task) => (
                    <tr key={task.id} className="task-row">
                      <td className="user-info-cell">
                        <div className="user-avatar">
                          <span>ID {task.userId}</span>
                        </div>
                        <div className="user-details">
                          <p className="user-name">{task.userName}</p>
                          <span className="user-role">System User</span>
                        </div>
                      </td>
                      
                      <td className="task-details-cell">
                        <p className="task-title">{task.title}</p>
                        <p className="task-description">{task.description}</p>
                      </td>
                      
                      <td className="status-cell">
                        <StatusBadge status={task.status} />
                      </td>
                      
                      <td className="date-cell">
                        <span className="date-text">
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      
                      <td className="actions-cell">
                        <button 
                          onClick={() => navigate(`/admin/edit-task/${task.id}`, { state: { task } })}
                          className="action-btn edit-btn"
                          title="Edit Task"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ show: true, taskId: task.id })}
                          className="action-btn delete-btn"
                          title="Delete Task"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {startIndex + 1} - {Math.min(startIndex + TASKS_PER_PAGE, filteredTasks.length)} of {filteredTasks.length} records
                </div>
                <div className="pagination-controls">
                  <button 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    «
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    ‹
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="page-ellipsis">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    ›
                  </button>
                  <button 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, taskId: null })}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3>Delete Task?</h3>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteModal({ show: false, taskId: null })} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;