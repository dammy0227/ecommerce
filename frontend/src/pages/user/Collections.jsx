import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../../features/product/productThunk";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { X, ShoppingCart, Heart, Eye, Star, Sparkles, ChevronRight } from "lucide-react";

const Collections = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    console.log("Added to cart:", selectedProduct.name, selectedSize);
    setSelectedProduct(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 14
      }
    }
  };

  return (
    <section
      ref={ref}
      className="w-full bg-white max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-16 md:py-10"
    >
      {/* Header - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6"
      >
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-purple-50 text-purple-700 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 border border-purple-200"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Best Sellers</span>
          </motion.span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-2xl tracking-tight">
            Customers'{" "}
            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              top picks
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 sm:mt-3 max-w-xl">
            Premium sneakers loved by thousands – curated for comfort and style.
          </p>
        </div>
        
        {/* Desktop view button */}
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="hidden sm:block"
        >
          
          <Link
            to="/login"
            onClick={() => alert('Please login or register to view all items')}
            className="group px-5 py-2.5 md:px-6 md:py-3.5 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2 text-sm md:text-base"
          >
            View Collection
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Products Grid - 2 columns on mobile, 4 on desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
      >
        {products.slice(0, 8).map((product, index) => {
          const outOfStock = product.stock <= 0;
          const discount = product.originalPrice 
            ? Math.round((1 - product.price / product.originalPrice) * 100) 
            : 0;
          
          return (
            <motion.div
              key={product._id}
              variants={itemVariants}
              custom={index}
              onHoverStart={() => setHoveredProduct(product._id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            >
              {/* Image Container - Adjusted height for mobile */}
              <div className="relative aspect-square sm:h-72 md:h-80 bg-gray-50 overflow-hidden">
                <img
                  src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Soft overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges - Mobile optimized */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
                  {discount > 0 && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                      -{discount}%
                    </span>
                  )}
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                      Low stock
                    </span>
                  )}
                  {product.price < 50 && !discount && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                      SALE
                    </span>
                  )}
                </div>

                {/* Price Badge - Mobile optimized */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <span className="px-2 py-1 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm text-purple-700 font-bold rounded-full shadow-md border border-white/50 text-xs sm:text-sm">
                    ${product.price}
                  </span>
                </div>

                {/* Quick Actions - Hidden on mobile, visible on hover desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredProduct === product._id ? 1 : 0,
                    y: hoveredProduct === product._id ? 0 : 10
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-4 left-4 right-4 gap-2 hidden sm:flex"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                    className="flex-1 bg-white text-gray-800 py-2.5 rounded-lg font-medium text-sm hover:bg-purple-600 hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Quick view
                  </button>
                  <button className="w-11 h-11 bg-white rounded-lg flex items-center justify-center hover:bg-purple-50 transition-colors shadow-lg">
                    <Heart 
                      className={`w-5 h-5 transition-colors ${
                        hoveredProduct === product._id ? "text-red-500 fill-red-500" : "text-gray-600"
                      }`} 
                    />
                  </button>
                </motion.div>
              </div>

              {/* Product Info - Mobile optimized */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shrink-0 ml-1">
                    <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700">4.8</span>
                  </div>
                </div>
                
                {/* Description - Hidden on mobile, visible on tablet/desktop */}
                <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
                  {product.description || "Premium sneaker – comfort meets street style."}
                </p>
                
                <div className="flex items-center justify-between mt-1 sm:mt-2">
                  {/* Reviews - Hidden on mobile */}
                  <div className="items-center gap-2 hidden sm:flex">
                    <span className="text-xs text-gray-500">★ 120+ reviews</span>
                    <span className={`text-xs font-medium ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {product.stock > 0 ? 'In stock' : 'Sold out'}
                    </span>
                  </div>
                  
                  {/* Mobile stock indicator */}
                  <span className={`text-[10px] font-medium sm:hidden ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {product.stock > 0 ? 'In stock' : 'Sold out'}
                  </span>
                  
                  <button
                    disabled={outOfStock}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium flex items-center gap-1 sm:gap-1.5 transition-all shrink-0 ${
                      outOfStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">
                      {outOfStock ? "Sold" : "Add"}
                    </span>
                    <span className="xs:hidden" onClick={()=>alert('login to get item')}>
                      {outOfStock ? "Out" : "Add"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile View All Button */}
      <div className="flex sm:hidden justify-center mt-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/shop"
            onClick={() => alert('Please login or register to view all items')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all duration-300 shadow-md inline-flex items-center gap-2 text-sm"
          >
            View Collection
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Tablet/Desktop View All Link */}
      <div className="hidden sm:flex md:hidden justify-center mt-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-purple-600 font-medium hover:text-purple-800 text-sm"
        >
          Shop all best sellers <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Product Modal - Mobile responsive */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative p-4 sm:p-6 md:p-8">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {/* Images - Mobile optimized */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-md bg-gray-50">
                      <img
                        src={selectedProduct.images?.[0]?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"}
                        alt={selectedProduct.name}
                        className="w-full h-64 sm:h-80 md:h-96 object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {selectedProduct.images?.slice(1, 4).map((img, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden shadow-sm">
                          <img 
                            src={img.url} 
                            alt="" 
                            className="w-full h-16 sm:h-20 object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Details - Mobile optimized */}
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">(4.8 · 120 reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                        ${selectedProduct.price}.00
                      </span>
                      {selectedProduct.price < 50 && (
                        <span className="text-base sm:text-lg text-gray-400 line-through">
                          ${(selectedProduct.price * 1.2).toFixed(0)}.00
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {selectedProduct.description || 
                        "Experience premium comfort and timeless style. Perfect for any rotation."}
                    </p>

                    {/* Size selector - Mobile responsive */}
                    <div>
                      <p className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                        Select Size
                        {!user && (
                          <span className="text-xs sm:text-sm text-gray-500 font-normal">
                            (Login to purchase)
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedProduct.sizes?.map((size) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!user}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-medium text-sm sm:text-base transition-all ${
                              !user
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : selectedSize === size
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-900 hover:bg-purple-100"
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* CTA - Mobile optimized */}
                    {user ? (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleAddToCart}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add to cart
                      </motion.button>
                    ) : (
                      <div className="bg-purple-50 rounded-xl p-4 sm:p-6">
                        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                          Login to purchase and unlock exclusive member pricing.
                        </p>
                        <div className="flex gap-2 sm:gap-3">
                          <Link 
                            to="/login" 
                            className="flex-1 bg-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-purple-700 transition text-center text-sm sm:text-base"
                          >
                            Login
                          </Link>
                          <Link 
                            to="/register" 
                            className="flex-1 bg-white border border-purple-300 text-purple-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-purple-50 transition text-center text-sm sm:text-base"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Collections;