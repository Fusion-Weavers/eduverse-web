import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function TopicFilter({ 
  onFilterChange, 
  subjectId, 
  initialFilters = {} 
}) {
  const { saveFilterState, getFilterState } = useNavigation();
  const filterKey = `topic-filter-${subjectId}`;
  const onFilterChangeRef = useRef(onFilterChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);
  
  // Initialize filters from navigation state or props
  const [filters, setFilters] = useState(() => {
    const savedFilters = getFilterState(filterKey);
    return {
      difficulty: savedFilters.difficulty || initialFilters.difficulty || 'all',
      searchTerm: savedFilters.searchTerm || initialFilters.searchTerm || '',
      showFavoritesOnly: savedFilters.showFavoritesOnly || initialFilters.showFavoritesOnly || false
    };
  });

  // Save filter state whenever filters change
  useEffect(() => {
    saveFilterState(filterKey, filters);
    if (onFilterChangeRef.current) {
      onFilterChangeRef.current(filters);
    }
  }, [filters, filterKey, saveFilterState]);

  const handleDifficultyChange = (difficulty) => {
    setFilters(prev => ({
      ...prev,
      difficulty
    }));
  };

  const handleSearchChange = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      searchTerm
    }));
  };

  const handleFavoritesToggle = () => {
    setFilters(prev => ({
      ...prev,
      showFavoritesOnly: !prev.showFavoritesOnly
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      difficulty: 'all',
      searchTerm: '',
      showFavoritesOnly: false
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = filters.difficulty !== 'all' || 
                          filters.searchTerm !== '' || 
                          filters.showFavoritesOnly;

  return (
    <div className="topic-filter">
      <div className="filter-section">
        <label className="filter-label">Filter by difficulty:</label>
        <div className="difficulty-buttons">
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button
              key={level}
              className={`difficulty-btn ${filters.difficulty === level ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(level)}
            >
              {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label" htmlFor="topic-search">Search topics:</label>
        <input
          id="topic-search"
          type="text"
          placeholder="Search by topic name..."
          value={filters.searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.showFavoritesOnly}
            onChange={handleFavoritesToggle}
            className="favorites-checkbox"
          />
          <span className="checkbox-text">Show favorites only</span>
        </label>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear all filters
          </button>
        </div>
      )}

      <style jsx>{`
        .topic-filter {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .filter-section {
          margin-bottom: 1.5rem;
        }

        .filter-section:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          display: block;
          font-weight: 500;
          color: #495057;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .difficulty-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .difficulty-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .difficulty-btn:hover {
          border-color: #007bff;
          color: #007bff;
        }

        .difficulty-btn.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: normal;
          margin-bottom: 0;
        }

        .favorites-checkbox {
          margin-right: 0.75rem;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 0.875rem;
          color: #495057;
        }

        .filter-actions {
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
          margin-top: 1rem;
        }

        .clear-filters-btn {
          padding: 0.5rem 1rem;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: #545b62;
        }

        @media (max-width: 768px) {
          .topic-filter {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .difficulty-buttons {
            flex-direction: column;
          }

          .difficulty-btn {
            width: 100%;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .difficulty-btn,
          .search-input,
          .clear-filters-btn {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}