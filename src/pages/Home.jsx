import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import {
  FiBook, FiBox, FiStar, FiUser, FiSun, FiMoon,
  FiArrowRight, FiZap, FiGlobe, FiLayers, FiSmartphone, FiSearch
} from "react-icons/fi";
import {
  AmbientBackground,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  PageHeader,
  SectionHeading
} from "../components/ui/DesignSystem";

// --- Main Component ---

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentLanguage, getUITranslation } = useLanguage();
  // Note: Dark mode logic retained but visual styling below is strictly "Light/Glass" as per design system requirements.
  const [darkMode, setDarkMode] = useState(false);

  // UI Translations - Now using centralized context
  // const t = { ... } // Removed inline translations

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
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {getUITranslation('welcomeBack', currentLanguage)}, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                {user.displayName || getUITranslation('learner', currentLanguage)}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-medium">
              {getUITranslation('readyToContinue', currentLanguage)}
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
                placeholder={getUITranslation('searchPlaceholder', currentLanguage)}
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-lg py-4 px-4 font-medium"
              />
              <button className="hidden sm:block px-8 py-3 bg-slate-900 text-white rounded-3xl font-bold hover:bg-slate-800 transition-colors">
                {getUITranslation('search', currentLanguage)}
              </button>
            </GlassCard>
          </section>

          {/* Features Grid */}
          <section>
            <SectionHeading
              icon={FiZap}
              title={getUITranslation('quickAccess', currentLanguage)}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: getUITranslation('subjects', currentLanguage), icon: FiBook, path: '/subjects', color: 'bg-blue-50 text-blue-600' },
                { label: getUITranslation('models3D', currentLanguage), icon: FiBox, path: '/ar', color: 'bg-purple-50 text-purple-600' },
                { label: getUITranslation('favorites', currentLanguage), icon: FiStar, path: '/favorites', color: 'bg-amber-50 text-amber-600' },
                { label: getUITranslation('profile', currentLanguage), icon: FiUser, path: '/profile', color: 'bg-emerald-50 text-emerald-600' },
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
            <SectionHeading
              icon={FiLayers}
              title={getUITranslation('featuredTopics', currentLanguage)}
              subtitle={getUITranslation('curatedPaths', currentLanguage)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeaturedCard
                badge={getUITranslation('popular', currentLanguage)}
                badgeColor="bg-blue-100 text-blue-700"
                title={getUITranslation('physicsFundamentals', currentLanguage)}
                desc={getUITranslation('physicsFundamentalsDesc', currentLanguage)}
                onBtnClick={() => navigate('/subjects')}
                btnText={getUITranslation('startLesson', currentLanguage)}
              />
              <FeaturedCard
                badge={getUITranslation('new', currentLanguage)}
                badgeColor="bg-purple-100 text-purple-700"
                title={getUITranslation('biologyIn3D', currentLanguage)}
                desc={getUITranslation('biologyIn3DDesc', currentLanguage)}
                onBtnClick={() => navigate('/ar')}
                btnText={getUITranslation('startLesson', currentLanguage)}
              />
              <FeaturedCard
                badge={getUITranslation('trending', currentLanguage)}
                badgeColor="bg-amber-100 text-amber-700"
                title={getUITranslation('chemistryReactions', currentLanguage)}
                desc={getUITranslation('chemistryReactionsDesc', currentLanguage)}
                onBtnClick={() => navigate('/subjects')}
                btnText={getUITranslation('startLesson', currentLanguage)}
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
              {getUITranslation('signIn', currentLanguage)}
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all"
            >
              {getUITranslation('getStarted', currentLanguage)}
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
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 text-indigo-600 text-sm font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                {getUITranslation('futureOfEducation', currentLanguage)}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {getUITranslation('exploreSTEM', currentLanguage)} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                  {getUITranslation('withARMagic', currentLanguage)}
                </span>
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                {getUITranslation('heroDesc', currentLanguage)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <PrimaryButton onClick={() => navigate('/signup')}>
                  {getUITranslation('startLearningFree', currentLanguage)} <FiArrowRight />
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate('/ar')}>
                  {getUITranslation('view3DDemo', currentLanguage)}
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
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">{getUITranslation('whyChoose', currentLanguage)}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">{getUITranslation('immersiveTech', currentLanguage)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureItem
              icon={FiBox}
              title={getUITranslation('interactiveAR', currentLanguage)}
              desc={getUITranslation('interactiveARDesc', currentLanguage)}
            />
            <FeatureItem
              icon={FiGlobe}
              title={getUITranslation('multiLanguage', currentLanguage)}
              desc={getUITranslation('multiLanguageDesc', currentLanguage)}
            />
            <FeatureItem
              icon={FiBook}
              title={getUITranslation('comprehensive', currentLanguage)}
              desc={getUITranslation('comprehensiveDesc', currentLanguage)}
            />
            <FeatureItem
              icon={FiZap}
              title={getUITranslation('selfPaced', currentLanguage)}
              desc={getUITranslation('selfPacedDesc', currentLanguage)}
            />
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="py-20 lg:py-32">
          <GlassCard className="p-8 md:p-12 lg:p-16 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {getUITranslation('mobileApp', currentLanguage)}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {getUITranslation('takeLabWithYou', currentLanguage).split(' ').reduce((acc, word, i) => i < 2 ? acc + word + ' ' : acc, '')} <br /> {getUITranslation('takeLabWithYou', currentLanguage).split(' ').slice(2).join(' ')}
                </h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto lg:mx-0 font-medium">
                  {getUITranslation('mobileAppDesc', currentLanguage)}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <img src="/image.png" alt="QR Code" className="w-24 h-24" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{getUITranslation('downloadAndroidApp', currentLanguage)}</p>
                    <PrimaryButton onClick={() => window.open('https://q.me-qr.com/spc1s2v7', '_blank')}>
                      {getUITranslation('downloadAPK', currentLanguage)} <FiArrowRight className="ml-2" />
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

function FeaturedCard({ badge, badgeColor, title, desc, onBtnClick, btnText }) {
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
        {btnText}
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