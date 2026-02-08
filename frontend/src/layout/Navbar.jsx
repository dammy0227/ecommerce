import React, { useState } from "react";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <header className="w-full border-b border-gray-300 bg-purple-700 fixed
      flex items-center lg:justify-between justify-end px-6 py-3 md:hidden ">

      <h2 className="hidden lg:block  text-purple-800">Welcome back Admin</h2>

      <div className="flex items-center space-x-4">
        <button className="relative bg-white rounded-2xl p-1">
          <FiBell size={20} color="purple" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-1 rounded-full bg-white 
          text-gray-800 dark:text-white"
        >
          {darkMode ? <FiSun size={20} color="purple"/> : <FiMoon size={20} color="purple"/>}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
