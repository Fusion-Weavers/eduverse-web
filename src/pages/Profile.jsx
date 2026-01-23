import { useState, useEffect, useMemo } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHourglassOutline,
  IoRefreshOutline,
  IoWarningOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoBookOutline,
  IoHeartOutline,
  IoSettingsOutline,
  IoCloudOfflineOutline,
  IoLogOutOutline,
  IoTrashOutline
} from "react-icons/io5";
import Navbar from "../components/Navbar";
import LanguageSelector from "../components/LanguageSelector";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";
import { useContent } from "../context/ContentContext";
import { getSubjectIcon } from "../utils/iconMap";
import { AmbientBackground, GlassCard, StatCard, Badge } from "../components/ui/DesignSystem";

export default function Profile() {
  const { user } = useAuth();
  const {
    currentLanguage,
    getLanguageDisplayName,
    isGeminiAvailable,
    translationError
  } = useLanguage();

  const {
    getFavoritesBySubject,
    getTotalFavoritesCount,
    syncStatus,
    getPendingActionsCount
  } = useFavorites();

  const { subjects, topics, concepts } = useContent();

  // User statistics state
  const [userStats, setUserStats] = useState({
    topicsViewed: 0,
    conceptsRead: 0,
    totalReadTime: 0,
    favoriteCount: 0,
    lastActivity: null
  });

  // Load user statistics
  useEffect(() => {
    if (user?.uid) {
      const stats = loadUserStatistics(user.uid);
      setUserStats({
        ...stats,
        favoriteCount: getTotalFavoritesCount()
      });
    }
  }, [user?.uid, getTotalFavoritesCount]);

  // Load user statistics from localStorage
  const loadUserStatistics = (userId) => {
    try {
      const stored = localStorage.getItem(`user_stats_${userId}`);
      if (stored) {
        const stats = JSON.parse(stored);
        return {
          topicsViewed: stats.topicsViewed || 0,
          conceptsRead: stats.conceptsRead || 0,
          totalReadTime: stats.totalReadTime || 0,
          lastActivity: stats.lastActivity ? new Date(stats.lastActivity) : null
        };
      }
    } catch (error) {
      console.error('Error loading user statistics:', error);
    }

    return {
      topicsViewed: 0,
      conceptsRead: 0,
      totalReadTime: 0,
      lastActivity: null
    };
  };

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear the translation cache? This will force fresh translations.")) {
      const keys = Object.keys(localStorage);
      const translationKeys = keys.filter(key => key.startsWith('translation_'));
      translationKeys.forEach(key => localStorage.removeItem(key));
      alert('Translation cache cleared successfully!');
    }
  };

  // Get organized favorites
  const favoritesBySubject = useMemo(() => {
    return getFavoritesBySubject(subjects, topics, concepts);
  }, [subjects, topics, concepts, getFavoritesBySubject]);

  const hasFavorites = Object.keys(favoritesBySubject).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <AmbientBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Profile</h2>
          <p className="mt-2 text-lg text-slate-500 font-medium">Manage your account settings and view your learning progress.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* LEFT COLUMN: User Info & Settings (4 cols) */}
          <div className="space-y-8 lg:col-span-4">

            {/* Identity Card */}
            <GlassCard className="p-8 text-center" hoverEffect={false}>
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-slate-200 to-slate-100 ring-4 ring-white shadow-inner">
                <span className="text-4xl font-bold text-slate-700">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{user.displayName || "Learner"}</h3>
              <p className="text-sm font-medium text-slate-500">{user.email}</p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Badge variant="primary">Student</Badge>
                <Badge variant="default">
                  Member since {user.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '2025'}
                </Badge>
              </div>
            </GlassCard>

            {/* Settings Panel */}
            <GlassCard className="p-6" hoverEffect={false}>
              <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <IoSettingsOutline className="text-slate-400" />
                <h4 className="font-bold text-slate-900">Preferences</h4>
              </div>

              {/* Language */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Language</label>
                <div className="relative">
                  <LanguageSelector variant="dropdown" showLabel={false} />
                </div>
                <div className="mt-3 space-y-2">
                  {isGeminiAvailable ? (
                    <div className="flex items-start gap-2 text-xs text-emerald-600">
                      <IoCheckmarkCircleOutline className="mt-0.5 text-lg" />
                      <span>AI Translation Active</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-xs text-amber-600">
                      <IoWarningOutline className="mt-0.5 text-lg" />
                      <span>Using pre-translated content only</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sync Status */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Cloud Sync</label>
                <div className={`flex items-center justify-between rounded-xl border p-3 ${syncStatus === 'synced' ? 'border-emerald-100 bg-emerald-50/50' :
                    syncStatus === 'syncing' ? 'border-blue-100 bg-blue-50/50' :
                      'border-amber-100 bg-amber-50/50'
                  }`}>
                  <div className="flex items-center gap-3">
                    {syncStatus === 'synced' && <IoCheckmarkCircleOutline className="text-xl text-emerald-600" />}
                    {syncStatus === 'syncing' && <IoRefreshOutline className="animate-spin text-xl text-blue-600" />}
                    {syncStatus === 'pending' && <IoCloudOfflineOutline className="text-xl text-amber-600" />}

                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${syncStatus === 'synced' ? 'text-emerald-700' :
                          syncStatus === 'syncing' ? 'text-blue-700' :
                            'text-amber-700'
                        }`}>
                        {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Pending'}
                      </span>
                      {syncStatus === 'pending' && (
                        <span className="text-xs text-amber-600">{getPendingActionsCount()} actions queued</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone / Actions */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleClearCache}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
                >
                  <IoTrashOutline /> Clear Cache
                </button>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT COLUMN: Stats & Favorites (8 cols) */}
          <div className="space-y-8 lg:col-span-8">

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={IoBookOutline}
                value={userStats.topicsViewed}
                label="Topics Viewed"
                colorClass="bg-blue-500"
              />
              <StatCard
                icon={IoCheckmarkCircleOutline}
                value={userStats.conceptsRead}
                label="Concepts Read"
                colorClass="bg-emerald-500"
              />
              <StatCard
                icon={IoTimeOutline}
                value={Math.round(userStats.totalReadTime / 60)}
                label="Minutes Read"
                colorClass="bg-purple-500"
              />
              <StatCard
                icon={IoHeartOutline}
                value={userStats.favoriteCount}
                label="Favorites"
                colorClass="bg-rose-500"
              />
            </div>

            {/* Favorites Collection */}
            <GlassCard className="p-8" hoverEffect={false}>
              <div className="mb-8 flex items-end justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">Your Collection</h3>
                {hasFavorites && (
                  <a href="/favorites" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                    View Full List
                  </a>
                )}
              </div>

              {!hasFavorites ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
                  <IoHeartOutline className="mb-3 text-4xl text-slate-300" />
                  <p className="text-slate-500">You haven't saved any favorites yet.</p>
                  <a href="/subjects" className="mt-4 rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105">
                    Explore Content
                  </a>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(favoritesBySubject).map(([subjectId, subjectData]) => {
                    const SubjectIcon = getSubjectIcon(subjectData.subject.icon);
                    return (
                      <div key={subjectId} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                        {/* Subject Title */}
                        <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-900/5 text-slate-600">
                            <SubjectIcon />
                          </span>
                          {subjectData.subject.name}
                        </h4>

                        {/* Combined Grid for Topics & Concepts */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Topics */}
                          {subjectData.topics.map(topic => (
                            <a
                              key={topic.id}
                              href={`/subjects/${topic.subjectId}?topic=${topic.id}`}
                              className="group block rounded-xl border border-slate-200/60 bg-white p-4 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">Topic</span>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${topic.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                  }`}>{topic.difficulty}</span>
                              </div>
                              <h5 className="font-bold text-slate-900 group-hover:text-indigo-700">{topic.name}</h5>
                              <p className="text-xs text-slate-500 mt-1">{topic.conceptCount} concepts</p>
                            </a>
                          ))}

                          {/* Concepts */}
                          {subjectData.concepts.map(concept => (
                            <a
                              key={concept.id}
                              href={`/concept/${concept.id}`}
                              className="group block rounded-xl border border-slate-200/60 bg-white p-4 transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-purple-600">Concept</span>
                                <span className="text-[10px] text-slate-400 font-medium">{concept.estimatedReadTime} min</span>
                              </div>
                              <h5 className="font-bold text-slate-900 group-hover:text-purple-700">{concept.title}</h5>
                              <p className="text-xs text-slate-500 mt-1">in {concept.topicName}</p>
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}