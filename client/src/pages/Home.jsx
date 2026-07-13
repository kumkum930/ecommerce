import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await api.get("/products", { params: { search } });
      setProducts(data.products);
      setLoading(false);
    };
    const timeout = setTimeout(fetchProducts, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-2 border rounded-md"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {products.length === 0 && <p>No products found.</p>}
        </div>
      )}
    </div>
  );
}
