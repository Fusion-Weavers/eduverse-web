import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { IoSearch, IoSparklesOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { useSearch } from "../context/SearchContext";
import { AmbientBackground, GlassCard, Badge } from "../components/ui/DesignSystem";

export default function Search() {
  const [searchParams] = useSearchParams();
  const { handleSearchChange, setScope, executeSearch } = useSearch();
  const lastQueryRef = useRef("");
  const lastScopeRef = useRef("");
  
  const query = searchParams.get("q") || "";
  const scope = searchParams.get("scope") || "all";

  // Update search state when URL parameters change
  useEffect(() => {
    // Only execute search if query or scope actually changed to prevent loops
    if (query && (query !== lastQueryRef.current || scope !== lastScopeRef.current)) {
      lastQueryRef.current = query;
      lastScopeRef.current = scope;
      
      handleSearchChange(query);
      setScope(scope);
      executeSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, scope]); 

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <AmbientBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Search Header Section */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 backdrop-blur-xl">
            <IoSearch className="text-3xl text-indigo-600" />
          </div>
          
          <h1 className="mb-4 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Explore Knowledge
          </h1>
          
          <p className="mb-10 text-lg text-slate-500">
            Find specific topics, concepts, or browse through our entire STEM library.
          </p>

          {/* Search Bar Container */}
          <div className="relative mx-auto transform transition-all duration-300 hover:scale-[1.01]">
            {/* Note: We wrap the SearchBar in a div to control its width and layout context 
              without modifying the SearchBar component itself if it's reused elsewhere.
            */}
            <div className="relative z-20">
              <SearchBar 
                placeholder="Search subjects, topics, and concepts..." 
                autoFocus={true}
              />
            </div>
            
            {/* Decorative Glow behind search bar */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-lg transition-opacity duration-300 group-focus-within:opacity-40" />
          </div>

          {/* Quick Hints */}
          {!query && (
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <IoSparklesOutline /> Try searching for:
              </span>
              <span className="cursor-pointer rounded-full bg-white/50 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-indigo-600 hover:ring-indigo-200 transition-all" onClick={() => executeSearch("Physics")}>
                Physics
              </span>
              <span className="cursor-pointer rounded-full bg-white/50 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-indigo-600 hover:ring-indigo-200 transition-all" onClick={() => executeSearch("Algorithm")}>
                Algorithms
              </span>
              <span className="cursor-pointer rounded-full bg-white/50 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-indigo-600 hover:ring-indigo-200 transition-all" onClick={() => executeSearch("Organic Chemistry")}>
                Organic Chemistry
              </span>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        <GlassCard className="min-h-[400px] p-6 sm:p-8" hoverEffect={false}>
          <SearchResults showHeader={true} />
        </GlassCard>

      </main>
    </div>
  );
}