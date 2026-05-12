import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

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
    <div className="flex min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-blob -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000 -z-10"></div>
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000 -z-10"></div>

      <Sidebar onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto z-10">
        <div className="max-w-7xl mx-auto animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
