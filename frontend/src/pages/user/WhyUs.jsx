import React, { useState } from 'react';
import {
  FaMedal,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const WhyUs = () => {

  const [activeCard, setActiveCard] = useState(1); // card 1 active by default

  const cards = [
    {
      id: 1,
      icon: <FaMedal size={40} />,
      title: "Unmatched Product Quality",
      text: "We offer products of the highest durability, style, and performance. Every item is inspected to ensure premium-grade quality."
    },
    {
      id: 2,
      icon: <FaShippingFast size={40} />,
      title: "Fast, Safe & Reliable Delivery",
      text: "We partner with trusted logistics services to deliver your orders quickly, safely, and with real-time tracking."
    },
    {
      id: 3,
      icon: <FaShieldAlt size={40} />,
      title: "Smooth & Secure Shopping Experience",
      text: "Enjoy safe, encrypted payment and a seamless checkout process built to give you comfort and security."
    },
    {
      id: 4,
      icon: <FaHeadset size={40} />,
      title: "Reliable Customer Support",
      text: "Our support team is available 24/7 to assist you, ensuring every shopping experience is exceptional."
    }
  ];

  return (
    <div className='pbb-5 lg:pb-10 h-full lg:h-[60vh] '>
      <div className='max-w-[1200px] m-auto h-full flex flex-col  justify-center'>

        <h1 className="text-[15px] md:text-3xl m-5 p-3 bg-purple-100 w-fit text-purple-500">
          Why Choose Us
        </h1>

        <div className='px-5 grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-6'>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                group flex flex-col items-center gap-6 text-center p-4 shadow-md cursor-pointer rounded-lg 
                duration-300
                ${activeCard === card.id 
                  ? "bg-purple-700 text-white scale-105" 
                  : "bg-white text-gray-600"} 
              `}
              onMouseEnter={() => setActiveCard(card.id)}   // activate on hover desktop
              onClick={() => setActiveCard(card.id)}        // activate on mobile tap
            >
              <div className='flex flex-col items-center gap-4 text-[18px]'>
                <span className={`${activeCard === card.id ? "text-white" : "text-purple-600"}`}>
                  {card.icon}
                </span>
                <span className='font-semibold'>{card.title}</span>
              </div>
              <p className='text-[14px]'>{card.text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WhyUs;
