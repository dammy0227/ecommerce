import React, { useState, useEffect} from "react";
import {
  ShoppingBag,
  Search,
  User,
  ShoppingCart,
  Menu,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Collections from "./Collections";
import WhyUs from "./WhyUs";
import Banner from "./Banner";
import Trending from "./Trending";
import Contact from "./Contact";
import Footer from "./Footer";

const heroImages = [
  "https://i.pinimg.com/1200x/81/62/23/8162238e43796fc1161b5e88948ec1d2.jpg",
  "https://i.pinimg.com/1200x/12/7f/17/127f1751bedef95dfb1120d338faea9d.jpg",
  "https://i.pinimg.com/736x/6e/70/10/6e7010c4731967d6eb954b6e1ae52b09.jpg"
];

const heroTitles = [
  {
    title: "Step Into Style",
    subtitle: "Premium sneakers crafted for comfort and performance",
    cta: "Explore Collection"
  },
  {
    title: "New Arrivals",
    subtitle: "Latest designs from top brands. Limited stock available",
    cta: "Shop Now"
  },
  {
    title: "Summer Collection",
    subtitle: "Lightweight sneakers perfect for any adventure",
    cta: "Discover More"
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

const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const navText = scrolled ? "text-purple-600" : "text-white";
  const iconColor = scrolled ? "text-purple-600" : "text-white";

  return (
    <div className="bg-gray-50">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ${navText}`}
            >
              FootHub
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`font-medium text-sm transition hover:text-purple-400 ${navText}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">
            <button className="p-2">
              <Search className={`w-5 h-5 ${iconColor}`} />
            </button>
            <button onClick={() => navigate("/login")} className="p-2 hidden sm:block">
              <User className={`w-5 h-5 ${iconColor}`} />
            </button>
            <button className="p-2 relative">
              <ShoppingCart className={`w-5 h-5 ${iconColor}`} />
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${iconColor}`} />
              ) : (
                <Menu className={`w-6 h-6 ${iconColor}`} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg rounded-xl mx-4 mt-4 p-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-purple-600"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative h-screen overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}

        {/* HERO CONTENT */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-center lg:text-left max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {heroTitles[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-2">
                {heroTitles[currentSlide].subtitle}
              </p>
              <p className="text-gray-300 mb-6">
                Discover exclusive styles, premium brands & limited stock online.
              </p>

              <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                >
                  {heroTitles[currentSlide].cta}
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border border-white text-white rounded-xl hover:bg-white/20"
                >
                  View All Products
                </button>
              </div>

              {/* STATS */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-white">
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-gray-300">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-gray-300">Brands</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-gray-300">Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
        <Collections />
        <div id="offer" className=""><Banner /></div>
        <div id="trending"><Trending /></div>
        <div id="our-service" className=""><WhyUs /></div>
        <div id="contact"><Contact /></div>
      

      <Footer />
    </div>
  );
};

export default UserDashboard;
