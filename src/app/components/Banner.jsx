"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const defaultSlides = [
  {
    title: "Yamaha R1 Beast",
    subtitle: "Experience ultimate speed and performance with Yamaha superbike.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9891c2c06",
    buttonText: "Explore Now",
    buttonLink: "/mainproducts"
  },
  {
    title: "Kawasaki Ninja ZX-10R",
    subtitle: "Dominate the road with aggressive power and precision.",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65",
    buttonText: "Shop Now",
    buttonLink: "/mainproducts"
  },
  {
    title: "Ducati Panigale V4",
    subtitle: "Italian engineering meets extreme racing DNA.",
    image: "https://images.unsplash.com/photo-1619771914271-a9c8e9f0f07d",
    buttonText: "View Details",
    buttonLink: "/mainproducts"
  },
  {
    title: "BMW S1000RR",
    subtitle: "German technology with unmatched superbike performance.",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6",
    buttonText: "Discover More",
    buttonLink: "/mainproducts"
  }
];

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/banners?location=banner")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch banners");
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch banners:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Use admin banners if available, otherwise use default slides
  const slides = banners.length > 0 
    ? banners.map(banner => ({
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink
      }))
    : defaultSlides;

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        navigation
        loop={true}
        speed={1000}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[60vh] md:h-[70vh] lg:h-screen w-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/15"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-10 items-center">
                  
                  {/* Left: Text Content */}
                  <div className="text-white space-y-6 animate-slideInLeft">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                      {slide.title || "Ride Your Dream"}
                    </h1>
                    
                    <p className="text-gray-300 text-lg md:text-xl max-w-lg">
                      {slide.subtitle || "Discover the ultimate performance, style, and freedom on two wheels."}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link 
                        href={slide.buttonLink || "/mainproducts"}
                        className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
                      >
                        {slide.buttonText || "Explore Now"}
                        <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                      
                      <Link 
                        href="/contact"
                        className="group border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white/10"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>

                  {/* Right: Decorative Elements */}
                  <div className="hidden md:flex justify-end items-center animate-slideInRight">
                    <div className="relative">
                      {/* Animated circle decoration */}
                      <div className="w-64 h-64 border-4 border-orange-500/30 rounded-full animate-pulse"></div>
                      <div className="absolute -top-4 -left-4 w-72 h-72 border-4 border-white/20 rounded-full animate-pulse delay-75"></div>
                      
                      {/* Stats */}
                      <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <p className="text-orange-500 font-bold text-2xl">500+</p>
                        <p className="text-white/70 text-sm">Motorcycles Available</p>
                      </div>
                      
                      <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <p className="text-orange-500 font-bold text-2xl">24/7</p>
                        <p className="text-white/70 text-sm">Support Available</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for animations */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        /* Custom Swiper pagination */
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
        }
        
        .swiper-pagination-bullet-active {
          background: #f97316 !important;
          transform: scale(1.3) !important;
        }

        /* Custom navigation buttons */
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.3);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(249, 115, 22, 0.8);
          transform: scale(1.1);
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }

        /* Hide navigation on mobile */
        @media (max-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
