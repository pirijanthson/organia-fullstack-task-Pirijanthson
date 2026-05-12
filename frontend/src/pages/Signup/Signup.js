import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../../api/axiosConfig";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  // Simple validation
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    switch (field) {
      case "username":
        return value.length >= 3 ? "" : "Min 3 characters";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email";
      case "phone":
        return value.length >= 10 ? "" : "Min 10 digits";
      case "password":
        return value.length >= 6 ? "" : "Min 6 characters";
      case "rePassword":
        return value === password ? "" : "Passwords don't match";
      default:
        return "";
    }
  };

  const getFieldError = (field) => {
    const value = { username, email, phone, password, rePassword }[field];
    return touched[field] ? validateField(field, value) : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const allTouched = { username: true, email: true, phone: true, password: true, rePassword: true };
    setTouched(allTouched);

    const errors = {
      username: validateField("username", username),
      email: validateField("email", email),
      phone: validateField("phone", phone),
      password: validateField("password", password),
      rePassword: validateField("rePassword", rePassword),
    };

    if (Object.values(errors).some(error => error)) {
      setError("Please fix the errors");
      return;
    }

    setLoading(true);
    try {
      await Api.post("/auth/register", { username, email, phone, password });
      navigate("/", { state: { message: "Account created! Please login." } });
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-brand">
          <div className="brand-icon">📋</div>
          <h2>TaskFlow</h2>
          <p>Manage tasks efficiently</p>
        </div>

        <div className="signup-form-wrapper">
          <div className="form-header">
            <h3>Create account</h3>
            <p>Get started for free</p>
          </div>

          {error && (
            <div className="error-alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched({ ...touched, username: true })}
                className={`input-field ${getFieldError("username") ? "error" : ""}`}
                placeholder="Username"
                required
              />
              {getFieldError("username") && <span className="error-text">{getFieldError("username")}</span>}
            </div>

            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={`input-field ${getFieldError("email") ? "error" : ""}`}
                placeholder="Email address"
                required
              />
              {getFieldError("email") && <span className="error-text">{getFieldError("email")}</span>}
            </div>

            <div className="input-group">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched({ ...touched, phone: true })}
                className={`input-field ${getFieldError("phone") ? "error" : ""}`}
                placeholder="Phone number"
                required
              />
              {getFieldError("phone") && <span className="error-text">{getFieldError("phone")}</span>}
            </div>

            <div className="input-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={`input-field ${getFieldError("password") ? "error" : ""}`}
                  placeholder="Password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
              {getFieldError("password") && <span className="error-text">{getFieldError("password")}</span>}
            </div>

            <div className="input-group">
              <div className="password-wrapper">
                <input
                  type={showRePassword ? "text" : "password"}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, rePassword: true })}
                  className={`input-field ${getFieldError("rePassword") ? "error" : ""}`}
                  placeholder="Confirm password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowRePassword(!showRePassword)}>
                  {showRePassword ? "👁️" : "🔒"}
                </button>
              </div>
              {getFieldError("rePassword") && <span className="error-text">{getFieldError("rePassword")}</span>}
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="form-footer">
            Already have an account? <Link to="/">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;