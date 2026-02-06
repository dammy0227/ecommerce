import React from 'react'

const Logo = () => {
  const logos = [
    {id :1, img: '/1.png' },
    {id: 2, img: '/2.png' },
    { id:3, img: '/3.png' },
    { id: 4,img: '/4.png' },
    { id:5, img: '/5.png' },
    { id:6, img: '/6.png' },
    { id: 7,img: '/7.png' },
  ];

  return (
   <div className='flex justify-between max-w-[1200px] m-auto items-center md:gap-0 gap-8 px-2 py-2 lg:py-5 md:overflow-x-visible overflow-x-auto'>
      {logos.map((image)=>{
            return(
            <img key={image.id}
            src={image.img}
            alt=''
            className='w-20 h-20 cursor-pointer object-contain hover:skew-5'
            />
            )
      })}
   </div>
  );
};

export default Logo;
