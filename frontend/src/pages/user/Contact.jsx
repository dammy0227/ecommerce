import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineClockCircle,
  AiOutlineSend,
  AiOutlineCheckCircle
} from "react-icons/ai";
import { FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Contact = () => {
  const [formStatus, setFormStatus] = useState("idle");
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <AiOutlineMail className="w-6 h-6" />,
      title: "Email Us",
      value: "support@foothub.com",
      link: "mailto:support@foothub.com",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <AiOutlinePhone className="w-6 h-6" />,
      title: "Call Us",
      value: "+234 81 2345 6789",
      link: "tel:+2348123456789",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Visit Us",
      value: "123 Fashion Street, Lagos, Nigeria",
      link: "https://maps.google.com",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <AiOutlineClockCircle className="w-6 h-6" />,
      title: "Working Hours",
      value: "Mon - Sat: 9:00 AM - 8:00 PM",
      link: null,
      color: "from-orange-500 to-red-500"
    }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook", color: "bg-blue-600" },
    { icon: <FaTwitter />, href: "#", label: "Twitter", color: "bg-sky-500" },
    { icon: <FaInstagram />, href: "#", label: "Instagram", color: "bg-linear-to-r from-purple-500 to-pink-500" },
    { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn", color: "bg-blue-700" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section ref={ref} className="py-20 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We'd Love to{' '}
            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about our products or services? Our team is here to help 24/7.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-r ${info.color} flex items-center justify-center mb-4 text-white`}>
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    href={social.href}
                    className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-white text-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              <p className="text-white/80 text-sm">
                Follow us for exclusive deals, new arrivals, and style inspiration
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              {formStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-linear-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AiOutlineCheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormStatus("idle")}
                    className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h3>
                  <p className="text-gray-600 mb-6">We typically respond within 24 hours</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          disabled={formStatus === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          disabled={formStatus === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        disabled={formStatus === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        disabled={formStatus === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows="5"
                        required
                        disabled={formStatus === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                        placeholder="Tell us about your inquiry..."
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <AiOutlineSend className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;