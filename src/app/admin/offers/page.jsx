"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/components/ImageUpload";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaTag } from "react-icons/fa";

export default function AdminOffersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    discount: "",
    image: "",
    buttonText: "Shop Now",
    buttonLink: "/mainproducts",
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, authLoading, router]);

  const fetchOffers = () => {
    fetch("/api/offers")
      .then(res => res.json())
      .then(data => {
        setOffers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch offers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchOffers();
    }
  }, [user, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.image) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in the title and upload an image'
      });
      return;
    }

    const url = editingId ? `/api/offers/${editingId}` : "/api/offers";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      fetchOffers();
      resetForm();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'Offer Updated!' : 'Offer Created!',
        text: editingId ? 'Your offer has been updated successfully.' : 'Your new offer has been created successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save offer. Please try again.'
      });
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title || "",
      subtitle: offer.subtitle || "",
      discount: offer.discount || "",
      image: offer.image || "",
      buttonText: offer.buttonText || "Shop Now",
      buttonLink: offer.buttonLink || "/mainproducts",
      isActive: offer.isActive !== false
    });
    setEditingId(offer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this offer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/offers/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        fetchOffers();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Offer has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete offer.'
        });
      }
    }
  };

  const toggleActive = async (offer) => {
    const res = await fetch(`/api/offers/${offer._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...offer, isActive: !offer.isActive })
    });

    if (res.ok) {
      fetchOffers();
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      discount: "",
      image: "",
      buttonText: "Shop Now",
      buttonLink: "/mainproducts",
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl text-gray-600">Loading offers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers Management</h1>
          <p className="text-gray-600 mt-2">Manage your special offers and promotions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/30"
        >
          <FaPlus />
          {showForm ? 'Cancel' : 'Add New Offer'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Edit Offer' : 'Create New Offer'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Offer Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Super Bike Mega Offer"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount Text
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30% OFF"
                  className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtitle / Description
              </label>
              <textarea
                placeholder="e.g., Get the best superbikes with exclusive discounts."
                className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Offer Image <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Upload offer image (recommended: 800x600)"
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
                  placeholder="e.g., Shop Now"
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
                {editingId ? 'Update Offer' : 'Create Offer'}
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
              <p className="text-gray-500 text-sm">Total Offers</p>
              <p className="text-3xl font-bold text-gray-900">{offers.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaTag className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Offers</p>
              <p className="text-3xl font-bold text-green-600">
                {offers.filter(o => o.isActive !== false).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaTag className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div 
            key={offer._id} 
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-transform hover:shadow-md ${!offer.isActive ? 'opacity-60' : ''}`}
          >
            <div className="h-48 bg-gray-200 relative">
              {offer.image ? (
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaTag className="text-4xl" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleActive(offer)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    offer.isActive !== false 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {offer.isActive !== false ? 'Active' : 'Inactive'}
                </button>
              </div>
              {offer.discount && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-orange-500 text-white">
                    {offer.discount}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {offer.title || "No Title"}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {offer.subtitle || "No description"}
              </p>
              
              {offer.buttonText && (
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500">Button: </span>
                  <span className="text-sm font-medium text-orange-500">
                    {offer.buttonText}
                  </span>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {offers.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTag className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No offers yet</p>
            <p className="text-gray-400 mb-6">Create your first offer to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaPlus />
              Add First Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
