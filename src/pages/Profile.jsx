import { useState, useEffect, useMemo } from "react";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoHourglassOutline, IoRefreshOutline, IoWarningOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import LanguageSelector from "../components/LanguageSelector";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";
import { useContent } from "../context/ContentContext";
import { getSubjectIcon } from "../utils/iconMap";

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

  // Get organized favorites
  const favoritesBySubject = getFavoritesBySubject(subjects, topics, concepts);
  const hasFavorites = Object.keys(favoritesBySubject).length > 0;

  return (
    <>
      <Navbar />

      <div className="page">
        <h2>Profile</h2>
        <p>Manage your account and preferences</p>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user.displayName || user.email}</h3>
            <p className="muted">Student</p>
            {userStats.lastActivity && (
              <p className="muted">
                Last active: {userStats.lastActivity.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Profile Cards */}
        <div className="profile-grid">
          {/* Account Info */}
          <div className="profile-card">
            <h4>Account Information</h4>
            <p><b>Email:</b> {user.email}</p>
            {user.displayName && <p><b>Name:</b> {user.displayName}</p>}
            <p><b>Role:</b> Learner</p>
            <p><b>Member since:</b> {user.metadata?.creationTime ?
              new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</p>
          </div>

          {/* User Statistics */}
          <div className="profile-card">
            <h4>Learning Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{userStats.topicsViewed}</span>
                <span className="stat-label">Topics Viewed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userStats.conceptsRead}</span>
                <span className="stat-label">Concepts Read</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userStats.favoriteCount}</span>
                <span className="stat-label">Favorites</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Math.round(userStats.totalReadTime / 60)}</span>
                <span className="stat-label">Minutes Read</span>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="profile-card">
            <h4>Language Preference</h4>
            <LanguageSelector
              variant="dropdown"
              showLabel={false}
            />
            <div className="language-status">
              <p className="hint">
                Current language: <strong>{getLanguageDisplayName(currentLanguage)}</strong>
              </p>
              {isGeminiAvailable ? (
                <p className="hint">
                  <IoCheckmarkCircleOutline aria-hidden="true" /> Content will be translated automatically using AI when needed.
                </p>
              ) : (
                <p className="hint">
                  <IoWarningOutline aria-hidden="true" /> Only pre-translated content is available. Set VITE_GEMINI_API_KEY for AI translation.
                </p>
              )}
              {translationError && (
                <p className="hint" style={{ color: '#dc2626' }}>
                  <IoCloseCircleOutline aria-hidden="true" /> Translation error: {translationError}
                </p>
              )}
            </div>
          </div>

          {/* Sync Status */}
          <div className="profile-card">
            <h4>Sync Status</h4>
            <div className="sync-status">
              {syncStatus === 'synced' && (
                <p className="hint">
                  <IoCheckmarkCircleOutline aria-hidden="true" /> All data synchronized
                </p>
              )}
              {syncStatus === 'syncing' && (
                <p className="hint">
                  <IoRefreshOutline aria-hidden="true" /> Synchronizing data...
                </p>
              )}
              {syncStatus === 'pending' && (
                <p className="hint">
                  <IoHourglassOutline aria-hidden="true" /> {getPendingActionsCount()} actions pending sync
                </p>
              )}
            </div>
            <button
              className="retry-btn"
              onClick={() => {
                // Clear translation cache
                const keys = Object.keys(localStorage);
                const translationKeys = keys.filter(key => key.startsWith('translation_'));
                translationKeys.forEach(key => localStorage.removeItem(key));
                alert('Translation cache cleared successfully!');
              }}
            >
              Clear Translation Cache
            </button>
            <p className="hint">
              Clear cached translations to force fresh translations from the AI service.
            </p>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="favorites-section">
          <h3>My Favorites</h3>
          {hasFavorites ? (
            <div className="favorites-by-subject">
              {Object.entries(favoritesBySubject).map(([subjectId, subjectData]) => (
                <div key={subjectId} className="subject-favorites">
                  {(() => {
                    const SubjectIcon = getSubjectIcon(subjectData.subject.icon);
                    return (
                      <h4 className="subject-title">
                        <span className="subject-icon" aria-hidden="true"><SubjectIcon /></span>
                        {subjectData.subject.name}
                      </h4>
                    );
                  })()}

                  {/* Favorite Topics */}
                  {subjectData.topics.length > 0 && (
                    <div className="favorite-topics">
                      <h5>Topics ({subjectData.topics.length})</h5>
                      <div className="favorite-items">
                        {subjectData.topics.map(topic => (
                          <div key={topic.id} className="favorite-item">
                            <a
                              href={`/subjects/${topic.subjectId}?topic=${topic.id}`}
                              className="favorite-link"
                            >
                              <div className="favorite-info">
                                <span className="favorite-title">{topic.name}</span>
                                <span className="favorite-meta">
                                  {topic.conceptCount} concepts • {topic.difficulty}
                                </span>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorite Concepts */}
                  {subjectData.concepts.length > 0 && (
                    <div className="favorite-concepts">
                      <h5>Concepts ({subjectData.concepts.length})</h5>
                      <div className="favorite-items">
                        {subjectData.concepts.map(concept => (
                          <div key={concept.id} className="favorite-item">
                            <a
                              href={`/concept/${concept.id}`}
                              className="favorite-link"
                            >
                              <div className="favorite-info">
                                <span className="favorite-title">{concept.title}</span>
                                <span className="favorite-meta">
                                  {concept.topicName} • {concept.estimatedReadTime} min read
                                </span>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-favorites">
              <p>You haven't saved any favorites yet.</p>
              <p className="hint">
                Browse subjects and topics to start building your collection of favorite content.
              </p>
              <a href="/subjects" className="cta-button">
                Explore Subjects
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
