import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  ShoppingBag, 
  Filter, 
  Search, 
  Star, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Eye,
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import { getProductsThunk } from "../../features/product/productThunk";
import { addCartThunk, getCartThunk } from "../../features/cart/cartThunk";

const ProductList = () => {
  const dispatch = useDispatch();
 
  const { products, loading, totalPages } = useSelector(
    (state) => state.product
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);


  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    dispatch(getProductsThunk({ page }));
    dispatch(getCartThunk());
  }, [dispatch, page]);

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize && selectedProduct?.sizes?.length > 0) {
      alert("Please choose a size!");
      return;
    }

    dispatch(
      addCartThunk({
        productId: selectedProduct._id,
        quantity,
        size: selectedSize || selectedProduct.sizes?.[0] || "One Size",
        color: selectedColor || selectedProduct.colors?.[0] || "Default",
      })
    ).then(() => {
      dispatch(getCartThunk());
      setSelectedProduct(null);
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
    });
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Products</h1>
            </div>
          </div>

        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isInWishlist = wishlist.has(product._id);

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border-gray-600 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0]?.url || '/api/placeholder/400/400'}
                    alt={product.name}
                    className="w-full h-34 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product._id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </button>
                  
                  {/* Quick View */}
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize(null);
                      setSelectedColor(null);
                    }}
                    className="absolute top-12 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {/* Stock Badge */}
                  {isOutOfStock && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Out of Stock
                    </div>
                  )}
                  
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      Only {product.stock} left
                    </div>
                  )}
                  
                  {product.isNew && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      New Arrival
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {getRatingStars(product.rating || 4)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setSelectedSize(null);
                        setSelectedColor(null);
                      }}
                      disabled={isOutOfStock}
                      className={`p-2 rounded-lg transition-colors ${
                        isOutOfStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    page === pageNum
                      ? "bg-purple-600 text-white"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Images */}
                  <div className="lg:w-1/2">
                    <div className="sticky top-0">
                      <img
                        src={selectedProduct.images?.[0]?.url || '/api/placeholder/600/600'}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover rounded-xl mb-4"
                      />
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.images?.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={`${selectedProduct.name} ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="lg:w-1/2 space-y-6">
                    {/* Price & Rating */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ${selectedProduct.price}
                        </span>
                        {selectedProduct.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ${selectedProduct.originalPrice}
                          </span>
                        )}
                        {selectedProduct.discountPercentage && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                            -{selectedProduct.discountPercentage}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getRatingStars(selectedProduct.rating || 4)}
                        <span className="text-gray-600">
                          ({selectedProduct.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                    
                    {/* Size Selection */}
                    {selectedProduct.sizes?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 border rounded-lg transition-all ${
                                selectedSize === size
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "hover:border-purple-300"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Color Selection */}
                    {selectedProduct.colors?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                                selectedColor === color
                                  ? "border-purple-600 bg-purple-50"
                                  : "hover:border-purple-300"
                              }`}
                            >
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span className="capitalize">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quantity & Stock */}
                    <div className="flex items-center gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
                        <div className="flex items-center border rounded-lg w-32">
                          <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-3 py-2 hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center py-2">{quantity}</span>
                          <button
                            onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                            className="px-3 py-2 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">{selectedProduct.stock}</span> in stock
                        </p>
                        <p className="text-green-600">
                          {selectedProduct.stock > 10 ? "✓ Usually ships in 24h" : "✓ Limited stock"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-linear-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => toggleWishlist(selectedProduct._id, e)}
                        className={`px-6 py-3 border rounded-lg transition-colors ${
                          wishlist.has(selectedProduct._id)
                            ? "border-red-300 bg-red-50 text-red-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlist.has(selectedProduct._id) ? "fill-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Product Details */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">SKU</p>
                          <p>{selectedProduct.sku || "N/A"}</p>
                        </div>
                        <div>
                          <p className="font-medium">Category</p>
                          <p className="capitalize">{selectedProduct.category || "General"}</p>
                        </div>
                        <div>
                          <p className="font-medium">Material</p>
                          <p>{selectedProduct.material || "High-quality materials"}</p>
                        </div>
                        <div>
                          <p className="font-medium">Weight</p>
                          <p>{selectedProduct.weight || "Varies"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;