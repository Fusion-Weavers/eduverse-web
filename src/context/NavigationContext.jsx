import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

const NAVIGATION_STORAGE_KEY = 'navigation_state';

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigation state that persists across page transitions
  const [navigationState, setNavigationState] = useState(() => {
    try {
      const saved = localStorage.getItem(NAVIGATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        lastVisited: {
          path: '/',
          timestamp: new Date().toISOString()
        },
        breadcrumbs: [],
        scrollPositions: {},
        filterStates: {},
        sortStates: {}
      };
    } catch (error) {
      console.error('Error loading navigation state:', error);
      return {
        lastVisited: {
          path: '/',
          timestamp: new Date().toISOString()
        },
        breadcrumbs: [],
        scrollPositions: {},
        filterStates: {},
        sortStates: {}
      };
    }
  });

  // Save navigation state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(navigationState));
    } catch (error) {
      console.error('Error saving navigation state:', error);
    }
  }, [navigationState]);

  // Update last visited path when location changes
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      lastVisited: {
        path: location.pathname,
        timestamp: new Date().toISOString()
      }
    }));
  }, [location.pathname]);

  // Save scroll position before navigation
  const saveScrollPosition = (path, position) => {
    setNavigationState(prev => ({
      ...prev,
      scrollPositions: {
        ...prev.scrollPositions,
        [path]: position
      }
    }));
  };

  // Restore scroll position for a path
  const getScrollPosition = (path) => {
    return navigationState.scrollPositions[path] || 0;
  };

  // Save filter state for a specific page/component
  const saveFilterState = (key, filterState) => {
    setNavigationState(prev => ({
      ...prev,
      filterStates: {
        ...prev.filterStates,
        [key]: filterState
      }
    }));
  };

  // Get filter state for a specific page/component
  const getFilterState = (key) => {
    return navigationState.filterStates[key] || {};
  };

  // Save sort state for a specific page/component
  const saveSortState = (key, sortState) => {
    setNavigationState(prev => ({
      ...prev,
      sortStates: {
        ...prev.sortStates,
        [key]: sortState
      }
    }));
  };

  // Get sort state for a specific page/component
  const getSortState = (key) => {
    return navigationState.sortStates[key] || {};
  };

  // Add breadcrumb
  const addBreadcrumb = (breadcrumb) => {
    setNavigationState(prev => {
      const newBreadcrumbs = [...prev.breadcrumbs];
      
      // Remove duplicate if exists
      const existingIndex = newBreadcrumbs.findIndex(b => b.path === breadcrumb.path);
      if (existingIndex !== -1) {
        newBreadcrumbs.splice(existingIndex, 1);
      }
      
      // Add new breadcrumb
      newBreadcrumbs.push({
        ...breadcrumb,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 10 breadcrumbs
      if (newBreadcrumbs.length > 10) {
        newBreadcrumbs.shift();
      }
      
      return {
        ...prev,
        breadcrumbs: newBreadcrumbs
      };
    });
  };

  // Clear breadcrumbs
  const clearBreadcrumbs = () => {
    setNavigationState(prev => ({
      ...prev,
      breadcrumbs: []
    }));
  };

  // Navigate with state preservation
  const navigateWithState = (path, options = {}) => {
    // Save current scroll position
    const currentScrollY = window.scrollY;
    saveScrollPosition(location.pathname, currentScrollY);
    
    // Add breadcrumb if specified
    if (options.breadcrumb) {
      addBreadcrumb({
        path: location.pathname,
        title: options.breadcrumb.title,
        params: options.breadcrumb.params
      });
    }
    
    // Navigate
    navigate(path, options.navigateOptions);
    
    // Restore scroll position after navigation (with delay for DOM update)
    if (options.restoreScroll !== false) {
      setTimeout(() => {
        const savedPosition = getScrollPosition(path);
        window.scrollTo(0, savedPosition);
      }, 100);
    }
  };

  // Get navigation history for back button functionality
  const getNavigationHistory = () => {
    return navigationState.breadcrumbs.slice().reverse();
  };

  // Go back to previous page with state restoration
  const goBack = () => {
    const history = getNavigationHistory();
    if (history.length > 0) {
      const previous = history[0];
      navigateWithState(previous.path, { restoreScroll: true });
      
      // Remove the breadcrumb we're going back to
      setNavigationState(prev => ({
        ...prev,
        breadcrumbs: prev.breadcrumbs.filter(b => b.path !== previous.path)
      }));
    } else {
      navigate(-1);
    }
  };

  // Clear all navigation state (useful for logout)
  const clearNavigationState = () => {
    const initialState = {
      lastVisited: {
        path: '/',
        timestamp: new Date().toISOString()
      },
      breadcrumbs: [],
      scrollPositions: {},
      filterStates: {},
      sortStates: {}
    };
    
    setNavigationState(initialState);
    localStorage.removeItem(NAVIGATION_STORAGE_KEY);
  };

  const value = {
    navigationState,
    
    // Scroll position management
    saveScrollPosition,
    getScrollPosition,
    
    // Filter and sort state management
    saveFilterState,
    getFilterState,
    saveSortState,
    getSortState,
    
    // Breadcrumb management
    addBreadcrumb,
    clearBreadcrumbs,
    getNavigationHistory,
    
    // Enhanced navigation
    navigateWithState,
    goBack,
    
    // State management
    clearNavigationState
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationContext;