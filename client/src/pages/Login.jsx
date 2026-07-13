import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-4 py-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-4 py-2" required />
        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md">Login</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link to="/register" className="text-emerald-600">Register</Link></p>
      <p className="mt-2 text-sm"><Link to="/forgot-password" className="text-slate-500">Forgot password?</Link></p>
    </div>
  );
}
