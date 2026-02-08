import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductThunk,
  getProductsThunk,
  deleteProductThunk,
  updateProductThunk
} from "../../features/product/productThunk";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Hash,
  Palette,
  Ruler,
  Image,
  X,
  Check,
  ChevronDown,
  Upload,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Tag
} from "lucide-react";

const ProductsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    colors: [],
    sizes: [],
    images: [],
  });

  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);

  const colorOptions = ["Red", "Black", "Blue", "White", "Green", "Gray", "Purple"];
  const sizeOptions = [40, 41, 42, 43, 44, 45, 46, 47];
  const categoryOptions = [
    "Nike",
    "Adidas",
    "Puma",
    "Under Armour",
    "Reebok",
    "Asics",
    "New Balance",
    "Jordan",
    "Converse",
    "Vans"
  ];

  // Fetch products on mount
  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  // Filter products based on search and filters
  const filteredProducts = products?.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "inStock" && product.stock > 0) ||
      (stockFilter === "lowStock" && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === "outOfStock" && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Calculate statistics
  const stats = {
    totalProducts: products?.length || 0,
    totalStock: products?.reduce((sum, p) => sum + p.stock, 0) || 0,
    totalValue: products?.reduce((sum, p) => sum + (p.price * p.stock), 0) || 0,
    lowStock: products?.filter(p => p.stock > 0 && p.stock <= 10).length || 0,
    outOfStock: products?.filter(p => p.stock === 0).length || 0,
  };

  // Form handlers
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const exists = prev[name].includes(value);
      const updated = exists
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value];
      return { ...prev, [name]: updated };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      if (key === "images") {
        formData.images.forEach((file) => data.append("images", file));
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((value) => data.append(key, value));
      } else {
        data.append(key, formData[key]);
      }
    }

    if (editProduct) {
      dispatch(updateProductThunk({ id: editProduct._id, formData: data }))
        .unwrap()
        .then(() => {
          alert("Product updated successfully");
          dispatch(getProductsThunk());
        })
        .catch((err) => alert(err));
    } else {
      dispatch(createProductThunk(data))
        .unwrap()
        .then(() => {
          alert("Product added successfully");
          dispatch(getProductsThunk());
        })
        .catch((err) => alert(err));
    }

    setIsOpen(false);
    setEditProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      colors: [],
      sizes: [],
      images: [],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProductThunk(id))
        .unwrap()
        .then(() => {
          alert("Product deleted successfully");
          dispatch(getProductsThunk());
        })
        .catch((err) => alert(err));
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsOpen(true);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      colors: product.colors || [],
      sizes: product.sizes || [],
      images: [],
    });
  };

  const openAddModal = () => {
    setEditProduct(null);
    setIsOpen(true);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      colors: [],
      sizes: [],
      images: [],
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h1>
                  <p className="text-gray-600">Manage your inventory and products</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 w-fit px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>↑ 8% from last month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium">Inventory value</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-amber-600 font-medium">Need restocking</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                </div>
                <div className="w-10 h-10 bg-linear-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-red-600 font-medium">Requires attention</div>
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
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none"
                >
                  <option value="all">All Stock</option>
                  <option value="inStock">In Stock</option>
                  <option value="lowStock">Low Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Package className="w-12 h-12 text-gray-400" />
                <p className="text-gray-600">No products found</p>
                {searchQuery && (
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                )}
                <button
                  onClick={openAddModal}
                  className="mt-4 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Add Your First Product
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Variants</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {/* Product */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shrink-0">
                              {product.images?.[0]?.url ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-gray-500 truncate">
                                {product.description.length > 50 
                                  ? `${product.description.substring(0, 50)}...` 
                                  : product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Category */}
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200">
                            <Tag className="w-3 h-3 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">{product.category}</span>
                          </div>
                        </td>
                        
                        {/* Price */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
                          </div>
                        </td>
                        
                        {/* Stock */}
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                            product.stock === 0 
                              ? "bg-linear-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
                              : product.stock <= 10
                              ? "bg-linear-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200"
                              : "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
                          }`}>
                            <Hash className="w-3 h-3" />
                            <span className="text-sm font-medium">{product.stock} units</span>
                          </div>
                        </td>
                        
                        {/* Variants */}
                        <td className="p-4">
                          <div className="space-y-1">
                            {product.colors?.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Palette className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{product.colors.length} colors</span>
                              </div>
                            )}
                            {product.sizes?.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Ruler className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{product.sizes.length} sizes</span>
                              </div>
                            )}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewProduct(product)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
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
                    Showing <span className="font-medium">{filteredProducts.length}</span> of{" "}
                    <span className="font-medium">{products?.length || 0}</span> products
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

      {/* Add/Edit Product Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-gray-600">Fill in the product details below</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Form */}
            <div className="flex-1 overflow-auto p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Package className="w-4 h-4" />
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={onChange}
                      placeholder="Enter price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                {/* Category & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Tag className="w-4 h-4" />
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="w-4 h-4" />
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={onChange}
                      placeholder="Enter stock quantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Enter product description"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
                
                {/* Colors */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Palette className="w-4 h-4" />
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleMultiSelect("colors", color)}
                        className={`px-4 py-2 border rounded-lg transition-all flex items-center gap-2 ${
                          formData.colors.includes(color)
                            ? "bg-linear-to-r from-purple-50 to-blue-50 border-purple-300 text-purple-700"
                            : "border-gray-300 hover:border-purple-300"
                        }`}
                      >
                        {formData.colors.includes(color) && <Check className="w-4 h-4" />}
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sizes */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Ruler className="w-4 h-4" />
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleMultiSelect("sizes", size)}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          formData.sizes.includes(size)
                            ? "bg-linear-to-r from-purple-50 to-blue-50 border-purple-300 text-purple-700"
                            : "border-gray-300 hover:border-purple-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Images */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Image className="w-4 h-4" />
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Drag & drop images or click to browse</p>
                    <input
                      type="file"
                      name="images"
                      multiple
                      onChange={onFileChange}
                      className="w-full"
                      accept="image/*"
                    />
                    <p className="text-sm text-gray-500 mt-2">Upload up to 10 images</p>
                  </div>
                  {formData.images.length > 0 && (
                    <p className="text-sm text-green-600">
                      {formData.images.length} image(s) selected
                    </p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editProduct ? "Updating..." : "Adding..."}
                      </>
                    ) : editProduct ? (
                      <>
                        <Check className="w-5 h-5" />
                        Update Product
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{viewProduct.name}</h2>
                <p className="text-gray-600">Product Details</p>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <div className="mb-4">
                    <img
                      src={viewProduct.images?.[0]?.url || '/api/placeholder/400/400'}
                      alt={viewProduct.name}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {viewProduct.images?.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`${viewProduct.name} ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{viewProduct.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">{viewProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-bold text-gray-900">{formatCurrency(viewProduct.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className={`font-medium ${
                        viewProduct.stock === 0 
                          ? "text-red-600"
                          : viewProduct.stock <= 10
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}>
                        {viewProduct.stock} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium text-gray-900">
                        {new Date(viewProduct.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {viewProduct.colors?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Colors</h3>
                      <div className="flex gap-2">
                        {viewProduct.colors.map(color => (
                          <span
                            key={color}
                            className="px-3 py-1.5 bg-linear-to-r from-gray-50 to-gray-100 rounded-lg text-sm"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {viewProduct.sizes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Sizes</h3>
                      <div className="flex gap-2">
                        {viewProduct.sizes.map(size => (
                          <span
                            key={size}
                            className="px-3 py-1.5 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg text-sm font-medium"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;