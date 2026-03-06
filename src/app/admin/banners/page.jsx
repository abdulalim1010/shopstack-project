"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/app/components/ImageUpload";
import { FaEdit, FaTrash, FaPlus, FaImages, FaEye, FaEyeSlash } from "react-icons/fa";

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
    location: "banner",
    order: 1,
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

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

  useEffect(() => {
    fetchBanners();
  }, []);

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
      location: banner.location || "banner",
      order: banner.order || 1,
      isActive: banner.isActive !== false
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

  const toggleActive = async (banner) => {
    const res = await fetch(`/api/banners/${banner._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive })
    });

    if (res.ok) {
      fetchBanners();
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      location: "banner",
      order: 1,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl text-gray-600">Loading banners...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-2">Manage your homepage banners and sliders</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {previewMode ? <FaEyeSlash /> : <FaEye />}
            {previewMode ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/30"
          >
            <FaPlus />
            {showForm ? 'Cancel' : 'Add New Banner'}
          </button>
        </div>
      </div>

      {/* Preview Mode Info */}
      {previewMode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>Preview Mode:</strong> You are viewing how banners will appear on the homepage. 
            Banners are shown in a slider with fade effects. Use the admin panel to edit content.
          </p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Edit Banner' : 'Create New Banner'}
            </h2>
            <span className="text-sm text-gray-500">
              {editingId ? 'Update existing banner' : 'Add a new banner to your slider'}
            </span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Yamaha R1 Beast"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Experience ultimate speed and performance"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Banner Image <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Upload banner image (recommended: 1920x1080)"
              />
            </div>

            {/* Button Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  placeholder="e.g., Explore Now"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  placeholder="/mainproducts"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.buttonLink}
                  onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                />
              </div>
            </div>

            {/* Location & Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                >
                  <option value="banner">Main Banner (Homepage)</option>
                  <option value="contact">Contact Page</option>
                  <option value="secondary">Secondary Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                Active (show on website)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg shadow-orange-500/30"
              >
                {editingId ? 'Update Banner' : 'Create Banner'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Banners</p>
              <p className="text-3xl font-bold text-gray-900">{banners.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaImages className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Banners</p>
              <p className="text-3xl font-bold text-green-600">
                {banners.filter(b => b.isActive !== false).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaEye className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Main Banners</p>
              <p className="text-3xl font-bold text-blue-600">
                {banners.filter(b => b.location === 'banner').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaImages className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div 
            key={banner._id} 
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-transform hover:shadow-md ${!banner.isActive ? 'opacity-60' : ''}`}
          >
            <div className="h-48 bg-gray-200 relative">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaImages className="text-4xl" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleActive(banner)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    banner.isActive !== false 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {banner.isActive !== false ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  banner.location === 'banner' 
                    ? 'bg-orange-500 text-white' 
                    : banner.location === 'contact'
                    ? 'bg-blue-500 text-white'
                    : 'bg-purple-500 text-white'
                }`}>
                  {banner.location}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {banner.title || "No Title"}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {banner.subtitle || "No description"}
              </p>
              
              {/* Button Preview */}
              {banner.buttonText && (
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Button: </span>
                  <span className="text-sm font-medium text-orange-500">
                    {banner.buttonText}
                  </span>
                  {banner.buttonLink && (
                    <span className="text-xs text-gray-400 ml-2">
                      → {banner.buttonLink}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaImages className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No banners yet</p>
            <p className="text-gray-400 mb-6">Create your first banner to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaPlus />
              Add First Banner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
