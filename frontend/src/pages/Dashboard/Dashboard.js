import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../services/taskService";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
         handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "To Do").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 glass p-6 rounded-2xl text-gradient">
          <div>
            <h1 className="text-2xl font-medium text-slate-500 mt-1">Welcome, {username || "User"}</h1>
            <h1 className="text-4xl font-extrabold text-slate-800">Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
             <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none w-full md:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={() => navigate("/AddTask")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard title="Total Tasks" value={totalTasks} type="blue" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <MetricCard title="Completed" value={completedTasks} type="green" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <MetricCard title="In Progress" value={inProgressTasks} type="indigo" icon="M13 10V3L4 14h7v7l9-11h-7z" />
          <MetricCard title="Pending" value={pendingTasks} type="yellow" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </div>

        {/* Tasks List Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Tasks</h2>
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="glass flex flex-col items-center justify-center p-16 rounded-2xl text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium text-slate-700">No tasks found</p>
              <p className="text-sm">Time to create a new one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div key={task.id} className="glass p-6 rounded-2xl hover-card flex flex-col h-full bg-white/80">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-slate-800 line-clamp-2">{task.title}</h3>
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">{task.description}</p>
                  
                  {task.dueDate && (
                     <p className="text-xs text-slate-400 mb-4 font-medium flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                       {new Date(task.dueDate).toLocaleDateString()}
                     </p>
                  )}

                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/edit-task/${task.id}`)}
                      className="flex-1 bg-slate-100 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 font-semibold py-2 px-4 rounded-xl transition-colors text-sm text-center"
                    >
                      Edit 
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex-1 bg-slate-100 hover:bg-red-50 text-red-500 hover:text-red-600 font-semibold py-2 px-4 rounded-xl transition-colors text-sm text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, type, icon }) {
  const colorMap = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-400 to-green-600",
    indigo: "from-indigo-400 to-purple-600",
    yellow: "from-amber-400 to-orange-500",
  };
  
  return (
    <div className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br ${colorMap[type]} relative overflow-hidden group`}>
      <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <div className="relative z-10">
        <h2 className="text-white/80 font-medium text-sm md:text-base">{title}</h2>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  if (status === "Completed") colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "In Progress") colorClass = "bg-indigo-100 text-indigo-700 border-indigo-200";
  if (status === "To Do") colorClass = "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {status}
    </span>
  );
}

export default Dashboard;