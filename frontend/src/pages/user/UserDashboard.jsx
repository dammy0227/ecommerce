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
  Heart
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
  "https://i.pinimg.com/1200x/81/62/23/8162238e43796fc1161b5e88948ec1d2.jpg",
  "https://i.pinimg.com/1200x/12/7f/17/127f1751bedef95dfb1120d338faea9d.jpg",
  "https://i.pinimg.com/736x/6e/70/10/6e7010c4731967d6eb954b6e1ae52b09.jpg"
];

const heroTitles = [
  {
    title: "Step Into Style",
    subtitle: "Premium sneakers crafted for comfort and performance",
    cta: "Explore Collection",
    highlight: "Limited Edition"
  },
  {
    title: "New Arrivals",
    subtitle: "Latest designs from top brands. Limited stock available",
    cta: "Shop Now",
    highlight: "Just Dropped"
  },
  {
    title: "Summer Collection",
    subtitle: "Lightweight sneakers perfect for any adventure",
    cta: "Discover More",
    highlight: "Up to 40% Off"
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

const stats = [
  { value: "500+", label: "Products", icon: <ShoppingBag className="w-5 h-5" /> },
  { value: "50+", label: "Brands", icon: <Star className="w-5 h-5" /> },
  { value: "24h", label: "Delivery", icon: <Truck className="w-5 h-5" /> },
  { value: "100%", label: "Authentic", icon: <Shield className="w-5 h-5" /> }
];

const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(5);
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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-gray-50">
      {/* HEADER */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* LOGO with animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <ShoppingBag className="w-6 h-6 text-white" />
              </motion.div>
              <span
                className={`text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ${
                  scrolled ? "" : "text-white"
                }`}
              >
                FootHub
              </span>
            </Link>
          </motion.div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className={`font-medium text-sm transition-all hover:text-purple-400 relative group ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 relative"
            >
              <Search className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/login")}
              className="p-2 hidden sm:block relative group"
            >
              <User className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 relative"
            >
              <ShoppingCart className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-linear-to-r from-purple-600 to-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
              >
                3
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 relative hidden sm:block"
            >
              <Heart className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
              >
                {wishlistCount}
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? "text-gray-700" : "text-white"}`} />
              )}
            </motion.button>
          </div>
        </div>

        {/* MOBILE MENU with animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl mx-4 mt-4 overflow-hidden border border-gray-100"
            >
              <div className="p-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 px-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {heroImages.map((img, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
              >
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent" />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* HERO CONTENT */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full mb-6"
              >
                ✨ {heroTitles[currentSlide].highlight}
              </motion.span>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-white mb-4"
              >
                {heroTitles[currentSlide].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-200 mb-4"
              >
                {heroTitles[currentSlide].subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 mb-8"
              >
                Discover exclusive styles, premium brands & limited stock online. 
                Free shipping on orders over $100.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 flex-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
                >
                  {heroTitles[currentSlide].cta}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  View All Products
                </motion.button>
              </motion.div>

              {/* STATS */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-12 grid grid-cols-4 gap-6"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2 text-white"
                    >
                      {stat.icon}
                    </motion.div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-300">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 right-8 hidden lg:block"
        >
          <div className="w-10 h-16 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full mt-3"></div>
          </div>
        </motion.div>
      </section>

      {/* Other Sections with Scroll Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <Collections />
      </motion.div>

      <motion.div
        id="offer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <Banner />
      </motion.div>

      <motion.div
        id="trending"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <Trending />
      </motion.div>

      <motion.div
        id="our-service"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <WhyUs />
      </motion.div>

      <motion.div
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <Contact />
      </motion.div>

      <Footer />
    </div>
  );
};

export default UserDashboard;