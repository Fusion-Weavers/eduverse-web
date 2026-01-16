import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IoSearchOutline, IoHourglassOutline, IoBulbOutline, 
  IoTimeOutline, IoChevronDownOutline, IoSparklesOutline 
} from "react-icons/io5";
import { useSearch } from "../context/SearchContext";

export default function SearchBar({ placeholder = "Search subjects, topics...", showSuggestions = true }) {
  const {
    searchQuery, suggestions, searchScope, isSearching,
    handleSearchChange, executeSearch, setScope, getPopularSearches
  } = useSearch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const displaySuggestions = suggestions.length > 0 ? suggestions : getPopularSearches();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch();
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&scope=${searchScope}`);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50">
      <form onSubmit={handleSubmit} className="group">
        <div className={`
          relative flex items-center bg-white/70 backdrop-blur-2xl border transition-all duration-500 rounded-full p-2
          ${showDropdown ? 'border-indigo-400/50 shadow-2xl shadow-indigo-500/10' : 'border-white/60 shadow-lg shadow-slate-200/50'}
        `}>
          
          {/* Scope Selector (The Glass Pill) */}
          <div className="relative hidden md:block border-r border-slate-200/50 pr-2 mr-2">
            <select
              value={searchScope}
              onChange={(e) => setScope(e.target.value)}
              className="appearance-none bg-transparent pl-4 pr-8 py-2 text-xs font-black uppercase tracking-widest text-slate-500 cursor-pointer focus:outline-none"
            >
              <option value="all">All Content</option>
              <option value="subjects">Subjects</option>
              <option value="topics">Topics</option>
              <option value="concepts">Concepts</option>
            </select>
            <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Main Input */}
          <div className="relative flex-1 flex items-center">
            <IoSearchOutline className={`ml-4 text-xl transition-colors duration-300 ${isSearching ? 'text-indigo-500' : 'text-slate-400'}`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e.target.value);
                setShowDropdown(e.target.value.trim().length > 0 && showSuggestions);
              }}
              onFocus={() => searchQuery.trim().length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder={placeholder}
              className="w-full bg-transparent px-4 py-3 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none"
              autoComplete="off"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className={`
              flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
              ${isSearching || !searchQuery.trim() ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white shadow-lg hover:bg-indigo-600 hover:-translate-y-0.5'}
            `}
          >
            {isSearching ? <IoHourglassOutline className="animate-spin" /> : <IoSparklesOutline />}
          </button>
        </div>

        {/* --- Dropdown Suggestions (The Glass Panel) --- */}
        {showDropdown && displaySuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b border-slate-100/50">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                {suggestions.length > 0 ? "Smart Suggestions" : "Popular Searches"}
              </span>
            </div>

            <div className="p-2 max-h-400px overflow-y-auto">
              {displaySuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => {
                    handleSearchChange(suggestion);
                    executeSearch(suggestion);
                    navigate(`/search?q=${encodeURIComponent(suggestion)}&scope=${searchScope}`);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-left
                    ${index === focusedIndex ? 'bg-slate-900 text-white translate-x-1 shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-lg
                    ${index === focusedIndex ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}
                  `}>
                    {suggestions.length > 0 ? <IoBulbOutline /> : <IoTimeOutline />}
                  </div>
                  <span className="font-bold flex-1">{suggestion}</span>
                  {index === focusedIndex && <IoSparklesOutline className="animate-pulse" />}
                </button>
              ))}
            </div>
            
            <div className="bg-slate-50/50 p-4 text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Press Enter to view all results</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}