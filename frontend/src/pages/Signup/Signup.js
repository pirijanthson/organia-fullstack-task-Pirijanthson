import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../api/axiosConfig";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await Api.post("/auth/register", { username, email, phone, password });
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      const message = error.response?.data || "Registration failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md my-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
          <p className="text-sm text-slate-500">Join us to start managing tasks</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="e.g. +1 234 567 890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-purple-500/30 mt-4"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-purple-600 hover:text-purple-800 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
