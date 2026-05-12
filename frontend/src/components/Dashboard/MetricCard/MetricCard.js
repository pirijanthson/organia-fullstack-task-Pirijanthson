import React from 'react';
import './MetricCard.css';

function MetricCard({ title, value, color, icon }) {
  return (
    <div className={`metric-card bg-gradient-to-br ${color}`}>
      {/* Decorative Glow */}
      <div className="card-glow"></div>
      
      <div className="card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={icon} />
        </svg>
      </div>
      
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-value">{value}</p>
        <div className="card-footer">
          <span className="footer-line"></span>
          <span>Live Metrics</span>
        </div>
      </div>
    </div>
  );
}

export default MetricCard;