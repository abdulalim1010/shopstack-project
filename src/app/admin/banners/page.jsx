"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/app/components/ImageUpload";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    buttonText: "",
    buttonLink: "",
    location: "banner" // banner, contact
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        setBanners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch banners:", err);
        setLoading(false);
      });
  }, []);

  const fetchBanners = () => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        setBanners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch banners:", err);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId ? `/api/banners/${editingId}` : "/api/banners";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      fetchBanners();
      resetForm();
    } else {
      alert("Failed to save banner");
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      location: banner.location || "banner"
    });
    setEditingId(banner._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    const res = await fetch(`/api/banners/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      fetchBanners();
    } else {
      alert("Failed to delete banner");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      location: "banner"
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading banners...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Banners</h1>
          <p className="text-gray-600 mt-2">Manage website banners and images</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Banner'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Main title"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="Subtitle text"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label=""
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  placeholder="Shop Now"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  placeholder="/products"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={form.buttonLink}
                  onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              >
                <option value="banner">Main Banner</option>
                <option value="contact">Contact Page Image</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {editingId ? 'Update Banner' : 'Save Banner'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  banner.location === 'banner' ? 'bg-blue-500' : 'bg-green-500'
                } text-white`}>
                  {banner.location}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900">{banner.title || "No Title"}</h3>
              <p className="text-gray-600 text-sm mb-4">{banner.subtitle || "No subtitle"}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No banners yet</p>
            <p className="text-gray-400">Add your first banner to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
