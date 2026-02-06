import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaGooglePlay, FaAppStoreIos } from "react-icons/fa";


const Footer = () => {
  return (
    <div>
    <footer className="bg-purple-900 text-gray-300 pt-12 pb-6 px-5 h-full">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 h-full justify-center">

        {/* About Us */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">About Us</h3>
          <p className="text-sm leading-relaxed">
            We are your #1 source for premium sneakers. From classic drops to
            exclusive releases — we bring you the latest in comfort, quality,
            and authentic footwear.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Shop Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>Running Sneakers</li>
            <li>Basketball Shoes</li>
            <li>Casual & Lifestyle</li>
            <li>Limited Editions</li>
            <li>Kids Collection</li>
            <li>Sports Trainers</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact Info</h3>
          <p className="text-sm">📍 Lagos, Nigeria</p>
          <p className="text-sm">📞 +234 800 765 4321</p>
          <p className="text-sm">📧 support@sneakerhub.com</p>
        </div>

        {/* Socials + Apps */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Stay Connected</h3>
          <p className="text-sm mb-3">Follow us on social media:</p>

          <div className="flex gap-4 text-xl">
            <FaFacebook className="hover:text-purple-500 duration-300 cursor-pointer" />
            <FaTwitter className="hover:text-purple-500 duration-300 cursor-pointer" />
            <FaInstagram className="hover:text-purple-500 duration-300 cursor-pointer" />
          </div>

          <p className="text-sm mt-5">Download our app:</p>

          <div className="flex gap-3 mt-3">
            <button className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-purple-800 duration-300">
              <FaGooglePlay size={26} /> Google Play
            </button>

            <button className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-purple-800 duration-300">
              <FaAppStoreIos size={26}/> App Store
            </button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-white border-t border-white pt-6 mt-10 text-sm">
        © 2025 SneakerHub. All Rights Reserved.
      </div>
    </footer>
  
    </div>
  )
}

export default Footer

