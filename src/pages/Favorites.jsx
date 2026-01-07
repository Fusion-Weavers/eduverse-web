import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { IoCloudUploadOutline, IoGlassesOutline, IoHeartOutline, IoHourglassOutline } from "react-icons/io5";
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

  // Calculate favorites by subject using useMemo to avoid setState in effect
  const favoritesBySubject = useMemo(() => {
    if (subjects && topics && concepts) {
      return getFavoritesBySubject(subjects, topics, concepts);
    }
    return {};
  }, [subjects, topics, concepts, getFavoritesBySubject]);

  const totalFavorites = getTotalFavoritesCount();
  const pendingCount = getPendingActionsCount();

  // Handle clear all favorites
  const handleClearAll = () => {
    clearAllFavorites();
    setShowClearConfirm(false);
  };

  // Render sync status indicator
  const renderSyncStatus = () => {
    if (syncStatus === 'syncing') {
      return (
        <div className="sync-status syncing">
          <span aria-hidden="true"><IoHourglassOutline /></span> Syncing favorites...
        </div>
      );
    }

    if (syncStatus === 'pending' && pendingCount > 0) {
      return (
        <div className="sync-status pending">
          <span aria-hidden="true"><IoCloudUploadOutline /></span> {pendingCount} change{pendingCount !== 1 ? 's' : ''} pending sync
        </div>
      );
    }

    return null;
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <IoHeartOutline />
      </div>
      <h3>No favorites yet</h3>
      <p>
        Start exploring STEM concepts and topics. Use the heart button to save
        your favorite content for easy access later.
      </p>
      <Link to="/subjects" className="btn btn-primary">
        Explore Subjects
      </Link>
    </div>
  );

  // Render subject section
  const renderSubjectSection = (subjectId, subjectData) => {
    const { subject, topics: favoriteTopics, concepts: favoriteConcepts } = subjectData;
    const SubjectIcon = getSubjectIcon(subject.icon);

    return (
      <div key={subjectId} className="favorites-subject">
        <div className="favorites-subject__header">
          <h3>
            <span className="subject-icon" aria-hidden="true"><SubjectIcon /></span>
            {subject.name}
          </h3>
          <span className="favorites-count">
            {favoriteTopics.length + favoriteConcepts.length} favorite{favoriteTopics.length + favoriteConcepts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {favoriteTopics.length > 0 && (
          <div className="favorites-section">
            <h4>Topics</h4>
            <div className="favorites-grid">
              {favoriteTopics.map(topic => (
                <div key={topic.id} className="favorite-item topic-item">
                  <div className="favorite-item__header">
                    <Link
                      to={`/subjects/${subject.id}/${topic.id}`}
                      className="favorite-item__title"
                    >
                      {topic.name}
                    </Link>
                    <FavoriteButton
                      itemId={topic.id}
                      itemType="topic"
                      size="small"
                    />
                  </div>
                  <p className="favorite-item__description">{topic.description}</p>
                  <div className="favorite-item__meta">
                    <span className={`difficulty difficulty--${topic.difficulty}`}>
                      {topic.difficulty}
                    </span>
                    <span className="concept-count">
                      {topic.conceptCount} concept{topic.conceptCount !== 1 ? 's' : ''}
                    </span>
                    <span className="estimated-time">
                      ~{topic.estimatedTime} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {favoriteConcepts.length > 0 && (
          <div className="favorites-section">
            <h4>Concepts</h4>
            <div className="favorites-grid">
              {favoriteConcepts.map(concept => (
                <div key={concept.id} className="favorite-item concept-item">
                  <div className="favorite-item__header">
                    <Link
                      to={`/subjects/${subject.id}/${concept.topicId}/${concept.id}`}
                      className="favorite-item__title"
                    >
                      {concept.title}
                    </Link>
                    <FavoriteButton
                      itemId={concept.id}
                      itemType="concept"
                      size="small"
                    />
                  </div>
                  <p className="favorite-item__topic">
                    From: <Link to={`/subjects/${subject.id}/${concept.topicId}`}>
                      {concept.topicName}
                    </Link>
                  </p>
                  <div className="favorite-item__meta">
                    <span className={`difficulty difficulty--${concept.difficulty}`}>
                      {concept.difficulty}
                    </span>
                    <span className="read-time">
                      {concept.estimatedReadTime} min read
                    </span>
                    {concept.arEnabled && (
                      <span className="ar-indicator" title="AR content available">
                        <IoGlassesOutline aria-hidden="true" /> AR
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
    <>
      <Navbar />
      <div className="page favorites-page">
        <div className="page-header">
          <h2>My Favorites</h2>
          {totalFavorites > 0 && (
            <div className="page-header__actions">
              <span className="total-count">
                {totalFavorites} total favorite{totalFavorites !== 1 ? 's' : ''}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {renderSyncStatus()}

        {totalFavorites === 0 ? (
          renderEmptyState()
        ) : (
          <div className="favorites-content">
            {Object.keys(favoritesBySubject).map(subjectId =>
              renderSubjectSection(subjectId, favoritesBySubject[subjectId])
            )}
          </div>
        )}

        {/* Clear confirmation modal */}
        {showClearConfirm && (
          <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Clear All Favorites?</h3>
              <p>
                This will remove all {totalFavorites} favorite{totalFavorites !== 1 ? 's' : ''} from your account.
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleClearAll}
                >
                  Clear All Favorites
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .favorites-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .page-header__actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .total-count {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .sync-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .sync-status.syncing {
          background-color: #e3f2fd;
          color: #1976d2;
          border: 1px solid #bbdefb;
        }

        .sync-status.pending {
          background-color: #fff3e0;
          color: #f57c00;
          border: 1px solid #ffcc02;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6c757d;
        }

        .empty-state__icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .empty-state p {
          margin-bottom: 2rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .favorites-subject {
          margin-bottom: 3rem;
        }

        .favorites-subject__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .favorites-subject__header h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          color: #495057;
        }

        .subject-icon {
          font-size: 1.5rem;
        }

        .favorites-count {
          color: #6c757d;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .favorites-section {
          margin-bottom: 2rem;
        }

        .favorites-section h4 {
          margin-bottom: 1rem;
          color: #6c757d;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .favorite-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.2s ease;
        }

        .favorite-item:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
          transform: translateY(-2px);
        }

        .favorite-item__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .favorite-item__title {
          font-weight: 600;
          color: #495057;
          text-decoration: none;
          flex: 1;
          margin-right: 0.5rem;
        }

        .favorite-item__title:hover {
          color: #007bff;
        }

        .favorite-item__description {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .favorite-item__topic {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .favorite-item__topic a {
          color: #007bff;
          text-decoration: none;
        }

        .favorite-item__topic a:hover {
          text-decoration: underline;
        }

        .favorite-item__meta {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
          font-size: 0.75rem;
        }

        .difficulty {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-block;
        }

        .difficulty--beginner {
          background-color: #d4edda;
          color: #155724;
        }

        .difficulty--intermediate {
          background-color: #fff3cd;
          color: #856404;
        }

        .difficulty--advanced {
          background-color: #f8d7da;
          color: #721c24;
        }

        .concept-count,
        .estimated-time,
        .read-time {
          color: #6c757d;
        }

        .ar-indicator {
          background-color: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .modal h3 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .modal p {
          margin-bottom: 2rem;
          color: #6c757d;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        .btn-outline {
          background-color: transparent;
          color: #6c757d;
          border: 1px solid #dee2e6;
        }

        .btn-outline:hover {
          background-color: #f8f9fa;
          border-color: #adb5bd;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        .btn-sm {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .favorites-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .favorites-grid {
            grid-template-columns: 1fr;
          }

          .favorite-item__meta {
            font-size: 0.75rem;
          }

          .modal {
            margin: 1rem;
            padding: 1.5rem;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
