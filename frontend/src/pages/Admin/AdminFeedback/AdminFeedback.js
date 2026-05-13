import React, { useState, useEffect, useMemo } from 'react';
import { getAllTasks } from '../../../services/adminService';
import './AdminFeedback.css';

const FEEDBACK_PER_PAGE = 6;

function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllTasks();
        // Filter only tasks that have feedback
        const withFeedback = data.filter(task => task.feedback && task.feedback.trim() !== '');
        setFeedbackList(withFeedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter(item => 
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.userName.toLowerCase().includes(search.toLowerCase()) ||
      item.feedback.toLowerCase().includes(search.toLowerCase()))
    );
  }, [feedbackList, search]);

  const totalPages = Math.ceil(filteredFeedback.length / FEEDBACK_PER_PAGE);
  const startIndex = (currentPage - 1) * FEEDBACK_PER_PAGE;
  const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + FEEDBACK_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getSentimentColor = (feedback) => {
    const text = feedback.toLowerCase();
    if (text.includes('great') || text.includes('excellent') || text.includes('good') || text.includes('amazing')) {
      return 'sentiment-positive';
    }
    if (text.includes('bad') || text.includes('poor') || text.includes('issue') || text.includes('problem')) {
      return 'sentiment-negative';
    }
    return 'sentiment-neutral';
  };

  const getSentimentIcon = (feedback) => {
    const text = feedback.toLowerCase();
    if (text.includes('great') || text.includes('excellent') || text.includes('good') || text.includes('amazing')) {
      return '😊';
    }
    if (text.includes('bad') || text.includes('poor') || text.includes('issue') || text.includes('problem')) {
      return '😞';
    }
    return '😐';
  };

  return (
    <div className="admin-feedback-container">
      {/* Header Section */}
      <div className="feedback-header">
        <div className="header-left">
          <div className="header-badge">
            <span>📝</span>
            Review Center
          </div>
          <h1 className="header-title">
            User <span className="gradient-text">Feedback</span>
          </h1>
          <p className="header-subtitle">
            Analyzing operator insights and task completion reports.
          </p>
        </div>
        
        <div className="header-right">
          <div className="search-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search feedback or operators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="feedback-stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div>
            <h3>{feedbackList.length}</h3>
            <p>Total Feedback</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👍</span>
          <div>
            <h3>{feedbackList.filter(f => getSentimentColor(f.feedback) === 'sentiment-positive').length}</h3>
            <p>Positive</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👎</span>
          <div>
            <h3>{feedbackList.filter(f => getSentimentColor(f.feedback) === 'sentiment-negative').length}</h3>
            <p>Negative</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">😐</span>
          <div>
            <h3>{feedbackList.filter(f => getSentimentColor(f.feedback) === 'sentiment-neutral').length}</h3>
            <p>Neutral</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Aggregating feedback data...</p>
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No Feedback Yet</h3>
          <p>Once users complete tasks and provide feedback, they will appear here for your review.</p>
        </div>
      ) : (
        <>
          {/* Feedback Grid */}
          <div className="feedback-grid">
            {paginatedFeedback.map((item, index) => (
              <div key={item.id} className="feedback-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="card-decor"></div>
                
                {/* Quote Icon */}
                <div className="quote-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3C14.017 1.89543 14.9124 1 16.017 1H19.017C21.7784 1 24.017 3.23858 24.017 6V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0 21L0 18C0 16.8954 0.89543 16 2 16H5C5.55228 16 6 15.5523 6 15V9C6 8.44772 5.55228 8 5 8H2C0.895431 8 0 7.10457 0 6V3L0 3C0 1.89543 0.895431 1 2 1H5C7.76142 1 10 3.23858 10 6V15C10 18.3137 7.31371 21 4 21H0Z" />
                  </svg>
                </div>

                {/* User Info */}
                <div className="user-info-section">
                  <div className="user-avatar">
                    <span>{item.userName?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="user-details">
                    <h4 className="user-name">{item.userName}</h4>
                    <p className="task-title">{item.title}</p>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="feedback-content">
                  <div className={`feedback-text ${getSentimentColor(item.feedback)}`}>
                    <span className="sentiment-icon">{getSentimentIcon(item.feedback)}</span>
                    <p>"{item.feedback}"</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="feedback-footer">
                  <div className="task-id">
                    <span className="id-label">Task ID</span>
                    <span className="id-value">#{item.id}</span>
                  </div>
                  <div className="verified-badge">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                «
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                ‹
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="page-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                ›
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminFeedback;