import React, { useState } from "react";
import ProductNavbar from "./ProductNavbar";
import ProductSidebar from "./ProductSidebar";

const ProductLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">

      {/* NAVBAR */}
      {/* <ProductNavbar onFilterClick={() => setIsSidebarOpen(true)} /> */}

      <div className="flex flex-1 overflow-hidden">

        {/* MOBILE OVERLAY */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
      <div
  className={`
    fixed md:static z-50 bg-white
    h-full
    top-0 md:top-0
    w-[250px]
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>
  <ProductSidebar onClose={() => setIsSidebarOpen(false)} />
</div>


        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-auto  bg-gray-50">
                <ProductNavbar onFilterClick={() => setIsSidebarOpen(true)} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
