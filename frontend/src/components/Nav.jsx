import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { MdLogin,  MdOutlineSpaceDashboard, MdOutlineAssignment  } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoBookOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { BiSolidSchool } from "react-icons/bi";

const Nav = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="h-screen">
     <nav className="flex flex-col p-5 gap-y-12">
      <div className="flex items-center justify-center text-2xl gap-x-3 gap-x-4"><BiSolidSchool/> SCM</div>
      <div className=" border-b-gray-800 border-b-1 w-full"></div>
      <Link to="/" className="flex items-center ml-3 gap-x-4 text-orange-300 pb-4 border-b border-transparent hover:border-b-orange-300  transition-all duration-[400ms]"><MdOutlineSpaceDashboard/> Dashboard</Link>
      <Link to="/courses" className="flex items-center ml-3 gap-x-4 text-gray-700 pb-4 border-b border-transparent hover:border-b-gray-700  transition-all duration-[400ms]"><IoBookOutline/> Courses</Link>
      <Link to="/assignments" className="flex items-center ml-3 gap-x-4 text-gray-700 pb-4 border-b border-transparent hover:border-b-gray-700  transition-all duration-[400ms]"><MdOutlineAssignment/> Assignments</Link>
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
          <span>({user.role}) {user.username}</span>
          <button onClick={logout} className="flex items-center ml-3 gap-x-4 pb-4 text-cyan-700 border-b border-transparent hover:border-b-cyan-700  transition-all duration-[400ms] ">Logout <CiLogout/></button>
        </>
      )}
    </nav>
    </div>
  );
};

export default Nav;