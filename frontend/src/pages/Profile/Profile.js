import React, { useState, useEffect } from 'react';
import Api from '../../api/axiosConfig';
import './Profile.css';

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
      <div className="profile-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <p>Loading Profile</p>
            <span>Please wait...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>We encountered a problem while retrieving your profile.</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const identityFields = [
    { label: 'Username', value: user.username, icon: '👤', color: 'indigo', copyable: true },
    { label: 'Email Address', value: user.email, icon: '📧', color: 'blue', copyable: true },
    { label: 'Phone Number', value: user.phone || 'Not Linked', icon: '📱', color: 'emerald', copyable: user.phone },
    { label: 'Member Since', value: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), icon: '📅', color: 'purple', copyable: false },
    { label: 'User ID', value: `#${user.id || '1001'}`, icon: '🆔', color: 'rose', copyable: true },
  ];

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info-wrapper">
          <div className="avatar-section">
            <div className="avatar">
              <span className="avatar-initial">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="status-badge">
              <span className="status-dot"></span>
            </div>
          </div>

          <div className="user-info">
            <div className="user-name-section">
              <h1 className="user-name">{user.username}</h1>
              <div className="verified-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Verified</span>
              </div>
            </div>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Details Card - Grid View */}
        <div className="profile-details-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            <span>5 fields</span>
          </div>
          
          <div className="details-grid">
            {identityFields.map((field, idx) => (
              <div key={idx} className={`detail-item color-${field.color}`}>
                <div className="detail-icon">
                  <span>{field.icon}</span>
                </div>
                <div className="detail-content">
                  <label>{field.label}</label>
                  <p>{field.value}</p>
                </div>
                {field.copyable && field.value !== 'Not Linked' && (
                  <button 
                    onClick={() => copyToClipboard(field.value, field.label)}
                    className="copy-btn"
                    title="Copy to clipboard"
                  >
                    {copiedField === field.label ? (
                      <span className="copied-icon">✓</span>
                    ) : (
                      <span className="copy-icon">📋</span>
                    )}
                  </button>
                )}
                {copiedField === field.label && (
                  <div className="toast-message">Copied!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="profile-sidebar">
          {/* Security Card */}
          <div className="security-card">
            <div className="security-header">
              <span className="security-icon">🔒</span>
              <h3>Security Status</h3>
            </div>
            
            <div className="security-items">
              <div className="security-item">
                <span className="item-icon">🛡️</span>
                <span>2FA Protection</span>
                <span className="status-active">Active</span>
              </div>
              
              <div className="security-item">
                <span className="item-icon">🔐</span>
                <span>Identity Guard</span>
                <span className="status-monitor">Monitoring</span>
              </div>
              
              <div className="security-item">
                <span className="item-icon">⚡</span>
                <span>Session Security</span>
                <span className="status-secure">Secure</span>
              </div>
            </div>
            
            <div className="encryption-badge">
              <span>AES-256 Encryption</span>
            </div>
          </div>

          {/* Session Card */}
          <div className="session-card">
            <div className="session-header">
              <span className="session-icon">💻</span>
              <h3>Active Session</h3>
            </div>
            <div className="session-info">
              <div className="session-detail">
                <span className="detail-label">Device</span>
                <span className="detail-value">Chrome on Windows</span>
              </div>
              <div className="session-detail">
                <span className="detail-label">Location</span>
                <span className="detail-value">Unknown Location</span>
              </div>
              <div className="session-detail">
                <span className="detail-label">Last Active</span>
                <span className="detail-value">Current session</span>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="activity-card">
            <div className="activity-header">
              <span className="activity-icon">📊</span>
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <p className="activity-event">Profile Updated</p>
                  <span className="activity-time">Just now</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <p className="activity-event">Login Successful</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;