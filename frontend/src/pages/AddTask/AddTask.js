import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createTask, getTaskById, updateTask } from "../../services/taskService";

function AddTask() {
  const { id } = useParams();
  const isEditMode = !!id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchTask = async () => {
        try {
          const task = await getTaskById(id);
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setDueDate(task.dueDate || "");
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };
      fetchTask();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const taskData = { title, description, status, dueDate };
    try {
      if (isEditMode) {
        await updateTask(id, taskData);
      } else {
        await createTask(taskData);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving task:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl relative z-10">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        <form onSubmit={handleSubmit} className="glass p-8 md:p-10 rounded-2xl shadow-xl w-full">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {isEditMode ? "Update the details of your task." : "Fill out the details below to add a new task to your dashboard."}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title</label>
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/70"
                placeholder="e.g. Redesign Landing Page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors h-32 resize-none bg-white/70"
                placeholder="Add necessary details, links, or instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/70 appearance-none pointer-events-auto"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right .7rem top 50%", backgroundSize: ".65rem auto" }}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/70"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                className="px-8 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 shadow-indigo-500/20 flex items-center justify-center min-w-[140px]"
              >
                {submitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : isEditMode ? "Update details" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;