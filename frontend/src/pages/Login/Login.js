import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../../api/axiosConfig";
import "./Login.css";
import logo from "../../asserts/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // If email is admin@gmail.com -> show error page
    if (email.trim().toLowerCase() === "admin@gmail.com") {
      navigate("/error");
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post("/auth/login", {
        email,
        password,
      });

      const { token, username } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login failed:", error);
      const backendMessage = error.response?.data?.message || error.response?.data;
      setError(backendMessage || error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <img src={logo} alt="TaskFlow" />
          </div>
          <h2>TaskFlow</h2>
          <p>Task Management System</p>
        </div>

        <div className="login-form-wrapper">
          <div className="form-header">
            <h3>Welcome back</h3>
            <p>Sign in to continue</p>
          </div>

          {error && (
            <div className="error-alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Email address"
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
            </div>

            <div className="options-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="form-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <div className="demo-items">
              <span>user@example.com</span>
              <span>password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;