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
import { AmbientBackground, GlassCard, Badge, DifficultyBadge, EmptyState, PrimaryButton, Alert } from "../components/ui/DesignSystem";

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
        <Alert variant="info" icon={IoHourglassOutline} className="mb-8">
          <span>Syncing favorites...</span>
        </Alert>
      );
    }

    if (syncStatus === 'pending' && pendingCount > 0) {
      return (
        <Alert variant="warning" icon={IoCloudUploadOutline} className="mb-8">
          <span>{pendingCount} change{pendingCount !== 1 ? 's' : ''} pending sync</span>
        </Alert>
      );
    }

    return null;
  };

  // 2. Empty State (Glass Panel with Ambient Depth)
  const renderEmptyState = () => (
    <EmptyState
      icon={IoHeartOutline}
      title="No favorites yet"
      description="Start exploring STEM concepts and topics. Use the heart button to save your favorite content for easy access later."
      action={
        <Link to="/subjects">
          <PrimaryButton>
            Explore Subjects <IoArrowForward />
          </PrimaryButton>
        </Link>
      }
    />
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
                <GlassCard key={topic.id} className="flex flex-col p-6">
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
                    <DifficultyBadge difficulty={topic.difficulty} />
                    <span className="text-xs font-medium text-slate-400">
                      {topic.conceptCount} concepts
                    </span>
                    <span className="ml-auto text-xs font-medium text-slate-400">
                      ~{topic.estimatedTime} min
                    </span>
                  </div>
                </GlassCard>
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
                <GlassCard key={concept.id} className="flex flex-col p-6">
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
                </GlassCard>
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
      <AmbientBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              My Favorites
            </h2>
            <p className="mt-2 text-lg text-slate-500 font-medium">
              Your curated collection of STEM topics and concepts.
            </p>
          </div>
          
          {totalFavorites > 0 && (
            <GlassCard className="flex items-center gap-4 p-2" hoverEffect={false}>
              <span className="pl-4 text-sm font-semibold text-slate-600">
                {totalFavorites} Item{totalFavorites !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-white hover:text-red-500 hover:shadow-md active:scale-95"
              >
                Clear All
              </button>
            </GlassCard>
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
          <GlassCard className="relative w-full max-w-md p-8" hoverEffect={false}>
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
          </GlassCard>
        </div>
      )}
    </div>
  );
}