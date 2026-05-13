import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createNote, updateNote } from '../../services/noteService';
import { getTasksByUser } from '../../services/taskService';
import './AddNote.css';

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const data = userId ? await getTasksByUser(userId) : [];
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.heading.trim()) {
      newErrors.heading = 'Heading is required';
    } else if (formData.heading.length < 3) {
      newErrors.heading = 'Heading must be at least 3 characters';
    } else if (formData.heading.length > 100) {
      newErrors.heading = 'Heading must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
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
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const userId = localStorage.getItem('userId') || 1;
      
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
    <div className="add-note-container">
      <div className="add-note-wrapper">
        {/* Header Section */}
        <div className="note-header">
          <button onClick={() => navigate('/notes')} className="back-nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Notes</span>
          </button>
          
          <div className="header-content">
            <h1 className="page-title">
              {editMode ? 'Refine' : 'Compose'} 
              <span className="gradient-text"> Note</span>
            </h1>
            <p className="page-subtitle">
              Capture your insights and project milestones.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-card">
            {/* Error Alert */}
            {error && (
              <div className="error-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Two Column Grid */}
            <div className="form-grid">
              {/* Heading Field */}
              <div className="form-field">
                <label className="form-label">
                  Note Heading <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title"
                  className={`form-input ${errors.heading ? 'error' : ''}`}
                  required
                />
                {errors.heading && <span className="field-error">{errors.heading}</span>}
              </div>

              {/* Date Field */}
              <div className="form-field">
                <label className="form-label">Log Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Related Task Dropdown */}
            <div className="form-field">
              <label className="form-label">Related Task</label>
              <div className="select-wrapper">
                <select
                  name="taskId"
                  value={formData.taskId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">General (No specific task)</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
                <div className="select-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Subheadings Section - COMPACT */}
            <div className="subheadings-section">
              <div className="section-header">
                <label className="form-label">Subheadings</label>
                <span className="counter-badge">{formData.subHeadings.length}/10</span>
              </div>
              
              <div className="subheadings-list">
                {formData.subHeadings.map((sub, index) => (
                  <div key={index} className="subheading-item">
                    <input
                      type="text"
                      value={sub}
                      onChange={(e) => handleSubheadingChange(index, e.target.value)}
                      placeholder={`Subheading ${index + 1}`}
                      className="subheading-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubheading(index)}
                      className="remove-subheading-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                  className="add-subheading-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Subheading
                </button>
              )}
            </div>

            {/* Description Field - OPTIMIZED SIZE */}
            <div className="form-field description-field">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Add detailed information, observations, or comments..."
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
              <div className="char-counter">
                {formData.description.length}/500 characters
              </div>
            </div>
          </div>

          {/* Form Actions - COMPACT BUTTONS */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{editMode ? 'Update' : 'Save'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNote;