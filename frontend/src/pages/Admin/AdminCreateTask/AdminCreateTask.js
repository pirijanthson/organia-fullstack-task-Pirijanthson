import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { assignTask, updateAdminTask } from '../../../services/adminService';
import './AdminCreateTask.css';

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
    userName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    if (!formData.userId) {
      newErrors.userId = 'Please select a user first';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editMode) {
        await updateAdminTask(id, formData);
      } else {
        await assignTask(formData);
      }
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Error processing task operation' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-task">
      <div className="create-task-container">
        {/* Header Section */}
        <div className="task-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          
          <div className="header-content">
            <h1 className="page-title">
              {editMode ? 'Update' : 'Create'} 
              <span className="gradient-text"> Task</span>
            </h1>
            <p className="page-subtitle">
              {editMode ? 'Modify mission objectives' : 'Configure mission objectives for field operations'}
            </p>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="success-toast">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{editMode ? 'Task updated successfully!' : 'Task created successfully!'}</span>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-card">
            {/* Error Alert */}
            {errors.submit && (
              <div className="error-alert">
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.submit}</span>
              </div>
            )}

            {/* User Info & Status Row */}
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Target Operator
                </label>
                <div className="user-badge">
                  <div className="user-dot"></div>
                  <span>{formData.userName || 'Not Selected'}</span>
                  {formData.userId && <span className="user-id">(ID: {formData.userId})</span>}
                </div>
                {errors.userId && <span className="field-error">{errors.userId}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Current Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="TODO">📋 To Do</option>
                  <option value="IN_PROGRESS">⚡ In Progress</option>
                  <option value="DONE">✅ Completed</option>
                </select>
              </div>
            </div>

            {/* Title & Due Date Row */}
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Task Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  required
                />
                {errors.title && <span className="field-error">{errors.title}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="form-field full-width">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Detailed instructions for the operator..."
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
              <div className="char-counter">
                {formData.description.length}/500 characters
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{editMode ? 'Update Task' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateTask;