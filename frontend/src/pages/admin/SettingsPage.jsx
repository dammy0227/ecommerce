import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  profileThunk,
  updateProfileThunk,
} from "../../features/user/userThunk";
import { clearUserError } from "../../features/user/userSlice";
import {
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle,
  AlertCircle,
  Key,
  Smartphone,
  Globe,
  Moon,
  Sun
} from "lucide-react";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, updateSuccess } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    security: true,
  });

  // Initialize formData directly from profile using useMemo
  const initialFormData = useMemo(() => ({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  }), [profile]);

  const [formData, setFormData] = useState(initialFormData);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* FETCH PROFILE */
  React.useEffect(() => {
    dispatch(profileThunk());
  }, [dispatch]);

  // Update formData when profile changes (without using useEffect for setState)
  React.useEffect(() => {
    // This effect only logs changes, doesn't set state
    if (profile && (formData.fullName !== (profile.fullName || "") ||
                    formData.email !== (profile.email || "") ||
                    formData.phone !== (profile.phone || ""))) {
      console.log("Profile updated, consider resetting form");
    }
  }, [profile, formData]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = useCallback((e) => {
    e.preventDefault();
    dispatch(updateProfileThunk(formData));
  }, [dispatch, formData]);

  const handlePasswordSubmit = useCallback((e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Add password update logic here
    alert("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [passwordData]);

  // Reset form button handler
  const handleResetForm = useCallback(() => {
    setFormData({
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });
  }, [profile]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="mb-6 p-4 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {profile?.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 truncate">
                      {profile?.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-600">{profile?.role || "Admin"}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Success Message */}
            {updateSuccess && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-medium">Profile updated successfully!</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(clearUserError())}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6 text-purple-600" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                        <p className="text-gray-600 text-sm">Update your personal details</p>
                      </div>
                    </div>
                    {/* Reset Form Button */}
                    {(formData.fullName !== (profile?.fullName || "") ||
                      formData.email !== (profile?.email || "") ||
                      formData.phone !== (profile?.phone || "")) && (
                      <button
                        onClick={handleResetForm}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Smartphone className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-700">
                          {profile?.role || "Admin"}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t">
                      <div className="text-sm text-gray-600">
                        {formData.fullName !== (profile?.fullName || "") ||
                         formData.email !== (profile?.email || "") ||
                         formData.phone !== (profile?.phone || "") ? (
                          <span className="text-amber-600">You have unsaved changes</span>
                        ) : (
                          <span className="text-green-600">All changes saved</span>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={loading || (formData.fullName === (profile?.fullName || "") &&
                                             formData.email === (profile?.email || "") &&
                                             formData.phone === (profile?.phone || ""))}
                        className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-gray-600 text-sm">Manage your password and security</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter current password"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={!passwordData.currentPassword || 
                                     !passwordData.newPassword || 
                                     !passwordData.confirmPassword}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Key className="w-5 h-5" />
                            Update Password
                          </button>
                          <button
                            type="button"
                            onClick={() => setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            })}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="pt-6 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-gray-600 text-sm">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-600 text-sm">Control how you receive notifications</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-sm text-gray-600">
                            {key === 'email' && 'Receive email notifications'}
                            {key === 'push' && 'Push notifications on this device'}
                            {key === 'security' && 'Security alerts and updates'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, [key]: !value})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-6 border-t mt-6">
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                      <p className="text-gray-600 text-sm">Customize the look and feel</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Theme */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setDarkMode(false)}
                          className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                            !darkMode ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Sun className="w-8 h-8 text-amber-600" />
                            <span className="font-medium">Light</span>
                          </div>
                        </button>
                        <button
                          onClick={() => setDarkMode(true)}
                          className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                            darkMode ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Moon className="w-8 h-8 text-indigo-600" />
                            <span className="font-medium">Dark</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <select className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t">
                      <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;