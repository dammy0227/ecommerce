import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyOrderIdThunk,
  updateOrderStatusThunk,
  updateOrderPaymentThunk,
  cancelOrderThunk,
} from "../../features/order/orderThunk";
import {
  ArrowLeft,
  Package,
  CreditCard,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Edit,
  Download,
  Printer,
  MessageSquare,
  MoreVertical,
  ChevronDown
} from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, loading } = useSelector((state) => state.order);

  const [isPaymentUpdating, setIsPaymentUpdating] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    dispatch(getMyOrderIdThunk(orderId));
  }, [dispatch, orderId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentOrder.orderStatus) return;
    
    setIsStatusUpdating(true);
    try {
      await dispatch(
        updateOrderStatusThunk({ orderId, orderStatus: newStatus })
      );
      await dispatch(getMyOrderIdThunk(orderId));
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update order status");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handlePaymentUpdate = async () => {
    if (!window.confirm("Mark this order as paid?")) return;
    setIsPaymentUpdating(true);
    try {
      await dispatch(updateOrderPaymentThunk(orderId));
      await dispatch(getMyOrderIdThunk(orderId));
    } catch (error) {
      console.error("Payment update failed:", error);
      alert("Failed to update payment status");
    } finally {
      setIsPaymentUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setIsCanceling(true);
    try {
      await dispatch(cancelOrderThunk(orderId));
      await dispatch(getMyOrderIdThunk(orderId));
    } catch (error) {
      console.error("Cancel order failed:", error);
      alert("Failed to cancel order");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Order confirmation email resent successfully!");
    } catch (error) {
      alert("Failed to resend confirmation", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleSaveNotes = () => {
    // Save notes logic here
    console.log("Saving notes:", adminNotes);
    alert("Notes saved successfully!");
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "processing": return "bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200";
      case "shipped": return "bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200";
      case "delivered": return "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
      case "cancelled": return "bg-linear-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
      default: return "bg-linear-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch(status) {
      case "paid": return "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
      case "pending": return "bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200";
      case "failed": return "bg-linear-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
      case "refunded": return "bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200";
      default: return "bg-linear-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "processing": return <Clock className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusTransitions = {
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const nextStatuses = statusTransitions[currentOrder?.orderStatus] || [];

  const isPaymentDisabled =
    isPaymentUpdating || isCanceling || currentOrder?.isPaid || currentOrder?.orderStatus === "cancelled";
  const isCancelDisabled =
    isCanceling || isPaymentUpdating || ["shipped", "delivered", "cancelled"].includes(currentOrder?.orderStatus);
  const isStatusDisabled =
    isStatusUpdating || ["delivered", "cancelled"].includes(currentOrder?.orderStatus);

  if (loading || !currentOrder) {
    return (
      <div className="min-h-screen bg-white smoker-bg p-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const address = order.shippingAddress;

  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = order.shippingFee || 0;
  const tax = order.taxAmount || 0;
  const discount = order.discountAmount || 0;
  const total = order.totalAmount || 0;

  return (
    <div className="min-h-screen pt-20 p-2 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Orders</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Print</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Export</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
                    <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-sm font-medium capitalize">{order.orderStatus}</span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getPaymentColor(order.paymentStatus)}`}>
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{order.paymentStatus}</span>
                  </div>
                  {order.paymentMethod && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-gray-50 to-slate-50 rounded-full border border-gray-200">
                      <span className="text-sm font-medium text-gray-700">{order.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.items?.length || 0} items • {order.user?.fullName || "Guest"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                <p className="text-gray-600">Products included in this order</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={`${item.product?._id || "item"}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shrink-0">
                              {item.product?.images?.[0]?.url ? (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.product?.name || "Product"}</p>
                              <p className="text-sm text-gray-500">SKU: {item.product?.sku || "N/A"}</p>
                              {item.size && (
                                <p className="text-xs text-gray-500">Size: {item.size}</p>
                              )}
                              {item.color && (
                                <p className="text-xs text-gray-500">Color: {item.color}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.quantity}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Order Summary */}
              <div className="p-6 border-t border-gray-200">
                <div className="max-w-md ml-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">{formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Contact Information</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">{order.user?.fullName || "Guest Customer"}</p>
                      <p className="text-gray-600">{order.user?.email || "No email provided"}</p>
                      <p className="text-gray-600">{order.user?.phone || "No phone provided"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    </div>
                    {address ? (
                      <div className="space-y-1">
                        <p className="text-gray-900">{address.address}</p>
                        <p className="text-gray-900">{address.city}, {address.state} {address.postalCode}</p>
                        <p className="text-gray-900">{address.country}</p>
                        <p className="text-sm text-gray-500">Phone: {address.phone || "Not provided"}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No shipping address provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Admin Actions */}
          <div className="space-y-6">
            {/* Order Status Update */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
                <p className="text-gray-600">Update the order status</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="font-medium capitalize">{order.orderStatus}</span>
                  </div>
                </div>
                
                {nextStatuses.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <div className="relative">
                      <select
                        value={order.orderStatus}
                        onChange={handleStatusChange}
                        disabled={isStatusDisabled}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                      >
                        <option value={order.orderStatus}>Keep as {order.orderStatus}</option>
                        {nextStatuses.map((status) => (
                          <option key={status} value={status}>
                            Change to {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {isStatusUpdating && (
                      <p className="text-sm text-gray-600 mt-2">Updating status...</p>
                    )}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Resend Confirmation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                <p className="text-gray-600">Manage payment status</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border ${getPaymentColor(order.paymentStatus)}`}>
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium capitalize">{order.paymentStatus}</span>
                </div>
                
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                  </div>
                )}
                
                {order.paymentStatus === "pending" && (
                  <button
                    onClick={handlePaymentUpdate}
                    disabled={isPaymentDisabled}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                      isPaymentDisabled
                        ? "bg-linear-to-r from-green-200 to-emerald-200 text-green-400 cursor-not-allowed"
                        : "bg-linear-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                    }`}
                  >
                    {isPaymentUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Paid</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-6 space-y-3">
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelDisabled}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                    isCancelDisabled
                      ? "bg-linear-to-r from-red-200 to-rose-200 text-red-400 cursor-not-allowed"
                      : "bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700"
                  }`}
                >
                  {isCanceling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Order</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>{showNotes ? "Hide Notes" : "Add Admin Notes"}</span>
                </button>
                
                {showNotes && (
                  <div className="pt-3 border-t border-gray-100">
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes about this order..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <button
                      onClick={handleSaveNotes}
                      className="mt-2 w-full px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Save Notes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-linear-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-linear-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-500">Processing payment</p>
                    </div>
                  </div>
                  
                  {order.updatedAt !== order.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-linear-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;