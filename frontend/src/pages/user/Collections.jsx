import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../../features/product/productThunk";
import { useInView } from "../../hooks/useInView";
import { Link } from "react-router-dom";

const Collections = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  const [ref, isVisible] = useInView({ threshold: 0.2 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

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

  return (
    <section
      ref={ref}
      className={`max-w-7xl mx-auto px-4 py-7 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl md:text-4xl font-bold text-gray-700">
          Best <span className="text-purple-600">Sellers</span>
        </h2>
        <Link
          className="text-sm md:text-base text-purple-600 hover:underline" 
          onClick={()=>alert('Please login or register to view all items')}
        >
          View all
        </Link>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.slice(0, 8).map((product) => {
          const outOfStock = product.stock <= 0;
          return (
            <div
              key={product._id}
              onClick={() => !outOfStock && setSelectedProduct(product)}
              className={`relative group rounded-lg overflow-hidden shadow cursor-pointer transition hover:shadow-lg ${
                outOfStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {/* IMAGE */}
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-64 md:h-72 lg:h-100 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/30 to-transparent" />

              {/* TEXT OVER IMAGE */}
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold text-sm md:text-base truncate w-40 md:w-48">
                  {product.name}
                </p>
                <p className="text-xs md:text-sm text-gray-200 line-clamp-2 w-40 md:w-48">
                  {product.description}
                </p>
                <p className="mt-1 font-bold text-sm md:text-base">${product.price}.00</p>
              </div>

              {/* QUICK VIEW BUTTON */}
              {!outOfStock && (
                <button
                  className="absolute bottom-4 right-4 bg-white text-purple-700 px-4 py-1 rounded-full
                   text-xs md:text-sm "
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  Quick View
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-3xl font-bold text-gray-700"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* IMAGES */}
              <div className="space-y-3 md:w-1/2">
                {selectedProduct.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={selectedProduct.name}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* DETAILS */}
              <div className="flex-1 space-y-4 md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-2xl font-bold text-purple-600">
                  ${selectedProduct.price}.00
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {selectedProduct.description || "No description available."}
                </p>

                {/* SIZES */}
                <div>
                  <p className="font-semibold mb-2">Available Sizes</p>
                  {!user && (
                    <p className="text-xs text-gray-500 italic mb-2">
                      Login to select size and purchase
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes?.map((size) => (
                      <button
                        key={size}
                        disabled={!user}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          !user
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : selectedSize === size
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {user ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      Login or create an account to continue shopping
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to="/login"
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg text-sm font-semibold"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Collections;
