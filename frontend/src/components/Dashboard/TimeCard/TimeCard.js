import React, { useState, useEffect } from 'react';
import './TimeCard.css';

function TimeCard() {
  const [time, setTime] = useState(new Date());

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