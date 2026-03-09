"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/banners?location=contact")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setBanner(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch banner:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form)
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for contacting us. We will get back to you soon.',
        timer: 3000,
        showConfirmButton: false
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }

  };

  return (

    <div className="max-w-7xl mx-auto py-16 px-6">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}

        <div className="relative h-[520px] w-full rounded-2xl overflow-hidden">

          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : banner && banner.image && banner.image.startsWith('http') ? (
            <Image
              src={banner.image}
              alt="contact"
              fill
              className="object-cover"
            />
          ) : (
            <Image
              src="/contact.jpg"
              alt="contact"
              fill
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-10 text-white">

            <h2 className="text-4xl font-bold mb-4">
              {banner?.title || "Top Quality Auto Parts"}
              <br />
              {banner?.subtitle || "& Smart Accessories"}
            </h2>

            <p className="text-lg mb-6">
              {banner?.buttonText || "Discover Premium Parts to Enhance Performance."}
            </p>

            <Link href={banner?.buttonLink || "/mainproducts"} 
              className="relative overflow-hidden bg-white text-black px-6 py-3 rounded-full w-40 text-center transition transform hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(90deg, #ffffff 0%, #f3f4f6 100%)',
                backgroundSize: '200% 100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundPosition = '100% 0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundPosition = '0 0';
              }}
            >
              {banner?.buttonText || "Shop Now"}
            </Link>

          </div>

        </div>

        {/* RIGHT FORM */}

        <div className="bg-gray-100 p-8 rounded-2xl">

          <h2 className="text-3xl font-bold mb-2">
            Contact Us
          </h2>

          <p className="text-gray-500 mb-6">
            You can also call customer service on (+01) 1234 8888
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Your Name*"
                className="p-3 rounded-lg border w-full"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Your Email*"
                className="p-3 rounded-lg border w-full"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Phone"
                className="p-3 rounded-lg border w-full"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Subject"
                className="p-3 rounded-lg border w-full"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />

            </div>

            <textarea
              placeholder="Your Message*"
              rows="6"
              className="p-3 rounded-lg border w-full"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button 
              className="relative overflow-hidden bg-black text-white px-8 py-3 rounded-full transition transform hover:scale-105 hover:shadow-lg hover:shadow-black/30"
              style={{
                background: 'linear-gradient(90deg, #1a1a1a 0%, #333333 100%)',
                backgroundSize: '200% 100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundPosition = '100% 0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundPosition = '0 0';
              }}
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}
