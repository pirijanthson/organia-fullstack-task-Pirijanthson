import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../../services/noteService';
import { getTasks } from '../../services/taskService';
import './SpecialNotes.css';

function SpecialNotes() {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, noteId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      const [notesData, tasksData] = await Promise.all([
        getNotes(userId || 1),
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

  const handleDelete = async () => {
    if (deleteModal.noteId) {
      try {
        await deleteNote(deleteModal.noteId);
        setDeleteModal({ show: false, noteId: null });
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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTask = selectedTask ? note.taskId === parseInt(selectedTask) : true;
    return matchesSearch && matchesTask;
  });

  return (
    <div className="special-notes-container">
      {/* Header Section */}
      <div className="notes-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-icon">📝</span>
            <span>Documentation</span>
          </div>
          <h1 className="page-title">
            Special <span className="gradient-text">Notes</span>
          </h1>
          <p className="page-description">
            Manage your task-related records and insights.
          </p>
        </div>
        <button
          onClick={() => navigate('/add-note')}
          className="compose-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Compose Note
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="notes-filters">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search notes by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className="filter-wrapper">
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="filter-select"
          >
            <option value="">All Tasks</option>
            <option value="general">General Notes</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Synchronizing notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Empty Archive</h3>
          <p>You haven't created any special notes yet. Start documenting your progress today.</p>
          <button onClick={() => navigate('/add-note')} className="empty-action-btn">
            Create your first note
          </button>
        </div>
      ) : (
        /* Notes Grid */
        <div className="notes-grid">
          {filteredNotes.map((note, index) => (
            <div key={note.id} className="note-card" style={{ animationDelay: `${index * 0.05}s` }}>
              {/* Card Background Decor */}
              <div className="card-accent"></div>
              
              {/* Card Header */}
              <div className="note-card-header">
                <div className="note-meta">
                  <span className="task-badge">
                    {getTaskTitle(note.taskId)}
                  </span>
                  <span className="date-badge">
                    <svg className="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="card-actions">
                  <button 
                    onClick={() => navigate(`/edit-note/${note.id}`, { state: { note } })}
                    className="action-btn edit-action"
                    title="Edit Note"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setDeleteModal({ show: true, noteId: note.id })}
                    className="action-btn delete-action"
                    title="Delete Note"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Note Title */}
              <h3 className="note-title">{note.heading}</h3>

              {/* Subheadings */}
              {note.subHeadings && note.subHeadings.length > 0 && (
                <div className="subheadings-list">
                  {note.subHeadings.slice(0, 3).map((sub, i) => (
                    <span key={i} className="subheading-tag">
                      {sub}
                    </span>
                  ))}
                  {note.subHeadings.length > 3 && (
                    <span className="subheading-more">+{note.subHeadings.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="note-description">
                <p>
                  {note.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Card Footer */}
              <div className="note-card-footer">
                <div className="footer-line"></div>
                <span className="footer-text">Last updated</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, noteId: null })}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon delete-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="modal-title">Delete Note?</h3>
            <p className="modal-message">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setDeleteModal({ show: false, noteId: null })}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="modal-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecialNotes;