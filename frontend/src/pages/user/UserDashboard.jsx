import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Shield,
  Truck,
  RefreshCw
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Collections from "./Collections";
import WhyUs from "./WhyUs";
import Banner from "./Banner";
import Trending from "./Trending";
import Contact from "./Contact";
import Footer from "./Footer";

const heroImages = [
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop"
];

const heroTitles = [
  {
    title: "Step Into Style",
    subtitle: "Premium sneakers crafted for comfort and performance",
    cta: "Explore Collection",
    bgGradient: "from-purple-600/70 to-purple-600/70" 
  },
  {
    title: "New Arrivals",
    subtitle: "Latest designs from top brands. Limited stock available",
    cta: "Shop Now",
    bgGradient: "from-blue-600/70 to-purple-500/70"
  },
  {
    title: "Summer Collection",
    subtitle: "Lightweight sneakers perfect for any adventure",
    cta: "Discover More",
    bgGradient: "from-pink-600/70 to-purple-500/70" 
  }
];

const navItems = [
  { id: "home", label: "Home" },
  { id: "collections", label: "Collections" },
  { id: "offer", label: "Sales" },
  { id: "trending", label: "Trending" },
  { id: "our-service", label: "Services" },
  { id: "contact", label: "Contact" }
];

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $99" },
  { icon: Shield, title: "2-Year Warranty", desc: "Quality guarantee" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Star, title: "Premium Quality", desc: "Authentic brands only" }
];

const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((p) => (p + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((p) => (p - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  FootHub
                </span>
                <span className="text-xs text-gray-500 font-medium">Premium Footwear</span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-4 py-2 text-sm font-medium text-black hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {/* SEARCH */}
              <div className={`relative transition-all duration-300 ${searchOpen ? 'w-64' : 'w-10'}`}>
                {searchOpen && (
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 ${searchOpen ? 'text-purple-600' : 'text-gray-600'}`}
                >
                  <Search className="w-5 h-5" color="black"/>
                </button>
              </div>

              {/* USER & CART */}
              <button
                onClick={() => navigate("/login")}
                className="p-2.5 bg-linear-to-br from-gray-100 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hidden sm:block"
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>
              
              <button className="p-2.5 relative group">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
                </div>
              </button>
              
              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-black" />
                ) : (
                  <Menu className="w-6 h-6 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-5">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 flex items-center justify-center col-span-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative  h-screen overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Image with less scale to show more content */}
            <img 
              src={img} 
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover scale-105" 
            />
            <div className={`absolute inset-0 bg-linear-to-br ${heroTitles[index].bgGradient}`} />
          </div>
        ))}

        {/* SLIDE CONTROLS */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group z-20"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* SLIDE INDICATORS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "w-8 bg-white" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* HERO CONTENT */}
        <div className="relative h-full flex items-center z-10">
          <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mt-10 md:mt-0 mb-6 leading-tight">
                {heroTitles[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-xl"> 
                {heroTitles[currentSlide].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => navigate("/login")}
                  className="group px-8 py-4 bg-linear-to-r from-white to-gray-100 text-gray-900 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                >
                  <span>{heroTitles[currentSlide].cta}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border-2 border-white/40 text-white rounded-2xl font-medium hover:bg-white/15 backdrop-blur-sm transition-all duration-300"
                >
                  View All Products
                </button>
              </div>

              {/* FEATURES - Made more transparent */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/25 hover:bg-white/25 transition-all duration-300"
                  >
                    <feature.icon className="w-8 h-8 text-white mb-2" />
                    <p className="text-white font-semibold">{feature.title}</p>
                    <p className="text-white/90 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GRADIENT FADE AT BOTTOM */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/20 to-transparent z-5"></div>
      </section>

      {/* MAIN CONTENT */}
      <main className="relative z-10">
        <div className="">
          <Collections />
          <div id="offer" >
            <Banner />
          </div>
          <div id="trending">
            <Trending />
          </div>
          <div id="our-service">
            <WhyUs />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;