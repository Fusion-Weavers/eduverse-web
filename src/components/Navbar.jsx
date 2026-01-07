import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3 className="logo">Eduverse</h3>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/subjects" onClick={() => setOpen(false)}>Subjects</Link>
        <Link to="/favorites" onClick={() => setOpen(false)}>Favorites</Link>
        <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
        <LanguageSelector variant="compact" showLabel={false} />
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
    </nav>
  );
}
