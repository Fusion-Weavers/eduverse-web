import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
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
  
  const sortKey = `topic-sort-${subjectId}`;
  
  // Initialize sort state from navigation context
  const savedSortState = getSortState(sortKey);
  const [sortBy, setSortBy] = useState(savedSortState.sortBy || "name");
  const [sortOrder, setSortOrder] = useState(savedSortState.sortOrder || "asc");
  
  // Filter state
  const [filters, setFilters] = useState({
    difficulty: 'all',
    searchTerm: '',
    showFavoritesOnly: false
  });

  const subject = subjects.find(s => s.id === subjectId);
  const topics = getTopicsBySubject(subjectId);

  // Save sort state whenever it changes
  useEffect(() => {
    saveSortState(sortKey, { sortBy, sortOrder });
  }, [sortBy, sortOrder, sortKey, saveSortState]);

  // Filter and sort topics based on current criteria
  const filteredAndSortedTopics = useMemo(() => {
    let filtered = [...topics];
    
    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(topic => topic.difficulty === filters.difficulty);
    }
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(topic => 
        topic.name.toLowerCase().includes(searchTerm) ||
        topic.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter(topic => isTopicFavorited(topic.id));
    }
    
    // Sort the filtered results
    const sorted = filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "difficulty") {
        const difficultyOrder = { "beginner": 1, "intermediate": 2, "advanced": 3 };
        comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else if (sortBy === "conceptCount") {
        comparison = a.conceptCount - b.conceptCount;
      } else if (sortBy === "estimatedTime") {
        comparison = a.estimatedTime - b.estimatedTime;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return sorted;
  }, [topics, filters, sortBy, sortOrder, isTopicFavorited]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Change sort field and reset to ascending
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleTopicClick = (topic, event) => {
    // Don't navigate if clicking on favorite button
    if (event.target.closest('.favorite-button')) {
      return;
    }

    // Track that user has viewed this topic
    if (user?.uid) {
      trackUserActivity(user.uid, 'topic_viewed', topic.id);
    }

    if (onTopicSelect) {
      onTopicSelect(topic);
    } else {
      // Use enhanced navigation with state preservation
      navigateWithState(`/subjects/${subjectId}/${topic.id}`, {
        breadcrumb: {
          title: subject.name,
          params: { subjectId }
        }
      });
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading topics..." size="medium" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Error Loading Topics"
        message={`Failed to load topics: ${error.message}`}
        icon="📚"
        variant="network"
        onRetry={() => window.location.reload()}
        showRetry={true}
      />
    );
  }

  if (!subject) {
    return (
      <ErrorState
        title="Subject Not Found"
        message="The requested subject could not be found."
        icon="🔍"
        variant="notFound"
        showRetry={false}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="topic-list">
        <div className="topic-list-header">
          <h3>{subject.name} Topics</h3>
          <p>{filteredAndSortedTopics.length} of {topics.length} topics</p>
        </div>

        <TopicFilter 
          subjectId={subjectId}
          onFilterChange={handleFilterChange}
        />
        
        <div className="sort-controls">
          <span>Sort by:</span>
          <button 
            className={`sort-btn ${sortBy === "name" ? "active" : ""}`}
            onClick={() => handleSortChange("name")}
          >
            Name {getSortIcon("name")}
          </button>
          <button 
            className={`sort-btn ${sortBy === "difficulty" ? "active" : ""}`}
            onClick={() => handleSortChange("difficulty")}
          >
            Difficulty {getSortIcon("difficulty")}
          </button>
          <button 
            className={`sort-btn ${sortBy === "conceptCount" ? "active" : ""}`}
            onClick={() => handleSortChange("conceptCount")}
          >
            Concepts {getSortIcon("conceptCount")}
          </button>
          <button 
            className={`sort-btn ${sortBy === "estimatedTime" ? "active" : ""}`}
            onClick={() => handleSortChange("estimatedTime")}
          >
            Time {getSortIcon("estimatedTime")}
          </button>
        </div>

        <div className="topics-grid">
          {filteredAndSortedTopics.map((topic) => (
            <div 
              key={topic.id} 
              className={`topic-card ${isTopicFavorited(topic.id) ? 'topic-card--favorited' : ''}`}
              onClick={(event) => handleTopicClick(topic, event)}
            >
              <div className="topic-header">
                <h4>{topic.name}</h4>
                <div className="topic-header-actions">
                  <span className={`difficulty ${topic.difficulty}`}>
                    {topic.difficulty}
                  </span>
                  <FavoriteButton 
                    itemId={topic.id} 
                    itemType="topic" 
                    size="small"
                  />
                </div>
              </div>
              
              <p className="topic-description">{topic.description}</p>
              
              <div className="topic-meta">
                <span className="concept-count">
                  {topic.conceptCount} concepts
                </span>
                <span className="estimated-time">
                  ~{topic.estimatedTime} min
                </span>
                {isTopicFavorited(topic.id) && (
                  <span className="favorite-indicator" title="Favorited">
                    ⭐
                  </span>
                )}
              </div>
              
              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <div className="prerequisites">
                  <small>Prerequisites: {topic.prerequisites.join(", ")}</small>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAndSortedTopics.length === 0 && topics.length > 0 && (
          <div className="no-results">
            <p>No topics match your current filters.</p>
            <p>Try adjusting your search criteria or clearing filters.</p>
          </div>
        )}

        {topics.length === 0 && (
          <div className="no-topics">
            <p>No topics available for this subject yet.</p>
          </div>
        )}

      <style jsx>{`
        .topic-list {
          padding: 1rem;
        }

        .topic-list-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .topic-list-header h3 {
          margin-bottom: 0.5rem;
          color: #495057;
        }

        .topic-list-header p {
          color: #6c757d;
          margin-bottom: 1.5rem;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .sort-controls span {
          color: #6c757d;
          font-weight: 500;
        }

        .sort-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .sort-btn:hover {
          border-color: #007bff;
          color: #007bff;
        }

        .sort-btn.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .topic-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0.75rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .topic-card:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
          transform: translateY(-2px);
        }

        .topic-card--favorited {
          border-color: #ffc107;
          background: linear-gradient(135deg, #fff 0%, #fffbf0 100%);
        }

        .topic-card--favorited:hover {
          border-color: #007bff;
          background: linear-gradient(135deg, #f8f9ff 0%, #fffbf0 100%);
        }

        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .topic-header h4 {
          margin: 0;
          color: #495057;
          font-size: 1.125rem;
          flex: 1;
        }

        .topic-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .difficulty {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .difficulty.beginner {
          background-color: #d4edda;
          color: #155724;
        }

        .difficulty.intermediate {
          background-color: #fff3cd;
          color: #856404;
        }

        .difficulty.advanced {
          background-color: #f8d7da;
          color: #721c24;
        }

        .topic-description {
          color: #6c757d;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .topic-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #6c757d;
          align-items: center;
          flex-wrap: wrap;
        }

        .concept-count,
        .estimated-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .concept-count::before {
          content: "📚";
          font-size: 0.75rem;
        }

        .estimated-time::before {
          content: "⏱️";
          font-size: 0.75rem;
        }

        .favorite-indicator {
          color: #ffc107;
          font-size: 1rem;
          animation: twinkle 2s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .prerequisites {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f3f4;
        }

        .prerequisites small {
          color: #6c757d;
          font-style: italic;
        }

        .no-topics,
        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          color: #6c757d;
        }

        .no-results {
          background: #f8f9fa;
          border-radius: 0.5rem;
          border: 1px solid #e9ecef;
        }

        .error-state {
          text-align: center;
          padding: 2rem;
          color: #dc3545;
        }

        .error-state button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .topic-list {
            padding: 0.5rem;
          }

          .topics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .topic-card {
            padding: 1rem;
          }

          .topic-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .topic-header-actions {
            align-self: flex-end;
          }

          .sort-controls {
            flex-direction: column;
            gap: 0.5rem;
          }

          .topic-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .topic-card,
          .sort-btn,
          .favorite-indicator {
            transition: none;
            animation: none;
          }

          .topic-card:hover {
            transform: none;
          }
        }
      `}</style>
      </div>
    </ErrorBoundary>
  );
}