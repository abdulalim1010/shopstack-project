"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/components/ImageUpload";
import Swal from "sweetalert2";

export default function AdminHelmets() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [helmets, setHelmets] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHelmet, setEditingHelmet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    image: "",
    inStock: true,
    rating: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchHelmets();
    }
  }, [user, isAdmin]);

  const fetchHelmets = async () => {
    try {
      const res = await fetch("/api/helmets");
      if (res.ok) {
        const data = await res.json();
        setHelmets(data);
      }
    } catch (err) {
      console.error("Error fetching helmets:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const openModal = (helmet = null) => {
    if (helmet) {
      setEditingHelmet(helmet);
      setFormData({
        name: helmet.name || "",
        brand: helmet.brand || "",
        description: helmet.description || "",
        price: helmet.price || "",
        image: helmet.image || "",
        inStock: helmet.inStock !== false,
        rating: helmet.rating || 0,
      });
    } else {
      setEditingHelmet(null);
      setFormData({
        name: "",
        brand: "",
        description: "",
        price: "",
        image: "",
        inStock: true,
        rating: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint = "/api/helmets";
    const method = editingHelmet ? "PUT" : "POST";
    const url = editingHelmet ? `${endpoint}/${editingHelmet._id}` : endpoint;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: editingHelmet ? 'Updated!' : 'Created!',
          text: editingHelmet ? 'Helmet updated successfully' : 'Helmet created successfully',
          timer: 2000,
          showConfirmButton: false
        });
        setShowModal(false);
        fetchHelmets();
      } else {
        setError(data.message || "Failed to save helmet");
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.message || "Failed to save helmet"
        });
      }
    } catch (err) {
      setError("Error saving helmet");
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: "Error saving helmet"
      });
    }
  };

  const handleDelete = async (helmetId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this helmet!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/helmets/${helmetId}`, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Helmet has been deleted.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchHelmets();
        } else {
          const data = await res.json();
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: data.message || 'Failed to delete helmet'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error deleting helmet'
        });
      }
    }
  };

  if (authLoading || loadingProducts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Helmets Management</h1>
          <p className="text-gray-600 mt-2">Manage your motorcycle helmets</p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Helmet
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-pulse">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Helmets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {helmets.map((helmet) => (
          <div 
            key={helmet._id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-48 bg-gray-100">
              {helmet.image ? (
                <img
                  src={helmet.image}
                  alt={helmet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">⛑️</span>
                </div>
              )}
              {!helmet.inStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Out of Stock
                </div>
              )}
            </div>
            
            <div className="p-4">
              {helmet.brand && (
                <p className="text-purple-600 text-sm font-medium mb-1">{helmet.brand}</p>
              )}
              <h3 className="font-bold text-gray-900 mb-1 truncate">{helmet.name}</h3>
              <p className="text-gray-600 text-lg font-bold mb-3">${helmet.price}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(helmet.rating || 0) ? "text-yellow-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openModal(helmet)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(helmet._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {helmets.length === 0 && !loadingProducts && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⛑️</div>
          <p className="text-gray-500 text-xl">No helmets found</p>
          <button
            onClick={() => openModal(null)}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Add Your First Helmet
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingHelmet ? "Edit Helmet" : "Add New Helmet"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Helmet name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Brand name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Helmet description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0-5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <ImageUpload
                  id="helmet-image-upload"
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                  label=""
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                  In Stock
                </label>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  {editingHelmet ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
