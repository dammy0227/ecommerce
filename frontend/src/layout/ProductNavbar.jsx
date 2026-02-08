import React, { useState } from "react";
import {
  Search,
  User,
  LogOut,
  Menu,
  Bell,
  Home,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getProductsThunk } from "../features/product/productThunk";
import { logout } from "../features/auth/authSlice";

const ProductNavbar = ({ onFilterClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartCount = cart?.items?.length || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(getProductsThunk({ search: value, page: 1 }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white px-3 border-b border-gray-200 sticky top-0 z-40">
      <div className="">
        {/* ================= TOP BAR ================= */}
        <div className="h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={onFilterClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/productDashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                to="/my-orders"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600"
              >
                <Package className="w-4 h-4" />
                Orders
              </Link>
            </div>
          </div>

          {/* CENTER (DESKTOP SEARCH) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden md:block text-sm text-gray-700">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 border-t"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= MOBILE EXPANDING SEARCH ================= */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProductNavbar;
