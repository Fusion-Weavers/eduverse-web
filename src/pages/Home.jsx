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

  // UI Translations
  const t = {
    welcomeBack: currentLanguage === 'hi' ? 'वापसी पर स्वागत है' : currentLanguage === 'bn' ? 'স্বাগতম' : 'Welcome back',
    learner: currentLanguage === 'hi' ? 'शिक्षार्थी' : currentLanguage === 'bn' ? 'শিক্ষার্থী' : 'Learner',
    readyToContinue: currentLanguage === 'hi' ? 'जारी रखने के लिए तैयार हैं? आपके 3D मॉडल और सहेजे गए पाठ प्रतीक्षा कर रहे हैं।' : currentLanguage === 'bn' ? 'চালিয়ে যেতে প্রস্তুত? আপনার 3D মডেল এবং সংরক্ষিত পাঠ অপেক্ষা করছে।' : 'Ready to continue your exploration? Your 3D models and saved lessons are waiting.',
    searchPlaceholder: currentLanguage === 'hi' ? 'विषय, विषय-सूची और अवधारणाएं खोजें...' : currentLanguage === 'bn' ? 'বিষয়, বিষয়সূচি এবং ধারণা অনুসন্ধান করুন...' : 'Search subjects, topics, and concepts...',
    search: currentLanguage === 'hi' ? 'खोजें' : currentLanguage === 'bn' ? 'অনুসন্ধান' : 'Search',
    quickAccess: currentLanguage === 'hi' ? 'त्वरित पहुंच' : currentLanguage === 'bn' ? 'দ্রুত প্রবেশ' : 'Quick Access',
    subjects: getUITranslation('subjects', currentLanguage),
    models3D: currentLanguage === 'hi' ? '3D मॉडल' : currentLanguage === 'bn' ? '3D মডেল' : '3D Models',
    favorites: getUITranslation('favorites', currentLanguage),
    profile: getUITranslation('profile', currentLanguage),
    featuredTopics: currentLanguage === 'hi' ? 'विशेष विषय' : currentLanguage === 'bn' ? 'বৈশিষ্ট্যযুক্ত বিষয়' : 'Featured Topics',
    curatedPaths: currentLanguage === 'hi' ? 'इस सप्ताह ट्रेंडिंग क्यूरेटेड लर्निंग पाथ।' : currentLanguage === 'bn' ? 'এই সপ্তাহে ট্রেন্ডিং কিউরেটেড শেখার পথ।' : 'Curated learning paths trending this week.',
    popular: currentLanguage === 'hi' ? 'लोकप्रिय' : currentLanguage === 'bn' ? 'জনপ্রিয়' : 'Popular',
    new: currentLanguage === 'hi' ? 'नया' : currentLanguage === 'bn' ? 'নতুন' : 'New',
    trending: currentLanguage === 'hi' ? 'ट्रेंडिंग' : currentLanguage === 'bn' ? 'ট্রেন্ডিং' : 'Trending',
    physicsFundamentals: currentLanguage === 'hi' ? 'भौतिकी के मूल सिद्धांत' : currentLanguage === 'bn' ? 'পদার্থবিজ্ঞানের মৌলিক বিষয়' : 'Physics Fundamentals',
    physicsFundamentalsDesc: currentLanguage === 'hi' ? 'गति, ऊर्जा और बलों की मुख्य अवधारणाओं में महारत हासिल करें।' : currentLanguage === 'bn' ? 'গতি, শক্তি এবং বলের মূল ধারণাগুলি আয়ত্ত করুন।' : 'Master the core concepts of motion, energy, and forces.',
    biologyIn3D: currentLanguage === 'hi' ? '3D में जीव विज्ञान' : currentLanguage === 'bn' ? '3D তে জীববিজ্ঞান' : 'Biology in 3D',
    biologyIn3DDesc: currentLanguage === 'hi' ? 'इमर्सिव मॉडल के साथ मानव शरीर रचना और प्रणालियों का अन्वेषण करें।' : currentLanguage === 'bn' ? 'নিমজ্জিত মডেল দিয়ে মানব শারীরস্থান এবং সিস্টেম অন্বেষণ করুন।' : 'Explore human anatomy and systems with immersive models.',
    chemistryReactions: currentLanguage === 'hi' ? 'रसायन विज्ञान प्रतिक्रियाएं' : currentLanguage === 'bn' ? 'রসায়ন বিক্রিয়া' : 'Chemistry Reactions',
    chemistryReactionsDesc: currentLanguage === 'hi' ? 'परमाणु संरचनाओं और रासायनिक प्रतिक्रियाओं को समझें।' : currentLanguage === 'bn' ? 'পারমাণবিক কাঠামো এবং রাসায়নিক বিক্রিয়া বুঝুন।' : 'Understand atomic structures and chemical reactions.',
    startLesson: currentLanguage === 'hi' ? 'पाठ शुरू करें' : currentLanguage === 'bn' ? 'পাঠ শুরু করুন' : 'Start Lesson',
    // Landing page
    futureOfEducation: currentLanguage === 'hi' ? 'शिक्षा का भविष्य' : currentLanguage === 'bn' ? 'শিক্ষার ভবিষ্যৎ' : 'The Future of Education',
    exploreSTEM: currentLanguage === 'hi' ? 'STEM का अन्वेषण करें' : currentLanguage === 'bn' ? 'STEM অন্বেষণ করুন' : 'Explore STEM',
    withARMagic: currentLanguage === 'hi' ? 'AR जादू के साथ' : currentLanguage === 'bn' ? 'AR জাদু দিয়ে' : 'with AR Magic',
    heroDesc: currentLanguage === 'hi' ? 'संवर्धित वास्तविकता के माध्यम से इंटरैक्टिव सीखने का अनुभव करें। अपनी पसंदीदा भाषा में इमर्सिव 3D विज़ुअलाइज़ेशन के साथ जटिल STEM अवधारणाओं में महारत हासिल करें।' : currentLanguage === 'bn' ? 'অগমেন্টেড রিয়েলিটির মাধ্যমে ইন্টারেক্টিভ শেখার অভিজ্ঞতা নিন। আপনার পছন্দের ভাষায় নিমজ্জিত 3D ভিজ্যুয়ালাইজেশন দিয়ে জটিল STEM ধারণাগুলি আয়ত্ত করুন।' : 'Experience interactive learning through augmented reality. Master complex STEM concepts in your preferred language with immersive 3D visualizations.',
    startLearningFree: currentLanguage === 'hi' ? 'मुफ्त में सीखना शुरू करें' : currentLanguage === 'bn' ? 'বিনামূল্যে শেখা শুরু করুন' : 'Start Learning Free',
    view3DDemo: currentLanguage === 'hi' ? '3D डेमो देखें' : currentLanguage === 'bn' ? '3D ডেমো দেখুন' : 'View 3D Demo',
    signIn: currentLanguage === 'hi' ? 'साइन इन' : currentLanguage === 'bn' ? 'সাইন ইন' : 'Sign In',
    getStarted: currentLanguage === 'hi' ? 'शुरू करें' : currentLanguage === 'bn' ? 'শুরু করুন' : 'Get Started',
    whyChoose: currentLanguage === 'hi' ? 'Eduverse क्यों चुनें?' : currentLanguage === 'bn' ? 'কেন Eduverse বেছে নেবেন?' : 'Why Choose Eduverse?',
    immersiveTech: currentLanguage === 'hi' ? 'इमर्सिव तकनीक पारंपरिक पाठ्यक्रम से मिलती है।' : currentLanguage === 'bn' ? 'নিমজ্জিত প্রযুক্তি ঐতিহ্যবাহী পাঠ্যক্রমের সাথে মিলিত হয়।' : 'Immersive technology meets traditional curriculum.'
  };

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
              {t.welcomeBack}, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                {user.displayName || t.learner}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-medium">
              {t.readyToContinue}
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
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-lg py-4 px-4 font-medium"
              />
              <button className="hidden sm:block px-8 py-3 bg-slate-900 text-white rounded-3xl font-bold hover:bg-slate-800 transition-colors">
                {t.search}
              </button>
            </GlassCard>
          </section>

          {/* Features Grid */}
          <section>
            <SectionHeading
              icon={FiZap}
              title={t.quickAccess}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: t.subjects, icon: FiBook, path: '/subjects', color: 'bg-blue-50 text-blue-600' },
                { label: t.models3D, icon: FiBox, path: '/ar', color: 'bg-purple-50 text-purple-600' },
                { label: t.favorites, icon: FiStar, path: '/favorites', color: 'bg-amber-50 text-amber-600' },
                { label: t.profile, icon: FiUser, path: '/profile', color: 'bg-emerald-50 text-emerald-600' },
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
              title={t.featuredTopics}
              subtitle={t.curatedPaths}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeaturedCard
                badge={t.popular}
                badgeColor="bg-blue-100 text-blue-700"
                title={t.physicsFundamentals}
                desc={t.physicsFundamentalsDesc}
                onBtnClick={() => navigate('/subjects')}
                btnText={t.startLesson}
              />
              <FeaturedCard
                badge={t.new}
                badgeColor="bg-purple-100 text-purple-700"
                title={t.biologyIn3D}
                desc={t.biologyIn3DDesc}
                onBtnClick={() => navigate('/ar')}
                btnText={t.startLesson}
              />
              <FeaturedCard
                badge={t.trending}
                badgeColor="bg-amber-100 text-amber-700"
                title={t.chemistryReactions}
                desc={t.chemistryReactionsDesc}
                onBtnClick={() => navigate('/subjects')}
                btnText={t.startLesson}
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
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 text-indigo-600 text-sm font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                The Future of Education
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Explore STEM <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                  with AR Magic
                </span>
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
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
                <p className="text-lg text-slate-500 max-w-md mx-auto lg:mx-0 font-medium">
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