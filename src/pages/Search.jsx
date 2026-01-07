import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { useSearch } from "../context/SearchContext";

export default function Search() {
  const [searchParams] = useSearchParams();
  const { handleSearchChange, setScope, executeSearch } = useSearch();
  const lastQueryRef = useRef("");
  const lastScopeRef = useRef("");
  
  const query = searchParams.get("q") || "";
  const scope = searchParams.get("scope") || "all";

  // Update search state when URL parameters change
  useEffect(() => {
    // Only execute search if query or scope actually changed
    if (query && (query !== lastQueryRef.current || scope !== lastScopeRef.current)) {
      lastQueryRef.current = query;
      lastScopeRef.current = scope;
      
      // Use the functions directly to avoid dependency issues
      handleSearchChange(query);
      setScope(scope);
      executeSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, scope]); // Intentionally excluding function dependencies to prevent infinite loop

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="search-page-header">
          <h1>Search</h1>
          <SearchBar placeholder="Search subjects, topics, and concepts..." />
        </div>
        
        <SearchResults showHeader={true} />
      </div>
    </>
  );
}