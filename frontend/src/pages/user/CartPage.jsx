import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCartThunk,
  updateCartThunk,
  removeCartThunk,
} from "../../features/cart/cartThunk";
import { getProductsThunk } from "../../features/product/productThunk";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Shield,
  Truck,
  CreditCard,
  Package,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.product);

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);

  useEffect(() => {
    dispatch(getCartThunk());
    dispatch(getProductsThunk());
  }, [dispatch]);

  const getProductData = (item) => {
    if (typeof item.product === "object") return item.product;
    return products.find((p) => p._id === item.product) || null;
  };

  const getProductId = (item) =>
    typeof item.product === "object" ? item.product._id : item.product;

  const handleDecrement = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = getProductId(item);
    if (!productId) return;

    if (item.quantity === 1) {
      dispatch(
        removeCartThunk({
          productId,
          size: item.size,
          color: item.color,
        })
      );
    } else {
      dispatch(
        updateCartThunk({
          productId,
          quantity: item.quantity - 1,
          size: item.size,
          color: item.color,
        })
      );
    }
  };

  const handleIncrement = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = getProductId(item);
    if (!productId) return;

    dispatch(
      updateCartThunk({
        productId,
        quantity: item.quantity + 1,
        size: item.size,
        color: item.color,
      })
    );
  };

  const handleRemove = (item) => {
    const productId = getProductId(item);
    if (!productId) return;

    dispatch(
      removeCartThunk({
        productId,
        size: item.size,
        color: item.color,
      })
    );
    setShowRemoveConfirm(null);
  };

  const toggleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      const allItemIds = cart.items.map(item => `${getProductId(item)}-${item.size}-${item.color}`);
      setSelectedItems(new Set(allItemIds));
    }
  };

  const getSelectedTotal = () => {
    if (selectedItems.size === 0) return 0;
    
    return cart.items.reduce((total, item) => {
      const itemId = `${getProductId(item)}-${item.size}-${item.color}`;
      if (selectedItems.has(itemId)) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to load cart</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getCartThunk())}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/productDashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Continue Shopping</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">
                {cart?.items?.length || 0} item{cart?.items?.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            {cart?.items?.length > 0 && (
              <button
                onClick={selectAllItems}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {selectedItems.size === cart.items.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="lg:w-2/3">
            {!cart?.items || cart.items.length === 0 ? (
              <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
                <div className="w-24 h-24 bg-linear-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
                </p>
                <button
                  onClick={() => navigate("/productDashboard")}
                  className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const product = getProductData(item);
                  if (!product) return null;

                  const itemId = `${getProductId(item)}-${item.size}-${item.color}`;
                  const isSelected = selectedItems.has(itemId);
                  const subtotal = item.price * item.quantity;

                  return (
                    <div
                      key={itemId}
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
                        isSelected ? "ring-2 ring-purple-500 ring-offset-2" : ""
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Image & Select */}
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className={`w-5 h-5 absolute top-2 left-2 z-10 cursor-pointer ${
                                isSelected ? "bg-purple-600 border-purple-600" : "bg-white border border-gray-300"
                              } rounded flex items-center justify-center`}
                              onClick={() => toggleSelectItem(itemId)}
                              >
                                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <img
                                src={product.images?.[0]?.url || "/api/placeholder/400/400"}
                                alt={product.name}
                                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl"
                              />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                  {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {product.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" 
                                         style={{ backgroundColor: item.color?.toLowerCase() || '#ccc' }} />
                                    <span className="capitalize">{item.color}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span>Size: {item.size}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>In Stock</span>
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center border rounded-lg">
                                    <button
                                      onClick={(e) => handleDecrement(e, item)}
                                      className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium min-w-10 text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={(e) => handleIncrement(e, item)}
                                      className="px-3 py-2 hover:bg-gray-50 text-gray-600"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  <button
                                    onClick={() => setShowRemoveConfirm(itemId)}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">
                                  ${subtotal.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${item.price.toFixed(2)} each
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          {cart?.items?.length > 0 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Selected Items Summary */}
                {selectedItems.size > 0 && (
                  <div className="mb-4 p-4 bg-linear-to-r from-purple-50 to-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Selected Items</span>
                      <span className="text-sm font-semibold text-purple-700">
                        {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Selected Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${getSelectedTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* All Items Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                    <span className="font-medium">${cart.totalAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${cart.totalAmount?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm text-gray-500">
                        or 4 interest-free payments
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-4"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                {/* Security Features */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>

          
            </div>
          )}
        </div>

        {/* Remove Confirmation Modal */}
        {showRemoveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Remove Item</h3>
                <button
                  onClick={() => setShowRemoveConfirm(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRemoveConfirm(null)}
                  className="flex-1 px-4 py-2.5 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const item = cart.items.find(item => 
                      `${getProductId(item)}-${item.size}-${item.color}` === showRemoveConfirm
                    );
                    if (item) handleRemove(item);
                  }}
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;