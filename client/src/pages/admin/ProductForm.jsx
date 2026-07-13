import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  images: [], // array of uploaded/entered URLs
};

export default function ProductForm() {
  const { id } = useParams(); // present when editing
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/products/${id}`).then(({ data }) => {
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        images: data.images || [],
      });
      setLoading(false);
    });
  }, [id, isEditing]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-uploading the same filename
    }
  };

  const removeImage = (url) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      images: form.images,
    };

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{isEditing ? "Edit Product" : "Add Product"}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Name</label>
          <input value={form.name} onChange={handleChange("name")} required
            className="w-full border rounded-md px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Description</label>
          <textarea value={form.description} onChange={handleChange("description")} required rows={3}
            className="w-full border rounded-md px-4 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Price ($)</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={handleChange("price")} required
              className="w-full border rounded-md px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Stock</label>
            <input type="number" min="0" value={form.stock} onChange={handleChange("stock")} required
              className="w-full border rounded-md px-4 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Category</label>
          <input value={form.category} onChange={handleChange("category")} required
            className="w-full border rounded-md px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">Images</label>
          <div className="flex flex-wrap gap-3 mb-2">
            {form.images.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-md border" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
          {uploading && <p className="text-sm text-slate-500 mt-1">Uploading...</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-slate-900 text-white px-6 py-2 rounded-md disabled:opacity-50">
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")}
            className="px-6 py-2 rounded-md border">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
