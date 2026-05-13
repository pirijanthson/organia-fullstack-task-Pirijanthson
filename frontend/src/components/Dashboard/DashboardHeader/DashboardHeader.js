import React, { useState, useEffect } from 'react';
import './DashboardHeader.css';

function DashboardHeader({ username, search, setSearch, statusFilter, setStatusFilter }) {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // Check for saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

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
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
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

      {/* Search & Filter Section - Filter icon removed */}
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
            aria-label="Search tasks"
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">
              <svg className="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="filter-wrapper">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
            aria-label="Filter by status"
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
              Search: "{search.length > 20 ? search.substring(0, 20) + '...' : search}"
              <button onClick={() => setSearch('')} className="badge-remove" aria-label="Remove search filter">×</button>
            </span>
          )}
          {statusFilter && (
            <span className="filter-badge">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('')} className="badge-remove" aria-label="Remove status filter">×</button>
            </span>
          )}
          <button 
            className="clear-all-btn"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
            }}
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;