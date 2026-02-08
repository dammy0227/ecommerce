import { useState, useEffect } from "react";
import { loginUserThunk } from "../../features/auth/authThunk";
import { clearError } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user && token) {
      user.role === "admin"
        ? navigate("/adminDashboard", { replace: true })
        : navigate("/productDashboard", { replace: true });
    }
  }, [user, token, navigate]);

  const onChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUserThunk(input));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white lg:bg-purple-50 ">
      <div className="w-full max-w-6xl shadow-0 lg:shadow-lg bg-white rounded-2xl  overflow-hidden flex flex-col  md:grid md:grid-cols-2">
              
              <div className=" md:hidden flex flex-col items-center gap-2 py-5">
                  <h1 className="font-bold text-2xl text-purple-800">Welcome Back</h1>
                  <p className="text-gray-400">Login to your Foothub account</p>
              </div>
              


        {/* TOP / RIGHT – ILLUSTRATION */}
        <div className="relative h-70 md:h-auto w-full">
          <img
            src="https://img.freepik.com/free-photo/3d-render-secure-login-password-illustration_107791-16640.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Login illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-whites lg:bg-purple-900/40" />
        </div>

        {/* FORM */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 hidden md:block text-purple-800">Welcome Back </h2>
          <p className="text-gray-500 mb-8 hidden md:block">
            Login to your Foothub account
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {typeof error === "string"
                ? error
                : error.message || "Login failed"}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={onChange}
                required
                className="w-full mt-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={input.password}
                onChange={onChange}
                required
                className="w-full mt-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 cursor-pointer text-white  py-3 rounded-full font-medium hover:bg-purple-800 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <span
              className="text-purple-500 cursor-pointer font-medium"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
