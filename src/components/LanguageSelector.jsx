import { useState } from "react";
import { IoGlobeOutline, IoRefreshOutline, IoChevronDownOutline, IoCheckmarkOutline, IoSearchOutline } from "react-icons/io5";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector({
  variant = "dropdown", // "dropdown" | "compact" | "inline"
  showLabel = true,
  className = ""
}) {
  const {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    isTranslating,
    isGeminiAvailable
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
    setSearch("");
  };

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLanguage);
  const filteredLanguages = supportedLanguages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  // --- Variant: Compact (Navbar style) ---
  if (variant === "compact") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating}
          className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-full text-slate-900 font-bold text-sm shadow-sm transition-all hover:bg-white hover:-translate-y-0.5"
        >
          <IoGlobeOutline className={`${isTranslating ? 'animate-spin text-indigo-500' : 'text-slate-400'}`} />
          <span>{currentLanguageInfo?.code.toUpperCase()}</span>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-3 w-64 z-50 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl shadow-slate-200/50 p-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-80 overflow-y-auto space-y-1">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                      currentLanguage === lang.code ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="font-bold text-sm">{lang.nativeName}</span>
                    {currentLanguage === lang.code && <IoCheckmarkOutline />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // --- Variant: Inline (Form style) ---
  if (variant === "inline") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {showLabel && <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Language</label>}
        <div className="relative group">
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isTranslating}
            className="w-full appearance-none bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl px-5 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
            ))}
          </select>
          <IoChevronDownOutline className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-900 transition-colors" />
        </div>
      </div>
    );
  }

  // --- Default: Full Dropdown ---
  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-3 px-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Language Preference</label>
          {!isGeminiAvailable && <span className="text-[10px] text-amber-500 font-bold">Standard Mode</span>}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm transition-all duration-300 ${isOpen ? 'ring-2 ring-indigo-500/20 translate-y-[-2px] bg-white' : 'hover:bg-white/90'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <IoGlobeOutline />
          </div>
          <div className="text-left">
            <div className="text-sm font-black text-slate-900 leading-none">{currentLanguageInfo?.nativeName}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-tighter mt-1">{currentLanguageInfo?.name}</div>
          </div>
        </div>
        <IoChevronDownOutline className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-slate-300'}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-4 z-50 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            
            {/* Search Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-100/50 border-none rounded-xl py-3 pl-11 pr-4 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    currentLanguage === lang.code 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-indigo-50 text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold">{lang.nativeName}</div>
                    <div className={`text-[10px] uppercase tracking-widest ${currentLanguage === lang.code ? 'text-slate-400' : 'text-slate-400'}`}>{lang.name}</div>
                  </div>
                  {currentLanguage === lang.code && <IoCheckmarkOutline className="text-xl" />}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-50/80 p-4 text-center border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isGeminiAvailable ? "AI Real-time Translation Active" : "Pre-translated content only"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}