import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  showAuthButtons?: boolean;
}

export default function Navbar({ showAuthButtons = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleImageError = () => {
    console.error('Image failed to load');
    setImageError(true);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`relative px-3 py-2 transition-colors ${
        isActive(to)
          ? 'text-blue-600'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {children}
      {isActive(to) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {!imageError ? (
                <img 
                  src="https://solimages.s3.us-east-1.amazonaws.com/Sol_Small_logo.png"
                  alt="Solomon AI Workforce"
                  className="w-10 h-10 group-hover:scale-105 transition-transform"
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Solomon Consulting Group
                </span>
                <span className="text-sm text-slate-600">Automation and AI Professional Services</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              <NavLink to="/features">Features</NavLink>
              <NavLink to="/pricing">Pricing</NavLink>
              <NavLink to="/about">About</NavLink>
            </div>
            
            {showAuthButtons && isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : !showAuthButtons && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/features"
              className={`block px-3 py-2 rounded-lg ${
                isActive('/features')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`block px-3 py-2 rounded-lg ${
                isActive('/pricing')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-lg ${
                isActive('/about')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              About
            </Link>
            {showAuthButtons && isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : !showAuthButtons && (
              <>
                <Link
                  to="/signin"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}