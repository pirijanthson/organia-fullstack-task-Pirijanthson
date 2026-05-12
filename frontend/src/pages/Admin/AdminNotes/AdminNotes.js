import React, { useState, useEffect, useCallback } from 'react';
import { getAdminNotes, deleteAdminNote, createAdminNote, updateAdminNote } from '../../../services/adminService';
import './AdminNotes.css';

function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, noteId: null });
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleDelete = async () => {
    if (deleteModal.noteId) {
      try {
        await deleteAdminNote(deleteModal.noteId);
        setDeleteModal({ show: false, noteId: null });
        fetchData();
      } catch (error) {
        console.error('Error deleting admin note:', error);
      }
    }
  };

  const filteredNotes = notes.filter(note =>
    note.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-notes-container">
      {/* Header Section */}
      <div className="notes-header">
        <div className="header-left">
          <div className="header-badge">
            <span>📋</span>
            Internal Ops
          </div>
          <h1 className="header-title">
            Admin <span className="gradient-text">Archive</span>
          </h1>
          <p className="header-subtitle">
            Internal reminders, planning details, and management observations.
          </p>
        </div>
        
        <div className="header-right">
          <div className="search-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => openModal()} className="create-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Accessing archives...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Secure Archive Empty</h3>
          <p>Document internal planning, reminders, and system observations here.</p>
          <button onClick={() => openModal()} className="empty-action-btn">
            Create First Note
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note, index) => (
            <div key={note.id} className="note-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="card-accent"></div>
              
              <div className="note-card-header">
                <div className="note-meta">
                  <span className="admin-badge">Administrative</span>
                  <span className="date-badge">
                    <svg className="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="card-actions">
                  <button onClick={() => openModal(note)} className="action-btn edit-action" title="Edit Note">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteModal({ show: true, noteId: note.id })} className="action-btn delete-action" title="Delete Note">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="note-title">{note.heading}</h3>

              {note.subHeadings && note.subHeadings.length > 0 && (
                <div className="subheadings-list">
                  {note.subHeadings.slice(0, 4).map((sub, i) => (
                    <span key={i} className="subheading-tag">{sub}</span>
                  ))}
                  {note.subHeadings.length > 4 && (
                    <span className="subheading-more">+{note.subHeadings.length - 4} more</span>
                  )}
                </div>
              )}

              <div className="note-description">
                <p>{note.description || 'No internal details recorded.'}</p>
              </div>

              <div className="note-card-footer">
                <div className="footer-line"></div>
                <span className="footer-text">Confidential</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="note-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentNote ? 'Update Internal Note' : 'Create Internal Note'}</h2>
              <button onClick={closeModal} className="modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Log Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="modal-input"
                  />
                </div>
                <div className="form-field">
                  <label>Heading <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    placeholder="Note Title"
                    className="modal-input"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Subheadings (Max 10)</label>
                <div className="subheadings-container">
                  {formData.subHeadings.map((sub, index) => (
                    <div key={index} className="subheading-input-group">
                      <input
                        type="text"
                        value={sub}
                        onChange={(e) => handleSubheadingChange(index, e.target.value)}
                        placeholder={`Subheading ${index + 1}`}
                        className="modal-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubheading(index)}
                        className="remove-sub-btn"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {formData.subHeadings.length < 10 && (
                  <button type="button" onClick={addSubheading} className="add-sub-btn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Subheading
                  </button>
                )}
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="Internal details..."
                  className="modal-textarea"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="modal-cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  {currentNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, noteId: null })}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">🗑️</div>
            <h3>Delete Note?</h3>
            <p>Are you sure you want to delete this administrative note? This action cannot be undone.</p>
            <div className="delete-actions">
              <button onClick={() => setDeleteModal({ show: false, noteId: null })} className="delete-cancel-btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="delete-confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotes;