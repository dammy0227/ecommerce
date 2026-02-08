import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getMyOrderIdThunk } from "../../features/order/orderThunk";
import { CheckCircle, Package, Truck, Home, ChevronRight, Calendar, MapPin, CreditCard, ArrowLeft } from "lucide-react";

const statusConfig = {
  processing: {
    label: "Processing",
    icon: Package,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    textColor: "text-amber-600"
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    textColor: "text-blue-600"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    textColor: "text-emerald-600"
  },
  cancelled: {
    label: "Cancelled",
    icon: "✕",
    color: "bg-red-50 border-red-200 text-red-700",
    textColor: "text-red-600"
  }
};

const paymentConfig = {
  paid: {
    label: "Paid",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "✓"
  },
  unpaid: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "…"
  },
  refunded: {
    label: "Refunded",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    icon: "↺"
  }
};

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (orderId) {
      dispatch(getMyOrderIdThunk(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading your order details...</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">!</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Unable to load order</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{error}</p>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Order not found</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const {
    items,
    totalAmount,
    shippingAddress,
    paymentStatus,
    orderStatus,
    createdAt,
    estimatedDelivery,
    orderNumber
  } = currentOrder;

  const StatusIcon = statusConfig[orderStatus]?.icon || Package;
  const isIconComponent = typeof StatusIcon !== 'string';

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = totalAmount - subtotal;

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 sm:py-8">
      {/* Mobile Back Button */}
      <div className="lg:hidden mb-4 px-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Success Header */}
        <div className="mb-6 sm:mb-10 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-r from-purple-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-sm sm:text-base px-2">
            Thank you for your purchase. We've sent a confirmation email with your order details.
          </p>
          <div className="inline-flex items-center justify-center gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 rounded-full">
            <span className="text-xs sm:text-sm font-medium text-purple-700">
              Order #{orderNumber || orderId?.slice(-8)}
            </span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-xs sm:text-sm text-gray-500">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-300 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${statusConfig[orderStatus]?.color}`}>
                    {isIconComponent ? (
                      <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <span className="text-xs">{StatusIcon}</span>
                    )}
                    <span className="font-medium capitalize">{orderStatus}</span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm ${paymentConfig[paymentStatus]?.color}`}>
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium capitalize">{paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {['processing', 'shipped', 'delivered'].map((status, index) => {
                  const isActive = ['processing', 'shipped', 'delivered'].indexOf(orderStatus) >= index;
                  const config = statusConfig[status];
                  const Icon = config.icon;
                  
                  return (
                    <div key={status} className="relative flex items-start mb-6 sm:mb-8 last:mb-0">
                      <div className={`relative z-10 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
                        isActive 
                          ? `${config.textColor} border-current bg-white` 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {typeof Icon === 'string' ? (
                          <span className="text-xs">{Icon}</span>
                        ) : (
                          <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive ? 'text-current' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <div className="ml-3 sm:ml-4 pt-0.5">
                        <p className={`font-medium text-sm sm:text-base ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {config.label}
                        </p>
                        {status === 'delivered' && orderStatus === 'delivered' && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                            Delivered on {new Date().toLocaleDateString()}
                          </p>
                        )}
                        {status === 'shipped' && orderStatus === 'shipped' && estimatedDelivery && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                            Est. delivery: {new Date(estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Ordered */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-300 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Items Ordered</h2>
              <div className="space-y-3 sm:space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item._id} 
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl ${
                      index % 2 === 0 ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                        {item.product.image ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-5 h-5 sm:w-8 sm:h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.product.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-0.5 sm:mt-1">
                          <span className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</span>
                          {item.size && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs sm:text-sm text-gray-500">Size: {item.size}</span>
                            </>
                          )}
                          {item.color && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs sm:text-sm text-gray-500">Color: {item.color}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2 sm:ml-4">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">${item.price.toFixed(2)}</p>
                      <p className="text-xs sm:text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Shipping */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-300 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-2.5 sm:pt-3 mt-2.5 sm:mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                    {paymentStatus === 'paid' ? 'Payment completed' : 'Payment pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-300 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="font-medium text-gray-900 text-sm sm:text-base">{shippingAddress.fullName}</p>
                <p className="text-gray-600 text-sm sm:text-base">{shippingAddress.address}</p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">{shippingAddress.country}</p>
                {shippingAddress.phone && (
                  <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3">📱 {shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => navigate("/productDashboard")}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/my-orders")}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-700 rounded-lg sm:rounded-xl border hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                View Order History
              </button>
              <p className="text-center text-xs text-gray-500 pt-2 sm:pt-4">
                Need help? <a className="text-purple-600 hover:text-purple-700 font-medium">Contact Support</a>
              </p>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mt-6 sm:mt-10 pt-4 sm:pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Order placed: {new Date(createdAt).toLocaleDateString()}</span>
            </div>
            {estimatedDelivery && (
              <>
                <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Est. delivery: {new Date(estimatedDelivery).toLocaleDateString()}</span>
                </div>
              </>
            )}
            <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <a className="text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm">
              Track your order
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;