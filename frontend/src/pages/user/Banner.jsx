import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Gift, 
  Flame,
  ChevronRight,
  Star,
  Eye
} from "lucide-react";

const Banner = () => {
  const imageSets = [
    {
      hero: "https://i.pinimg.com/1200x/e3/b8/9d/e3b89de5a4a74dac7108c643976e0395.jpg",
      primary: "https://i.pinimg.com/736x/12/41/75/124175833ba103a7852797ef3f0415fd.jpg",
      secondary: "https://i.pinimg.com/736x/79/9b/04/799b04c4a7cbdd7e9ee2337b5c34196b.jpg",
      accent: "https://i.pinimg.com/736x/d4/cc/21/d4cc21d7799332a0111dcbf606c75ddb.jpg"
    },
    {
      hero: "https://i.pinimg.com/1200x/87/70/99/877099fbc97ec0ad897baa65fe126129.jpg",
      primary: "https://i.pinimg.com/736x/40/a2/a8/40a2a888fe5e8d8d7a07c5b231bb123a.jpg",
      secondary: "https://i.pinimg.com/1200x/3e/84/1d/3e841d86bc724262394cd4e8295b9c3a.jpg",
      accent: "https://i.pinimg.com/736x/8d/c9/a3/8dc9a33ea26a9719028b2b92504652b7.jpg"
    },
    {
      hero: "https://i.pinimg.com/736x/78/4e/2d/784e2d39bff88513ca94729cc6a1107d.jpg",
      primary: "https://i.pinimg.com/736x/a8/bc/70/a8bc707eb79e865f1d861a3d8dcd9f83.jpg",
      secondary: "https://i.pinimg.com/1200x/fe/33/9e/fe339e45e15480ebcdc89c6956cffe2b.jpg",
      accent: "https://i.pinimg.com/1200x/00/ca/04/00ca04277ef06296b5404586aea519a8.jpg"
    }
  ];

  const [currentSet, setCurrentSet] = useState(0);
  
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % imageSets.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const offers = [
    { id: "sale", label: "Flash Sale", icon: <Flame className="w-4 h-4" />, discount: "Up to 50% Off", color: "from-amber-500 to-orange-500" },
    { id: "new", label: "New Arrivals", icon: <Sparkles className="w-4 h-4" />, discount: "Just Landed", color: "from-blue-500 to-cyan-500" },
    { id: "member", label: "Members Only", icon: <Gift className="w-4 h-4" />, discount: "Extra 20% Off", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full bg-white py-8 md:py-10 overflow-hidden"
    >
      {/* Subtle architectural background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-slate-50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-t from-slate-50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
              <span className="w-12 h-px bg-slate-300" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight">
              Seasonal 
              <span className="block text-3xl md:text-4xl font-light text-slate-500 mt-3">
                Edit • 2025
              </span>
            </h2>
          </div>
          
          {/* Collection counter */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <span className="text-sm text-slate-500">Collection</span>
            <div className="flex gap-1.5">
              {imageSets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSet(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentSet
                      ? "w-8 bg-slate-900"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-900">
              {String(currentSet + 1).padStart(2, '0')} / {String(imageSets.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* Main Gallery Layout - Professional Editorial Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative aspect-4/5 overflow-hidden bg-slate-100 rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSet}
                  src={imageSets[currentSet].hero}
                  alt="Hero product"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Minimal overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent" />
              
              {/* Product tag - Appears on hover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-lg shadow-lg"
              >
                <p className="text-sm font-medium text-slate-900">Signature Edition</p>
                <p className="text-xs text-slate-500 mt-0.5">Limited to 500 pieces</p>
              </motion.div>
            </div>
            
            {/* Caption */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-slate-500">Hero piece • Featured</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">01</span>
            </div>
          </motion.div>

          {/* Right Column - Editorial Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Primary Image - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="col-span-2 relative group"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100 rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSet}
                    src={imageSets[currentSet].primary}
                    alt="Primary product"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Quick view button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg"
                >
                  <Eye className="w-4 h-4 text-slate-700" />
                </motion.button>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-500">Spring Collection</span>
                <span className="text-xs font-medium text-slate-900">$245</span>
              </div>
            </motion.div>

            {/* Secondary Image - Square */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative group"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSet}
                    src={imageSets[currentSet].secondary}
                    alt="Secondary product"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Price tag */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-medium text-slate-900">$189</span>
                </div>
              </div>
            </motion.div>

            {/* Accent Image - Square */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative group"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSet}
                    src={imageSets[currentSet].accent}
                    alt="Accent product"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* New badge */}
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs px-2 py-1 rounded-md">
                  New
                </span>
              </div>
            </motion.div>

            {/* Editorial note - spans both columns */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="col-span-2 mt-4 pt-4 border-t border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Complete the look</span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                    ))}
                  </div>
                </div>
                <button className="group flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors">
                  Shop this edit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Offer Banner - Integrated at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {offers.map((offer, i) => (
                  <div
                    key={offer.id}
                    className={`w-10 h-10 rounded-full bg-linear-to-r ${offer.color} flex items-center justify-center text-white border-2 border-white`}
                    style={{ zIndex: offers.length - i }}
                  >
                    {offer.icon}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-medium text-slate-900">Multiple offers available</h4>
                <p className="text-sm text-slate-500">Flash sale, new arrivals, and member exclusives</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Use code: EDIT25</span>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
                Apply Offer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;