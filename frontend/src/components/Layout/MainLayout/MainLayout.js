import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './MainLayout.css';

function MainLayout({ children, onLogout }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="main-layout">
      {/* Animated Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      <div className="bg-blob blob-4"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="grid-overlay"></div>
      
      {/* Gradient Orbs */}
      <div className="gradient-orb orb-top"></div>
      <div className="gradient-orb orb-bottom"></div>

      <Sidebar onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;