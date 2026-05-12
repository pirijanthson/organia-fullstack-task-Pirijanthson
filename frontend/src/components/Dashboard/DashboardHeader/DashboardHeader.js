import React from 'react';
import './DashboardHeader.css';

function DashboardHeader({ username, search, setSearch, statusFilter, setStatusFilter }) {
  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get current date formatted
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <header className="dashboard-header">
      {/* Top Bar with Date */}
      <div className="top-bar">
        <div className="date-display">
          <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getCurrentDate()}</span>
        </div>
        <div className="theme-toggle">
          <button className="theme-toggle-btn" id="themeToggle">
            🌙
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="greeting-container">
            <span className="greeting-badge">
              {getGreeting()}!
            </span>
            <span className="wave-emoji">👋</span>
          </div>
          
          <h1 className="welcome-title">
            <span className="user-greeting">Welcome back,</span>
            <span className="gradient-text"> {username || "User"}</span>
          </h1>
          
          <p className="welcome-subtitle">
            Here's what's happening with your tasks today.
          </p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="search-filter-section">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>
              <svg className="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="filter-wrapper">
          <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="To Do">📋 To Do</option>
            <option value="In Progress">⚡ In Progress</option>
            <option value="Completed">✅ Completed</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(search || statusFilter) && (
        <div className="active-filters">
          <span className="filter-label">Active filters:</span>
          {search && (
            <span className="filter-badge">
              <svg className="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search: "{search}"
              <button onClick={() => setSearch('')} className="badge-remove">×</button>
            </span>
          )}
          {statusFilter && (
            <span className="filter-badge">
              <svg className="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('')} className="badge-remove">×</button>
            </span>
          )}
          <button 
            className="clear-all-btn"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;