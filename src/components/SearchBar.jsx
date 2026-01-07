import { useState, useRef } from "react";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ placeholder = "Search subjects, topics, and concepts...", showSuggestions = true }) {
  const {
    searchQuery,
    suggestions,
    searchScope,
    isSearching,
    handleSearchChange,
    executeSearch,
    setScope,
    getPopularSearches
  } = useSearch();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch();
      setShowDropdown(false);
      // Navigate to search results (we'll create this route)
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&scope=${searchScope}`);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    handleSearchChange(value);
    setShowDropdown(value.trim().length > 0 && showSuggestions);
    setFocusedIndex(-1);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchQuery.trim().length > 0 && showSuggestions) {
      setShowDropdown(true);
    }
  };

  // Handle input blur (with delay to allow clicking suggestions)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setFocusedIndex(-1);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const suggestionsList = suggestions.length > 0 ? suggestions : getPopularSearches();
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestionsList.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestionsList.length) {
          const selectedSuggestion = suggestionsList[focusedIndex];
          handleSearchChange(selectedSuggestion);
          executeSearch(selectedSuggestion);
          setShowDropdown(false);
          navigate(`/search?q=${encodeURIComponent(selectedSuggestion)}&scope=${searchScope}`);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setFocusedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSearchChange(suggestion);
    executeSearch(suggestion);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}&scope=${searchScope}`);
  };

  // Handle scope change
  const handleScopeChange = (e) => {
    setScope(e.target.value);
  };

  // Get display suggestions
  const displaySuggestions = suggestions.length > 0 ? suggestions : getPopularSearches();

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            autoComplete="off"
          />
          
          <select
            value={searchScope}
            onChange={handleScopeChange}
            className="search-scope-select"
            title="Search scope"
          >
            <option value="all">All Content</option>
            <option value="subjects">Subjects Only</option>
            <option value="topics">Topics Only</option>
            <option value="concepts">Concepts Only</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="engineering">Engineering</option>
          </select>
          
          <button
            type="submit"
            className="search-button"
            disabled={isSearching || !searchQuery.trim()}
            title="Search"
          >
            {isSearching ? "⏳" : "🔍"}
          </button>
        </div>

        {/* Search suggestions dropdown */}
        {showDropdown && displaySuggestions.length > 0 && (
          <div className="search-suggestions">
            <div className="suggestions-header">
              {suggestions.length > 0 ? "Suggestions" : "Recent Searches"}
            </div>
            {displaySuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`suggestion-item ${index === focusedIndex ? "focused" : ""}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <span className="suggestion-icon">
                  {suggestions.length > 0 ? "💡" : "🕒"}
                </span>
                <span className="suggestion-text">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}