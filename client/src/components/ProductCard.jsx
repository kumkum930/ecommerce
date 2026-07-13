import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition p-4"
    >
      <img
        src={product.images?.[0] || "https://placehold.co/300x300?text=Product"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />
      <h3 className="font-medium text-slate-800">{product.name}</h3>
      <p className="text-emerald-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
    </Link>
  );
}
