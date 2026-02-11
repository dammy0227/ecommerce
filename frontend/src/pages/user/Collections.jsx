import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../../features/product/productThunk";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { X, ShoppingCart, Heart, Eye } from "lucide-react";

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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section
      ref={ref}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full mb-4">
            Shop Now
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Best <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Sellers</span>
          </h2>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => alert('Please login or register to view all items')}
          >
            View All
          </Link>
        </motion.div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.slice(0, 8).map((product, index) => {
          const outOfStock = product.stock <= 0;
          return (
            <motion.div
              key={product._id}
              variants={itemVariants}
              custom={index}
              onHoverStart={() => setHoveredProduct(product._id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                outOfStock ? "opacity-60" : ""
              }`}
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProduct === product._id ? 1 : 0 }}
                  className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"
                />

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hoveredProduct === product._id ? 1 : 0,
                    y: hoveredProduct === product._id ? 0 : 20
                  }}
                  className="absolute bottom-4 left-4 right-4 flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="flex-1 bg-white text-purple-600 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                  </motion.button>
                </motion.div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.price < 50 && (
                    <span className="px-3 py-1 bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                      SALE
                    </span>
                  )}
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="px-3 py-1 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-purple-600 font-bold rounded-lg shadow-lg">
                    ${product.price}.00
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(120)</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={outOfStock}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                      outOfStock
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    } transition-colors`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {outOfStock ? "Out of Stock" : "Add"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <div className="relative p-6 md:p-8">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Images */}
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={selectedProduct.images?.[0]?.url}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedProduct.images?.slice(1, 4).map((img, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden shadow-md">
                          <img
                            src={img.url}
                            alt={`${selectedProduct.name} ${idx + 2}`}
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-lg">★</span>
                          ))}
                        </div>
                        <span className="text-gray-600">(4.8 · 120 reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-purple-600">
                        ${selectedProduct.price}.00
                      </span>
                      {selectedProduct.price < 50 && (
                        <span className="text-lg text-gray-400 line-through">
                          ${(selectedProduct.price * 1.2).toFixed(0)}.00
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {selectedProduct.description || "Experience premium comfort and style with this exclusive sneaker. Designed for both performance and fashion, it's perfect for any occasion."}
                    </p>

                    {/* Sizes */}
                    <div>
                      <p className="font-semibold mb-3 flex items-center gap-2">
                        Select Size
                        <span className="text-sm text-gray-500 font-normal">
                          {user ? "" : "(Login to purchase)"}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes?.map((size) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!user}
                            onClick={() => setSelectedSize(size)}
                            className={`w-14 h-14 rounded-xl font-semibold transition-all ${
                              !user
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : selectedSize === size
                                ? "bg-purple-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-900 hover:bg-purple-100"
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    {user ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </motion.button>
                    ) : (
                      <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                        <p className="text-gray-700 mb-4">
                          Login to purchase this item and unlock exclusive deals!
                        </p>
                        <div className="flex gap-3">
                          <Link
                            to="/login"
                            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                          >
                            Login
                          </Link>
                          <Link
                            to="/register"
                            className="flex-1 bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center"
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