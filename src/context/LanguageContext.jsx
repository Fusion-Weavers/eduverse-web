import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const LanguageContext = createContext();

// Supported languages with their display names and codes
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" }
];

const DEFAULT_LANGUAGE = "en";
const FALLBACK_LANGUAGE = "en";

// Google Gemini API configuration for translations
const TRANSLATE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Static translations for UI elements
const UI_TRANSLATIONS = {
  en: {
    loading: "Loading",
    error: "Error",
    notFound: "Not Found",
    backButton: "Back",
    searchPlaceholder: "Search...",
    search: "Search",
    favorites: "Favorites",
    profile: "Profile",
    subjects: "Subjects",
    topics: "Topics",
    concepts: "Concepts",
    quickAccess: "Quick Access",
    models3D: "3D Models",
    featuredTopics: "Featured Topics",
    curatedPaths: "Curated learning paths trending this week.",
    popular: "Popular",
    new: "New",
    trending: "Trending",
    startLesson: "Start Lesson",
    physicsFundamentals: "Physics Fundamentals",
    physicsFundamentalsDesc: "Master the core concepts of motion, energy, and forces.",
    biologyIn3D: "Biology in 3D",
    biologyIn3DDesc: "Explore human anatomy and systems with immersive models.",
    chemistryReactions: "Chemistry Reactions",
    chemistryReactionsDesc: "Understand atomic structures and chemical reactions.",
    welcomeBack: "Welcome Back",
    learner: "Learner",
    readyToContinue: "Ready to continue your exploration? Your 3D models and saved lessons are waiting.",
    // Auth & Landing
    signIn: "Sign In",
    getStarted: "Get Started",
    emailAddress: "Email Address",
    password: "Password",
    forgotPassword: "Forgot password?",
    donHaveAccount: "Don’t have an account?",
    createAccount: "Create account",
    alreadyHaveAccount: "Already have an account?",
    logInHere: "Log in here",
    signingIn: "Signing in...",
    cAccount: "Create Account",
    joinUs: "Join us to start your learning journey today.",
    creatingAccount: "Creating account...",
    enterCredentials: "Enter your credentials to access your account.",
    pleaseFillAll: "Please fill in all fields to continue.",
    passMin6: "Password must be at least 6 characters long.",
    // Landing
    futureOfEducation: "The Future of Education",
    exploreSTEM: "Explore STEM",
    withARMagic: "with AR Magic",
    heroDesc: "Experience interactive learning through augmented reality. Master complex STEM concepts in your preferred language with immersive 3D visualizations.",
    startLearningFree: "Start Learning Free",
    view3DDemo: "View 3D Demo",
    whyChoose: "Why Choose Eduverse?",
    immersiveTech: "Immersive technology meets traditional curriculum.",
    mobileApp: "Mobile App",
    takeLabWithYou: "Take the Lab With You",
    mobileAppDesc: "Experience full AR capabilities on your smartphone. Scan to download the APK directly.",
    downloadAndroidApp: "Download Android App",
    downloadAPK: "Download APK",
    interactiveAR: "Interactive AR",
    interactiveARDesc: "Explore 3D models of scientific concepts in your physical space.",
    multiLanguage: "Multi-Language",
    multiLanguageDesc: "Learn in your preferred language with seamless content translation.",
    comprehensive: "Comprehensive",
    comprehensiveDesc: "Structured lessons across Physics, Chemistry, and Biology.",
    selfPaced: "Self-Paced",
    selfPacedDesc: "Save favorites and track your learning progress over time.",

    difficulty: {
      title: "Difficulty",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced"
    },
    sortBy: "Sort By",
    time: "Time",
    all: "Universal",
    name: "Name",
    // AR Page
    arLearning: "3D Learning",
    immersiveVisualConcepts: "Immersive Visual Concepts",
    exploreInteractiveVis: "Explore {count} interactive visualizations. Interact with complex STEM topics through Augmented Reality and 3D modeling directly in your browser.",
    sort: "Sort",
    clickToLaunch: "Click to launch experience",
    loading3DExperience: "Loading 3D Experience...",
    systemNotification: "System Notification",
    noArConcepts: "No 3D concepts found",
    noArConceptsDesc: "We couldn't find any concepts matching your current filters. Try selecting a different category.",
    clearFilters: "Clear Filters",
    arModel: "AR Model",
    // Subjects & Topics
    loadingCurriculum: "Loading curriculum...",
    connectionIssue: "Connection Issue",
    tryAgain: "Try Again",
    subjectNotFound: "Subject Not Found",
    subjectNotFoundDesc: "The requested subject ID does not exist in our curriculum.",
    viewAllSubjects: "View All Subjects",
    courseCatalog: "Course Catalog",
    catalogSubtitle: "Select a scientific discipline to begin your journey.",
    explore: "Explore",
    topicsCount: "Topics",
    // Search
    exploreKnowledge: "Explore Knowledge",
    searchSubtitle: "Find specific topics, concepts, or browse through our entire STEM library.",
    trySearchingFor: "Try searching for:",
    // Profile
    manageAccount: "Manage your account settings and view your learning progress.",
    preferences: "Preferences",
    cloudSync: "Cloud Sync",
    clearCache: "Clear Cache",
    synced: "Synced",
    syncing: "Syncing...",
    pending: "Pending",
    actionsQueued: "actions queued",
    topicsViewed: "Topics Viewed",
    conceptsRead: "Concepts Read",
    minutesRead: "Minutes Read",
    memberSince: "Member since",
    student: "Student",
    // Favorites
    myFavorites: "My Favorites",
    favoritesSubtitle: "Your curated collection of STEM topics and concepts.",
    yourCollection: "Your Collection",
    viewFullList: "View Full List",
    noFavorites: "No favorites yet",
    startExploring: "Start exploring STEM concepts and topics. Use the heart button to save your favorite content for easy access later.",
    exploreSubjects: "Explore Subjects",
    saved: "Saved",
    clearAll: "Clear All",
    confirmClearFavorites: "Clear all favorites?",
    confirmClearDesc: "This will remove all favorites from your account. This action cannot be undone.",
    cancel: "Cancel",
    yesClearAll: "Yes, Clear All",
    syncingFavorites: "Syncing favorites...",
    pendingSync: "change(s) pending sync",
    // Navbar
    home: "Home",
    admin: "Admin",
    signOut: "Sign Out",
    settings: "Settings"
  },
  hi: {
    loading: "लोड हो रहा है",
    error: "त्रुटि",
    notFound: "नहीं मिला",
    backButton: "वापस",
    searchPlaceholder: "खोजें...",
    search: "खोजें",
    favorites: "पसंदीदा",
    profile: "प्रोफ़ाइल",
    subjects: "विषय",
    topics: "विषय-सूची",
    concepts: "अवधारणाएं",
    quickAccess: "त्वरित पहुंच",
    models3D: "3D मॉडल",
    featuredTopics: "विशेष विषय",
    curatedPaths: "इस सप्ताह ट्रेंडिंग क्यूरेटेड लर्निंग पाथ।",
    popular: "लोकप्रिय",
    new: "नया",
    trending: "ट्रेंडिंग",
    startLesson: "पाठ शुरू करें",
    physicsFundamentals: "भौतिकी के मूल सिद्धांत",
    physicsFundamentalsDesc: "गति, ऊर्जा और बलों की मुख्य अवधारणाओं में महारत हासिल करें।",
    biologyIn3D: "3D में जीव विज्ञान",
    biologyIn3DDesc: "इमर्सिव मॉडल के साथ मानव शरीर रचना और प्रणालियों का अन्वेषण करें।",
    chemistryReactions: "रसायन विज्ञान प्रतिक्रियाएं",
    chemistryReactionsDesc: "परमाणु संरचनाओं और रासायनिक प्रतिक्रियाओं को समझें।",
    welcomeBack: "वापसी पर स्वागत है",
    learner: "शिक्षार्थी",
    readyToContinue: "जारी रखने के लिए तैयार हैं? आपके 3D मॉडल और सहेजे गए पाठ प्रतीक्षा कर रहे हैं।",
    // Auth & Landing
    signIn: "साइन इन",
    getStarted: "शुरू करें",
    emailAddress: "ईमेल पता",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    donHaveAccount: "खाता नहीं है?",
    createAccount: "खाता बनाएं",
    alreadyHaveAccount: "क्या आपके पास पहले से एक खाता मौजूद है?",
    logInHere: "यहाँ लॉग इन करें",
    signingIn: "साइन इन हो रहा है...",
    cAccount: "खाता बनाएं",
    joinUs: "आज ही अपनी सीखने की यात्रा शुरू करने के लिए हमसे जुड़ें।",
    creatingAccount: "खाता बनाया जा रहा है...",
    enterCredentials: "अपने खाते तक पहुंचने के लिए अपने क्रेडेंशियल्स दर्ज करें।",
    pleaseFillAll: "जारी रखने के लिए कृपया सभी फ़ील्ड भरें।",
    passMin6: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    // Landing
    futureOfEducation: "शिक्षा का भविष्य",
    exploreSTEM: "STEM का अन्वेषण करें",
    withARMagic: "AR जादू के साथ",
    heroDesc: "संवर्धित वास्तविकता के माध्यम से इंटरैक्टिव सीखने का अनुभव करें। अपनी पसंदीदा भाषा में इमर्सिव 3D विज़ुअलाइज़ेशन के साथ जटिल STEM अवधारणाओं में महारत हासिल करें।",
    startLearningFree: "मुफ्त में सीखना शुरू करें",
    view3DDemo: "3D डेमो देखें",
    whyChoose: "Eduverse क्यों चुनें?",
    immersiveTech: "इमर्सिव तकनीक पारंपरिक पाठ्यक्रम से मिलती है।",
    mobileApp: "मोबाइल ऐप",
    takeLabWithYou: "लैब को अपने साथ ले जाएं",
    mobileAppDesc: "अपने स्मार्टफोन पर पूर्ण AR क्षमताओं का अनुभव करें। सीधे APK डाउनलोड करने के लिए स्कैन करें।",
    downloadAndroidApp: "एंड्रॉइड ऐप डाउनलोड करें",
    downloadAPK: "APK डाउनलोड करें",
    interactiveAR: "इंटरैक्टिव AR",
    interactiveARDesc: "अपने भौतिक स्थान में वैज्ञानिक अवधारणाओं के 3D मॉडल का अन्वेषण करें।",
    multiLanguage: "बहु-भाषा",
    multiLanguageDesc: "सहज सामग्री अनुवाद के साथ अपनी पसंदीदा भाषा में सीखें।",
    comprehensive: "व्यापक",
    comprehensiveDesc: "भौतिकी, रसायन विज्ञान और जीव विज्ञान में संरचित पाठ।",
    selfPaced: "स्व-रफ़्तार",
    selfPacedDesc: "पसंदीदा सहेजें और समय के साथ अपनी सीखने की प्रगति को ट्रैक करें।",

    difficulty: {
      title: "कठिलाई",
      beginner: "शुरुआती",
      intermediate: "मध्यवर्ती",
      advanced: "उन्नत"
    },
    sortBy: "क्रमबद्ध करें",
    time: "समय",
    all: "सभी",
    name: "नाम",
    // AR Page
    arLearning: "3D लर्निंग",
    immersiveVisualConcepts: "इमर्सिव विज़ुअल कॉन्सेप्ट्स",
    exploreInteractiveVis: "{count} इंटरैक्टिव विज़ुअलाइज़ेशन का अन्वेषण करें। अपने ब्राउज़र में सीधे ऑगमेंटेड रियलिटी और 3D मॉडलिंग के माध्यम से जटिल STEM विषयों के साथ इंटरैक्ट करें।",
    sort: "क्रमबद्ध",
    clickToLaunch: "अनुभव शुरू करने के लिए क्लिक करें",
    loading3DExperience: "3D अनुभव लोड हो रहा है...",
    systemNotification: "सिस्टम सूचना",
    noArConcepts: "कोई 3D अवधारणा नहीं मिली",
    noArConceptsDesc: "हमें आपके वर्तमान फ़िल्टर के अनुसार कोई अवधारणा नहीं मिली। एक अलग श्रेणी चुनने का प्रयास करें।",
    clearFilters: "फ़िल्टर साफ़ करें",
    arModel: "AR मॉडल",
    // Subjects & Topics
    loadingCurriculum: "पाठ्यक्रम लोड हो रहा है...",
    connectionIssue: "कनेक्शन समस्या",
    tryAgain: "पुनः प्रयास करें",
    subjectNotFound: "विषय नहीं मिला",
    subjectNotFoundDesc: "अनुरोधित विषय आईडी हमारे पाठ्यक्रम में मौजूद नहीं है।",
    viewAllSubjects: "सभी विषय देखें",
    courseCatalog: "पाठ्यक्रम सूची",
    catalogSubtitle: "अपनी यात्रा शुरू करने के लिए एक वैज्ञानिक अनुशासन चुनें।",
    explore: "अन्वेषण करें",
    topicsCount: "विषय",
    // Search
    exploreKnowledge: "ज्ञान का अन्वेषण करें",
    searchSubtitle: "विशिष्ट विषय, अवधारणाएं खोजें, या हमारी पूरी STEM लाइब्रेरी ब्राउज़ करें।",
    trySearchingFor: "इसके लिए खोजने का प्रयास करें:",
    // Profile
    manageAccount: "अपनी खाता सेटिंग्स प्रबंधित करें और अपनी सीखने की प्रगति देखें।",
    preferences: "प्राथमिकताएं",
    cloudSync: "क्लाउड सिंक",
    clearCache: "कैश साफ़ करें",
    synced: "सिंक किया गया",
    syncing: "सिंक हो रहा है...",
    pending: "लंबित",
    actionsQueued: "क्रियाएं कतार में",
    topicsViewed: "विषय देखे गए",
    conceptsRead: "अवधारणाएं पढ़ी गईं",
    minutesRead: "मिनट पढ़े गए",
    memberSince: "से सदस्य",
    student: "छात्र",
    // Favorites
    myFavorites: "मेरे पसंदीदा",
    favoritesSubtitle: "STEM विषयों और अवधारणाओं का आपका क्यूरेटेड संग्रह।",
    yourCollection: "आपका संग्रह",
    viewFullList: "पूरी सूची देखें",
    noFavorites: "अभी तक कोई पसंदीदा नहीं",
    startExploring: "STEM अवधारणाओं और विषयों की खोज शुरू करें। बाद में आसान पहुंच के लिए अपनी पसंदीदा सामग्री को सहेजने के लिए दिल के बटन का उपयोग करें।",
    exploreSubjects: "विषयों का अन्वेषण करें",
    saved: "सहेजा गया",
    clearAll: "सभी साफ़ करें",
    confirmClearFavorites: "सभी पसंदीदा साफ़ करें?",
    confirmClearDesc: "यह आपके खाते से सभी पसंदीदा हटा देगा। इस कार्रवाई को पूर्ववत नहीं किया जा सकता है।",
    cancel: "रद्द करें",
    yesClearAll: "हाँ, सभी साफ़ करें",
    syncingFavorites: "पसंदीदा सिंक हो रहे हैं...",
    pendingSync: "परिवर्तन सिंक लंबित",
    // Navbar
    home: "होम",
    admin: "एडमिन",
    signOut: "साइन आउट",
    settings: "सेटिंग्स"
  },
  bn: {
    loading: "লোড হচ্ছে",
    error: "ত্রুটি",
    notFound: "পাওয়া যায়নি",
    backButton: "ফিরে যান",
    searchPlaceholder: "অনুসন্ধান করুন...",
    search: "অনুসন্ধান",
    favorites: "প্রিয়",
    profile: "প্রোফাইল",
    subjects: "বিষয়",
    topics: "বিষয়সূচি",
    concepts: "ধারণা",
    quickAccess: "দ্রুত প্রবেশ",
    models3D: "3D মডেল",
    featuredTopics: "বৈশিষ্ট্যযুক্ত বিষয়",
    curatedPaths: "এই সপ্তাহে ট্রেন্ডিং কিউরেটেড শেখার পথ।",
    popular: "জনপ্রিয়",
    new: "নতুন",
    trending: "ট্রেন্ডিং",
    startLesson: "পাঠ শুরু করুন",
    physicsFundamentals: "পদার্থবিজ্ঞানের মৌলিক বিষয়",
    physicsFundamentalsDesc: "গতি, শক্তি এবং বলের মূল ধারণাগুলি আয়ত্ত করুন।",
    biologyIn3D: "3D তে জীববিজ্ঞান",
    biologyIn3DDesc: "নিমজ্জিত মডেল দিয়ে মানব শারীরস্থান এবং সিস্টেম অন্বেষণ করুন।",
    chemistryReactions: "রসায়ন বিক্রিয়া",
    chemistryReactionsDesc: "পারমাণবিক কাঠামো এবং রাসায়নিক বিক্রিয়া বুঝুন।",
    welcomeBack: "স্বাগতম",
    learner: "শিক্ষার্থী",
    readyToContinue: "চালিয়ে যেতে প্রস্তুত? আপনার 3D মডেল এবং সংরক্ষিত পাঠ অপেক্ষা করছে।",
    // Auth & Landing
    signIn: "সাইন ইন",
    getStarted: "শুরু করুন",
    emailAddress: "ইমেল ঠিকানা",
    password: "পাসওয়ার্ড",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    donHaveAccount: "অ্যাকাউন্ট নেই?",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    alreadyHaveAccount: "ইতোমধ্যে একটি একাউন্ট আছে?",
    logInHere: "এখানে লগ ইন করুন",
    signingIn: "সাইন ইন করা হচ্ছে...",
    cAccount: "অ্যাকাউন্ট তৈরি করুন",
    joinUs: "আজই আপনার শেখার যাত্রা শুরু করতে আমাদের সাথে যোগ দিন।",
    creatingAccount: "অ্যাকাউন্ট তৈরি করা হচ্ছে...",
    enterCredentials: "আপনার অ্যাকাউন্টে প্রবেশ করতে আপনার শংসাপত্র লিখুন।",
    pleaseFillAll: "চালিয়ে যেতে অনুগ্রহ করে সমস্ত ক্ষেত্র পূরণ করুন।",
    passMin6: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    // Landing
    futureOfEducation: "শিক্ষার ভবিষ্যৎ",
    exploreSTEM: "STEM অন্বেষণ করুন",
    withARMagic: "AR জাদু দিয়ে",
    heroDesc: "অগমেন্টেড রিয়েলিটির মাধ্যমে ইন্টারেক্টিভ শেখার অভিজ্ঞতা নিন। আপনার পছন্দের ভাষায় নিমজ্জিত 3D ভিজ্যুয়ালাইজেশন দিয়ে জটিল STEM ধারণাগুলি আয়ত্ত করুন।",
    startLearningFree: "বিনামূল্যে শেখা শুরু করুন",
    view3DDemo: "3D ডেমো দেখুন",
    whyChoose: "কেন Eduverse বেছে নেবেন?",
    immersiveTech: "নিমজ্জিত প্রযুক্তি ঐতিহ্যবাহী পাঠ্যক্রমের সাথে মিলিত হয়।",
    mobileApp: "মোবাইল অ্যাপ",
    takeLabWithYou: "ল্যাবটি আপনার সাথে নিন",
    mobileAppDesc: "আপনার স্মার্টফোনে সম্পূর্ণ AR ক্ষমতার অভিজ্ঞতা নিন। সরাসরি APK ডাউনলোড করতে স্ক্যান করুন।",
    downloadAndroidApp: "অ্যান্ড্রয়েড অ্যাপ ডাউনলোড করুন",
    downloadAPK: "APK ডাউনলোড করুন",
    interactiveAR: "ইন্টারেক্টিভ AR",
    interactiveARDesc: "আপনার শারীরিক স্থানে বৈজ্ঞানিক ধারণার 3D মডেল অন্বেষণ করুন।",
    multiLanguage: "বহু-ভাষা",
    multiLanguageDesc: "নির্বিঘ্ন বিষয়বস্তু অনুবাদের সাথে আপনার পছন্দের ভাষায় শিখুন।",
    comprehensive: "ব্যাপক",
    comprehensiveDesc: "পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞানে কাঠামোগত পাঠ।",
    selfPaced: "স্ব-গতিসম্পন্ন",
    selfPacedDesc: "প্রিয়ভাজন সংরক্ষণ করুন এবং সময়ের সাথে আপনার শেখার অগ্রগতি ট্র্যাক করুন।",

    difficulty: {
      title: "স্তর",
      beginner: "শিক্ষানবিস",
      intermediate: "মধ্যবর্তী",
      advanced: "উন্নত"
    },
    sortBy: "সাজান",
    time: "সময়",
    all: "সর্বজনীন",
    name: "নাম",
    // AR Page
    arLearning: "3D শিক্ষা",
    immersiveVisualConcepts: "নিমজ্জিত ভিজ্যুয়াল ধারণা",
    exploreInteractiveVis: "{count}টি ইন্টারেক্টিভ ভিজ্যুয়ালাইজেশন অন্বেষণ করুন। অগমেন্টেড রিয়েলিটি এবং 3D মডেলিং এর মাধ্যমে সরাসরি আপনার ব্রাউজারে জটিল STEM বিষয়গুলির সাথে ইন্টারঅ্যাক্ট করুন।",
    sort: "সাজান",
    clickToLaunch: "অভিজ্ঞতা চালু করতে ক্লিক করুন",
    loading3DExperience: "3D অভিজ্ঞতা লোড হচ্ছে...",
    systemNotification: "সিস্টেম বিজ্ঞপ্তি",
    noArConcepts: "কোনো 3D ধারণা পাওয়া যায়নি",
    noArConceptsDesc: "আপনার বর্তমান ফিল্টারের সাথে মেলে এমন কোনো ধারণা আমরা খুঁজে পাইনি। একটি ভিন্ন ক্যাটেগরি নির্বাচন করার চেষ্টা করুন।",
    clearFilters: "ফিল্টার সাফ করুন",
    arModel: "AR মডেল",
    // Subjects & Topics
    loadingCurriculum: "পাঠ্যক্রম লোড করা হচ্ছে...",
    connectionIssue: "সংযোগ সমস্যা",
    tryAgain: "আবার চেষ্টা করুন",
    subjectNotFound: "বিষয় পাওয়া যায়নি",
    subjectNotFoundDesc: "অনুরোধ করা বিষয় আইডি আমাদের পাঠ্যক্রমে বিদ্যমান নেই।",
    viewAllSubjects: "সব বিষয় দেখুন",
    courseCatalog: "কোর্স ক্যাটালগ",
    catalogSubtitle: "আপনার যাত্রা শুরু করতে একটি বৈজ্ঞানিক শৃঙ্খলা নির্বাচন করুন।",
    explore: "অন্বেষণ",
    topicsCount: "বিষয়",
    // Search
    exploreKnowledge: "জ্ঞান অন্বেষণ করুন",
    searchSubtitle: "নির্দিষ্ট বিষয়, ধারণা খুঁজুন বা আমাদের সম্পূর্ণ STEM লাইব্রেরি ব্রাউজ করুন।",
    trySearchingFor: "অনুসন্ধান করার চেষ্টা করুন:",
    // Profile
    manageAccount: "আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন এবং আপনার শেখার অগ্রগতি দেখুন।",
    preferences: "পছন্দসমূহ",
    cloudSync: "ক্লাউড সিঙ্ক",
    clearCache: "ক্যাশে সাফ করুন",
    synced: "সিঙ্ক করা হয়েছে",
    syncing: "সিঙ্ক হচ্ছে...",
    pending: "অমীমাংসিত",
    actionsQueued: "অ্যাকশন সারিবদ্ধ",
    topicsViewed: "বিষয় দেখা হয়েছে",
    conceptsRead: "ধারণা পড়া হয়েছে",
    minutesRead: "মিনিট পড়া হয়েছে",
    memberSince: "সদস্য যেহেতু",
    student: "ছাত্র",
    // Favorites
    myFavorites: "আমার প্রিয়",
    favoritesSubtitle: "STEM বিষয় এবং ধারণার আপনার কিউরেটেড সংগ্রহ।",
    yourCollection: "আপনার সংগ্রহ",
    viewFullList: "সম্পূর্ণ তালিকা দেখুন",
    noFavorites: "এখনও কোন প্রিয় নেই",
    startExploring: "STEM ধারণা এবং বিষয় অন্বেষণ শুরু করুন। পরে সহজে অ্যাক্সেসের জন্য আপনার প্রিয় বিষয়বস্তু সংরক্ষণ করতে হার্ট বোতাম ব্যবহার করুন।",
    exploreSubjects: "বিষয় অন্বেষণ করুন",
    saved: "সংরক্ষিত",
    clearAll: "সব সাফ করুন",
    confirmClearFavorites: "সব প্রিয় সাফ করবেন?",
    confirmClearDesc: "এটি আপনার অ্যাকাউন্ট থেকে সমস্ত প্রিয় সরিয়ে ফেলবে। এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।",
    cancel: "বাতিল করুন",
    yesClearAll: "হ্যাঁ, সব সাফ করুন",
    syncingFavorites: "প্রিয় সিঙ্ক করা হচ্ছে...",
    pendingSync: "পরিবর্তন সিঙ্ক অমীমাংসিত",
    // Navbar
    home: "হোম",
    admin: "অ্যাডমিন",
    signOut: "সাইন আউট",
    settings: "সেটিংস"
  }
};

// Translation utilities
const TranslationUtils = {
  // Get cached translation
  getCachedTranslation: (contentId, language, contentHash) => {
    try {
      const cacheKey = `translation_${contentId}_${language}_${contentHash}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is still valid (30 days for translations)
        const cacheTime = new Date(parsed.timestamp);
        const now = new Date();
        const daysDiff = (now - cacheTime) / (1000 * 60 * 60 * 24);

        if (daysDiff < 30) {
          console.log(`✅ Using cached translation for ${contentId} in ${language}`);
          return parsed.data;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.error('Error reading translation cache:', error);
    }
    return null;
  },

  // Save translation to cache
  saveTranslationToCache: (contentId, language, contentHash, translation) => {
    try {
      const cacheKey = `translation_${contentId}_${language}_${contentHash}`;
      const cacheEntry = {
        data: translation,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      console.log(`💾 Cached translation for ${contentId} in ${language}`);
    } catch (error) {
      console.error('Error saving translation to cache:', error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        TranslationUtils.clearOldTranslationCache();
      }
    }
  },

  // Clear old translation cache
  clearOldTranslationCache: () => {
    try {
      const keys = Object.keys(localStorage);
      const translationKeys = keys.filter(key => key.startsWith('translation_'));

      // Sort by timestamp and remove oldest entries
      const cacheEntries = translationKeys.map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          return { key, timestamp: new Date(data.timestamp) };
        } catch {
          return { key, timestamp: new Date(0) };
        }
      });

      cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest 30% of translation entries
      const toRemove = Math.ceil(cacheEntries.length * 0.3);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(cacheEntries[i].key);
      }
      console.log(`🧹 Cleared ${toRemove} old translation cache entries`);
    } catch (error) {
      console.error('Error clearing old translation cache:', error);
    }
  },

  // Generate content hash for caching
  generateContentHash: (content) => {
    // Simple hash function for content identification
    let hash = 0;
    const str = JSON.stringify(content);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },

  // Translate text using Google Gemini API
  translateText: async (text, targetLanguage, sourceLanguage = 'en') => {
    if (!TRANSLATE_API_KEY) {
      throw new Error("Translation API key not configured");
    }

    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'bn': 'Bengali'
    };

    try {
      const prompt = `Translate the following text from ${languageNames[sourceLanguage] || sourceLanguage} to ${languageNames[targetLanguage] || targetLanguage}. Only provide the translation without any additional explanation or commentary:\n\n${text}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!translatedText) {
        throw new Error('No translation received from API');
      }

      return translatedText;
    } catch (error) {
      console.error('Translation API error:', error);
      throw error;
    }
  },

  // Translate content object with smart batching
  translateContent: async (content, targetLanguage, sourceLanguage = 'en') => {
    if (!TRANSLATE_API_KEY) {
      throw new Error("Translation API key not configured");
    }

    try {
      // Extract all text fields to translate
      const textsToTranslate = [];
      const textMap = {};

      // Helper to extract text recursively
      const extractTexts = (obj, path = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;

          if (typeof value === 'string' && value.trim()) {
            textsToTranslate.push(value);
            textMap[textsToTranslate.length - 1] = currentPath;
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'string' && item.trim()) {
                textsToTranslate.push(item);
                textMap[textsToTranslate.length - 1] = `${currentPath}[${index}]`;
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            extractTexts(value, currentPath);
          }
        }
      };

      extractTexts(content);

      if (textsToTranslate.length === 0) {
        return content;
      }

      console.log(`🌐 Translating ${textsToTranslate.length} text segments to ${targetLanguage}...`);

      const languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'bn': 'Bengali'
      };

      // Batch translate all texts using Gemini
      const prompt = `Translate the following JSON array of text strings from ${languageNames[sourceLanguage] || sourceLanguage} to ${languageNames[targetLanguage] || targetLanguage}. Return ONLY a valid JSON array with the translations in the same order, without any additional text, explanation, or markdown formatting:\n\n${JSON.stringify(textsToTranslate)}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Translation API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const translatedTextRaw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!translatedTextRaw) {
        throw new Error('No translation received from API');
      }

      // Parse the JSON response, removing any markdown code blocks if present
      let translatedTexts;
      try {
        const cleanedResponse = translatedTextRaw.replace(/```json\n?|```\n?/g, '').trim();
        translatedTexts = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('Failed to parse translation response:', translatedTextRaw);
        throw new Error('Invalid translation response format');
      }

      if (!Array.isArray(translatedTexts) || translatedTexts.length !== textsToTranslate.length) {
        throw new Error('Translation count mismatch');
      }

      // Convert to the expected format
      const translations = translatedTexts.map(text => ({ translatedText: text }));

      // Reconstruct the content object with translations
      const translatedContent = JSON.parse(JSON.stringify(content));

      translations.forEach((translation, index) => {
        const path = textMap[index];
        const translatedText = translation.translatedText;

        // Set the translated text at the correct path
        const pathParts = path.split('.');
        let current = translatedContent;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          const arrayMatch = part.match(/(.+)\[(\d+)\]/);

          if (arrayMatch) {
            const [, key, idx] = arrayMatch;
            current = current[key][parseInt(idx)];
          } else {
            current = current[part];
          }
        }

        const lastPart = pathParts[pathParts.length - 1];
        const arrayMatch = lastPart.match(/(.+)\[(\d+)\]/);

        if (arrayMatch) {
          const [, key, idx] = arrayMatch;
          current[key][parseInt(idx)] = translatedText;
        } else {
          current[lastPart] = translatedText;
        }
      });

      console.log(`✅ Translation completed for ${targetLanguage}`);
      return translatedContent;

    } catch (error) {
      console.error('Content translation error:', error);
      throw error;
    }
  },

  // Get UI translation
  getUITranslation: (key, language = DEFAULT_LANGUAGE) => {
    const translations = UI_TRANSLATIONS[language] || UI_TRANSLATIONS[DEFAULT_LANGUAGE];
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value || key;
  },

  // Get language display name
  getLanguageDisplayName: (languageCode) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    return language ? language.nativeName : languageCode;
  },

  // Check if language is supported
  isLanguageSupported: (languageCode) => {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [fallbackLanguage, setFallbackLanguage] = useState(FALLBACK_LANGUAGE);
  const [translationError, setTranslationError] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationQueue, setTranslationQueue] = useState(new Map());

  // Load language preference from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferred_language');
      const savedFallback = localStorage.getItem('fallback_language');

      if (savedLanguage && TranslationUtils.isLanguageSupported(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }

      if (savedFallback && TranslationUtils.isLanguageSupported(savedFallback)) {
        setFallbackLanguage(savedFallback);
      }
    } catch (error) {
      console.error('Error loading language preferences:', error);
    }
  }, []);

  // Save language preference to localStorage
  const saveLanguagePreference = (language, fallback = null) => {
    try {
      localStorage.setItem('preferred_language', language);
      if (fallback) {
        localStorage.setItem('fallback_language', fallback);
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Change current language
  const changeLanguage = useCallback((languageCode) => {
    if (TranslationUtils.isLanguageSupported(languageCode)) {
      setCurrentLanguage(languageCode);
      saveLanguagePreference(languageCode, fallbackLanguage);
      setTranslationError(null);
    } else {
      console.error(`Unsupported language: ${languageCode}`);
    }
  }, [fallbackLanguage]);

  // Change fallback language
  const changeFallbackLanguage = useCallback((languageCode) => {
    if (TranslationUtils.isLanguageSupported(languageCode)) {
      setFallbackLanguage(languageCode);
      saveLanguagePreference(currentLanguage, languageCode);
    }
  }, [currentLanguage]);

  // Get localized content for a concept/topic
  const getLocalizedContent = useCallback(async (content, contentId = 'unknown') => {
    // If content already exists in current language, return it
    if (content[currentLanguage]) {
      return {
        ...content[currentLanguage],
        language: currentLanguage,
        isTranslated: false
      };
    }

    // If no source content available, return first available
    if (!content[fallbackLanguage] && !content.en) {
      const availableLanguages = Object.keys(content);
      if (availableLanguages.length > 0) {
        const firstAvailable = availableLanguages[0];
        return {
          ...content[firstAvailable],
          language: firstAvailable,
          isTranslated: false,
          isFallback: true,
          fallbackReason: 'language_unavailable'
        };
      }
      throw new Error('No content available in any language');
    }

    // Get source content (prefer fallback language, then English)
    const sourceContent = content[fallbackLanguage] || content.en;
    const sourceLanguage = content[fallbackLanguage] ? fallbackLanguage : 'en';

    // Generate content hash for caching
    const contentHash = TranslationUtils.generateContentHash(sourceContent);

    // Check cache first
    const cached = TranslationUtils.getCachedTranslation(contentId, currentLanguage, contentHash);
    if (cached) {
      return {
        ...cached,
        language: currentLanguage,
        isTranslated: true,
        fromCache: true
      };
    }

    // Check if translation API is available
    if (!TRANSLATE_API_KEY) {
      console.warn('Translation API key not configured, using fallback');
      return {
        ...sourceContent,
        language: sourceLanguage,
        isTranslated: false,
        isFallback: true,
        fallbackReason: 'translation_unavailable'
      };
    }

    // Check if already translating this content
    const queueKey = `${contentId}_${currentLanguage}`;
    if (translationQueue.has(queueKey)) {
      console.log(`⏳ Translation already in progress for ${contentId}`);
      return translationQueue.get(queueKey);
    }

    // Start translation
    setIsTranslating(true);
    setTranslationError(null);

    const translationPromise = (async () => {
      try {
        console.log(`🔄 Translating ${contentId} from ${sourceLanguage} to ${currentLanguage}...`);

        const translated = await TranslationUtils.translateContent(
          sourceContent,
          currentLanguage,
          sourceLanguage
        );

        // Cache the translation
        TranslationUtils.saveTranslationToCache(contentId, currentLanguage, contentHash, translated);

        const result = {
          ...translated,
          language: currentLanguage,
          isTranslated: true,
          fromCache: false
        };

        // Remove from queue
        setTranslationQueue(prev => {
          const newQueue = new Map(prev);
          newQueue.delete(queueKey);
          return newQueue;
        });

        return result;

      } catch (error) {
        console.error('Translation failed:', error);
        setTranslationError(error.message);

        // Remove from queue
        setTranslationQueue(prev => {
          const newQueue = new Map(prev);
          newQueue.delete(queueKey);
          return newQueue;
        });

        // Return fallback content
        return {
          ...sourceContent,
          language: sourceLanguage,
          isTranslated: false,
          isFallback: true,
          fallbackReason: 'translation_failed',
          error: error.message
        };
      } finally {
        setIsTranslating(false);
      }
    })();

    // Add to queue
    setTranslationQueue(prev => new Map(prev.set(queueKey, translationPromise)));

    return translationPromise;
  }, [currentLanguage, fallbackLanguage, translationQueue]);

  // Clear all translation cache
  const clearTranslationCache = useCallback(() => {
    TranslationUtils.clearOldTranslationCache();
  }, []);

  const value = useMemo(() => ({
    // Current state
    currentLanguage,
    fallbackLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isTranslating,
    translationError,

    // Actions
    changeLanguage,
    changeFallbackLanguage,
    getLocalizedContent,
    clearTranslationCache,

    // Utilities
    getLanguageDisplayName: TranslationUtils.getLanguageDisplayName,
    isLanguageSupported: TranslationUtils.isLanguageSupported,
    getUITranslation: TranslationUtils.getUITranslation,

    // API availability
    isTranslateApiAvailable: !!TRANSLATE_API_KEY,
    isGeminiAvailable: !!TRANSLATE_API_KEY
  }), [
    currentLanguage,
    fallbackLanguage,
    isTranslating,
    translationError,
    changeLanguage,
    changeFallbackLanguage,
    getLocalizedContent,
    clearTranslationCache
  ]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
