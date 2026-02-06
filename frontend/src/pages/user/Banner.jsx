import React, { useState, useEffect } from "react";
import { useInView } from "../../hooks/useInView"; 

const Banner = () => {
  const imageSets = [
    [
      "https://i.pinimg.com/1200x/e3/b8/9d/e3b89de5a4a74dac7108c643976e0395.jpg",
      "https://i.pinimg.com/736x/12/41/75/124175833ba103a7852797ef3f0415fd.jpg",
      "https://i.pinimg.com/736x/79/9b/04/799b04c4a7cbdd7e9ee2337b5c34196b.jpg",
    ],
    [
      "https://i.pinimg.com/1200x/87/70/99/877099fbc97ec0ad897baa65fe126129.jpg",
      "https://i.pinimg.com/736x/40/a2/a8/40a2a888fe5e8d8d7a07c5b231bb123a.jpg",
      "https://i.pinimg.com/1200x/3e/84/1d/3e841d86bc724262394cd4e8295b9c3a.jpg",
    ],
    [
      "https://i.pinimg.com/736x/78/4e/2d/784e2d39bff88513ca94729cc6a1107d.jpg",
      "https://i.pinimg.com/736x/a8/bc/70/a8bc707eb79e865f1d861a3d8dcd9f83.jpg",
      "https://i.pinimg.com/1200x/fe/33/9e/fe339e45e15480ebcdc89c6956cffe2b.jpg",
    ],
  ];

  const [currentSet, setCurrentSet] = useState(0);

  // 👇 SCROLL ANIMATION HOOK
  const [ref, isVisible] = useInView({ threshold: 0.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % imageSets.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [imageSets.length]);

  return (
    <section
      ref={ref}
      className={`w-full overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 
      ${isVisible ? "opacity-100 animate-slide-up" : "opacity-0 translate-y-10"}`}
      aria-label="Promotional banner"
    >
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="relative rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch">

          {/* Left Text Area */}
          <div
            className={`md:w-1/2 flex items-center p-6 md:p-10 text-white transition-all duration-700 
            ${isVisible ? "animate-slide-left" : "opacity-0 -translate-x-10"}`}
          >
            <div>
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  Up to 50% OFF
                </span>
                <span className="text-xs opacity-80">Limited stock</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-2">
                Limited Time Sale
              </h2>

              <p className="text-sm md:text-base max-w-xl opacity-90 mb-5">
                Selected products across the store — grab them before they're gone!
              </p>

              <a
                href="#/shop"
                className="inline-block rounded-lg px-5 py-3 font-semibold bg-white text-purple-500 shadow hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right Image Area */}
          <div
            className={`md:w-1/2 relative grid grid-cols-2 grid-rows-2 gap-2 p-2 md:p-3 bg-white/5 transition-all duration-700 
            ${isVisible ? "animate-slide-right" : "opacity-0 translate-x-10"}`}
          >
            <img
              src={imageSets[currentSet][0]}
              alt="product image 1"
              className="object-cover w-full h-48 md:h-56 rounded-lg col-span-2 transition-transform duration-500 hover:scale-110"
            />

            <img
              src={imageSets[currentSet][1]}
              alt="product image 2"
              className="object-cover w-full h-40 md:h-48 rounded-lg transition-transform duration-500 hover:scale-110"
            />

            <img
              src={imageSets[currentSet][2]}
              alt="product image 3"
              className="object-cover w-full h-40 md:h-48 rounded-lg transition-transform duration-500 hover:scale-110"
            />

            <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-900 border border-white/20 shadow transition-all duration-300 hover:scale-110">
              Ends soon
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
