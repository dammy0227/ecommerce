import React from "react";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

const Contact = () => {
  return (
    <div className="py-10 px-5 bg-gray-100 flex justify-center">
      {/* Main card */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-[1400px] grid md:grid-cols-2">

        {/* LEFT SIDE IMAGE */}
        <div className="w-full h-[300px] md:h-auto">
          <img
            src="https://i.pinimg.com/736x/d4/cc/21/d4cc21d7799332a0111dcbf606c75ddb.jpg"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-5">
            Get in Touch
          </h2>

          <form
            action="mailto:fatunsindamilare1@gmail.com"
            method="GET"
            encType="text/plain"
          >
            {/* NAME */}
            <div className="mb-4">
              <label className="text-sm font-semibold">Name</label>
              <input
                type="text"
                name="Name"
                required
                className="w-full p-3 border rounded-md mt-1 focus:outline-purple-500"
                placeholder="Enter your name"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                name="Email"
                required
                className="w-full p-3 border rounded-md mt-1 focus:outline-purple-500"
                placeholder="Enter your email"
              />
            </div>

            {/* MESSAGE */}
            <div className="mb-4">
              <label className="text-sm font-semibold">Message</label>
              <textarea
                name="Message"
                rows="5"
                required
                className="w-full p-3 border rounded-md mt-1 focus:outline-purple-500"
                placeholder="Write your message..."
              ></textarea>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Send Message
            </button>
          </form>

          {/* CONTACT INFO */}
          <div className="mt-6 space-y-2 text-gray-600">
            <p className="flex items-center gap-2">
              <AiOutlineMail className="text-xl" /> example@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <AiOutlinePhone className="text-xl" /> +234 81 2345 6789
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
