import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../api/axiosConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await Api.post("/auth/login", { email, password });
      const { token, username } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-500">Please enter your details to sign in</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;