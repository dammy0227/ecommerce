import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMyOrderThunk,
  cancelOrderThunk,
} from "../../features/order/orderThunk";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  SortAsc,
  ShoppingBag,
} from "lucide-react";

const statusConfig = {
  processing: {
    label: "Processing",
    icon: Clock,
    color: "bg-amber-50 border-amber-100 text-amber-700",
    badgeColor: "bg-amber-500",
    action: "Cancel",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-blue-50 border-blue-100 text-blue-700",
    badgeColor: "bg-blue-500",
    action: "Track",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-emerald-50 border-emerald-100 text-emerald-700",
    badgeColor: "bg-emerald-500",
    action: "Review",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-50 border-red-100 text-red-700",
    badgeColor: "bg-red-500",
    action: null,
  },
};

const paymentConfig = {
  paid: {
    label: "Paid",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    icon: "✓",
  },
  unpaid: {
    label: "Pending",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    icon: "…",
  },
  refunded: {
    label: "Refunded",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    icon: "↺",
  },
};

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrderThunk());
  }, [dispatch]);

  const handleCancelOrder = (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      dispatch(cancelOrderThunk(orderId));
    }
  };

  const handleOrderAction = (orderId, status) => {
    switch (status) {
      case "processing":
        handleCancelOrder(orderId);
        break;
      case "shipped":
        navigate(`/track-order/${orderId}`);
        break;
      case "delivered":
        navigate(`/review/${orderId}`);
        break;
      default:
        navigate(`/order/${orderId}`);
    }
  };

  const getItemCount = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // const getOrderStatusIcon = (status) => {
  //   const Icon = statusConfig[status]?.icon || Package;
  //   return <Icon className="w-4 h-4" />;
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <ShoppingBag className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Your Orders
          </h3>
          <p className="text-gray-600">
            We're fetching your order history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Orders
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(getMyOrderThunk())}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-linear-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
          <p className="text-gray-600 mb-2">
            When you place orders, they'll appear here with all their details.
          </p>
          <p className="text-gray-500 text-sm mb-8">Ready to start shopping?</p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-sm hover:shadow-md inline-flex items-center gap-2"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-600 mt-2">
                You have {orders.length} order{orders.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                Sort
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((o) => o.orderStatus === "processing").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter((o) => o.orderStatus === "delivered").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const status = statusConfig[order.orderStatus];
            
            // ✅ Safe payment lookup with fallback
            const payment =
              paymentConfig[order.paymentStatus] || {
                label: order.paymentStatus || "Unknown",
                color: "text-gray-600",
                bgColor: "bg-gray-100",
                icon: "?",
              };

            const Icon = status?.icon || Package;
            const itemCount = getItemCount(order.items);

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Status Banner */}
                <div className={`px-5 py-3 ${status.color} border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-semibold capitalize">
                        {order.orderStatus}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${payment.bgColor} ${payment.color}`}
                    >
                      {payment.label}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-5">
                  {/* Order ID & Date */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Order Number
                      </p>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="font-mono text-sm font-semibold text-gray-900 truncate">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Preview Items */}
                  {order.items.slice(0, 2).map((item, index) => (
                    <div
                      key={item._id}
                      className={`flex items-center gap-3 text-sm p-3 rounded-lg ${
                        index % 2 === 0 ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity} • ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-center text-xs text-gray-500 mt-2">
                      +{order.items.length - 2} more item
                      {order.items.length - 2 !== 1 ? "s" : ""}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t space-y-2">
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="w-full px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/button"
                    >
                      <Eye className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
                      View Details
                    </button>

                    {status.action && (
                      <button
                        onClick={() =>
                          handleOrderAction(order._id, order.orderStatus)
                        }
                        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium transition-colors ${
                          order.orderStatus === "processing"
                            ? "text-red-600 border-red-200 hover:bg-red-50"
                            : "text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {status.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-gray-600 mb-6">
            Need help with an order?{" "}
            <a
              
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Contact Support
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/productDashboard")}
              className="px-6 py-2.5 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
