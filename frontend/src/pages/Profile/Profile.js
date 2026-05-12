import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosConfig';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-[6px] border-indigo-600/10 border-t-indigo-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-indigo-600/20"></div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-slate-800 dark:text-white font-black tracking-widest uppercase text-xs animate-pulse">Syncing Identity</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card-premium text-center p-16 animate-fadeIn border-red-500/20 bg-red-500/[0.02] max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Connection Error</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">We encountered a problem while retrieving your digital identity.</p>
      </div>
    );
  }

  const identityFields = [
    { label: 'Username', value: user.username, icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />, color: 'indigo', copyable: true },
    { label: 'Email Address', value: user.email, icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, color: 'blue', copyable: true },
    { label: 'Phone', value: user.phone || 'Not Linked', icon: <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />, color: 'emerald' },
    { label: 'Account Rank', value: 'System Admin', icon: <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />, color: 'amber' },
    { label: 'Member Since', value: 'May 2026', icon: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />, color: 'purple' },
    { label: 'Digital ID', value: `U-${user.id || '01'}`, icon: <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a1 1 0 010 2H5v12a2 2 0 002 2h12a2 2 0 002-2v-1M7 7h10M7 11h10M7 15h10" />, color: 'rose', copyable: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16 px-4">
      {/* Dynamic Profile Header - More Compact */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-all duration-500 group">
        <div className="h-48 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative">
          <div className="absolute top-5 left-5 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-5 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:15px_15px]"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-8 -mt-16 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <div className="w-40 h-40 bg-white dark:bg-slate-950 p-2 rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 rounded-[2rem] flex items-center justify-center text-6xl font-black text-white shadow-inner relative overflow-hidden">
                <span className="relative z-10 drop-shadow-xl">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 border-[4px] border-white dark:border-slate-950 rounded-xl flex items-center justify-center shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left pb-2 space-y-2">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{user.username}</h1>
              <span className="px-4 py-1 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Verified Identity</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-base flex items-center justify-center md:justify-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area - Identity Dossier */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                Profile Details
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locked for Security</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {identityFields.map((field, idx) => (
                <div key={idx} className="group relative bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 p-5 rounded-2xl transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${field.color}-500/10 rounded-xl text-${field.color}-600 dark:text-${field.color}-400`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {field.icon}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{field.label}</p>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate">{field.value}</p>
                    </div>
                    {field.copyable && (
                      <button 
                        onClick={() => copyToClipboard(field.value, field.label)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative"
                        title="Copy to clipboard"
                      >
                        {copiedField === field.label ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                        {copiedField === field.label && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">Copied!</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Area - Security & Logs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 bg-indigo-500/20 rounded-2xl border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase">Security Vault</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">2FA Protection</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">Identity Guard</span>
                <span className="text-[10px] font-black text-indigo-400 uppercase">Monitoring</span>
              </div>

              <div className="pt-4 border-t border-white/5 text-center">
                <p className="text-[9px] text-indigo-300 font-bold italic tracking-wider">AES-256 ENCRYPTION ACTIVE</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6">Recent Activity</h3>
            <div className="space-y-5">
              {[
                { event: 'Identity Authenticated', time: 'Just now', color: 'emerald' },
                { event: 'Vault Sync Successful', time: '1 hour ago', color: 'indigo' },
              ].map((log, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-${log.color}-500 shadow-lg group-hover:scale-150 transition-transform`}></div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">{log.event}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
