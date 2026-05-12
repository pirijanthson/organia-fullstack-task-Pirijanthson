import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createTask, getTaskById, updateTask } from "../../services/taskService";
import "./AddTask.css";

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
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (title.length < 3) newErrors.title = "Title must be at least 3 characters";
    if (title.length > 100) newErrors.title = "Title must be less than 100 characters";
    if (!description.trim()) newErrors.description = "Description is required";
    if (description.length < 10) newErrors.description = "Description must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
    if (!feedback.trim()) {
      setErrors({ feedback: "Please provide feedback before completing" });
      return;
    }
    setShowFeedbackModal(false);
    saveTask();
  };

  return (
    <div className="add-task-container">
      <div className="add-task-content">
        {/* Back Button */}
        <Link to="/dashboard" className="back-button">
          <div className="back-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="task-form-card">
          {/* Animated Background */}
          <div className="card-bg-decoration bg-1"></div>
          <div className="card-bg-decoration bg-2"></div>
          
          <div className="card-header">
            <h2 className="card-title">
              {isEditMode ? "Edit Task" : "Create Task"}
            </h2>
            <p className="card-subtitle">
              {isEditMode 
                ? "Modify your task details below." 
                : "Organize your workflow by adding a new task."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            {/* Title Field */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-text">Task Title</span>
                <span className="required-star">*</span>
              </label>
              <input
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isEditMode}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Description Field */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-text">Description</span>
                <span className="required-star">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Add more context to this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isEditMode}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            {/* Status & Date Grid */}
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <span className="label-text">Current Status</span>
                </label>
                <div className="select-wrapper">
                  <select
                    className={`form-select ${isEditMode && originalStatus === "DONE" ? 'disabled' : ''}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isEditMode && originalStatus === "DONE"}
                  >
                    {(!isEditMode || originalStatus === "TODO") && <option value="TODO">🎯 To Do</option>}
                    {(!isEditMode || originalStatus === "TODO" || originalStatus === "IN_PROGRESS") && <option value="IN_PROGRESS">⚡ In Progress</option>}
                    {(!isEditMode || originalStatus === "IN_PROGRESS" || originalStatus === "DONE") && <option value="DONE">✅ Completed</option>}
                  </select>
                  <div className="select-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <span className="label-text">Target Date</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isEditMode}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="cancel-button"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : isEditMode ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <div className="modal-decoration"></div>
            
            <div className="modal-content">
              <div className="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="modal-header">
                <h3 className="modal-title">Mission Accomplished!</h3>
                <p className="modal-subtitle">
                  Please share your feedback on this task before we archive it as completed.
                </p>
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="modal-form">
                <div className="form-field">
                  <label className="form-label">Your Feedback</label>
                  <textarea
                    required
                    className={`modal-textarea ${errors.feedback ? 'error' : ''}`}
                    placeholder="How did it go? Any challenges or wins?"
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                      if (errors.feedback) setErrors({});
                    }}
                  />
                  {errors.feedback && <span className="error-message">{errors.feedback}</span>}
                </div>
                
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="modal-cancel-btn"
                  >
                    Not Now
                  </button>
                  <button
                    type="submit"
                    className="modal-submit-btn"
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