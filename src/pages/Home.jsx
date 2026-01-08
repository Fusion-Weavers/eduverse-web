import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // If user is logged in, show the regular home page
  if (user) {
    return (
      <>
        <Navbar />
        <div className="page">
          <h1>Welcome to Eduverse</h1>
          <p>
            Learn STEM concepts in your preferred language with structured,
            easy-to-understand explanations.
          </p>

          {/* Prominent search interface */}
          <div className="home-search-section">
            <h2>Find What You're Looking For</h2>
            <SearchBar placeholder="Search subjects, topics, and concepts..." />
          </div>

          <div className="card">
            <h3>Get Started</h3>
            <p>
              Browse subjects, explore topics, and save your favorite concepts
              for quick revision.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Landing page for non-logged-in users
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">Eduverse</div>
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              className="nav-btn nav-btn-signin"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              className="nav-btn"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Explore STEM
              <span className="highlight"> with AR</span>
            </h1>
            <p className="hero-description">
              Experience interactive learning through augmented reality.
              Master complex STEM concepts in your preferred language
              with immersive 3D visualizations.
            </p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/ar')}
              >
                View 3D Concepts
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/banner.png" alt="Eduverse AR Learning" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Eduverse?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Interactive AR Models</h3>
              <p>Explore 3D models of scientific concepts in augmented reality for deeper understanding.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Multi-Language Support</h3>
              <p>Learn in your preferred language with seamless content translation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Comprehensive Content</h3>
              <p>Access structured lessons across Physics, Chemistry, Biology, and Engineering.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Learn at Your Pace</h3>
              <p>Save favorites, track progress, and revisit concepts whenever you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="mobile-app-section">
        <div className="container">
          <div className="mobile-app-content">
            <div className="mobile-app-text">
              <h2 className="section-title">Download Our Mobile App</h2>
              <p className="mobile-app-description">
                Take your learning anywhere with our mobile application.
                Experience full AR capabilities on your smartphone.
              </p>
              <div className="app-badges">
                <div className="qr-placeholder">
                  <div className="qr-box">
                    <span>QR Code</span>
                    <p>Scan to download</p>
                  </div>
                </div>
                <div className="store-info">
                  <p>Available on iOS and Android</p>
                  <div className="coming-soon-badge">Coming Soon</div>
                </div>
              </div>
            </div>
            <div className="mobile-mockup">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="screen-content">
                    <div className="app-preview">📱</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-brand">Eduverse</h3>
              <p className="footer-tagline">
                Making STEM education accessible through technology
              </p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#subjects">Subjects</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#blog">Blog</a></li>
                <li><a href="#support">Support</a></li>
                <li><a href="#documentation">Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">
              © {new Date().getFullYear()} Eduverse. All rights reserved.
            </p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
