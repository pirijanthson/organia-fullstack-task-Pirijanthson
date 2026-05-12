import { useNavigate } from "react-router-dom";
import "./Error.css";

function AdminError() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/");
  };

  const handleGoToSignup = () => {
    navigate("/signup");
  };

  const handleTryAgain = () => {
    navigate("/");
  };

  return (
    <div className="admin-error-container">
      <div className="admin-error-card">
        {/* Animated Background */}
        <div className="admin-bg-shape"></div>
        <div className="admin-bg-shape shape-2"></div>
        
        <div className="admin-error-content">
          {/* Shield Icon */}
          <div className="admin-error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="admin-error-title">Admin Access Required</h1>
          
          {/* Error Message */}
          <div className="admin-error-message">
            <p>
              <strong>Notice:</strong> You've attempted to login with <strong>admin@gmail.com</strong>
            </p>
            <p>
              This email is reserved for administrators only. Regular users cannot access the system with admin credentials.
            </p>
          </div>

          {/* What Happened Section */}
          <div className="admin-info-box">
            <div className="info-header">
              <span className="info-icon">ℹ️</span>
              <strong>What happened?</strong>
            </div>
            <ul className="info-list">
              <li>You tried to login with admin credentials</li>
              <li>Admin access is restricted to authorized personnel only</li>
              <li>Please use your personal user account to continue</li>
            </ul>
          </div>

          {/* Solutions Section */}
          <div className="admin-solutions">
            <div className="solution-header">
              <span className="solution-icon">💡</span>
              <strong>How to fix this:</strong>
            </div>
            
            <div className="solution-grid">
              <div className="solution-card">
                <div className="solution-number">1</div>
                <div className="solution-content">
                  <h4>Use Regular User Account</h4>
                  <p>Login with your personal email address instead of admin@gmail.com</p>
                </div>
              </div>

              <div className="solution-card">
                <div className="solution-number">2</div>
                <div className="solution-content">
                  <h4>Create a New Account</h4>
                  <p>If you don't have an account yet, please sign up as a regular user</p>
                </div>
              </div>

              <div className="solution-card">
                <div className="solution-number">3</div>
                <div className="solution-content">
                  <h4>Contact Administrator</h4>
                  <p>If you believe you need admin access, contact your system administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="admin-error-actions">
            <button onClick={handleTryAgain} className="admin-btn admin-btn-primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              Try Again
            </button>

            <button onClick={handleGoToSignup} className="admin-btn admin-btn-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
              Create Account
            </button>

            <button onClick={handleGoToLogin} className="admin-btn admin-btn-outline">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                />
              </svg>
              Back to Login
            </button>
          </div>

          {/* Help Text */}
          <div className="admin-help-text">
            <p>
              <span className="help-emoji">🆘</span>
              Need assistance? <a href="/support">Contact Support Team</a>
            </p>
          </div>

          {/* Warning Note */}
          <div className="admin-warning">
            <span className="warning-icon">⚠️</span>
            <span>
              <strong>Security Notice:</strong> Multiple failed admin login attempts will be logged for security purposes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminError;