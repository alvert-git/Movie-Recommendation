import React, { useState, useEffect } from 'react';
import { Search, Film, User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. Load user data from JWT on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid Token");
        localStorage.removeItem('token');
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/95 py-3 shadow-2xl' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <Film className="text-red-600 w-8 h-8 group-hover:scale-110 transition-transform" />
          <h1 className="text-white text-2xl font-bold tracking-tighter uppercase">
            Movie<span className="text-red-600">Rec</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/recommend" className="hover:text-white transition-colors">Recommendations</Link>
          <Link to="/popular" className="hover:text-white transition-colors">Watch List</Link>
        </nav>

        {/* Search and Profile */}
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <input 
              type="text" 
              placeholder="Titles, people, genres" 
              className="bg-zinc-900/80 text-white text-sm rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all border border-zinc-700"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          {/* User Profile / Login Section */}
          <div className="relative group">
            {user ? (
              <div className="flex items-center gap-2 cursor-pointer py-2">
                {/* Profile Image */}
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-md object-cover border border-zinc-700"
                  onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=User'}
                />
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" />

                {/* Dropdown Menu (Hover Triggered) */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-black border border-zinc-800 rounded shadow-xl w-56 overflow-hidden">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-xs text-gray-500 uppercase font-bold">Account</p>
                      <p className="text-sm text-white truncate">{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-zinc-900 transition-colors border-t border-zinc-800"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out of MovieRec
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-red-600 px-4 py-1.5 rounded text-sm font-bold">
                Sign In
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;