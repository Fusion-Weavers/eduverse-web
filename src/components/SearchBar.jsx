import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoSearchOutline, IoHourglassOutline, IoBulbOutline,
  IoTimeOutline, IoChevronDownOutline, IoSparklesOutline, IoArrowForwardOutline
} from "react-icons/io5";
import { useSearch } from "../context/SearchContext";

export default function SearchBar({ placeholder = "Search subjects, topics..." }) {
  const {
    searchQuery, searchScope, isSearching,
    handleSearchChange, executeSearch, setScope
  } = useSearch();

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch();
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&scope=${searchScope}`);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50">
      <form onSubmit={handleSubmit} className="group">
        <div className={`
          relative flex items-center bg-white/70 backdrop-blur-2xl border transition-all duration-500 rounded-full p-2
          border-white/60 shadow-lg shadow-slate-200/50
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
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent px-4 py-3 text-slate-900 font-bold placeholder:text-slate-400 !outline-none !border-none !ring-0 !shadow-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:!outline-none focus-visible:ring-0 focus-visible:border-none"
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
            {isSearching ? <IoHourglassOutline className="animate-spin" /> : <IoArrowForwardOutline />}
          </button>
        </div>
      </form>
    </div>
  );
}