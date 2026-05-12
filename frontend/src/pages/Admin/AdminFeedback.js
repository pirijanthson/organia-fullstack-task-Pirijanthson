import React, { useState, useEffect, useMemo } from 'react';
import { getAllTasks } from '../../services/adminService';

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
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.userName.toLowerCase().includes(search.toLowerCase()) ||
      item.feedback.toLowerCase().includes(search.toLowerCase())
    );
  }, [feedbackList, search]);

  const startIndex = (currentPage - 1) * FEEDBACK_PER_PAGE;
  const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + FEEDBACK_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-2">Review Center</h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Feedback</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Analyzing operator insights and task completion reports.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search feedback or operators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-xl"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-slate-500 font-bold animate-pulse">Aggregating feedback data...</p>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="card-premium p-20 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">No Feedback Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">Once users complete tasks and provide feedback, they will appear here for your review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedFeedback.map((item) => (
            <div key={item.id} className="card-premium group relative overflow-hidden flex flex-col p-8 hover:scale-[1.02] transition-all duration-500">
              <div className="absolute top-0 right-0 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600/10 group-hover:text-indigo-600/20 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3C14.017 1.89543 14.9124 1 16.017 1H19.017C21.7784 1 24.017 3.23858 24.017 6V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM0 21L0 18C0 16.8954 0.89543 16 2 16H5C5.55228 16 6 15.5523 6 15V9C6 8.44772 5.55228 8 5 8H2C0.895431 8 0 7.10457 0 6V3L0 3C0 1.89543 0.895431 1 2 1H5C7.76142 1 10 3.23858 10 6V15C10 18.3137 7.31371 21 4 21H0Z" />
                </svg>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                  {item.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white leading-tight">{item.userName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</p>
                </div>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 mb-6">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{item.feedback}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Task ID: {item.id}</span>
                <span className="text-indigo-600 dark:text-indigo-400">Validated Report</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;
