"use client";
import { useState } from "react";
import Link from "next/link";
import { FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categories = ["Electronics", "Fashion", "Books", "Sports", "Home & Kitchen"];

  return (
    <header className="w-full shadow-md">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center text-sm">
        <div className="font-bold text-lg">ShopStack</div>
        <div className="flex items-center space-x-3">
          <a href="mailto:youremail@gmail.com" className="hover:underline">Gmail</a>
          <Link href="/signin">
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Sign In</button>
          </Link>
          <Link href="/join">
            <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Join</button>
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">ShopStack</Link>
          </div>

          {/* Center: Nav Items (Desktop) */}
          <ul className="hidden md:flex space-x-6 font-medium items-center">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>

            {/* Products Dropdown */}
            <li className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}>
              <button className="hover:text-blue-600 flex items-center">Products ▼</button>
              {categoriesOpen && (
                <ul className="absolute top-full left-0 mt-2 bg-white border shadow-md py-2 w-44">
                  {categories.map(cat => (
                    <li key={cat}>
                      <Link href={`/products/${cat.toLowerCase()}`} className="block px-4 py-2 hover:bg-gray-100">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li><Link href="/offers" className="hover:text-blue-600">Offers</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
          </ul>

          {/* Right: Search + Cart */}
          <div className="hidden md:flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search products..."
              className="border px-3 py-1 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="text-gray-700 hover:text-blue-600 text-2xl relative">
              <FiShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden bg-white px-4 pb-4 space-y-2 font-medium">
            <li><Link href="/" className="block hover:text-blue-600">Home</Link></li>

            {/* Mobile Products Dropdown */}
            <li>
              <button
                className="w-full text-left hover:text-blue-600 flex justify-between items-center"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Products {categoriesOpen ? "▲" : "▼"}
              </button>
              {categoriesOpen && (
                <ul className="pl-4 mt-1 space-y-1">
                  {categories.map(cat => (
                    <li key={cat}>
                      <Link href={`/products/${cat.toLowerCase()}`} className="block hover:text-blue-600">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li><Link href="/offers" className="block hover:text-blue-600">Offers</Link></li>
            <li><Link href="/contact" className="block hover:text-blue-600">Contact</Link></li>

            {/* Mobile Search + Cart */}
            <li className="pt-2">
              <input
                type="text"
                placeholder="Search products..."
                className="border px-3 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <button className="w-full bg-gray-100 flex justify-center items-center py-2 rounded text-gray-700 hover:bg-gray-200">
                <FiShoppingCart className="text-xl mr-2" /> Cart (3)
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}