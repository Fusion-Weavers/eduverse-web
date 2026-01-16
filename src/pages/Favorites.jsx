import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  IoCloudUploadOutline, 
  IoGlassesOutline, 
  IoHeartOutline, 
  IoHourglassOutline, 
  IoWarningOutline,
  IoArrowForward
} from "react-icons/io5";
import Navbar from "../components/Navbar";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../context/FavoritesContext";
import { useContent } from "../context/ContentContext";
import { getSubjectIcon } from "../utils/iconMap";

export default function Favorites() {
  const { subjects, topics, concepts } = useContent();
  const {
    getFavoritesBySubject,
    getTotalFavoritesCount,
    clearAllFavorites,
    syncStatus,
    getPendingActionsCount
  } = useFavorites();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculate favorites by subject
  const favoritesBySubject = useMemo(() => {
    if (subjects && topics && concepts) {
      return getFavoritesBySubject(subjects, topics, concepts);
    }
    return {};
  }, [subjects, topics, concepts, getFavoritesBySubject]);

  const totalFavorites = getTotalFavoritesCount();
  const pendingCount = getPendingActionsCount();

  const handleClearAll = () => {
    clearAllFavorites();
    setShowClearConfirm(false);
  };

  // --- Render Helpers ---

  // 1. Sync Status Indicator (Glass Pill)
  const renderSyncStatus = () => {
    if (syncStatus === 'syncing') {
      return (
        <div className="mb-8 flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-md">
          <IoHourglassOutline className="animate-spin" /> 
          <span>Syncing favorites...</span>
        </div>
      );
    }

    if (syncStatus === 'pending' && pendingCount > 0) {
      return (
        <div className="mb-8 flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-50/50 px-4 py-2 text-sm font-medium text-amber-700 backdrop-blur-md">
          <IoCloudUploadOutline /> 
          <span>{pendingCount} change{pendingCount !== 1 ? 's' : ''} pending sync</span>
        </div>
      );
    }

    return null;
  };

  // 2. Empty State (Glass Panel with Ambient Depth)
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/50 bg-white/60 px-6 py-20 text-center shadow-lg backdrop-blur-xl md:px-12">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400 shadow-inner">
        <IoHeartOutline className="h-10 w-10" />
      </div>
      <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">No favorites yet</h3>
      <p className="mb-8 max-w-md text-slate-500">
        Start exploring STEM concepts and topics. Use the heart button to save
        your favorite content for easy access later.
      </p>
      <Link 
        to="/subjects" 
        className="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 font-medium text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-slate-800"
      >
        Explore Subjects
        <IoArrowForward className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );

  // 3. Subject Section
  const renderSubjectSection = (subjectId, subjectData) => {
    const { subject, topics: favoriteTopics, concepts: favoriteConcepts } = subjectData;
    const SubjectIcon = getSubjectIcon(subject.icon);

    return (
      <div key={subjectId} className="mb-16 last:mb-0">
        {/* Subject Header */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
              <span className="text-xl text-slate-700"><SubjectIcon /></span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {subject.name}
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {favoriteTopics.length + favoriteConcepts.length} Saved
          </span>
        </div>

        {/* Topics Grid */}
        {favoriteTopics.length > 0 && (
          <div className="mb-10">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Topics</h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteTopics.map(topic => (
                <div key={topic.id} className="group relative flex flex-col rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
                  <div className="mb-4 flex items-start justify-between">
                    <Link
                      to={`/subjects/${subject.id}/${topic.id}`}
                      className="text-lg font-bold text-slate-900 transition-colors hover:text-indigo-600"
                    >
                      {topic.name}
                    </Link>
                    <div className="ml-2 shrink-0 transform transition-transform duration-200 hover:scale-110 active:scale-95">
                       <FavoriteButton itemId={topic.id} itemType="topic" size="small" />
                    </div>
                  </div>
                  <p className="mb-6 line-clamp-2 flex-grow text-sm leading-relaxed text-slate-500">
                    {topic.description}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      topic.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                      topic.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {topic.difficulty}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {topic.conceptCount} concepts
                    </span>
                    <span className="ml-auto text-xs font-medium text-slate-400">
                      ~{topic.estimatedTime} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concepts Grid */}
        {favoriteConcepts.length > 0 && (
          <div>
             <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Concepts</h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteConcepts.map(concept => (
                <div key={concept.id} className="group relative flex flex-col rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
                  <div className="mb-2 flex items-start justify-between">
                    <Link
                      to={`/subjects/${subject.id}/${concept.topicId}/${concept.id}`}
                      className="text-lg font-bold text-slate-900 transition-colors hover:text-indigo-600"
                    >
                      {concept.title}
                    </Link>
                    <div className="ml-2 shrink-0 transform transition-transform duration-200 hover:scale-110 active:scale-95">
                      <FavoriteButton itemId={concept.id} itemType="concept" size="small" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                     <p className="text-xs font-medium text-slate-400">
                        Topic: <Link to={`/subjects/${subject.id}/${concept.topicId}`} className="text-indigo-500 hover:underline">{concept.topicName}</Link>
                     </p>
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100">
                    <span className={`h-2 w-2 rounded-full ${
                      concept.difficulty === 'beginner' ? 'bg-emerald-400' :
                      concept.difficulty === 'intermediate' ? 'bg-amber-400' :
                      'bg-rose-400'
                    }`} />
                    <span className="text-xs font-medium text-slate-500">
                      {concept.estimatedReadTime} min read
                    </span>
                    {concept.arEnabled && (
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">
                        <IoGlassesOutline /> AR
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* Ambient Background Decorations (Blurry Orbs) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-300/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-300/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              My Favorites
            </h2>
            <p className="mt-2 text-lg text-slate-500">
              Your curated collection of STEM topics and concepts.
            </p>
          </div>
          
          {totalFavorites > 0 && (
            <div className="flex items-center gap-4 rounded-2xl bg-white/40 p-2 backdrop-blur-md">
              <span className="pl-4 text-sm font-semibold text-slate-600">
                {totalFavorites} Item{totalFavorites !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-red-500 hover:shadow-md active:scale-95"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {renderSyncStatus()}

          {totalFavorites === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-12">
              {Object.keys(favoritesBySubject).map(subjectId =>
                renderSubjectSection(subjectId, favoritesBySubject[subjectId])
              )}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setShowClearConfirm(false)}
          />
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
               <IoWarningOutline className="h-6 w-6" />
            </div>
            
            <h3 className="mb-2 text-xl font-bold text-slate-900">Clear all favorites?</h3>
            <p className="mb-8 text-slate-500">
              This will remove all {totalFavorites} favorite{totalFavorites !== 1 ? 's' : ''} from your account. 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-full border border-slate-200 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-600 hover:-translate-y-0.5"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}