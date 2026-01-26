import { useState, useMemo, useEffect } from "react";
import {
  IoArrowDownOutline, IoArrowUpOutline, IoLibraryOutline,
  IoSearchOutline, IoStar, IoSwapVerticalOutline, IoTimeOutline
} from "react-icons/io5";
import { useContent } from "../context/ContentContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
import { useLanguage } from "../context/LanguageContext";
import FavoriteButton from "./FavoriteButton";
import TopicFilter from "./TopicFilter";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";
import ErrorState from "./ErrorState";

export default function TopicList({ subjectId, onTopicSelect }) {
  const { user } = useAuth();
  const { getTopicsBySubject, subjects, trackUserActivity, loading, error } = useContent();
  const { isTopicFavorited } = useFavorites();
  const { saveSortState, getSortState, navigateWithState } = useNavigation();
  const { currentLanguage, getUITranslation } = useLanguage();

  const sortKey = `topic-sort-${subjectId}`;
  const savedSortState = getSortState(sortKey);

  const [sortBy, setSortBy] = useState(savedSortState.sortBy || "name");
  const [sortOrder, setSortOrder] = useState(savedSortState.sortOrder || "asc");
  const [filters, setFilters] = useState({ difficulty: 'all', searchTerm: '', showFavoritesOnly: false });

  const subject = subjects.find(s => s.id === subjectId);
  const topics = getTopicsBySubject(subjectId);

  useEffect(() => {
    saveSortState(sortKey, { sortBy, sortOrder });
  }, [sortBy, sortOrder, sortKey, saveSortState]);

  const filteredAndSortedTopics = useMemo(() => {
    // Critical safeguard: Check if topics exist and is an array
    if (!topics || !Array.isArray(topics)) return [];

    let filtered = [...topics];

    // Safety check filter
    filtered = filtered.filter(t => t && typeof t === 'object');

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(t => t.difficulty === filters.difficulty);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        (t.name && t.name.toLowerCase().includes(term)) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    }

    if (filters.showFavoritesOnly) {
      filtered = filtered.filter(t => isTopicFavorited(t.id));
    }

    return filtered.sort((a, b) => {
      // Safe access to properties for sorting
      const aName = a.name || '';
      const bName = b.name || '';

      let comp = 0;
      if (sortBy === "name") {
        comp = aName.localeCompare(bName);
      } else if (sortBy === "difficulty") {
        const order = { "beginner": 1, "intermediate": 2, "advanced": 3 };
        const aDiff = a.difficulty ? a.difficulty.toLowerCase() : 'beginner';
        const bDiff = b.difficulty ? b.difficulty.toLowerCase() : 'beginner';
        comp = (order[aDiff] || 1) - (order[bDiff] || 1);
      } else if (sortBy === "conceptCount") {
        comp = (a.conceptCount || 0) - (b.conceptCount || 0);
      } else if (sortBy === "estimatedTime") {
        comp = (a.estimatedTime || 0) - (b.estimatedTime || 0);
      }
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [topics, filters, sortBy, sortOrder, isTopicFavorited]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <IoSwapVerticalOutline className="opacity-50" />;
    return sortOrder === "asc" ? <IoArrowUpOutline className="text-indigo-500" /> : <IoArrowDownOutline className="text-indigo-500" />;
  };

  if (loading) return <LoadingSpinner message="Curating topics..." />;
  if (error || !subject) return <ErrorState variant={error ? "network" : "notFound"} onRetry={() => window.location.reload()} />;

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Backgrounds */}
        <div className="absolute top-0 right-0 w-500px h-500px bg-indigo-100/50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-500px h-500px bg-purple-100/50 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Section */}
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              {subject.name} <span className="text-slate-400">Library</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Showing {filteredAndSortedTopics.length} specialized modules tailored for your learning path.
            </p>
          </header>

          {/* Controls Panel */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="w-full lg:w-auto">
              <TopicFilter subjectId={subjectId} onFilterChange={setFilters} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-2">{getUITranslation('sortBy', currentLanguage) === 'sortBy' ? 'Sort By' : getUITranslation('sortBy', currentLanguage)}</span>
              {["name", "difficulty", "conceptCount", "estimatedTime"].map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${sortBy === field
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                    : "bg-white/50 border-white/80 text-slate-600 hover:bg-white hover:border-slate-300"
                    }`}
                >
                  {field === 'conceptCount' ? (getUITranslation('concepts', currentLanguage) || 'Concepts') :
                    field === 'estimatedTime' ? (getUITranslation('time', currentLanguage) || 'Time') :
                      field === 'difficulty' ? (getUITranslation('difficulty.title', currentLanguage) || 'Difficulty') :
                        field === 'name' ? (getUITranslation('name', currentLanguage) || 'Name') :
                          field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  {getSortIcon(field)}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={(e) => !e.target.closest('.favorite-button') && navigateWithState(`/subjects/${subjectId}/${topic.id}`)}
                className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-2rem p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-2 h-full transition-colors duration-300 ${topic.difficulty === 'beginner' ? 'bg-emerald-400' :
                  topic.difficulty === 'intermediate' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />

                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {topic.name}
                  </h4>
                  <div className="favorite-button">
                    <FavoriteButton itemId={topic.id} itemType="topic" size="small" />
                  </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <IoLibraryOutline className="text-lg" /> {topic.conceptCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <IoTimeOutline className="text-lg" /> {topic.estimatedTime}m
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${topic.difficulty === 'beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    topic.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                    {topic.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty States */}
          {filteredAndSortedTopics.length === 0 && (
            <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-300">
              <IoSearchOutline className="text-5xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No matches found</h3>
              <p className="text-slate-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}