import { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoCloseCircleOutline, IoHeart, IoHeartOutline, IoFilterOutline } from 'react-icons/io5';
import { useNavigation } from '../context/NavigationContext';

export default function TopicFilter({ 
  onFilterChange, 
  subjectId, 
  initialFilters = {} 
}) {
  const { saveFilterState, getFilterState } = useNavigation();
  const filterKey = `topic-filter-${subjectId}`;
  const onFilterChangeRef = useRef(onFilterChange);
  
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);
  
  const [filters, setFilters] = useState(() => {
    const savedFilters = getFilterState(filterKey);
    return {
      difficulty: savedFilters.difficulty || initialFilters.difficulty || 'all',
      searchTerm: savedFilters.searchTerm || initialFilters.searchTerm || '',
      showFavoritesOnly: savedFilters.showFavoritesOnly || initialFilters.showFavoritesOnly || false
    };
  });

  useEffect(() => {
    saveFilterState(filterKey, filters);
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(filters);
    }
  }, [filters, filterKey, saveFilterState]);

  const hasActiveFilters = filters.difficulty !== 'all' || 
                          filters.searchTerm !== '' || 
                          filters.showFavoritesOnly;

  return (
    <div className="relative group bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:bg-white/80">
      
      {/* Decorative Shine Effect */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        
        {/* Search Section */}
        <div className="lg:col-span-4 space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            <IoSearchOutline className="text-sm" /> Search Topics
          </label>
          <div className="relative group/input">
            <input
              type="text"
              placeholder="Start typing..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full bg-white/50 border border-slate-200/60 rounded-2xl py-3.5 pl-5 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all"
            />
            {filters.searchTerm && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <IoCloseCircleOutline className="text-xl" />
              </button>
            )}
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="lg:col-span-5 space-y-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            <IoFilterOutline className="text-sm" /> Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setFilters(prev => ({ ...prev, difficulty: level }))}
                className={`
                  px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border
                  ${filters.difficulty === level 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 -translate-y-1' 
                    : 'bg-white/50 border-slate-200/60 text-slate-500 hover:border-slate-300 hover:bg-white'}
                `}
              >
                {level === 'all' ? 'Universal' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites & Actions Section */}
        <div className="lg:col-span-3 flex flex-wrap lg:flex-nowrap items-center gap-4">
          <button
            onClick={() => setFilters(prev => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))}
            className={`
              flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border
              ${filters.showFavoritesOnly 
                ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-inner' 
                : 'bg-white/50 border-slate-200/60 text-slate-600 hover:border-rose-200 hover:text-rose-500'}
            `}
          >
            {filters.showFavoritesOnly ? <IoHeart className="text-lg" /> : <IoHeartOutline className="text-lg" />}
            <span>Favorites</span>
          </button>

          {hasActiveFilters && (
            <button 
              onClick={() => setFilters({ difficulty: 'all', searchTerm: '', showFavoritesOnly: false })}
              className="flex items-center justify-center p-3.5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
              title="Reset Filters"
            >
              <IoRefreshOutline className="text-xl animate-reverse-spin" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}