import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaMedal,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaCheckCircle,
  FaStar,
  FaTruck,
  FaUndo
} from "react-icons/fa";

const WhyUs = () => {
  const [activeCard, setActiveCard] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const cards = [
    {
      id: 1,
      icon: <FaMedal />,
      title: "Premium Quality",
      text: "Every product is thoroughly inspected to ensure the highest standards of durability, style, and performance.",
      color: "from-purple-500 to-pink-500",
      stats: "100% Authentic"
    },
    {
      id: 2,
      icon: <FaShippingFast />,
      title: "Lightning Fast Delivery",
      text: "Free shipping on orders over $100. Track your order in real-time from our warehouse to your doorstep.",
      color: "from-blue-500 to-cyan-500",
      stats: "24-48h Delivery"
    },
    {
      id: 3,
      icon: <FaShieldAlt />,
      title: "Secure Shopping",
      text: "Your security is our priority. Encrypted payments, fraud protection, and hassle-free returns.",
      color: "from-green-500 to-emerald-500",
      stats: "SSL Secured"
    },
    {
      id: 4,
      icon: <FaHeadset />,
      title: "24/7 Support",
      text: "Our dedicated support team is always ready to assist you with any questions or concerns.",
      color: "from-orange-500 to-red-500",
      stats: "Instant Response"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
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
    <section ref={ref} className="py-0 lg:py-10 pb-10 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We Don't Just Sell Shoes,{' '}
            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              We Deliver Experience
            </span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Here's why thousands of customers trust us for their footwear needs
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-r from-purple-600 to-blue-600 rounded-3xl p-8 mb-16 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50K+", label: "Happy Customers", icon: <FaCheckCircle /> },
              { value: "100%", label: "Authentic", icon: <FaShieldAlt /> },
              { value: "4.8", label: "Customer Rating", icon: <FaStar /> },
              { value: "30-Day", label: "Returns", icon: <FaUndo /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              onHoverStart={() => setActiveCard(card.id)}
              onClick={() => setActiveCard(card.id)}
              className={`relative group cursor-pointer rounded-2xl p-8 transition-all duration-500 ${
                activeCard === card.id
                  ? `bg-linear-to-br ${card.color} text-white shadow-2xl scale-105`
                  : "bg-white text-gray-700 hover:shadow-xl border border-gray-100"
              }`}
            >
              {/* Decorative Circle */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${
                activeCard === card.id
                  ? "bg-white/10"
                  : "bg-linear-to-br " + card.color + " opacity-10"
              }`}></div>

              {/* Icon */}
              <div className={`text-4xl mb-6 ${
                activeCard === card.id ? "text-white" : `text-linear bg-linear-to-r ${card.color} bg-clip-text text-transparent`
              }`}>
                {card.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${
                activeCard === card.id ? "text-white/90" : "text-gray-600"
              }`}>
                {card.text}
              </p>

              {/* Stats Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                activeCard === card.id
                  ? "bg-white/20 text-white"
                  : `bg-linear-to-r ${card.color} text-white`
              }`}>
                <FaCheckCircle className="w-3 h-3" />
                {card.stats}
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                activeCard !== card.id && "border-2 border-purple-400"
              }`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
        >
          {[
            "Free Shipping Over $100",
            "30-Day Returns",
            "2-Year Warranty",
            "Price Match Guarantee"
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-600">
              <FaCheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;