import { Link } from "react-router-dom";
import { 
  IoLibraryOutline, IoBookOutline, IoDocumentTextOutline, 
  IoSearchOutline, IoSparklesOutline, IoChevronForwardOutline 
} from "react-icons/io5";
import { useSearch } from "../context/SearchContext";
import LoadingSpinner from "./LoadingSpinner";

export default function SearchResults({ showHeader = true }) {
  const { searchQuery, searchResults, isSearching, searchScope } = useSearch();

  const getScopeDisplayName = (scope) => {
    const scopes = {
      all: "All Content", subjects: "Subjects", topics: "Topics", 
      concepts: "Concepts", physics: "Physics", chemistry: "Chemistry",
      biology: "Biology", engineering: "Engineering"
    };
    return scopes[scope] || "All Content";
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "subject": return <IoLibraryOutline />;
      case "topic": return <IoBookOutline />;
      default: return <IoDocumentTextOutline />;
    }
  };

  const getResultPath = (result) => {
    if (result.type === "subject") return `/subjects/${result.id}`;
    if (result.type === "topic") return `/subjects/${result.subjectId}/${result.id}`;
    return `/subjects/${result.subjectId || 'unknown'}/${result.topicId || 'unknown'}/${result.id}`;
  };

  const highlightSearchTerms = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-indigo-500/10 text-indigo-600 rounded-sm px-0.5 font-bold italic">
          {part}
        </span>
      ) : part
    );
  };

  // --- 1. SEARCHING STATE ---
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-400px animate-in fade-in duration-500">
        <LoadingSpinner 
          message={`Searching ${getScopeDisplayName(searchScope).toLowerCase()}...`} 
          size="large" 
        />
      </div>
    );
  }

  // --- 2. EMPTY STATE (Instructions) ---
  if (!searchQuery.trim()) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 text-center space-y-8">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm border border-indigo-100">
            <IoSearchOutline />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Discover Content</h2>
          <p className="text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
            Enter a keyword to explore our vast library of physics, chemistry, and engineering concepts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {['Physics', 'Chemistry', 'Circuits'].map(tip => (
               <div key={tip} className="p-4 bg-white/50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400">
                 Try "{tip}"
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. RESULTS FEED ---
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
      {showHeader && (
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Search Results</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
              Showing <span className="text-indigo-600">{searchResults.length}</span> results in {getScopeDisplayName(searchScope)}
            </p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black tracking-widest">
            QUERY: {searchQuery.toUpperCase()}
          </div>
        </header>
      )}

      {searchResults.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-2xl border border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
          <IoSearchOutline className="text-6xl text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-900 mb-2">No matches found</h3>
          <p className="text-slate-500 mb-8 font-medium">Try broadening your search or using different keywords.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['DNA', 'Gravity', 'Molecules'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">#{tag}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {searchResults.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={getResultPath(result)}
              className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 transition-all duration-300 hover:bg-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon Column */}
                <div className="hidden md:flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:bg-indigo-600 transition-colors">
                    {getResultIcon(result.type)}
                  </div>
                  {result.relevanceScore && (
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                      {Math.round(result.relevanceScore)}% match
                    </span>
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{result.type}</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {highlightSearchTerms(result.type === 'concept' ? result.title : result.name, searchQuery)}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {highlightSearchTerms(
                      result.type === 'concept' 
                        ? (result.content?.en?.summary || 'Deep dive into ' + result.title)
                        : result.description, 
                      searchQuery
                    )}
                  </p>

                  {/* Breadcrumb Navigation */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    {result.subjectName && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <IoLibraryOutline /> {result.subjectName}
                      </span>
                    )}
                    {result.topicName && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <IoBookOutline /> {result.topicName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Column */}
                <div className="flex items-center justify-end">
                  <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all">
                    <IoChevronForwardOutline className="text-xl group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}