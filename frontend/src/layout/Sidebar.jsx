import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineBarChart,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { useDispatch, } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* HAMBURGER BUTTON */}
      {!open && (
        <button
          className="lg:hidden fixed top-2 left-6 z-50 text-white lg:text-purple-700 cursor-pointer p-2 "
          onClick={() => setOpen(true)}
        >
          <AiOutlineMenu size={24} />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 lg:z-0
          w-72 lg:w-54 bg-linear-to-b from-purple-900 to-purple-700  md:white 
          flex flex-col transition-transform duration-300
          transform shadow-xl
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* CLOSE BUTTON - MOBILE ONLY */}
        {open && (
          <button
            className="lg:hidden self-end m-4 text-white hover:text-purple-200 transition-colors"
            onClick={() => setOpen(false)}
          >
            <AiOutlineClose size={24} />
          </button>
        )}

        {/* LOGO SECTION */}
        <div className="px-6 py-6 border-b border-purple-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-lg">FH</div>
            </div>
            <div>
              <span className="text-xl font-bold bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                FootHub
              </span>
              <p className="text-xs text-purple-300/80 mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 py-6 flex-1">
          <nav className="flex flex-col gap-2">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-purple-300 shadow-sm" 
                  : "text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <AiOutlineHome size={22} className={({ isActive }) => isActive ? "text-purple-300" : ""} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="users"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-purple-300 shadow-sm" 
                  : "text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <AiOutlineUser size={22} className={({ isActive }) => isActive ? "text-purple-300" : ""} />
              <span>Users</span>
            </NavLink>

            <NavLink
              to="products"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-purple-300 shadow-sm" 
                  : "text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <AiOutlineShoppingCart size={22} className={({ isActive }) => isActive ? "text-purple-300" : ""} />
              <span>Products</span>
            </NavLink>

            <NavLink
              to="orders"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-purple-300 shadow-sm" 
                  : "text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <AiOutlineFileText size={22} className={({ isActive }) => isActive ? "text-purple-300" : ""} />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="reports"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-purple-300 shadow-sm" 
                  : "text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <AiOutlineBarChart size={22} className={({ isActive }) => isActive ? "text-purple-300" : ""} />
              <span>Reports</span>
            </NavLink>

            <NavLink
              to="settings"
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-white/10 text-white border-l-4 border-purple-300 shadow-sm" 
                  : "text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <AiOutlineSetting size={22} className={({ isActive }) => isActive ? "text-purple-300" : ""} />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="px-4 py-6 border-t border-purple-700/50">
          <div
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-purple-100/80 hover:bg-white/5 hover:text-white hover:pl-5 group"
          >
            <AiOutlineLogout size={22} className="group-hover:text-purple-300" />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;