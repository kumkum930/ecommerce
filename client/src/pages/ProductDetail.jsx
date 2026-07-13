import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.images?.[0] || "https://placehold.co/500x500?text=Product"}
        alt={product.name}
        className="w-full rounded-lg"
      />
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-emerald-600 text-xl font-bold mt-2">${product.price.toFixed(2)}</p>
        <p className="text-slate-600 mt-4">{product.description}</p>
        <p className="text-sm text-slate-500 mt-2">{product.stock} in stock</p>

        <div className="flex items-center gap-3 mt-6">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 border rounded-md px-2 py-1"
          />
          <button
            onClick={() => addItem(product, quantity)}
            disabled={product.stock === 0}
            className="bg-slate-900 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
