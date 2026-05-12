import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../../services/taskService";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import MetricsGrid from "../../components/Dashboard/MetricsGrid";
import TaskListItem from "../../components/Dashboard/TaskListItem";
import TimeCard from "../../components/Dashboard/TimeCard";

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
      const data = await getTasks();
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

  // Reset pagination when search or filters change
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex-1 w-full">
          <DashboardHeader 
            username={username}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onLogout={handleLogout}
          />
        </div>
        <div className="animate-fadeIn mt-2 lg:mt-0">
          <TimeCard />
        </div>
      </div>

      <MetricsGrid tasks={tasks} />

      <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="card-premium overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Active Tasks</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage and track your project progress.</p>
            </div>
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm border border-indigo-100 dark:border-indigo-800/50">
              {filteredTasks.length} Tasks Total
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-indigo-600/20 border-t-indigo-600"></div>
              <p className="text-slate-500 font-bold animate-pulse">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">All caught up!</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">No tasks found matching your filters. Try adjusting your search or add a new task.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-8">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.2em]">
                      <th className="px-10 py-5 font-bold">Task Information</th>
                      <th className="px-8 py-5 font-bold">Priority Status</th>
                      <th className="px-8 py-5 font-bold">Timeline</th>
                      <th className="px-10 py-5 font-bold text-right">Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
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

              {/* Enhanced Pagination Controls */}
              {filteredTasks.length > 0 && (
                <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-8 px-6 py-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/10 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      Showing <span className="text-slate-800 dark:text-white">{startIndex + 1}</span> - <span className="text-slate-800 dark:text-white">{Math.min(startIndex + TASKS_PER_PAGE, filteredTasks.length)}</span> of <span className="text-indigo-600 dark:text-indigo-400">{filteredTasks.length}</span> Records
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {/* First Page */}
                    <button 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">First</span>
                    </button>

                    {/* Previous */}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl font-black text-xs transition-all duration-300 ${
                            currentPage === i + 1
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-110 z-10"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:border-indigo-500 shadow-sm"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Next */}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Last Page */}
                    <button 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                    >
                      <span className="hidden sm:inline">Last</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;