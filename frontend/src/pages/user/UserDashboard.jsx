import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Star,
  Truck,
  Shield,
  Heart,
  Zap,
  Award,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Collections from "./Collections";
import WhyUs from "./WhyUs";
import Banner from "./Banner";
import Trending from "./Trending";
import Contact from "./Contact";
import Footer from "./Footer";

const heroImages = [
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2874&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2942&auto=format&fit=crop",
  'https://i.pinimg.com/1200x/c1/47/d7/c147d75d161d89ee196b1e3622fecb8c.jpg'
];

const heroTitles = [
  {
    title: "Define Your Edge",
    subtitle: "Premium performance footwear engineered for the modern athlete",
    cta: "Explore Collection",
    highlight: "2025 Collection",
    badge: "NEW SEASON"
  },
  {
    title: "Future of Motion",
    subtitle: "Revolutionary comfort meets iconic design",
    cta: "Discover Now",
    highlight: "Innovation Series",
    badge: "LIMITED"
  },
  {
    title: "Iconic Origins",
    subtitle: "Where heritage meets contemporary craftsmanship",
    cta: "Shop Heritage",
    highlight: "Signature Edition",
    badge: "ORIGINAL"
  }
];

const navItems = [
  { id: "home", label: "Home" },
  { id: "collections", label: "Collections" },
  { id: "new", label: "New Arrivals" },
  { id: "trending", label: "Trending" },
  { id: "sale", label: "Sale" },
  { id: "contact", label: "Contact" }
];

const stats = [
  { value: "500+", label: "Premium Products", icon: <ShoppingBag className="w-5 h-5" /> },
  { value: "50+", label: "Global Brands", icon: <Award className="w-5 h-5" /> },
  { value: "24h", label: "Express Delivery", icon: <Truck className="w-5 h-5" /> },
  { value: "100%", label: "Authentic Guarantee", icon: <Shield className="w-5 h-5" /> }
];

const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  return (
    <div className="bg-white">
      {/* NAVBAR */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-11 h-11 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:shadow-xl group-hover:shadow-indigo-600/30 transition-shadow"
            >
              <ShoppingBag className="w-6 h-6 text-white" />
            </motion.div>
            <span className={`text-2xl font-bold tracking-tight ${
              scrolled 
                ? "bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" 
                : "text-white"
            }`}>
              FOOTHUB
            </span>
            <span className="hidden sm:block px-2 py-0.5 bg-white/20 text-white/90 text-xs font-semibold rounded-full border border-white/30">
              PRO
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`px-4 py-2 font-medium text-sm rounded-full transition-all relative group ${
                  scrolled 
                    ? "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50" 
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {item.id === "sale" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                )}
              </motion.a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl transition-colors ${
                scrolled ? "hover:bg-indigo-50" : "hover:bg-white/10"
              }`}
            >
              <Search className={`w-5 h-5 ${scrolled ? "text-slate-600" : "text-white"}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className={`p-2.5 rounded-xl hidden sm:block transition-colors ${
                scrolled ? "hover:bg-indigo-50" : "hover:bg-white/10"
              }`}
            >
              <User className={`w-5 h-5 ${scrolled ? "text-slate-600" : "text-white"}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl relative transition-colors ${
                scrolled ? "hover:bg-indigo-50" : "hover:bg-white/10"
              }`}
            >
              <Heart className={`w-5 h-5 ${scrolled ? "text-slate-600" : "text-white"}`} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30"
              >
                {wishlistCount}
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl relative transition-colors ${
                scrolled ? "hover:bg-indigo-50" : "hover:bg-white/10"
              }`}
            >
              <ShoppingCart className={`w-5 h-5 ${scrolled ? "text-slate-600" : "text-white"}`} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30"
              >
                {cartCount}
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                scrolled ? "hover:bg-indigo-50" : "hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${scrolled ? "text-slate-600" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? "text-slate-600" : "text-white"}`} />
              )}
            </motion.button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute top-full left-4 right-4 mt-2"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 text-slate-700 hover:text-white hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 rounded-xl transition-all group"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </motion.a>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      Sign In / Register
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO SECTION - Indigo/Purple linear overlay */}
      <section id="home" className="relative min-h-screen overflow-hidden bg-linear-to-br from-indigo-900 via-purple-900 to-purple-800 pt-10">
        {/* Background Images - Full visibility with linear overlay */}
        <AnimatePresence mode="wait">
          {heroImages.map((img, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={img} 
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover object-center"
                />
                {/* Indigo/Purple linear overlay - consistent with theme */}
                <div className="absolute inset-0 bg-linear-to-r from-indigo-900/60 via-purple-900/50 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-indigo-950/80 via-purple-900/40 to-transparent" />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Hero Content - Mobile optimized */}
        <div className="relative min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-20 md:py-24 lg:py-28">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto lg:mx-0"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8"
              >
                <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full">
                  {heroTitles[currentSlide].badge}
                </span>
                <span className="text-white/80 text-xs sm:text-sm">
                  {heroTitles[currentSlide].highlight}
                </span>
              </motion.div>

              {/* Title - White for maximum contrast */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-[1.1] text-center lg:text-left drop-shadow-lg"
              >
                {heroTitles[currentSlide].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl text-center lg:text-left mx-auto lg:mx-0 drop-shadow"
              >
                {heroTitles[currentSlide].subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12 md:mb-16 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={()=> navigate("/login")}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl text-sm sm:text-base"
                >
                  <span>{heroTitles[currentSlide].cta}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={()=> navigate("/login")}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span >Shop All</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 max-w-3xl mx-auto lg:mx-0"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="flex flex-col items-center lg:items-start"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white">
                        {stat.icon}
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow">{stat.value}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 text-center lg:text-left drop-shadow">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-10">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 sm:w-12 bg-white"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 right-12 hidden lg:block z-10"
        >
          <div className="w-12 h-20 border-2 border-white/20 rounded-full flex justify-center backdrop-blur-md">
            <div className="w-1.5 h-3 bg-white/80 rounded-full mt-4"></div>
          </div>
        </motion.div>
      </section>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key="collections"
          id="collections"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <Collections />
        </motion.div>

        <motion.div
          key="banner"
          id="sale"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <Banner />
        </motion.div>

        <motion.div
          key="trending"
          id="trending"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <Trending />
        </motion.div>

        <motion.div
          key="whyus"
          id="our-service"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <WhyUs />
        </motion.div>

        <motion.div
          key="contact"
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <Contact />
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UserDashboard;