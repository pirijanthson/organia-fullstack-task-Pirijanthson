import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createTask, getTaskById, updateTask } from "../../services/taskService";

function AddTask() {
  const { id } = useParams();
  const isEditMode = !!id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [originalStatus, setOriginalStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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
          setOriginalStatus(task.status);
          setDueDate(task.dueDate || "");
          setFeedback(task.feedback || "");
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };
      fetchTask();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If status changed to DONE, show feedback modal
    if (isEditMode && status === "DONE" && originalStatus !== "DONE") {
      setShowFeedbackModal(true);
      return;
    }
    
    saveTask();
  };

  const saveTask = async (finalFeedback = feedback) => {
    setSubmitting(true);
    const taskData = { 
      title, 
      description, 
      status, 
      dueDate,
      feedback: finalFeedback 
    };
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

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setShowFeedbackModal(false);
    saveTask();
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 md:py-8 space-y-6 animate-fadeIn">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
        <div className="p-2 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Back to Dashboard
      </Link>

      <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <div className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {isEditMode ? "Edit Task" : "Create Task"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
            {isEditMode ? "Modify your task details below." : "Organize your workflow by adding a new task."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Task Title</label>
                 <input
                   className="w-full px-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 dark:text-white font-semibold text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed"
                   placeholder="What needs to be done?"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   required
                   disabled={isEditMode}
                 />
               </div>
 
               <div className="space-y-2">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Description</label>
                 <textarea
                   className="w-full px-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none text-slate-700 dark:text-slate-300 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed"
                   placeholder="Add more context to this task..."
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   disabled={isEditMode}
                 />
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Current Status</label>
                   <div className="relative">
                     <select
                       className="w-full px-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-all text-slate-700 dark:text-slate-300 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                       value={status}
                       onChange={(e) => setStatus(e.target.value)}
                       disabled={isEditMode && originalStatus === "DONE"}
                     >
                       {/* Rules implementation */}
                       {(!isEditMode || originalStatus === "TODO") && <option value="TODO">🎯 To Do</option>}
                       {(!isEditMode || originalStatus === "TODO" || originalStatus === "IN_PROGRESS") && <option value="IN_PROGRESS">⚡ In Progress</option>}
                       {(!isEditMode || originalStatus === "IN_PROGRESS" || originalStatus === "DONE") && <option value="DONE">✅ Completed</option>}
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                     </div>
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Target Date</label>
                   <input
                     type="date"
                     className="w-full px-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 dark:text-slate-300 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                     value={dueDate}
                     onChange={(e) => setDueDate(e.target.value)}
                     disabled={isEditMode}
                   />
                 </div>
               </div>
            </div>

          <div className="pt-8 flex flex-col md:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              className="btn-primary min-w-[200px] text-lg py-4"
            >
              {submitting ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : isEditMode ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-scaleIn">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="p-8 md:p-10 relative z-10">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Mission Accomplished!</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Please share your feedback on this task before we archive it as completed.</p>
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Your Feedback</label>
                  <textarea
                    required
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32 resize-none text-slate-700 dark:text-slate-300 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="How did it go? Any challenges or wins?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                  >
                    Not Now
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTask;