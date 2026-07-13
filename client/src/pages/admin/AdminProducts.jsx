import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { page, limit: 10 } });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link to="/admin/products/new" className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm">
          + Add Product
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-slate-500">No products yet. Add your first one.</p>
      ) : (
        <>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b text-slate-500">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.category}</td>
                  <td className="py-2">${p.price.toFixed(2)}</td>
                  <td className="py-2">
                    <span className={p.stock === 0 ? "text-red-500 font-medium" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-2 text-right space-x-3">
                    <Link to={`/admin/products/${p._id}/edit`} className="text-emerald-600">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="text-red-500 disabled:opacity-50"
                    >
                      {deletingId === p._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
