import React, { useState, useEffect, useCallback } from 'react';
import { getAdminNotes, deleteAdminNote, createAdminNote, updateAdminNote } from '../../services/adminService';

function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heading: '',
    subHeadings: [''],
    description: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching admin notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (note = null) => {
    if (note) {
      setCurrentNote(note);
      setFormData({
        date: note.date,
        heading: note.heading,
        subHeadings: note.subHeadings.length > 0 ? note.subHeadings : [''],
        description: note.description
      });
    } else {
      setCurrentNote(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        heading: '',
        subHeadings: [''],
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentNote(null);
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
    try {
      const filteredSubheadings = formData.subHeadings.filter(s => s.trim() !== '');
      const payload = { ...formData, subHeadings: filteredSubheadings };

      if (currentNote) {
        await updateAdminNote(currentNote.id, payload);
      } else {
        await createAdminNote(payload);
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error saving admin note:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this administrative note?')) {
      try {
        await deleteAdminNote(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting admin note:', error);
      }
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-2">Internal Ops</h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Archive</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Internal reminders, planning details, and management observations.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Internal Note
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-slate-500 font-bold animate-pulse">Accessing archives...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="card-premium p-20 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Secure Archive Empty</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">Document internal planning, reminders, and system observations here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {notes.map((note) => (
            <div key={note.id} className="card-premium group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden flex flex-col">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-600 to-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-800/50">
                      Administrative
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {note.heading}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openModal(note)}
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
                  {note.description || 'No internal details recorded.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideIn">
            <div className="p-8 lg:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
                  {currentNote ? 'Update' : 'Compose'} <span className="text-indigo-600">Internal</span> Note
                </h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Log Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-premium w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Heading</label>
                    <input
                      type="text"
                      value={formData.heading}
                      onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                      placeholder="Note Title"
                      className="input-premium w-full"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Subheadings (Max 10)</label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {formData.subHeadings.map((sub, index) => (
                      <div key={index} className="flex gap-2">
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
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  {formData.subHeadings.length < 10 && (
                    <button
                      type="button"
                      onClick={addSubheading}
                      className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                      + Add Subheading
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Detailed Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    placeholder="Internal details..."
                    className="input-premium w-full resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1 py-4 font-black uppercase tracking-widest text-xs">
                    {currentNote ? 'Update Archive' : 'Save Archive'}
                  </button>
                  <button type="button" onClick={closeModal} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
                    Cancel
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

export default AdminNotes;
