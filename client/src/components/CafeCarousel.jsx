import { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import menuPics1 from "../assets/menuPics1.jpg";
import menuPics2 from "../assets/menuPics2.jpg";
import menuPics3 from "../assets/menuPics3.jpg";
import menuPics4 from "../assets/menuPics4.png";
import menuPics5 from "../assets/menuPics5.png";

export const CafeCarousel = () => {
  const countScreenSize = () => {
    if (window.innerWidth >= 768) {
      if (window.innerWidth >= 1024) {
        // large screen
        return 4;
      } else {
        // medium screen
        return 3;
      }
    } else {
      // small screen
      return 1;
    }
  }
  const [slidesNum, setSlidesNum ] = useState(countScreenSize);

  useEffect(() => {
    const handleResize = () => {
      setSlidesNum(countScreenSize());
    }
    // Handle the changes of screen size
    window.addEventListener('resize', handleResize)
  }, [])

  const settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      speed: 500,
      slidesToShow: slidesNum,
      slidesToScroll: 1
      }
  return (
    <div className='w-1/2 z-0 mx-auto'>
        <Slider {...settings}>
            <div className=''><img src={menuPics1} className='w-full px-2'/></div>
            <div className=''><img src={menuPics2} className='w-full px-2'/></div>
            <div className=''><img src={menuPics3} className='w-full px-2'/></div>
            <div className=''><img src={menuPics4} className='w-full px-2'/></div>
            <div className=''><img src={menuPics5} className='w-full px-2'/></div>
        </Slider>
    </div>
  )
}
