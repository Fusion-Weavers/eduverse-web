import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FiHome, FiBox, FiBook, FiStar, FiUser, FiShield, FiLogOut, FiMenu, FiX, FiSearch } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glass intensity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  const handleSearchClick = () => {
    navigate("/search");
    setOpen(false);
  };

  const navItems = [
    { to: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
    { to: "/ar", label: "3D Concepts", icon: <FiBox className="w-4 h-4" /> },
    { to: "/subjects", label: "Subjects", icon: <FiBook className="w-4 h-4" /> },
    { to: "/favorites", label: "Favorites", icon: <FiStar className="w-4 h-4" /> },
    { to: "/profile", label: "Profile", icon: <FiUser className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-sm"
          : "bg-white/50 backdrop-blur-md border-transparent"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              to="/"
              className="group relative flex items-center gap-2"
            >
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-linear-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text tracking-tight italic">
                Eduverse
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group overflow-hidden
                      ${isActive
                        ? "text-slate-900 bg-slate-100"
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                      }
                    `}
                  >
                    <span className={`transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-indigo-500"}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="w-px h-6 bg-slate-200 mx-2" />

              {/* Admin Button (Premium Style) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-700 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:text-slate-900 transition-all duration-300 font-medium text-sm group mr-2"
                >
                  <FiShield className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  <span>Admin</span>
                </Link>
              )}

              <button
                onClick={handleSearchClick}
                className={`p-2 rounded-full transition-all duration-300 mr-1 ${location.pathname === "/search"
                    ? "bg-slate-100 text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
                  }`}
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              <LanguageSelector variant="compact" showLabel={false} />

              <button
                onClick={handleLogout}
                className="ml-2 p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                aria-label="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Sidebar (Glass Sheet) */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/90 backdrop-blur-2xl shadow-2xl z-50 transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">

          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <span className="text-2xl font-black text-slate-800 italic tracking-tight">
              Eduverse
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">

            {/* Search Item for Mobile */}
            <button
              onClick={handleSearchClick}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="p-2 rounded-xl bg-slate-100">
                <FiSearch className="w-4 h-4" />
              </span>
              <span className="text-lg">Search</span>
            </button>

            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-200
                    ${isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <span className={`p-2 rounded-xl ${isActive ? "bg-white shadow-sm" : "bg-slate-100"}`}>
                    {item.icon}
                  </span>
                  <span className="text-lg">{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 mt-4 border border-dashed border-slate-200"
              >
                <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <FiShield className="w-4 h-4" />
                </span>
                <span className="text-lg font-medium">Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-slate-100 bg-white/50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settings</span>
              <LanguageSelector variant="compact" showLabel={false} />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}