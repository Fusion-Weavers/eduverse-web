import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { FiBook, FiBox, FiStar, FiUser, FiSun, FiMoon, FiArrowRight, FiZap, FiGlobe, FiBookOpen } from "react-icons/fi";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkMode(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // --- LOGGED IN DASHBOARD ---
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12 lg:space-y-16">
          
          {/* Welcome Section */}
          <section className="text-center md:text-left space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content tracking-tight">
              Welcome back, <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user.displayName || 'Learner'}</span>!
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-2xl">
              Continue your STEM learning journey with interactive 3D concepts
            </p>
          </section>

          {/* Search Section */}
          <section className="bg-gradient-to-br from-base-100 to-base-200 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border border-base-300/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content">Search & Explore</h2>
            </div>
            <SearchBar placeholder="Search subjects, topics, and concepts..." />
          </section>

          {/* Quick Shortcuts */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content">Quick Access</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Subjects', icon: <FiBook className="w-6 h-6" />, path: '/subjects', gradient: 'from-blue-500 to-blue-600' },
                { label: '3D Models', icon: <FiBox className="w-6 h-6" />, path: '/ar', gradient: 'from-purple-500 to-purple-600' },
                { label: 'Favorites', icon: <FiStar className="w-6 h-6" />, path: '/favorites', gradient: 'from-amber-500 to-amber-600' },
                { label: 'Profile', icon: <FiUser className="w-6 h-6" />, path: '/profile', gradient: 'from-emerald-500 to-emerald-600' },
              ].map((item) => (
                <div 
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="group relative bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-base-300/50 overflow-hidden hover:-translate-y-2 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-primary to-secondary"></div>
                  <div className="card-body items-center text-center p-6 sm:p-8">
                    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mt-4 text-base-content group-hover:text-primary transition-colors">
                      {item.label}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Content */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content">Featured Topics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <FeaturedCard 
                badge="Popular" 
                badgeGradient="from-blue-500 to-blue-600"
                title="Physics Fundamentals" 
                desc="Master the core concepts of motion, energy, and forces."
                onBtnClick={() => navigate('/subjects')}
              />
              <FeaturedCard 
                badge="New" 
                badgeGradient="from-purple-500 to-purple-600"
                title="Biology in 3D" 
                desc="Explore human anatomy and systems with immersive models."
                onBtnClick={() => navigate('/ar')}
              />
              <FeaturedCard 
                badge="Trending" 
                badgeGradient="from-amber-500 to-amber-600"
                title="Chemistry Reactions" 
                desc="Understand atomic structures and chemical reactions."
                onBtnClick={() => navigate('/subjects')}
              />
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- LANDING PAGE (GUEST) ---
  return (
    <div className="bg-base-100 min-h-screen">
      {/* Navbar */}
      <div className="navbar bg-base-100/80 backdrop-blur-lg border-b border-base-300/50 sticky top-0 z-50 px-4 md:px-8 shadow-sm">
        <div className="flex-1">
          <span className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text italic">
            Eduverse
          </span>
        </div>
        <div className="flex-none gap-2 sm:gap-3">
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-ghost hidden sm:inline-flex hover:bg-base-200"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-gradient-to-br from-base-100 via-base-200 to-base-100 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero Image */}
            <div className="flex-1 order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <img 
                  src="/banner.png" 
                  alt="Hero" 
                  className="relative w-full max-w-md lg:max-w-lg mx-auto rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 border-4 border-base-300/50" 
                />
              </div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 order-2 lg:order-1 text-center lg:text-left space-y-6 lg:space-y-8">
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-4">
                🚀 The Future of STEM Education
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                Explore STEM{" "}
                <span className="text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text italic relative">
                  with AR
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10C50 4 100 2 198 8" stroke="currentColor" strokeWidth="3" className="text-primary" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-base-content/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience interactive learning through augmented reality. 
                Master complex STEM concepts in your preferred language with immersive 3D visualizations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button 
                  onClick={() => navigate('/signup')} 
                  className="btn btn-primary btn-lg px-8 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105"
                >
                  Get Started
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/ar')} 
                  className="btn btn-outline btn-lg px-8 hover:bg-base-200 transition-all duration-300 hover:scale-105"
                >
                  View 3D Concepts
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 max-w-xl mx-auto lg:mx-0">
                {[
                  { value: "500+", label: "3D Models" },
                  { value: "50K+", label: "Students" },
                  { value: "10+", label: "Languages" }
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-base-content/60 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 bg-base-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
              ✨ Features
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-base-content">
              Why Choose <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">Eduverse</span>?
            </h2>
            <p className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto">
              Discover what makes our platform the future of STEM education
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <FeatureItem 
              icon={<FiBox className="w-8 h-8" />} 
              gradient="from-blue-500 to-blue-600"
              title="Interactive AR" 
              desc="Explore 3D models of scientific concepts in your physical space." 
            />
            <FeatureItem 
              icon={<FiGlobe className="w-8 h-8" />} 
              gradient="from-purple-500 to-purple-600"
              title="Multi-Language" 
              desc="Learn in your preferred language with seamless content translation." 
            />
            <FeatureItem 
              icon={<FiBookOpen className="w-8 h-8" />} 
              gradient="from-emerald-500 to-emerald-600"
              title="Comprehensive" 
              desc="Structured lessons across Physics, Chemistry, and Biology." 
            />
            <FeatureItem 
              icon={<FiZap className="w-8 h-8" />} 
              gradient="from-amber-500 to-amber-600"
              title="Self-Paced" 
              desc="Save favorites and track your learning progress over time." 
            />
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-base-100 via-base-200 to-base-100 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
                📱 Mobile App
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-base-content">
                Download Our App
              </h2>
              
              <p className="text-lg sm:text-xl text-base-content/70 max-w-xl mx-auto lg:mx-0">
                Experience full AR capabilities on your smartphone. Take your STEM lab wherever you go.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 bg-base-100 rounded-3xl shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300 max-w-xl mx-auto lg:mx-0">
                <div className="bg-white p-3 rounded-2xl shadow-lg">
                  <img src="/image.png" alt="QR Code" className="w-24 h-24 sm:w-28 sm:h-28" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-3">
                    Android App
                  </p>
                  <a 
                    href="https://q.me-qr.com/spc1s2v7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Download APK
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="mockup-phone border-primary shadow-2xl relative transform group-hover:scale-105 transition-transform duration-500">
                  <div className="camera"></div> 
                  <div className="display">
                    <div className="artboard artboard-demo phone-1 bg-base-100">
                      <img 
                        src="/app.jpeg" 
                        alt="App Preview" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer p-10 lg:p-16 bg-neutral text-neutral-content rounded-t-3xl shadow-2xl">
        <nav>
          <header className="text-2xl font-black mb-4 text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
            Eduverse
          </header> 
          <p className="max-w-xs text-neutral-content/80 leading-relaxed">
            Making STEM education accessible through immersive AR technology.
          </p>
        </nav> 
        <nav>
          <header className="footer-title text-neutral-content opacity-100 font-bold text-lg mb-4">Product</header> 
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Features</a>
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Subjects</a>
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Pricing</a>
        </nav> 
        <nav>
          <header className="footer-title text-neutral-content opacity-100 font-bold text-lg mb-4">Company</header> 
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">About us</a>
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Contact</a>
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Careers</a>
        </nav> 
        <nav>
          <header className="footer-title text-neutral-content opacity-100 font-bold text-lg mb-4">Legal</header> 
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Terms of use</a>
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Privacy policy</a>
          <a className="link link-hover text-neutral-content/80 hover:text-primary transition-colors">Cookie policy</a>
        </nav>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function FeaturedCard({ badge, badgeGradient, title, desc, onBtnClick }) {
  return (
    <div className="group relative bg-base-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-300/50 overflow-hidden hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="card-body p-6 sm:p-8 relative z-10">
        <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-4 bg-gradient-to-r ${badgeGradient} shadow-lg`}>
          {badge}
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-sm sm:text-base text-base-content/70 leading-relaxed mb-6">
          {desc}
        </p>
        
        <div className="card-actions justify-end mt-auto">
          <button 
            className="btn btn-primary btn-sm group/btn hover:shadow-lg transition-all duration-300" 
            onClick={onBtnClick}
          >
            Explore
            <FiArrowRight className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, gradient, title, desc }) {
  return (
    <div className="group relative bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-base-300/50 overflow-hidden hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="card-body items-center text-center p-6 sm:p-8 relative z-10 space-y-4">
        <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-base-content group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-sm sm:text-base text-base-content/60 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}