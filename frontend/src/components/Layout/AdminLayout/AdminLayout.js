import React, { useState, useEffect } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import './AdminLayout.css';

function AdminLayout({ children, onLogout }) {
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="admin-layout">
      {/* Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="grid-overlay"></div>

      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <AdminSidebar onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Main Content */}
      <main className="admin-main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}
    </div>
  );
}

export default AdminLayout;