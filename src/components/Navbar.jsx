import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FiHome, FiBox, FiBook, FiStar, FiUser, FiShield, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
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
      <nav className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-300/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text italic hover:scale-105 transition-transform duration-300"
            >
              Eduverse
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-base-content/80 hover:text-primary hover:bg-base-200 transition-all duration-200 font-medium group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    <FiShield className="w-4 h-4" />
                  </span>
                  <span>Admin</span>
                </Link>
              )}

              <div className="ml-2">
                <LanguageSelector variant="compact" showLabel={false} />
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-200 font-medium ml-2 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200">
                  <FiLogOut className="w-4 h-4" />
                </span>
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? (
                <FiX className="w-6 h-6 text-base-content" />
              ) : (
                <FiMenu className="w-6 h-6 text-base-content" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-base-300">
            <span className="text-2xl font-black text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text italic">
              Eduverse
            </span>
            <button
              onClick={() => setOpen(false)}
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-base-content/80 hover:text-primary hover:bg-base-200 transition-all duration-200 font-medium group"
              >
                <span className="p-2 rounded-lg bg-base-200 group-hover:bg-primary/10 transition-colors group-hover:scale-110 duration-200">
                  {item.icon}
                </span>
                <span className="text-lg">{item.label}</span>
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg group"
              >
                <span className="p-2 rounded-lg bg-white/20 group-hover:scale-110 transition-transform duration-200">
                  <FiShield className="w-5 h-5" />
                </span>
                <span className="text-lg">Admin Panel</span>
              </Link>
            )}

            <div className="pt-4">
              <div className="px-4 py-3 rounded-xl bg-base-200/50">
                <p className="text-xs font-semibold text-base-content/60 mb-2">LANGUAGE</p>
                <LanguageSelector variant="compact" showLabel={false} />
              </div>
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-base-300">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-200 font-medium group"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">
                <FiLogOut className="w-5 h-5" />
              </span>
              <span className="text-lg">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}