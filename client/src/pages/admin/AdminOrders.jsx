import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api
      .get("/orders")
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-slate-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.user?.name || "Unknown customer"}</p>
                  <p className="text-sm text-slate-500">{order.user?.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <ul className="text-sm text-slate-600 mt-3 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity} x {item.name} — ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center gap-2">
                <label className="text-sm text-slate-500">Update status:</label>
                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
