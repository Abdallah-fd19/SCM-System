import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { MdLogin,  MdOutlineSpaceDashboard, MdOutlineAssignment  } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoBookOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { BiSolidSchool } from "react-icons/bi";
import { FaRegMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
const Nav = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false)
  const toggleDarkMode = ()=>{
    setIsDark(prev=> !prev)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="h-screen bg-primary-color">
     <nav className="flex flex-col p-5 gap-y-12">
      <div className="flex items-center justify-center text-2xl gap-x-8">
        <div className="text-secondary-color"><BiSolidSchool className="inline-block "/> SCM </div>
        <div className="rounded-full p-2 hover:shadow-2xl bg-secondary-color shadow-secondary-color transition-all duration-300" onClick={toggleDarkMode}>{isDark ? <IoSunnyOutline/> : <FaRegMoon className="text-white"/>}</div>
      </div>
      <div className=" border-b-secondary-color border-b-1 w-full"></div>
      <Link to="/" className="flex items-center ml-3 gap-x-4 text-orange-300 pb-4 border-b border-transparent hover:border-b-orange-300  transition-all duration-[400ms]"><MdOutlineSpaceDashboard/> Dashboard</Link>
      <Link to="/courses" className="flex items-center ml-3 gap-x-4 text-secondary-color pb-4 border-b border-transparent hover:border-b-secondary-color  transition-all duration-[400ms]"><IoBookOutline/> Courses</Link>
      <Link to="/assignments" className="flex items-center ml-3 gap-x-4 text-secondary-color pb-4 border-b border-transparent hover:border-b-secondary-color  transition-all duration-[400ms]"><MdOutlineAssignment/> Assignments</Link>
      {!user ? (
        <>
          <Link to="/login" className="flex items-center ml-3 gap-x-4 text-cyan-700 pb-4 border-b border-transparent hover:border-b-cyan-700  transition-all duration-[400ms]">
           <MdLogin/>
           Login
          </Link>
          <Link to="/register" className="flex items-center ml-3 gap-x-4 text-cyan-700 pb-4 border-b border-transparent hover:border-b-cyan-700  transition-all duration-[400ms]"><CgProfile/> Register</Link>
        </>
      ) : (
        <>
          <span className="text-secondary-color">({user.role}) {user.username}</span>
          <button onClick={logout} className="flex items-center ml-3 gap-x-4 pb-4 text-cyan-700 border-b border-transparent hover:border-b-cyan-700  transition-all duration-[400ms] ">Logout <CiLogout/></button>
        </>
      )}
    </nav>
    </div>
  );
};

export default Nav;