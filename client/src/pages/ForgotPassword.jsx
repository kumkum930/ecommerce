import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Forgot Password</h1>
      {message && <p className="text-emerald-600 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-4 py-2" required />
        <button type="submit" disabled={sending} className="w-full bg-slate-900 text-white py-2 rounded-md disabled:opacity-50">
          {sending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p className="mt-4 text-sm"><Link to="/login" className="text-emerald-600">Back to login</Link></p>
    </div>
  );
}
