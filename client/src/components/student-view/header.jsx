import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { Menu, X } from "lucide-react"; // Icons for menu toggle
import navbarLogo from "@/assets/navbar-logo.png";
import notificationIcon from "@/assets/Notification.png";
import profileIcon from "@/assets/Profile.png";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white shadow-md">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <Link to="/home">
          <img className="w-[60px] md:w-[80px]" src={navbarLogo} alt="Logo" />
        </Link>
      </div>

      {/* Right Section - Navigation + Menu Toggle for Mobile */}
      <div className="flex items-center space-x-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="hover:text-black font-bold text-[14px] md:text-[16px]">
            HOME
          </Link>
          <Link to="/courses" className="hover:text-black font-bold text-[14px] md:text-[16px]">
            EXPLORE COURSES
          </Link>
          <Link to="#" className="hover:text-black font-bold text-[14px] md:text-[16px]">
            ABOUT US
          </Link>
          <Link to="/student-courses" className="hover:text-black font-bold text-[14px] md:text-[16px]">
            MY COURSES
          </Link>
        </nav>

        {/* Icons & Logout Button (Desktop Only) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/notifications">
            <img className="w-[30px] h-[30px]" src={notificationIcon} alt="Notifications" />
          </Link>
          <Link to="/profile">
            <img className="w-[30px] h-[30px]" src={profileIcon} alt="Profile" />
          </Link>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu (Collapsible) */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-3/4 bg-white shadow-md flex flex-col space-y-4 p-4 md:hidden">
          <Link to="/home" className="text-black font-bold text-[16px]" onClick={() => setIsMenuOpen(false)}>
            HOME
          </Link>
          <Link to="/courses" className="text-black font-bold text-[16px]" onClick={() => setIsMenuOpen(false)}>
            EXPLORE COURSES
          </Link>
          <Link to="#" className="text-black font-bold text-[16px]" onClick={() => setIsMenuOpen(false)}>
            ABOUT US
          </Link>
          <Link to="/student-courses" className="text-black font-bold text-[16px]" onClick={() => setIsMenuOpen(false)}>
            MY COURSES
          </Link>
          <div className="flex items-center justify-between pt-4">
            <Link to="/notifications">
              <img className="w-[30px] h-[30px]" src={notificationIcon} alt="Notifications" />
            </Link>
            <Link to="/profile">
              <img className="w-[30px] h-[30px]" src={profileIcon} alt="Profile" />
            </Link>
            <Button onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;
