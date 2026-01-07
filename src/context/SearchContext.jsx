import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useContent } from "./ContentContext";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const { searchContent } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchScope, setSearchScope] = useState("all"); // 'all', 'subjects', 'topics', 'concepts', or specific subject ID
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("search_history");
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("search_history", JSON.stringify(searchHistory));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  }, [searchHistory]);

  // Perform search
  const performSearch = useCallback(async (query, scope = searchScope) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Add delay to simulate search processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const results = await searchContent(query.trim(), scope);
      setSearchResults(results);
      
      // Add to search history if it's a new search
      const trimmedQuery = query.trim();
      if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
        const newHistory = [trimmedQuery, ...searchHistory.slice(0, 9)]; // Keep last 10 searches
        setSearchHistory(newHistory);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchContent, searchScope, searchHistory]);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    
    // Generate suggestions based on search history
    if (query.trim()) {
      const matchingSuggestions = searchHistory.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchHistory]);

  // Execute search (called when user submits)
  const executeSearch = useCallback((query = searchQuery) => {
    performSearch(query, searchScope);
    setSuggestions([]); // Clear suggestions after search
  }, [performSearch, searchQuery, searchScope]);

  // Set search scope (for scoped searches within subjects)
  const setScope = useCallback((scope) => {
    setSearchScope(scope);
    // Re-run search if there's an active query
    if (searchQuery.trim()) {
      performSearch(searchQuery, scope);
    }
  }, [searchQuery, performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSuggestions([]);
    setSearchScope("all");
  }, []);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    setSuggestions([]);
  }, []);

  // Get popular search terms (most recent from history)
  const getPopularSearches = useCallback(() => {
    return searchHistory.slice(0, 5);
  }, [searchHistory]);

  const value = {
    // Search state
    searchQuery,
    searchResults,
    searchHistory,
    searchScope,
    isSearching,
    suggestions,
    
    // Search actions
    handleSearchChange,
    executeSearch,
    performSearch,
    setScope,
    clearSearch,
    clearSearchHistory,
    
    // Utility functions
    getPopularSearches,
    
    // State setters for direct manipulation if needed
    setSearchQuery,
    setSearchResults
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export default SearchContext;