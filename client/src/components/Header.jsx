import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdArrowForwardIos } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import LOGO from "../assets/artisanBrewsBrand.png";
import { selectUsername, selectRole } from '../redux/auth/AuthSlice';

let navigation = [
  { name: 'Home', href: '/', current: false},
  { name: 'Menu', href: '/menu', current: false},
  { name: 'Cart', href: '/cart', current: false},
  { name: 'Contact Us', href: '/contact', current: false}
]

export const Header = () => {
  // Hide mobile navigation by default
  const [showMobileNav, setMobileNav] = useState(false);
  const handleMobileNav = () => {
  showMobileNav ? (
    setMobileNav(false)
  ) : (
    setMobileNav(true)
  )
  };

  // Fetch username
  const username = useSelector(selectUsername);
  const isAdmin = useSelector(selectRole);

  return (
  <div>
    <header className="w-full h-24 z-30 fixed flex flex-row justify-between bg-[#373333]">
      <div className="text-white m-2 w-32">
        <img src={LOGO} />
      </div>
      <div className="relative my-8 mx-auto max-md:hidden">
        {navigation.map((item) => (
          <Link
            key={item.name} 
            to={item.href} 
            className='px-4 py-2 text-white hover:drop-shadow-lg'>
            {item.name}
          </Link>
        ))}
        {isAdmin && (
          <Link to="/admin/orders" className="text-white hover:underline">
            Inventory →
          </Link>
        )}
      </div>
      {username ? (
      <div className="mx-6 flex flex-row my-auto text-white">
        <p className="my-auto px-6">HELLO, {username.toUpperCase()}</p>
      </div>
      ) : (
      <div className="my-auto text-white">
        <Link to='/login' className={`mx-6 p-2 flex flex-row my-auto hover:border-2 border-slate-200 rounded-full`}>
          <p className='text-base my-auto px-6'>LOGIN</p>
          <MdArrowForwardIos className='my-auto mr-6'/>
        </Link>
      </div>
      )}
    </header>
    <nav className={`fixed ${showMobileNav ? 'left-0' : '-left-[100%]'} transition-all duration-700 z-50 w-full h-screen bg-[#c6c0b7] text-center`}>
      <div className="relative">
        <button onClick={() => handleMobileNav()}><IoMdClose className="absolute top-5 right-5 text-white text-4xl active:border-2 border-slate-200 rounded-md"/></button>
        <div className="pt-40 block">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="w-2/5 mx-auto font-bold text-[#ffffff] block py-4 drop-shadow-md active:border-2 border-slate-200 rounded-md">
            {item.name}
          </a>
        ))}
        </div>
      </div>
    </nav>
  </div>
  )
}
