import { useState, useRef, useCallback } from "react";

/**
 * Custom hook for debounced search functionality
 * 
 * Usage:
 * const { searchQuery, setSearchQuery, isSearching } = useDebouncedSearch(
 *   async (query) => {
 *     const response = await get(`${API_ENDPOINT}?search=${query}`);
 *     setResults(response.results);
 *   },
 *   300 // debounce delay in ms
 * );
 */
export const useDebouncedSearch = (onSearch, debounceMs = 300) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const handleSearch = useCallback(
    (value) => {
      setSearchQuery(value);

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!value || value.trim() === "") {
        // If search is cleared, immediately reset
        setIsSearching(false);
        onSearch("");
        return;
      }

      // Set loading state and trigger search after debounce
      setIsSearching(true);
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          await onSearch(value.trim());
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    onSearch("");
  }, [onSearch]);

  return {
    searchQuery,
    setSearchQuery: handleSearch,
    clearSearch,
    isSearching,
  };
};

export default useDebouncedSearch;
