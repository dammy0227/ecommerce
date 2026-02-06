import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileThunk } from "./features/user/userThunk";
import Login from "./pages/auth/Login";
import Register2 from "./pages/auth/Register2";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import DashboardHome from "./pages/admin/DashboardHome";
import ReportPage from "./pages/admin/ReportPage";
import SettingsPage from "./pages/admin/SettingsPage";
import OrderDetails from "./pages/admin/OrderDetails";
import Products from "./pages/user/Products";
import CartPage from "./pages/user/CartPage";
import OrderPage from "./pages/user/OrderPage"; 
import OrderConfirmationPage from "./pages/user/OrderConfirmationPage"; 
import MyOrdersPage from "./pages/user/MyOrdersPage";
import ProfilePage from "./pages/user/ProfilePage";

const App = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch user profile when app loads if token exists
    const token = localStorage.getItem("token");
    if (token && !profile) {
      dispatch(profileThunk());
    }
  }, [dispatch, profile]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register2 />} />

        {/* Admin Routes - Protected */}
        <Route path="/adminDashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* User Routes */}
        <Route path="/" element={<UserDashboard />} />
        <Route path="/productDashboard" element={<Products />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<OrderPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;