import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return <p className="p-6">Your cart is empty. <Link to="/" className="text-emerald-600">Browse products</Link></p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {items.map((item) => (
        <div key={item.productId} className="flex items-center justify-between border-b py-4">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="w-16 border rounded-md px-2 py-1"
            />
            <button onClick={() => removeItem(item.productId)} className="text-red-500 text-sm">
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-6">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={() => navigate(user ? "/checkout" : "/login")}
          className="bg-emerald-600 text-white px-6 py-2 rounded-md"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
