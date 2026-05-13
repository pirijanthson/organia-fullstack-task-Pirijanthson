import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, getTasksByUser, deleteTask } from "../../services/taskService";
import DashboardHeader from "../../components/Dashboard/DashboardHeader/DashboardHeader";
import MetricsGrid from "../../components/Dashboard/MetricsGrid/MetricsGrid";
import TaskListItem from "../../components/Dashboard/TaskListItem/TaskListItem";
import TimeCard from "../../components/Dashboard/TimeCard/TimeCard";
import "./Dashboard.css";

const TASKS_PER_PAGE = 6;

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const data = userId ? await getTasksByUser(userId) : await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
         localStorage.removeItem("token");
         localStorage.removeItem("username");
         navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, [fetchTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const title = task.title || "";
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      
      let taskStatus = task.status || "";
      if (taskStatus === "TODO") taskStatus = "To Do";
      if (taskStatus === "IN_PROGRESS") taskStatus = "In Progress";
      if (taskStatus === "DONE") taskStatus = "Completed";

      const matchesStatus = statusFilter ? taskStatus === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header-wrapper">
          <div className="dashboard-header-left">
            <DashboardHeader 
              username={username}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onLogout={handleLogout}
            />
          </div>
          <div className="dashboard-header-right">
            <TimeCard />
          </div>
        </div>

        {/* Metrics Grid */}
        <MetricsGrid tasks={tasks} />

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="tasks-header">
            <div className="tasks-title">
              <h2>Active Tasks</h2>
              <p>Manage and track your project progress</p>
            </div>
            <div className="tasks-count">
              {filteredTasks.length} Tasks
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>All caught up!</h3>
              <p>No tasks found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="tasks-table-wrapper">
                <table className="tasks-table">
                  <thead>
                    <tr>
                      <th>Task Information</th>
                      <th>Priority Status</th>
                      <th>Timeline</th>
                      <th>Management</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTasks.map((task) => (
                      <TaskListItem 
                        key={task.id} 
                        task={task} 
                        onDelete={handleDelete} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredTasks.length > 0 && (
                <div className="pagination-wrapper">
                  <div className="pagination-info">
                    <div className="info-icon">📊</div>
                    <p>
                      Showing <span>{startIndex + 1}</span> - <span>{Math.min(startIndex + TASKS_PER_PAGE, filteredTasks.length)}</span> of <span>{filteredTasks.length}</span> Records
                    </p>
                  </div>
                  
                  <div className="pagination-controls">
                    <button 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      « First
                    </button>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      ‹ Prev
                    </button>

                    <div className="page-numbers">
                      {[...Array(totalPages)].slice(0, 5).map((_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 3 + i;
                          if (pageNum > totalPages) return null;
                        }
                        if (pageNum <= totalPages) {
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
                        return null;
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && <span>...</span>}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="page-number"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      Next ›
                    </button>

                    <button 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      Last »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;