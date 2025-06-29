import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { EregContext } from "../contexts/EregContext";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Header(){
 const {logout}=useContext(EregContext);
    return (
  <header className="bg-gray-800 text-gray-100 px-4 py-4">
  <div className="max-w-6xl mx-auto flex justify-between items-center">
    
    <div className="hidden md:flex items-center space-x-2">
      <img src="https://www.svgrepo.com/show/533303/react.svg"  alt="App Logo" className="w-30 h-30" />
      <NavLink to="/" className="text-lg font-semibold hover:text-blue-400">Home</NavLink>
    </div>

    <div className="relative group md:hidden flex items-center space-x-2">
      <svg className="w-6 h-6 fill-current  stroke-white cursor-pointer" viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <div className="absolute top-full -left-5 mt-2 w-48 bg-gray-700 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
        <nav className="flex flex-col space-y-2 text-sm font-medium p-4">
          <NavLink to="/calendar" className="hover:text-blue-400">Calendar</NavLink>
          <NavLink to="/students" className="hover:text-blue-400">Students</NavLink>
          <NavLink to="/professors" className="hover:text-blue-400">Professors</NavLink>
          <NavLink to="/courses" className="hover:text-blue-400">Courses</NavLink>
          <NavLink to="/devpage" className="hover:text-blue-400">Devpage</NavLink>
        </nav>
      </div>
    </div>

     <div className="flex md:hidden items-center space-x-2">
      <img src="https://www.svgrepo.com/show/533303/react.svg" alt="App Logo" className="w-8 h-8" />
      <NavLink to="/" className="text-lg font-semibold hover:text-blue-400">Home</NavLink>
    </div>

    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
      <NavLink to="/calendar" className="hover:text-blue-400">Calendar</NavLink>
      <NavLink to="/students" className="hover:text-blue-400">Students</NavLink>
      <NavLink to="/professors" className="hover:text-blue-400">Professors</NavLink>
      <NavLink to="/courses" className="hover:text-blue-400">Courses</NavLink>
      <NavLink to="/devpage" className="hover:text-blue-400">Devpage</NavLink>
      {/* only for dev,remove and move to admin header after */}
       <NavLink to="/admincoursespage" className="hover:text-blue-400">admincoursespage</NavLink>
    </nav>

 <div className="flex items-center gap-4 text-2xl">
  <NavLink
    to="/account"
    aria-label="Account"
    className="hover:text-blue-500 transition-colors"
  >
    <FaUser />
  </NavLink>

  <button
    onClick={() => logout()}
    className="cursor-pointer hover:text-red-500 transition-colors"
    aria-label="Logout"
  >
    <FaSignOutAlt />
  </button>
</div>
  </div>
</header>
    )
}