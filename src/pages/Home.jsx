import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar"; // Assuming this is also refactored
import { 
  FiBook, FiBox, FiStar, FiUser, FiSun, FiMoon, 
  FiArrowRight, FiZap, FiGlobe, FiLayers, FiSmartphone, FiSearch 
} from "react-icons/fi";

// --- Design System Components ---

const AmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] opacity-70" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] opacity-70" />
    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-sky-200/40 rounded-full blur-[80px] opacity-60" />
  </div>
);

const GlassCard = ({ children, className = "", hoverEffect = true }) => (
  <div className={`relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-sm 
    ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/80' : ''} 
    ${className}`}>
    {/* Inner Edge Shine */}
    <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/50 pointer-events-none" />
    {children}
  </div>
);

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-500 text-lg max-w-2xl">{subtitle}</p>}
  </div>
);

const PrimaryButton = ({ children, onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`group flex items-center justify-center gap-2 px-8 py-4 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 rounded-full font-bold transition-all duration-300 hover:bg-white hover:shadow-md active:scale-95 ${className}`}
  >
    {children}
  </button>
);

// --- Main Component ---

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Note: Dark mode logic retained but visual styling below is strictly "Light/Glass" as per design system requirements.
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
  };

  // --- LOGGED IN DASHBOARD ---
  if (user) {
    return (
      <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <AmbientBackground />
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          
          {/* Welcome Header */}
          <section className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {user.displayName || 'Learner'}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl">
              Ready to continue your exploration? Your 3D models and saved lessons are waiting.
            </p>
          </section>

          {/* Search Glass Bar */}
          <section>
            <GlassCard className="p-2 flex items-center" hoverEffect={false}>
              <div className="pl-6 text-slate-400">
                <FiSearch className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Search subjects, topics, and concepts..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-lg py-4 px-4 font-medium"
              />
              <button className="hidden sm:block px-8 py-3 bg-slate-900 text-white rounded-3xl font-bold hover:bg-slate-800 transition-colors">
                Search
              </button>
            </GlassCard>
          </section>

          {/* Quick Access Grid */}
          <section>
            <SectionHeading icon={FiZap} title="Quick Access" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Subjects', icon: FiBook, path: '/subjects', color: 'bg-blue-50 text-blue-600' },
                { label: '3D Models', icon: FiBox, path: '/ar', color: 'bg-purple-50 text-purple-600' },
                { label: 'Favorites', icon: FiStar, path: '/favorites', color: 'bg-amber-50 text-amber-600' },
                { label: 'Profile', icon: FiUser, path: '/profile', color: 'bg-emerald-50 text-emerald-600' },
              ].map((item) => (
                <GlassCard 
                  key={item.label}
                  className="p-6 cursor-pointer flex flex-col items-center justify-center text-center group"
                >
                  <div onClick={() => navigate(item.path)} className="w-full h-full flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.label}</h3>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Featured Content */}
          <section>
            <SectionHeading icon={FiLayers} title="Featured Topics" subtitle="Curated learning paths trending this week." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeaturedCard 
                badge="Popular" 
                badgeColor="bg-blue-100 text-blue-700"
                title="Physics Fundamentals" 
                desc="Master the core concepts of motion, energy, and forces."
                onBtnClick={() => navigate('/subjects')}
              />
              <FeaturedCard 
                badge="New" 
                badgeColor="bg-purple-100 text-purple-700"
                title="Biology in 3D" 
                desc="Explore human anatomy and systems with immersive models."
                onBtnClick={() => navigate('/ar')}
              />
              <FeaturedCard 
                badge="Trending" 
                badgeColor="bg-amber-100 text-amber-700"
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
    <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <AmbientBackground />
      
      {/* Navbar (Custom Glass) */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm px-6 py-3 flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Eduverse
            </span>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="hidden sm:block text-slate-500 font-bold hover:text-slate-900 transition-colors">
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')} 
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Hero Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 text-indigo-600 text-sm font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                The Future of Education
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Explore STEM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  with AR Magic
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience interactive learning through augmented reality. 
                Master complex STEM concepts in your preferred language with immersive 3D visualizations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <PrimaryButton onClick={() => navigate('/signup')}>
                  Start Learning Free <FiArrowRight />
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate('/ar')}>
                  View 3D Demo
                </SecondaryButton>
              </div>

              {/* Stats - Floating Glass */}
              <div className="pt-8 flex justify-center lg:justify-start gap-4">
                 {[
                  { value: "500+", label: "Models" },
                  { value: "50K+", label: "Users" },
                  { value: "10+", label: "Langs" }
                ].map((stat, i) => (
                  <div key={i} className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-center">
                    <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
              <GlassCard className="p-4 rotate-3 lg:rotate-6 !bg-white/40">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                   <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                   {/* Replace with actual image */}
                   <img 
                    src="/banner.png" 
                    alt="AR Education" 
                    className="relative w-full h-full object-cover" 
                  />
                  {/* Floating Element Decoration */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <FiBox />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Current Session</p>
                        <p className="text-slate-900 font-bold">Anatomy of the Heart</p>
                     </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Why Choose Eduverse?</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Immersive technology meets traditional curriculum.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureItem 
              icon={FiBox} 
              title="Interactive AR" 
              desc="Explore 3D models of scientific concepts in your physical space." 
            />
            <FeatureItem 
              icon={FiGlobe} 
              title="Multi-Language" 
              desc="Learn in your preferred language with seamless content translation." 
            />
            <FeatureItem 
              icon={FiBook} 
              title="Comprehensive" 
              desc="Structured lessons across Physics, Chemistry, and Biology." 
            />
            <FeatureItem 
              icon={FiZap} 
              title="Self-Paced" 
              desc="Save favorites and track your learning progress over time." 
            />
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="py-20 lg:py-32">
          <GlassCard className="p-8 md:p-12 lg:p-16 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Mobile App
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Take the Lab <br /> With You
                </h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto lg:mx-0">
                  Experience full AR capabilities on your smartphone. Scan to download the APK directly.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <img src="/image.png" alt="QR Code" className="w-24 h-24" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Download Android App</p>
                    <PrimaryButton onClick={() => window.open('https://q.me-qr.com/spc1s2v7', '_blank')}>
                      Download APK <FiArrowRight className="ml-2" />
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Custom CSS Phone Mockup to avoid DaisyUI */}
              <div className="flex-1 flex justify-center lg:justify-end relative">
                 <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] shadow-2xl ring-8 ring-slate-900 overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 flex justify-center">
                        <div className="w-32 h-6 bg-slate-900 rounded-b-xl"></div>
                    </div>
                    {/* Screen */}
                    <img src="/app.jpeg" alt="App Screen" className="w-full h-full object-cover bg-slate-800" />
                    {/* Reflections */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10"></div>
                 </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200/60 mt-12 bg-white/40 backdrop-blur-lg">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xl font-black text-slate-900 tracking-tight">Eduverse</span>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-400">© 2024 Eduverse Inc.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function FeaturedCard({ badge, badgeColor, title, desc, onBtnClick }) {
  return (
    <GlassCard className="p-8 flex flex-col h-full group">
      <div className="mb-6 flex justify-between items-start">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
          {badge}
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
          <FiArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-500 leading-relaxed mb-6 flex-1">
        {desc}
      </p>

      <button onClick={onBtnClick} className="text-sm font-bold text-slate-900 underline decoration-slate-300 underline-offset-4 group-hover:decoration-indigo-500 transition-all">
        Start Lesson
      </button>
    </GlassCard>
  );
}

function FeatureItem({ icon: Icon, title, desc }) {
  return (
    <GlassCard className="p-8 text-center" hoverEffect={true}>
      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </GlassCard>
  );
}