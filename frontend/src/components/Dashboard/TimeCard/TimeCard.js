import React, { useState, useEffect } from 'react';
import './TimeCard.css';

function TimeCard() {
  const [time, setTime] = useState(new Date());

  // Get current date formatted
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="time-card">
      {/* Animated Background Gradient */}
      <div className="time-card-glow"></div>
      
      {/* Time Display */}
      <div className="time-display">
        <div className="date-display">
          <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getCurrentDate()}</span>
        </div>
        <div className="time-digits">
          <span className="digit">{formatTime(time).charAt(0)}</span>
          <span className="digit">{formatTime(time).charAt(1)}</span>
          <span className="colon">:</span>
          <span className="digit">{formatTime(time).charAt(3)}</span>
          <span className="digit">{formatTime(time).charAt(4)}</span>
          <span className="colon">:</span>
          <span className="digit">{formatTime(time).charAt(6)}</span>
          <span className="digit">{formatTime(time).charAt(7)}</span>
        </div>
        
        {/* AM/PM Indicator */}
        <div className="ampm-indicator">
          <span className="ampm-text">{formatTime(time).slice(-2)}</span>
        </div>
      </div>
      
      {/* Separator */}
      <div className="time-separator"></div>
      
      {/* Live Status */}
      <div className="live-status">
        <div className="live-dot"></div>
        <span className="live-text">LIVE</span>
      </div>
    </div>
  );
}

export default TimeCard;