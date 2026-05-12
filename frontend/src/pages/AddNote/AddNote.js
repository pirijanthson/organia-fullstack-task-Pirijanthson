import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createNote, updateNote } from '../../services/noteService';
import { getTasks } from '../../services/taskService';

function AddNote() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editMode = !!id;
  const existingNote = location.state?.note;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heading: '',
    subHeadings: [''],
    description: '',
    taskId: ''
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();

    if (editMode && existingNote) {
      setFormData({
        date: existingNote.date,
        heading: existingNote.heading,
        subHeadings: existingNote.subHeadings.length > 0 ? existingNote.subHeadings : [''],
        description: existingNote.description,
        taskId: existingNote.taskId
      });
    }
  }, [editMode, existingNote]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubheadingChange = (index, value) => {
    const newSubheadings = [...formData.subHeadings];
    newSubheadings[index] = value;
    setFormData({ ...formData, subHeadings: newSubheadings });
  };

  const addSubheading = () => {
    if (formData.subHeadings.length < 10) {
      setFormData({ ...formData, subHeadings: [...formData.subHeadings, ''] });
    }
  };

  const removeSubheading = (index) => {
    const newSubheadings = formData.subHeadings.filter((_, i) => i !== index);
    setFormData({ ...formData, subHeadings: newSubheadings.length > 0 ? newSubheadings : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.heading) {
      setError('Heading is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const userId = localStorage.getItem('userId') || 1;
      
      // Filter out empty subheadings
      const filteredSubheadings = formData.subHeadings.filter(s => s.trim() !== '');
      
      const payload = {
        ...formData,
        userId: parseInt(userId),
        subHeadings: filteredSubheadings
      };

      if (editMode) {
        await updateNote(id, payload);
      } else {
        await createNote(payload);
      }
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving note. Maximum 10 subheadings allowed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-10">
        <button onClick={() => navigate('/notes')} className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-black uppercase tracking-widest text-xs">Back to Notes</span>
        </button>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
          {editMode ? 'Refine' : 'Compose'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Note</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Capture your insights and project milestones.</p>
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
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Note Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                placeholder="Enter a descriptive title"
                className="input-premium w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Log Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-premium w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Related Task</label>
            <select
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              className="input-premium w-full"
            >
              <option value="">General (No specific task)</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Subheadings (Max 10)</label>
              <span className="text-[10px] font-bold text-indigo-600">{formData.subHeadings.length}/10</span>
            </div>
            <div className="space-y-3">
              {formData.subHeadings.map((sub, index) => (
                <div key={index} className="flex gap-3 animate-slideIn">
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => handleSubheadingChange(index, e.target.value)}
                    placeholder={`Subheading ${index + 1}`}
                    className="input-premium flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubheading(index)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {formData.subHeadings.length < 10 && (
                <button
                  type="button"
                  onClick={addSubheading}
                  className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Subheading
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Detailed information, observations, or comments..."
              className="input-premium w-full resize-none py-4"
            ></textarea>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-5 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-lg tracking-tight font-black">{editMode ? 'Update Archive' : 'Save Archive'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/notes')}
            className="px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNote;
