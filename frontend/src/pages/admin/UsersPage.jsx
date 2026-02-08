import { useEffect, useState } from "react";
import { getAllUserThunk } from "../../features/user/userThunk";
import { getAllOrdersThunk } from "../../features/order/orderThunk";
import { useSelector, useDispatch } from "react-redux";
import {
  Users,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Calendar,
  CreditCard,
  Package,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";

const UsersPage = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  const { loading: userLoading, error: userError, allUsers, profile } = useSelector((state) => state.user);
  const { allOrders, loading: orderLoading, error: orderError } = useSelector((state) => state.order);

  useEffect(() => {
    if (profile?.role === "admin") {
      dispatch(getAllUserThunk());
      dispatch(getAllOrdersThunk());
    }
  }, [dispatch, profile]);

  const filteredUsers = allUsers?.filter(user => user.role !== "admin") || [];

  const getLatestOrder = (userId) => {
    const userOrders = allOrders?.filter(order => order.user?._id === userId) || [];
    if (!userOrders.length) return null;
    return userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

  const getOrderStats = (userId) => {
    const userOrders = allOrders?.filter(order => order.user?._id === userId) || [];
    const completedOrders = userOrders.filter(order => order.orderStatus === "delivered").length;
    const totalSpent = userOrders
      .filter(order => order.paymentStatus === "paid")
      .reduce((acc, order) => acc + order.totalAmount, 0);
    
    return { totalOrders: userOrders.length, completedOrders, totalSpent };
  };

  // Filter users based on search and filters
  const filteredAndSearchedUsers = filteredUsers.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const latestOrder = getLatestOrder(user._id);
    let matchesStatus = true;
    let matchesDate = true;
    
    if (statusFilter !== "all" && latestOrder) {
      matchesStatus = latestOrder.orderStatus === statusFilter;
    }
    
    if (dateFilter !== "all" && latestOrder) {
      const orderDate = new Date(latestOrder.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") matchesDate = daysDiff === 0;
      else if (dateFilter === "week") matchesDate = daysDiff <= 7;
      else if (dateFilter === "month") matchesDate = daysDiff <= 30;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const getStatusIcon = (status) => {
    switch(status) {
      case "processing": return <Clock className="w-4 h-4" />;
      case "shipped": return <Package className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen pt-20 p-2 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600">Manage and monitor all registered customers</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Export</span>
              </button>
              
              <button className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm">
                Add User
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>↑ 12% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredUsers.filter(user => {
                      const order = getLatestOrder(user._id);
                      return order && order.orderStatus === "processing";
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-amber-600 font-medium">3 pending review</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredUsers.filter(user => {
                      const order = getLatestOrder(user._id);
                      if (!order) return false;
                      const orderDate = new Date(order.createdAt);
                      const today = new Date();
                      return orderDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium">Active users</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredUsers.filter(user => {
                      const order = getLatestOrder(user._id);
                      if (!order) return true;
                      const orderDate = new Date(order.createdAt);
                      const today = new Date();
                      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
                      return daysDiff > 30;
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-gray-100 to-slate-100 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 font-medium">No activity in 30+ days</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Order Stats</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Latest Order</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {(userLoading || orderLoading) ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-2 text-gray-600">Loading users...</p>
                    </td>
                  </tr>
                ) : (userError || orderError) ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <span>{userError || orderError}</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSearchedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-600">No users found</p>
                        {searchTerm && (
                          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSearchedUsers.map((user) => {
                    const latestOrder = getLatestOrder(user._id);
                    const orderStats = getOrderStats(user._id);
                    
                    return (
                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {/* Customer */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-purple-600">
                                {user.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.fullName || "Unnamed User"}</p>
                              <p className="text-xs text-gray-500">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Contact */}
                        <td className="p-4">
                          <div>
                            <p className="text-gray-900">{user.email}</p>
                            <p className="text-sm text-gray-500">
                              {user.phone || "No phone number"}
                            </p>
                          </div>
                        </td>
                        
                        {/* Order Stats */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Orders:</span>
                              <span className="font-medium text-gray-900">{orderStats.totalOrders}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Completed:</span>
                              <span className="font-medium text-green-600">{orderStats.completedOrders}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Total Spent:</span>
                              <span className="font-medium text-purple-600">{formatCurrency(orderStats.totalSpent)}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Latest Order Status */}
                        <td className="p-4">
                          {latestOrder ? (
                            <div className="space-y-2">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(latestOrder.orderStatus)}`}>
                                {getStatusIcon(latestOrder.orderStatus)}
                                <span className="text-sm font-medium capitalize">{latestOrder.orderStatus}</span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(latestOrder.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-gray-400 text-sm">No orders yet</span>
                              <span className="text-xs text-gray-500">User hasn't placed any orders</span>
                            </div>
                          )}
                        </td>
                        
                        {/* Payment Status */}
                        <td className="p-4">
                          {latestOrder ? (
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getPaymentColor(latestOrder.paymentStatus)}`}>
                              <CreditCard className="w-4 h-4" />
                              <span className="text-sm font-medium capitalize">{latestOrder.paymentStatus}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                        
                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit User">
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete User">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredAndSearchedUsers.length}</span> of{" "}
                <span className="font-medium">{filteredUsers.length}</span> customers
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
        </div>
      </div>
    </div>
  );
};

export default UsersPage;