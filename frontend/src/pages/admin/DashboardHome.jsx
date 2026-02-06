import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserThunk } from "../../features/user/userThunk";
import { getProductsThunk } from "../../features/product/productThunk";
import { getMyOrderThunk } from "../../features/order/orderThunk";
import { getCartThunk, getAllCartsThunk } from "../../features/cart/cartThunk";
import { getAllOrdersThunk } from "../../features/order/orderThunk";
import DashboardChart from "./DashboardChart";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Sun,
  Moon,
  Search,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Target,
  Activity,
  Filter
} from "lucide-react";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("month");
  const [darkMode, setDarkMode] = useState(false);

  const { profile, allUsers } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);
  const { orders, allOrders } = useSelector((state) => state.order);
  const { cart, adminCarts } = useSelector((state) => state.cart);

  // Fetch data
  useEffect(() => {
    dispatch(getProductsThunk());
    if (profile?.role === "admin") {
      dispatch(getAllUserThunk());
      dispatch(getAllOrdersThunk());
      dispatch(getAllCartsThunk());
    } else {
      dispatch(getMyOrderThunk());
      dispatch(getCartThunk());
    }
  }, [dispatch, profile]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // Determine which orders to use
  const ordersList = profile?.role === "admin" ? allOrders || [] : orders || [];

  // Filter orders by period
  const filterOrdersByRange = (range) => {
    const now = new Date();
    return ordersList.filter((order) => {
      const date = new Date(order.createdAt);
      if (range === "day") return date.toDateString() === now.toDateString();
      if (range === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return date >= startOfWeek && date <= now;
      }
      if (range === "month")
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      if (range === "year") return date.getFullYear() === now.getFullYear();
      return false;
    });
  };

  const filtered = filterOrdersByRange(filter);

  // Calculate stats
  const pendingOrders = ordersList.filter((o) => o.orderStatus === "processing").length;
  const completedOrders = ordersList.filter((o) => o.orderStatus === "delivered").length;
  const cancelledOrders = ordersList.filter((o) => o.orderStatus === "cancelled").length;
  const totalSales = ordersList.filter((o) => o.orderStatus === "delivered").length;
  const totalRevenue = ordersList
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const summary = {
    period:
      filter === "day" ? "Today" : filter === "week" ? "This Week" : filter === "month" ? "This Month" : "This Year",
    totalOrders: filtered.length,
    paidOrders: filtered.filter((o) => o.paymentStatus === "paid").length,
    pendingOrders: filtered.filter((o) => o.paymentStatus !== "paid").length,
    revenue: filtered.filter((o) => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalAmount, 0),
  };

  summary.avgOrderValue = summary.paidOrders > 0 ? summary.revenue / summary.paidOrders : 0;

  // Best-selling product
  const productCount = {};
  filtered.forEach((order) => {
    order.items.forEach((item) => {
      const name = item.productName || item.product?.name || "Unknown";
      productCount[name] = (productCount[name] || 0) + item.quantity;
    });
  });

  summary.bestProduct =
    Object.keys(productCount).length > 0
      ? Object.entries(productCount).sort((a, b) => b[1] - a[1])[0][0]
      : "-";

  // Stats cards data
  const statsCards = [
    {
      title: "Total Users",
      value: allUsers?.filter((u) => u.role !== "admin").length || 0,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-linear-to-r from-purple-50 to-pink-50",
      change: "+12.5%",
      trend: "up"
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-linear-to-r from-blue-50 to-cyan-50",
      change: "+8.2%",
      trend: "up"
    },
    {
      title: "Total Sales",
      value: totalSales,
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-linear-to-r from-green-50 to-emerald-50",
      change: "+24.7%",
      trend: "up"
    },
    {
      title: "Active Carts",
      value: profile?.role === "admin"
        ? adminCarts?.filter((c) => c.items?.length > 0).length || 0
        : cart?.items?.length || 0,
      icon: ShoppingBag,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-linear-to-r from-amber-50 to-orange-50",
      change: "+5.3%",
      trend: "up"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-linear-to-r from-red-50 to-rose-50",
      change: "+18.4%",
      trend: "up"
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "from-indigo-500 to-violet-500",
      bgColor: "bg-linear-to-r from-indigo-50 to-violet-50",
      change: "+3.2%",
      trend: "up"
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-linear-to-r from-emerald-50 to-teal-50",
      change: "+15.8%",
      trend: "up"
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders,
      icon: XCircle,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-linear-to-r from-gray-50 to-slate-50",
      change: "-2.1%",
      trend: "down"
    }
  ];

  // Filter buttons
  const filterButtons = [
    { id: "day", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-5 md:gap-3 mb-2">
                <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-md bg-purple-400">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-600">
                    Welcome back, Admin! Here's what's happening with your store today.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search analytics..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm w-64"
                />
              </div>

              {/* Filter Button */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Filter</span>
              </button>

              {/* Notification & Dark Mode */}
              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors hidden md:flex">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors hidden md:flex"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders + completedOrders}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-purple-600 font-medium">↑ 15% from last month</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${filterOrdersByRange("month").filter(o => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-pink-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-pink-600 font-medium">↑ 24% from last month</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products?.length > 0 ? ((totalSales / products.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium">↑ 8% from last month</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.trend === "up" 
                      ? "bg-linear-to-r from-purple-50  text-purple-700 border border-purple-200"
                      : "bg-linear-to-r from-purple-50  text-purple-700 border border-purple-200"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full bg-linear-to-r ${stat.color}`}
                      style={{ width: `${Math.min(100, (stat.value / 100) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Revenue Analytics</h2>
                <p className="text-gray-600">Track your sales performance over time</p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="w-8 h-8 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Real-time data</span>
              </div>
            </div>
            <DashboardChart orders={ordersList} />
          </div>
        </div>

        {/* Sales Summary Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sales Summary</h2>
                <p className="text-gray-600">Filter by time period for detailed insights</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filter === btn.id
                        ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Period</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Orders</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Paid</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Pending</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Best Seller</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">{summary.period.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900">{summary.period}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">{summary.totalOrders}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-green-600">
                      ${summary.revenue.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{summary.paidOrders}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">{summary.pendingOrders}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200">
                      <Target className="w-3 h-3 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">{summary.bestProduct}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-blue-600">
                      ${summary.avgOrderValue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="p-5 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">Filtered Period</p>
                <p className="text-lg font-semibold text-gray-900">{summary.period}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Revenue (Filtered)</p>
                <p className="text-lg font-bold text-green-600">${summary.revenue.toFixed(2)}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-lg font-semibold text-purple-600">
                  {summary.totalOrders > 0 ? ((summary.paidOrders / summary.totalOrders) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for white smoke background */}
      <style jsx>{`
        .smoker-bg {
          background-color: #f5f5f5;
        }
        @media (prefers-color-scheme: dark) {
          .smoker-bg {
            background-color: #1a1a1a;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;