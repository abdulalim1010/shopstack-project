"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import Swal from "sweetalert2";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const { user, logout, loading, isAdmin } = useAuth();

  const categories = [
    "Helmets",
    "Wheels",
    "Parts",
    "Accessories",
    "Maintenance",
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setUserMenuOpen(false);
        Swal.fire({
          icon: "success",
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <header className="w-full fixed top-0 z-[9999] shadow-md">

      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm relative z-[9999]">
        <div className="font-bold text-lg">ShopStack</div>

        <div className="flex items-center space-x-3">
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-1 hover:text-blue-300"
              >
                <FiUser />
                <span>{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 bg-white text-gray-800 shadow-xl rounded-lg py-2 w-48 z-[9999]">
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 flex items-center text-purple-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser className="mr-2" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Sign In
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                Join
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-blue-600 backdrop-blur-md z-[9998]">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-3">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white">
            ShopStack
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 font-medium items-center">
            <li>
              <Link
                href="/"
                className={`hover:text-white ${
                  pathname === "/" ? "text-white font-bold" : "text-blue-100"
                }`}
              >
                Home
              </Link>
            </li>

            {/* Products */}
            <li
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="text-blue-100 hover:text-white flex items-center">
                Products ▼
              </button>

              {categoriesOpen && (
                <ul className="absolute top-full left-0 mt-2 bg-white border shadow-lg py-2 w-44 rounded-md z-[9999]">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/products/${cat.toLowerCase()}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/offers"
                className={`hover:text-white ${
                  pathname === "/offers"
                    ? "text-white font-bold"
                    : "text-blue-100"
                }`}
              >
                Offers
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className={`hover:text-white ${
                  pathname === "/contact"
                    ? "text-white font-bold"
                    : "text-blue-100"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">

            {/* Search */}
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-blue-300 px-3 py-1 rounded w-64 focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-blue-200"
              />
            </form>

            {/* Cart */}
            <Link
              href="/cart"
              className="text-white hover:text-blue-200 text-2xl relative"
            >
              <FiShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden bg-white px-4 pb-4 space-y-2 font-medium z-[9999] relative">
            <li>
              <Link href="/" className="block hover:text-blue-600">
                Home
              </Link>
            </li>

            <li>
              <Link href="/offers" className="block hover:text-blue-600">
                Offers
              </Link>
            </li>

            <li>
              <Link href="/contact" className="block hover:text-blue-600">
                Contact
              </Link>
            </li>

            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 flex items-center justify-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </li>
            ) : (
              <li className="flex space-x-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  Sign In
                </button>

                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  Join
                </button>
              </li>
            )}
          </ul>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
}