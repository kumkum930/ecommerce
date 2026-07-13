import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Set New Password</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-4 py-2" required minLength={8} />
        <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-2 rounded-md disabled:opacity-50">
          {saving ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
