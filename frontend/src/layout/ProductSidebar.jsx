// src/layout/ProductSidebar.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getProductsThunk } from "../features/product/productThunk";
import { logout } from "../features/auth/authSlice";
import {
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Palette,
  Ruler,
  DollarSign,
  RefreshCw,
  Star,
  Truck,
  Shield,
  LogOut,
  ShoppingBag,
} from "lucide-react";

// -------------------- DATA --------------------
const categories = [
  { name: "Nike", icon: "✓", color: "bg-gradient-to-r from-black to-gray-800" },
  { name: "Adidas", icon: "✕", color: "bg-gradient-to-r from-blue-600 to-black" },
  { name: "Puma", icon: "⚡", color: "bg-gradient-to-r from-red-600 to-black" },
  { name: "Under Armour", icon: "🏃", color: "bg-gradient-to-r from-purple-600 to-black" },
  { name: "Reebok", icon: "⚡", color: "bg-gradient-to-r from-blue-400 to-gray-800" },
  { name: "Asics", icon: "🏆", color: "bg-gradient-to-r from-red-400 to-blue-600" },
  { name: "New Balance", icon: "N", color: "bg-gradient-to-r from-gray-800 to-black" },
];

const colors = [
  { name: "Red", value: "red", hex: "#EF4444" },
  { name: "Black", value: "black", hex: "#000000" },
  { name: "Blue", value: "blue", hex: "#3B82F6" },
  { name: "White", value: "white", hex: "#FFFFFF", border: "border" },
  { name: "Green", value: "green", hex: "#10B981" },
  { name: "Purple", value: "purple", hex: "#8B5CF6" },
];

const sizes = [6, 7, 8, 9, 10, 11, 12];

// -------------------- FILTER SECTION --------------------
const FilterSection = ({ title, icon, isOpen, onToggle, children }) => {
  const Icon = icon;

  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-3"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && <div className="pl-6">{children}</div>}
    </div>
  );
};

// -------------------- MAIN SIDEBAR --------------------
const ProductSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [openSections, setOpenSections] = useState({
    category: true,
    color: true,
    size: true,
    price: true,
    features: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const applyFilter = (filters) => {
    dispatch(getProductsThunk({ ...filters, page: 1 }));
    onClose?.(); // auto-close on mobile
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedColor("");
    setSelectedSize("");
    setSelectedPrice("");
    dispatch(getProductsThunk({ page: 1 }));
    onClose?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="relative z-50 h-full bg-white border-r overflow-y-auto px-6  md:w-64 w-full flex flex-col gap-3">
      
      {/* MOBILE HEADER */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-50 p-2">
        <Link to="/productDashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            FootHub
          </span>
        </Link>

        {/* ✅ FIXED CLOSE ICON */}
        <button
          onClick={onClose}
          className=" rounded-lg hover:bg-gray-100 md:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* CATEGORY */}
      <FilterSection title="Category" icon={Tag} isOpen={openSections.category} onToggle={() => toggleSection("category")}>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                const newCat = selectedCategory === cat.name ? "" : cat.name;
                setSelectedCategory(newCat);
                applyFilter({ category: newCat, color: selectedColor, size: selectedSize, priceOrder: selectedPrice });
              }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                selectedCategory === cat.name
                  ? "bg-purple-50 border border-purple-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                <span className="text-white font-bold">{cat.icon}</span>
              </div>
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* COLOR */}
      <FilterSection title="Color" icon={Palette} isOpen={openSections.color} onToggle={() => toggleSection("color")}>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                const newColor = selectedColor === color.value ? "" : color.value;
                setSelectedColor(newColor);
                applyFilter({ category: selectedCategory, color: newColor, size: selectedSize, priceOrder: selectedPrice });
              }}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50"
            >
              <div
                className={`w-8 h-8 rounded-full mb-1 ${color.border || ""}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs">{color.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* SIZE */}
      <FilterSection title="Size" icon={Ruler} isOpen={openSections.size} onToggle={() => toggleSection("size")}>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                const newSize = selectedSize === size ? "" : size;
                setSelectedSize(newSize);
                applyFilter({ category: selectedCategory, color: selectedColor, size: newSize, priceOrder: selectedPrice });
              }}
              className="w-12 h-12 rounded-lg border hover:border-purple-400"
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* RESET */}
      <button
        onClick={resetFilters}
        className="w-full mt-6 px-4 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Reset All Filters
      </button>

      {/* MOBILE LOGOUT */}
      <div className="mt-8 pt-6 border-t md:hidden">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProductSidebar;
