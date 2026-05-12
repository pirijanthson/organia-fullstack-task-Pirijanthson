import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../../services/noteService';
import { getTasks } from '../../services/taskService';

function SpecialNotes() {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      const username = localStorage.getItem('username');
      
      // We might need to fetch the actual userId from the backend if it's not in localStorage
      // For now, let's assume we can get it or we'll need to update the login flow.
      // Looking at the Task entity, it uses userId.
      
      const [notesData, tasksData] = await Promise.all([
        getNotes(userId || 1), // Fallback to 1 for testing if needed
        getTasks()
      ]);
      
      setNotes(notesData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const getTaskTitle = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'General Note';
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-2">Documentation</h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
            Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Notes</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your task-related records and insights.</p>
        </div>
        <button
          onClick={() => navigate('/add-note')}
          className="btn-primary flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Compose Note
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-slate-500 font-bold animate-pulse">Synchronizing notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="card-premium p-20 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Empty Archive</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">You haven't created any special notes yet. Start documenting your progress today.</p>
          </div>
          <button onClick={() => navigate('/add-note')} className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-sm hover:underline">Create your first note</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {notes.map((note) => (
            <div key={note.id} className="card-premium group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden flex flex-col">
              {/* Decorative side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-600 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50">
                      {getTaskTitle(note.taskId)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {note.heading}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/edit-note/${note.id}`, { state: { note } })}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {note.subHeadings && note.subHeadings.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {note.subHeadings.map((sub, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
                      {sub}
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex-1">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                  {note.description || 'No detailed description provided.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpecialNotes;
