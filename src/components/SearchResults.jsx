import { Link } from "react-router-dom";
import { IoLibraryOutline, IoBookOutline, IoDocumentTextOutline, IoSearchOutline } from "react-icons/io5";
import { useSearch } from "../context/SearchContext";
import LoadingSpinner from "./LoadingSpinner";

export default function SearchResults({ showHeader = true }) {
  const { searchQuery, searchResults, isSearching, searchScope } = useSearch();

  // Get scope display name
  const getScopeDisplayName = (scope) => {
    switch (scope) {
      case "all": return "All Content";
      case "subjects": return "Subjects";
      case "topics": return "Topics";
      case "concepts": return "Concepts";
      case "physics": return "Physics";
      case "chemistry": return "Chemistry";
      case "biology": return "Biology";
      case "engineering": return "Engineering";
      default: return "All Content";
    }
  };

  // Get result type icon
  const getResultIcon = (type) => {
    switch (type) {
      case "subject":
        return <IoLibraryOutline aria-hidden="true" />;
      case "topic":
        return <IoBookOutline aria-hidden="true" />;
      case "concept":
      default:
        return <IoDocumentTextOutline aria-hidden="true" />;
    }
  };

  // Get result link path
  const getResultPath = (result) => {
    switch (result.type) {
      case "subject":
        return `/subjects/${result.id}`;
      case "topic":
        return `/subjects/${result.subjectId}/${result.id}`;
      case "concept":
        return `/subjects/${result.subjectId || 'unknown'}/${result.topicId || 'unknown'}/${result.id}`;
      default:
        return "#";
    }
  };

  // Highlight search terms in text
  const highlightSearchTerms = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    );
  };

  if (isSearching) {
    return (
      <div className="search-results">
        {showHeader && (
          <div className="search-results-header">
            <h2>Searching...</h2>
          </div>
        )}
        <LoadingSpinner
          message={`Searching ${getScopeDisplayName(searchScope).toLowerCase()}...`}
          size="medium"
          color="primary"
        />
      </div>
    );
  }

  if (!searchQuery.trim()) {
    return (
      <div className="search-results">
        {showHeader && (
          <div className="search-results-header">
            <h2>Search</h2>
            <p className="search-instructions">
              Enter a search term to find subjects, topics, and concepts.
            </p>
            <div className="search-tips">
              <h4>Search Tips:</h4>
              <ul>
                <li>Use specific keywords for better results</li>
                <li>Try searching for concepts like "photosynthesis" or "gravity"</li>
                <li>Use the scope filter to narrow your search</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="search-results">
      {showHeader && (
        <div className="search-results-header">
          <h2>Search Results</h2>
          <div className="search-meta">
            <span className="search-query">"{searchQuery}"</span>
            <span className="search-scope">in {getScopeDisplayName(searchScope)}</span>
            <span className="results-count">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {searchResults.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon" aria-hidden="true">
            <IoSearchOutline />
          </div>
          <h3>No results found</h3>
          <p>
            No {getScopeDisplayName(searchScope).toLowerCase()} found for "{searchQuery}".
          </p>
          <div className="no-results-suggestions">
            <h4>Try:</h4>
            <ul>
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Searching in "All Content" instead of a specific scope</li>
              <li>Using more general terms</li>
            </ul>
          </div>
          <div className="popular-searches">
            <h4>Popular Searches:</h4>
            <div className="popular-tags">
              <span className="popular-tag">photosynthesis</span>
              <span className="popular-tag">gravity</span>
              <span className="popular-tag">DNA</span>
              <span className="popular-tag">circuits</span>
              <span className="popular-tag">molecules</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="results-list">
          {searchResults.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={getResultPath(result)}
              className="result-item"
            >
              <div className="result-header">
                <span className="result-icon">{getResultIcon(result.type)}</span>
                <span className="result-type">{result.type}</span>
                {result.relevanceScore && (
                  <span className="relevance-score" title="Relevance score">
                    {Math.round(result.relevanceScore)}%
                  </span>
                )}
              </div>

              <h3 className="result-title">
                {highlightSearchTerms(
                  result.type === 'concept' ? result.title : result.name, 
                  searchQuery
                )}
              </h3>

              <p className="result-description">
                {highlightSearchTerms(
                  result.type === 'concept' 
                    ? (result.content?.en?.summary || result.content?.en?.body?.substring(0, 150) + '...' || 'No description available')
                    : result.description, 
                  searchQuery
                )}
              </p>

              <div className="result-breadcrumb">
                {result.subjectName && (
                  <span className="breadcrumb-item">
                    <IoLibraryOutline aria-hidden="true" /> {result.subjectName}
                  </span>
                )}
                {result.topicName && (
                  <span className="breadcrumb-item">
                    <IoBookOutline aria-hidden="true" /> {result.topicName}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .search-results {
          width: 100%;
        }

        .search-results-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .search-results-header h2 {
          font-size: 1.75rem;
          color: #495057;
          margin-bottom: 1rem;
        }

        .search-instructions {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .search-tips {
          background: #f8f9fa;
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: left;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-tips h4 {
          color: #495057;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .search-tips ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0;
        }

        .search-tips li {
          color: #6c757d;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .search-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .search-query {
          font-weight: 600;
          color: #007bff;
          background: #e3f2fd;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }

        .search-scope {
          color: #6c757d;
        }

        .results-count {
          color: #495057;
          font-weight: 500;
          background: #f8f9fa;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }

        .no-results {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #495057;
        }

        .no-results p {
          color: #6c757d;
          margin-bottom: 2rem;
          font-size: 1rem;
          line-height: 1.5;
        }

        .no-results-suggestions {
          text-align: left;
          max-width: 400px;
          margin: 0 auto 2rem auto;
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 0.75rem;
        }

        .no-results-suggestions h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #495057;
        }

        .no-results-suggestions ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0;
        }

        .no-results-suggestions li {
          margin-bottom: 0.5rem;
          color: #6c757d;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .popular-searches {
          text-align: center;
        }

        .popular-searches h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #495057;
        }

        .popular-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .popular-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.375rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #bbdefb;
        }

        .popular-tag:hover {
          background: #1976d2;
          color: white;
          transform: translateY(-1px);
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .result-item {
          display: block;
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          border: 1px solid #e9ecef;
        }

        .result-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          text-decoration: none;
          color: inherit;
          border-color: #007bff;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .result-icon {
          font-size: 1.25rem;
        }

        .result-type {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f8f9fa;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }

        .relevance-score {
          margin-left: auto;
          font-size: 0.75rem;
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
        }

        .result-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #495057;
          line-height: 1.4;
        }

        .result-description {
          font-size: 0.875rem;
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .result-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: #9ca3af;
          flex-wrap: wrap;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #f8f9fa;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
        }

        .search-highlight {
          background: #fff3cd;
          color: #856404;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .search-results-header {
            margin-bottom: 1.5rem;
          }

          .search-results-header h2 {
            font-size: 1.5rem;
          }

          .search-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .no-results {
            padding: 2rem 1rem;
          }

          .no-results-suggestions {
            text-align: center;
          }

          .result-item {
            padding: 1rem;
          }

          .result-header {
            flex-wrap: wrap;
          }

          .result-title {
            font-size: 1.125rem;
          }

          .popular-tags {
            justify-content: center;
          }

          .search-tips {
            padding: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .no-results {
            padding: 1.5rem 0.75rem;
          }

          .no-results-icon {
            font-size: 3rem;
          }

          .result-item {
            padding: 0.75rem;
          }

          .result-title {
            font-size: 1rem;
          }

          .result-description {
            font-size: 0.8125rem;
          }

          .popular-tag {
            font-size: 0.8125rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}