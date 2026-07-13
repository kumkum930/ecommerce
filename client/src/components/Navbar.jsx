import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
      <Link to="/" className="text-lg font-semibold">MERN Shop</Link>
      <div className="flex items-center gap-6">
        <Link to="/cart" className="relative">
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-emerald-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="text-sm hover:underline">Admin</Link>
        )}
        {user ? (
          <>
            <span className="text-sm text-slate-300">Hi, {user.name}</span>
            <button onClick={logout} className="text-sm hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="text-sm hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}
