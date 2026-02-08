import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { saveAs } from "file-saver";
import {
  Download,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Calendar,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Award,
  Shield,
  CheckCircle
} from "lucide-react";

import { getProductsThunk } from "../../features/product/productThunk";
import { getAllOrdersThunk } from "../../features/order/orderThunk";
import { getAllUserThunk } from "../../features/user/userThunk";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Utility: format date YYYY-MM-DD
const formatDate = (d) => {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Build array of last N dates
const lastNDates = (n) => {
  const arr = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(formatDate(d));
  }
  return arr;
};

// CSV helper
const toCSV = (rows, headers = []) => {
  const headerRow = headers.length ? headers.join(",") + "\n" : "";
  return (
    headerRow +
    rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n")
  );
};

// Safe object property check
const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const ReportPage = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = React.useState("30");
  const [isExporting, setIsExporting] = React.useState(false);

  useEffect(() => {
    dispatch(getProductsThunk());
    dispatch(getAllOrdersThunk());
    dispatch(getAllUserThunk());
  }, [dispatch]);

  // Redux slices
  const products = useSelector((state) => state.product.products || []);
  const orders = useSelector((state) => state.order.allOrders || []);
  const users = useSelector((state) => state.user.allUsers || []);

  const loading = useSelector(
    (state) =>
      state.product.loading || state.order.loading || state.user.loading
  );

  const normalUsers = useMemo(() => users.filter((u) => u.role !== "admin"), [users]);
  const today = useMemo(() => new Date(), []);
  const daysCount = useMemo(() => parseInt(dateRange, 10), [dateRange]);

  const {
    revenueChart,
    orderStatusData,
    paymentStatusData,
    topProducts,
    lowStock,
    userGrowthData,
    stats
  } = useMemo(() => {
    const days = lastNDates(daysCount);

    // Calculate stats
    const paidOrders = orders.filter(o => o.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount ?? 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = normalUsers.length;

    // Revenue Chart
    const revenueMap = Object.fromEntries(days.map((d) => [d, 0]));
    orders.forEach((o) => {
      const dateKey = formatDate(o.createdAt || today);
      const total = Number(o.totalAmount ?? 0);
      if (dateKey in revenueMap && o.paymentStatus === "paid") {
        revenueMap[dateKey] += total;
      }
    });

    const revenueChart = {
      labels: days,
      datasets: [
        {
          label: "Revenue",
          data: days.map((d) => +revenueMap[d].toFixed(2)),
          fill: true,
          tension: 0.4,
          backgroundColor: "rgba(124, 58, 237, 0.1)",
          borderColor: "rgba(124, 58, 237, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(124, 58, 237, 1)",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };

    // Orders by Status
    const statusCounts = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    
    orders.forEach((o) => {
      const status = o.orderStatus ?? "unknown";
      if (hasOwnProperty(statusCounts, status)) {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      }
    });

    const orderStatusData = {
      labels: ["Processing", "Shipped", "Delivered", "Cancelled"],
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            "rgba(245, 158, 11, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderColor: [
            "rgb(245, 158, 11)",
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(239, 68, 68)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // Payment Status
    const paymentCounts = {
      paid: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
    };
    
    orders.forEach((o) => {
      const payment = o.paymentStatus ?? "unknown";
      if (hasOwnProperty(paymentCounts, payment)) {
        paymentCounts[payment] = (paymentCounts[payment] || 0) + 1;
      }
    });

    const paymentStatusData = {
      labels: Object.keys(paymentCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      datasets: [
        { 
          data: Object.values(paymentCounts), 
          backgroundColor: [
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(59, 130, 246, 0.8)",
          ],
          borderColor: [
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(239, 68, 68)",
            "rgb(59, 130, 246)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // Top Products
    const prodQty = {};
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const pid = it.product?._id || it.product || "unknown";
        const name = it.product?.name || it.productName || "Unnamed";
        const qty = Number(it.quantity ?? 0);
        if (!prodQty[pid]) prodQty[pid] = { name, qty: 0 };
        prodQty[pid].qty += qty;
      });
    });
    
    const topProductsArr = Object.entries(prodQty)
      .map(([id, v]) => ({ id, name: v.name, qty: v.qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    const topProducts = {
      labels: topProductsArr.map((p) => p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name),
      datasets: [
        { 
          label: "Units Sold", 
          data: topProductsArr.map((p) => p.qty), 
          backgroundColor: "rgba(124, 58, 237, 0.8)",
          borderColor: "rgb(124, 58, 237)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };

    // Low-stock products
    const lowStock = products
      .filter((p) => typeof p.stock === "number" && p.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);

    // User Growth
    const userDays = lastNDates(daysCount);
    const userMap = Object.fromEntries(userDays.map((d) => [d, 0]));
    normalUsers.forEach((u) => {
      const dateKey = formatDate(u.createdAt || today);
      if (dateKey in userMap) userMap[dateKey] += 1;
    });
    
    const userGrowthData = {
      labels: userDays,
      datasets: [
        { 
          label: "New Users", 
          data: userDays.map((d) => userMap[d]), 
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Additional metrics
    const conversionRate = totalUsers > 0 ? (paidOrders.length / totalUsers * 100).toFixed(1) : 0;
    const avgOrderValue = paidOrders.length > 0 ? (totalRevenue / paidOrders.length).toFixed(2) : 0;

    const stats = {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      conversionRate,
      avgOrderValue,
      paidOrders: paidOrders.length,
      pendingOrders: orders.filter(o => o.orderStatus === "processing").length,
      lowStockCount: lowStock.length,
    };

    return {
      revenueChart,
      orderStatusData,
      paymentStatusData,
      topProducts,
      lowStock,
      userGrowthData,
      stats
    };
  }, [products, orders, normalUsers, today, daysCount]);

  const handleExportCSV = () => {
    setIsExporting(true);
    
    try {
      const orderRows = orders.map((o) => [
        o._id,
        o.user?.fullName ?? "",
        formatDate(o.createdAt ?? today),
        o.orderStatus ?? "",
        o.paymentStatus ?? "",
        o.totalAmount ?? 0,
      ]);

      const productRows = products.map((p) => [
        p._id,
        p.name ?? "",
        p.category ?? "",
        p.price ?? "",
        Array.isArray(p.sizes) ? p.sizes.join("|") : p.sizes ?? "",
        Array.isArray(p.colors) ? p.colors.join("|") : p.colors ?? "",
        p.stock ?? 0,
      ]);

      const userRows = normalUsers.map((u) => [
        u._id,
        u.fullName ?? u.name ?? "",
        u.email ?? "",
        formatDate(u.createdAt ?? today),
      ]);

      const csvParts = [];
      csvParts.push("=== ORDERS ===\n");
      csvParts.push(
        toCSV(orderRows, ["Order ID", "Customer", "Date", "Status", "Payment", "Total"])
      );
      csvParts.push("\n\n=== PRODUCTS ===\n");
      csvParts.push(
        toCSV(productRows, ["Product ID", "Name", "Category", "Price", "Sizes", "Colors", "Stock"])
      );
      csvParts.push("\n\n=== USERS ===\n");
      csvParts.push(toCSV(userRows, ["User ID", "Name", "Email", "Registered At"]));

      const blob = new Blob(csvParts, { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `reports_${formatDate(today)}.csv`);
      
      setTimeout(() => setIsExporting(false), 1500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    dispatch(getProductsThunk());
    dispatch(getAllOrdersThunk());
    dispatch(getAllUserThunk());
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 6,
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading analytics...</p>
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
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-gray-600">Comprehensive insights into your business performance</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="180">Last 6 months</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>↑ 24% from last period</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-purple-600 font-medium">{stats.paidOrders} paid</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-blue-600 font-medium">{stats.conversionRate}% conversion</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.avgOrderValue}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-amber-600 font-medium">Per customer</div>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-600">Daily revenue over selected period</p>
              </div>
              <div className="w-8 h-8 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="h-64">
              <Line data={revenueChart} options={chartOptions} />
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-600">New user registrations over time</p>
              </div>
              <div className="w-8 h-8 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="h-64">
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Status Distribution</h3>
                <p className="text-sm text-gray-600">Breakdown by current status</p>
              </div>
              <div className="w-8 h-8 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="h-64">
              <Pie data={orderStatusData} options={chartOptions} />
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Payment Status</h3>
                <p className="text-sm text-gray-600">Payment completion overview</p>
              </div>
              <div className="w-8 h-8 bg-linear-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="h-64">
              <Doughnut data={paymentStatusData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
                  <p className="text-sm text-gray-600">Most popular items by units sold</p>
                </div>
                <div className="w-8 h-8 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="h-64">
                <Bar data={topProducts} options={{
                  ...chartOptions,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Low Stock & Quick Stats */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Low Stock Alert</h3>
                  <p className="text-sm text-gray-600">Products needing restock (≤ 5 units)</p>
                </div>
                <div className="w-8 h-8 bg-linear-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
              </div>
              
              <div className="space-y-3">
                {lowStock.length > 0 ? (
                  lowStock.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.category || 'Uncategorized'}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        p.stock === 0 
                          ? 'bg-linear-to-r from-red-50 to-rose-50 text-red-700 border border-red-200'
                          : p.stock <= 2
                          ? 'bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200'
                          : 'bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200'
                      }`}>
                        {p.stock} units
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-600">All products are well-stocked!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <div className="text-center p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-xl font-bold text-gray-900">{stats.lowStockCount}</p>
                </div>
                <div className="text-center p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-xl font-bold text-gray-900">{stats.conversionRate}%</p>
                </div>
                <div className="text-center p-3 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;