import { useState } from 'react' 
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiFillMobile, AiOutlineClose } from 'react-icons/ai'

import logo from '../assets/logo.png'

// to pass navbar items into 
const NavbarItem = ({ title, classProps }) => {
  return (
    <li className={`mx-4 cursor-pointer ${classProps}`}>
      {title}
    </li>
  )
}

const Navbar = () => {
  // for mobile for menu toggle, false unless state says it 
  // is mobile 
  const [toggleMenu, setToggleMenu] = useState(false)
  
  return (
    <nav className='w-full flex md:justify-center 
    justify-between items-center p-4'>
      <div className='md:flex-[0.5] flex-initial 
      justify-center items-center'>
        <img src={logo} alt="logo"  className='w-32 
        cursor-pointer' />
      </div>
      <ul className='text-white md:flex hidden 
      list-none flex-row justify-between items-center 
      flex-initial'>
        {/* make an array of navbar names in array to make into */}
        {/* components within list*/}
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <NavbarItem key={item + index} title={item} />
        ))}
        {/* login button */}
        <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full 
        cursor-pointer hover:bg-[#2546bd]'>
          Login
        </li>
      </ul>

      {/* for mobile view navbar */}
      <div className='flex relative'>
        {/* if mobile view on, create responsive menu icons to use */}
        {toggleMenu
         ? <AiOutlineClose fontSize={28} className='text-white 
         md:hidden cursor-pointer' onClick={() => setToggleMenu(false)}/>
          : <HiMenuAlt4 fontSize={28} className='text-white 
          md:hidden cursor-pointer' onClick={() => setToggleMenu(true)}/>}
        {/* display menu stuff remapping layout for mobile*/}
        {toggleMenu && (
          <ul className='z-10 fixed top-0 -right-2 p-3 w-[70wv] h-screen 
          shadow-2xl md:hidden list-none flex flex-col 
          justify-start items-end rounded-md 
          blue-glassmorphism text-white animate-slide-in'>
            <li className='text-xl w-full my-2'>
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
            <NavbarItem key={item + index} title={item} classProps='my-2 text-lg'/>
            ))}
          </ul>
        )}
      </div>

    </nav>
  )
}

export default Navbar