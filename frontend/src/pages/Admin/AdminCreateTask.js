import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { assignTask, updateAdminTask } from '../../services/adminService';

function AdminCreateTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editMode = !!id;
  const stateTask = location.state?.task;
  const initialUser = React.useMemo(() => 
    location.state?.userId ? { id: location.state.userId, name: location.state.userName } : null
  , [location.state]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: new Date().toISOString().split('T')[0],
    userId: '',
    userName: '' // Visual only
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editMode && stateTask) {
      setFormData({
        title: stateTask.title,
        description: stateTask.description,
        status: stateTask.status,
        dueDate: stateTask.dueDate,
        userId: stateTask.userId,
        userName: stateTask.userName
      });
    } else if (initialUser) {
      setFormData(prev => ({
        ...prev,
        userId: initialUser.id,
        userName: initialUser.name
      }));
    }
  }, [editMode, stateTask, initialUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      setError('Please select a user first through the User Details page.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (editMode) {
        await updateAdminTask(id, formData);
      } else {
        await assignTask(formData);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Error processing task operation. Please check all fields.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-10">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-black uppercase tracking-widest text-xs">Back</span>
        </button>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
          {editMode ? 'Update' : 'Deploy'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Task</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configuring mission objectives for field operations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card-premium space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Target Operator</label>
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-white font-black text-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                {formData.userName} (ID: {formData.userId})
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Current Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-premium w-full font-bold"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Core mission objective"
                className="input-premium w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Deadline Timeline</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input-premium w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Mission Briefing</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Detailed instructions for the operator..."
              className="input-premium w-full resize-none py-4"
            ></textarea>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-5 flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-indigo-500/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-lg tracking-tight font-black">{editMode ? 'Commit Changes' : 'Initialize Mission'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateTask;
