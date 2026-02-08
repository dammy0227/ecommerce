import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrdersThunk } from "../../features/order/orderThunk";
import { filterOrders, resetFilter } from "../../features/order/orderSlice";
import {
  Package,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  CreditCard,
  ChevronDown,
  TrendingUp,
  BarChart3,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  ArrowUpDown
} from "lucide-react";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { allOrders, loading } = useSelector((state) => state.order);
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    if (profile?.role === "admin") {
      dispatch(getAllOrdersThunk());
    }
  }, [dispatch, profile]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      dispatch(resetFilter());
    } else {
      dispatch(filterOrders(value));
    }
  };

  const handleViewOrder = (id) => {
    navigate(`/adminDashboard/orders/${id}`);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    if (!allOrders) return [];
    
    let filtered = [...allOrders];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        if (dateFilter === "today") {
          return orderDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "week") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          return orderDate >= startOfWeek && orderDate <= now;
        }
        if (dateFilter === "month") {
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "priceHigh") {
        return b.totalAmount - a.totalAmount;
      }
      if (sortBy === "priceLow") {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });
    
    return filtered;
  }, [allOrders, searchTerm, statusFilter, dateFilter, sortBy]);

  // Calculate statistics
  const stats = {
    totalOrders: allOrders?.length || 0,
    totalRevenue: allOrders?.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0) || 0,
    pendingOrders: allOrders?.filter(o => o.orderStatus === "processing").length || 0,
    deliveredOrders: allOrders?.filter(o => o.orderStatus === "delivered").length || 0,
    cancelledOrders: allOrders?.filter(o => o.orderStatus === "cancelled").length || 0,
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "priceLow", label: "Price: Low to High" }
  ];

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Show loading if profile not loaded yet
  if (!profile && loading) {
    return (
      <div className="min-h-screen  p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (profile && profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-white smoker-bg p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You must be an administrator to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 p-2 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
                  <p className="text-gray-600">View and manage all customer orders</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Export</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Refresh</span>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>↑ 12% this month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium">↑ 18% from last month</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-amber-600 font-medium">Requires attention</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium">Completed successfully</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-red-600 font-medium">Requires review</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer, status, or payment..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ArrowUpDown className="h-5 w-5 text-gray-400" />
                </div>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredAndSortedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Package className="w-12 h-12 text-gray-400" />
                <p className="text-gray-600">No orders found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Order Details</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Total</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {filteredAndSortedOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {/* Order Details */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">#{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(order.createdAt)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items?.length || 0} items
                            </p>
                          </div>
                        </td>
                        
                        {/* Customer */}
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.user?.fullName || "Guest Customer"}
                            </p>
                            <p className="text-sm text-gray-600">{order.user?.email || "No email"}</p>
                            <p className="text-xs text-gray-500">
                              {order.shippingAddress?.city || "Location not specified"}
                            </p>
                          </div>
                        </td>
                        
                        {/* Total */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                          </div>
                          {order.discountAmount > 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              -{formatCurrency(order.discountAmount)} discount
                            </p>
                          )}
                        </td>
                        
                        {/* Order Status */}
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus === "processing" && <Clock className="w-4 h-4" />}
                            {order.orderStatus === "shipped" && <Truck className="w-4 h-4" />}
                            {order.orderStatus === "delivered" && <CheckCircle className="w-4 h-4" />}
                            {order.orderStatus === "cancelled" && <XCircle className="w-4 h-4" />}
                            <span className="text-sm font-medium capitalize">{order.orderStatus}</span>
                          </div>
                        </td>
                        
                        {/* Payment Status */}
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getPaymentColor(order.paymentStatus)}`}>
                            <CreditCard className="w-4 h-4" />
                            <span className="text-sm font-medium capitalize">{order.paymentStatus}</span>
                          </div>
                          {order.paymentMethod && (
                            <p className="text-xs text-gray-600 mt-1">
                              {order.paymentMethod}
                            </p>
                          )}
                        </td>
                        
                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewOrder(order._id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View</span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredAndSortedOrders.length}</span> of{" "}
                    <span className="font-medium">{allOrders?.length || 0}</span> orders
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm">
                      1
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;