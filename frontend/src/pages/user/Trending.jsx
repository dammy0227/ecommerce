import React from "react";
import { useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, ShoppingCart, Eye, TrendingUp, Star } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <motion.div
    whileHover={{ scale: 1.1, backgroundColor: "#7c3aed", color: "#ffffff" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer text-gray-700 hover:text-white transition-colors duration-300 border border-gray-200"
  >
    <span className="text-2xl font-light">›</span>
  </motion.div>
);

const PrevArrow = ({ onClick }) => (
  <motion.div
    whileHover={{ scale: 1.1, backgroundColor: "#7c3aed", color: "#ffffff" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer text-gray-700 hover:text-white transition-colors duration-300 border border-gray-200"
  >
    <span className="text-2xl font-light">‹</span>
  </motion.div>
);

const Trending = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  const trendingData = [
    {
      img: "https://i.pinimg.com/736x/d4/cc/21/d4cc21d7799332a0111dcbf606c75ddb.jpg",
      title: "Nike Air Jordan 1",
      desc: "Retro High OG 'Chicago' - Limited Edition",
      price: 400,
      originalPrice: 550,
      rating: 4.8,
      reviews: 234,
      badge: "Hot",
      badgeColor: "from-red-500 to-pink-500"
    },
    {
      img: "https://i.pinimg.com/1200x/8d/c9/a3/8dc9a33ea26a9719028b2b92504652b7.jpg",
      title: "Reebok Classic Club C",
      desc: "Premium leather, vintage style, EVA cushioning",
      price: 700,
      rating: 4.7,
      reviews: 189,
      badge: "Premium",
      badgeColor: "from-purple-500 to-indigo-500"
    },
    {
      img: "https://i.pinimg.com/1200x/00/ca/04/00ca04277ef06296b5404586aea519a8.jpg",
      title: "Under Armour HOVR",
      desc: "Phantom 2 - Responsive cushioning, breathable mesh",
      price: 400,
      originalPrice: 480,
      rating: 4.9,
      reviews: 312,
      badge: "New",
      badgeColor: "from-green-500 to-emerald-500"
    },
    {
      img: "https://i.pinimg.com/736x/9e/d4/cf/9ed4cfec68989ad2c18bebc5cf2c0378.jpg",
      title: "Puma Park Lifestyle",
      desc: "Navy Blue REPLICA series - Limited stock",
      price: 300,
      rating: 4.6,
      reviews: 156,
      badge: "Sale",
      badgeColor: "from-orange-500 to-red-500"
    },
    {
      img: "https://i.pinimg.com/1200x/e4/b4/52/e4b452e517db6aa441e89a5e1784fcff.jpg",
      title: "Nike Air Max 90",
      desc: "Premium suede, Max Air unit, timeless design",
      price: 500,
      originalPrice: 600,
      rating: 4.8,
      reviews: 445,
      badge: "Iconic",
      badgeColor: "from-blue-500 to-cyan-500"
    },
    {
      img: "https://i.pinimg.com/1200x/4a/c3/85/4ac385012cd37bc9e8299ff128b135a9.jpg",
      title: "Adidas Ultraboost 22",
      desc: "Responsive Boost, Primeknit+, energy return",
      price: 300,
      originalPrice: 380,
      rating: 4.9,
      reviews: 678,
      badge: "Bestseller",
      badgeColor: "from-amber-500 to-yellow-500"
    }
  ];

  const Card = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
    
    return (
      <div className="relative group px-3">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Image Container - No animations */}
          <div className="relative h-72 overflow-hidden bg-gray-100">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            
            {/* linear Overlay - Subtle */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1.5 bg-linear-to-r ${item.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}>
                {item.badge}
              </span>
              {discount > 0 && (
                <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Quick Actions - Slide up on hover */}
            <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transform transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              <button
                className="flex-1 bg-white text-purple-600 py-2.5 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </button>
              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-purple-50 transition-colors shadow-lg">
                <Heart className={`w-4 h-4 transition-colors ${
                  isHovered ? "text-red-500" : "text-gray-600"
                }`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title and Rating */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-500 text-xs mb-3 line-clamp-2">
              {item.desc}
            </p>
            
            {/* Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400">
                {item.reviews.toLocaleString()} reviews
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
              
              <button className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium text-xs hover:shadow-lg transition-shadow flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" onClick={()=>alert('login to get item')}/>
                Add
              </button>
            </div>
          </div>

          {/* Trending Indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-md">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">#{index + 1}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={ref} className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Only header has animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-purple-50 text-purple-600 text-sm font-semibold rounded-full mb-4 border border-purple-100">
            🔥 Trending Now
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Most{' '}
            <span className="bg-linear-to-r from-purple-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Popular Picks
            </span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Join thousands of sneaker enthusiasts who've already grabbed these hottest styles
          </p>
        </motion.div>

        {/* Mobile Scroll View - Clean horizontal scroll */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-6 px-1 -mx-1 snap-x snap-mandatory scrollbar-hide">
            {trendingData.map((item, i) => (
              <div key={i} className="flex-none w-[280px] sm:w-[300px] snap-start">
                <Card item={item} index={i} />
              </div>
            ))}
          </div>
          
          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {trendingData.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === 0 ? "w-6 bg-purple-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Slick Slider */}
        <div className="hidden lg:block slider-container">
          <Slider {...settings}>
            {trendingData.map((item, i) => (
              <Card key={i} item={item} index={i} />
            ))}
          </Slider>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <motion.button
          onClick={()=> alert("login to view all trending item")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-200 hover:border-purple-600 hover:bg-purple-50 transition-all duration-300 inline-flex items-center gap-2"
          >
            View All Trending Items
            <span className="text-xl">→</span>
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-mandatory {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
        :global(.slick-dots) {
          bottom: -45px;
        }
        :global(.slick-dots li) {
          margin: 0 3px;
        }
        :global(.slick-dots li button:before) {
          font-size: 8px;
          color: #c084fc;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        :global(.slick-dots li.slick-active button:before) {
          opacity: 1;
          color: #7c3aed;
          transform: scale(1.2);
        }
        :global(.slick-track) {
          display: flex;
          padding: 15px 0 25px;
        }
      `}</style>
    </section>
  );
};

export default Trending;