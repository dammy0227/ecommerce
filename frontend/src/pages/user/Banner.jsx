import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Tag, Zap } from "lucide-react";

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
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % imageSets.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [imageSets.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-linear-to-r from-purple-900 via-purple-800 to-blue-900 py-16 md:py-24"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg"
                >
                  <Tag className="w-4 h-4 inline mr-1" />
                  Limited Time Offer
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-white/20"
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Up to 50% OFF
                </motion.span>
              </div>

              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-bold text-white mb-4"
              >
                Flash Sale
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300">
                  Ends Soon!
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-gray-300 text-lg mb-6"
              >
                Grab your favorite sneakers at unbeatable prices. 
                Selected products across the store — hurry before they're gone!
              </motion.p>

              {/* Countdown Timer */}
              <motion.div
                variants={itemVariants}
                className="flex gap-4 mb-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl font-bold text-white">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">Hours</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl font-bold text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">Minutes</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl font-bold text-white">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">Seconds</span>
                </div>
              </motion.div>

              <motion.a
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 w-fit"
              >
                Shop Now
                <Clock className="w-5 h-5" />
              </motion.a>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              variants={itemVariants}
              className="lg:w-1/2 p-4 lg:p-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSet}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 gap-3 h-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="col-span-2 rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={imageSets[currentSet][0]}
                      alt="Featured product"
                      className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </motion.div>
                  
                  {[1, 2].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={imageSets[currentSet][i]}
                        alt={`Product ${i + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default Banner;