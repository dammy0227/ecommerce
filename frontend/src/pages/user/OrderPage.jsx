import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrderThunk } from "../../features/order/orderThunk";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Package,
  Shield,
  Lock,
  CheckCircle,
  MapPin,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  Loader2
} from "lucide-react";

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const {   error } = useSelector((state) => state.order);

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);

  const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan"];

  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
    }
  }, [error]);

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-linear-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add items to your cart to proceed with checkout.
          </p>
          <button
            onClick={() => navigate("/productDashboard")}
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;

    if (!shipping.fullName.trim()) errors.fullName = "Full name is required";
    if (!shipping.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(shipping.email)) errors.email = "Invalid email format";
    if (!shipping.phone.trim()) errors.phone = "Phone number is required";
    else if (!phoneRegex.test(shipping.phone.replace(/\D/g, ''))) errors.phone = "Invalid phone number";
    if (!shipping.address.trim()) errors.address = "Address is required";
    if (!shipping.city.trim()) errors.city = "City is required";
    if (!shipping.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!shipping.country.trim()) errors.country = "Country is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
     const orderData = {
  shippingAddress: shipping,
  paymentMethod: paymentMethod === "stripe" ? "Stripe" : "Stripe",
  saveAddressForFuture: saveAddress,
};

      

      const result = await dispatch(createOrderThunk(orderData)).unwrap();
      navigate(`/order/${result.order._id}`);
    } catch (error) {
      console.error("Order placement failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const subtotal = cart.totalAmount || 0;
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Cart</span>
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-2">
                Complete your order in 3 simple steps
              </p>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <span className="font-medium text-gray-900">Shipping</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-semibold">2</span>
                </div>
                <span className="font-medium text-gray-500">Payment</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-semibold">3</span>
                </div>
                <span className="font-medium text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 hrink-0" />
    <div>
      <p className="font-medium text-red-800">Order placement failed</p>
      <p className="text-sm text-red-600 mt-1">
        {typeof error === "string"
          ? error
          : error?.message || "Something went wrong. Please try again."}
      </p>
    </div>
  </div>
)}


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="lg:w-2/3 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                  <p className="text-sm text-gray-500">We'll use this to send order updates</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.fullName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shipping.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                  <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shipping.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="123 Main St"
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={shipping.apartment}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shipping.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.city ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="New York"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shipping.postalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.postalCode ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="10001"
                    />
                    {formErrors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={shipping.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.country ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {formErrors.country && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Save this address for future orders</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">How would you like to pay?</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "stripe" ? "border-purple-600 bg-purple-50" : "border-gray-300 hover:border-purple-300"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500 mt-1">Pay securely with Stripe</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-5 bg-gray-900 rounded-sm"></div>
                        <div className="w-8 h-5 bg-blue-600 rounded-sm"></div>
                        <div className="w-8 h-5 bg-red-600 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "cod" ? "border-purple-600 bg-purple-50" : "border-gray-300 hover:border-purple-300"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                      </div>
                      <Truck className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={item.product?.images?.[0]?.url || "/api/placeholder/80/80"}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.product?.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-500">
                          {item.size && <span className="mr-2">Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Including all taxes</div>
                  </div>
                </div>
              </div>

              {/* Security & Guarantees */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By placing your order, you agree to our{" "}
                <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
              </p>
            </div>

            {/* Need Help Card */}
            <div className="mt-6 bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need help with your order?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call us: 1-800-SHOP-HUB
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email: support@shophub.com
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Live chat available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage; 