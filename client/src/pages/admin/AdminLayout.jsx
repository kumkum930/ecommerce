import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-md text-sm ${
    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-[180px_1fr] gap-8">
      <aside className="space-y-1">
        <NavLink to="/admin" end className={linkClass}>Overview</NavLink>
        <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
        <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
