import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/analytics")
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load analytics"));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="text-2xl font-semibold">{stats.totalOrders}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Low Stock (≤ 5 units)</h2>
      {stats.lowStockProducts.length === 0 ? (
        <p className="text-slate-500 text-sm">Nothing running low right now.</p>
      ) : (
        <ul className="space-y-2">
          {stats.lowStockProducts.map((p) => (
            <li key={p._id} className="flex justify-between border-b pb-2 text-sm">
              <span>{p.name}</span>
              <span className={p.stock === 0 ? "text-red-500 font-medium" : "text-yellow-600"}>
                {p.stock} left
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/admin/products" className="inline-block mt-6 text-emerald-600 text-sm">
        Manage products →
      </Link>
    </div>
  );
}
