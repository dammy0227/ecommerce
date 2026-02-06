import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  profileThunk,
  updateProfileThunk,
} from "../../features/user/userThunk";
import { clearUserError } from "../../features/user/userSlice";
import {
  User,
  Mail,
  Save,
  ArrowLeft,
  Shield,
  CheckCircle,
  Key,
  Bell,
  Camera,
  AlertCircle,
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, error, successMessage } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile once
  useEffect(() => {
    dispatch(profileThunk());
  }, [dispatch]);

  // Initialize form data when profile loads and not editing
  useEffect(() => {
    if (profile && !isEditing) {
      const initFormData = () => {
        setFormData({
          fullName: profile.fullName ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          address: profile.address ?? "",
        });
      };
      initFormData();
    }
  }, [profile, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileThunk(formData));
    setIsEditing(false);
  };


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearUserError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const menuItems = [
    { icon: User, label: "Profile Information", active: true },
    { icon: Key, label: "Password & Security" },
    { icon: Bell, label: "Notifications" },
    { icon: Shield, label: "Privacy Settings" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/productDashboard")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shopping</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-2">
                Manage your profile and preferences
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border flex items-center justify-center hover:bg-gray-50">
                      <Camera className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {formData.fullName || "User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formData.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          item.active
                            ? "bg-linear-to-r from-purple-50 to-blue-50 text-purple-600 border border-purple-100"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium">
                  <Shield className="w-5 h-5" />
                  Account Security
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Update your personal details and contact information
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        if (profile) {
                          setFormData({
                            fullName: profile.fullName ?? "",
                            email: profile.email ?? "",
                            phone: profile.phone ?? "",
                            address: profile.address ?? "",
                          });
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="px-6 pt-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700">Update Failed</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700">
                        Profile Updated
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isEditing
                          ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isEditing
                          ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Bell className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isEditing
                          ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Shield className="w-4 h-4" />
                      Shipping Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                        isEditing
                          ? "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      placeholder="Enter your complete shipping address"
                    />
                  </div>
                </div>

                {/* Save Button (Mobile) */}
                {isEditing && (
                  <div className="mt-8 pt-6 border-t md:hidden">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>

              {/* Account Info */}
              <div className="p-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not available"}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Account Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
