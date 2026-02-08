import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ---------- CUSTOM ARROWS ---------- */
const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-3 top-1/2 -translate-y-1/2 
    bg-white/90 hover:bg-white shadow-lg w-11 h-11 
    rounded-full flex items-center justify-center cursor-pointer z-50"
  >
    <span className="text-3xl text-gray-800">›</span>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-3 top-1/2 -translate-y-1/2 
    bg-white/90 hover:bg-white shadow-lg w-11 h-11 
    rounded-full flex items-center justify-center cursor-pointer z-50"
  >
    <span className="text-3xl text-gray-800">‹</span>
  </div>
);

const Trending = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const trendingData = [
    {
      img: "https://i.pinimg.com/736x/d4/cc/21/d4cc21d7799332a0111dcbf606c75ddb.jpg",
      title: "Nike Jordan",
      desc: "Basketball shoes, nike jordan retro, and AJ1.",
      price: "$400.00",
    },
    {
      img: "https://i.pinimg.com/1200x/8d/c9/a3/8dc9a33ea26a9719028b2b92504652b7.jpg",
      title: "Reebok",
      desc: "Reebok sneakers built for comfort and durability.",
      price: "$700.00",
    },
    {
      img: "https://i.pinimg.com/1200x/00/ca/04/00ca04277ef06296b5404586aea519a8.jpg",
      title: "Under Armour",
      desc: "Classic Under Armour trainer made for stability.",
      price: "$400.00",
    },
    {
      img: "https://i.pinimg.com/736x/9e/d4/cf/9ed4cfec68989ad2c18bebc5cf2c0378.jpg",
      title: "Puma",
      desc: "The Puma Park Lifestyle Navy Blue R.E.P.L.I.C.A",
      price: "$300.00",
    },
    {
      img: "https://i.pinimg.com/1200x/e4/b4/52/e4b452e517db6aa441e89a5e1784fcff.jpg",
      title: "Nike",
      desc: "Breathable Nike sneaker engineered for comfort.",
      price: "$500.00",
    },
    {
      img: "https://i.pinimg.com/1200x/4a/c3/85/4ac385012cd37bc9e8299ff128b135a9.jpg",
      title: "Adidas",
      desc: "Classic Adidas design with durable materials.",
      price: "$300.00",
    },
  ];

  const Card = ({ item }) => (
    <div className="relative h-[420px] rounded-xl overflow-hidden group min-w-[260px]">
      <img
        src={item.img}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover
        transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t 
        from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 p-5 text-white flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{item.title}</h2>
        <p className="text-sm text-gray-200 line-clamp-2">
          {item.desc}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">{item.price}</span>

          <button
            onClick={() => alert("login to see all items")}
            className="bg-purple-700 hover:bg-purple-800
            text-sm px-4 py-2 rounded-full transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="pt-10 max-w-[1200px] mx-auto px-5">
      <h1 className="text-gray-400 font-bold text-lg md:text-4xl mb-8">
        Top <span className="text-purple-700">Trending</span>
      </h1>

      {/* ---------- MOBILE SCROLL ---------- */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory lg:hidden pb-4">
        {trendingData.map((item, i) => (
          <div key={i} className="snap-start">
            <Card item={item} />
          </div>
        ))}
      </div>

      {/* ---------- DESKTOP SLICK ---------- */}
      <div className="hidden lg:block">
        <Slider {...settings}>
          {trendingData.map((item, i) => (
            <div key={i} className="px-2">
              <Card item={item} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Trending;
