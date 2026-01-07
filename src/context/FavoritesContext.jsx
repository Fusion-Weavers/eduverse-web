import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

// Favorites utilities
const FavoritesUtils = {
  // Get user-specific storage key
  getUserStorageKey: (userId, type) => {
    return `favorites_${type}_${userId}`;
  },

  // Load favorites from localStorage
  loadFavorites: (userId, type) => {
    try {
      const key = FavoritesUtils.getUserStorageKey(userId, type);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Error loading ${type} favorites:`, error);
      return [];
    }
  },

  // Save favorites to localStorage
  saveFavorites: (userId, type, favorites) => {
    try {
      const key = FavoritesUtils.getUserStorageKey(userId, type);
      localStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error(`Error saving ${type} favorites:`, error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        FavoritesUtils.clearOldFavorites(userId);
        // Try again after clearing
        try {
          const key = FavoritesUtils.getUserStorageKey(userId, type);
          localStorage.setItem(key, JSON.stringify(favorites));
        } catch (retryError) {
          console.error(`Failed to save ${type} favorites after cleanup:`, retryError);
        }
      }
    }
  },

  // Clear old favorites data (for storage management)
  clearOldFavorites: (userId) => {
    try {
      const keys = Object.keys(localStorage);
      const userFavoriteKeys = keys.filter(key => 
        key.startsWith('favorites_') && key.endsWith(`_${userId}`)
      );
      
      // For now, just clear any orphaned favorite entries
      // In a real app, you might implement more sophisticated cleanup
      userFavoriteKeys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (!Array.isArray(data)) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing old favorites:', error);
    }
  },

  // Sync favorites when coming back online
  syncFavorites: async (userId, pendingActions) => {
    // In a real app, this would sync with a backend API
    // For now, we just apply the pending actions locally
    try {
      for (const action of pendingActions) {
        const { type, itemType, itemId, operation } = action;
        
        if (type === 'favorite') {
          const currentFavorites = FavoritesUtils.loadFavorites(userId, itemType);
          
          if (operation === 'add' && !currentFavorites.includes(itemId)) {
            currentFavorites.push(itemId);
            FavoritesUtils.saveFavorites(userId, itemType, currentFavorites);
          } else if (operation === 'remove') {
            const updatedFavorites = currentFavorites.filter(id => id !== itemId);
            FavoritesUtils.saveFavorites(userId, itemType, updatedFavorites);
          }
        }
      }
      
      // Clear pending actions after sync
      localStorage.removeItem(`pending_favorites_${userId}`);
      return true;
    } catch (error) {
      console.error('Error syncing favorites:', error);
      return false;
    }
  },

  // Add pending action for offline sync
  addPendingAction: (userId, action) => {
    try {
      const key = `pending_favorites_${userId}`;
      const existing = localStorage.getItem(key);
      const pendingActions = existing ? JSON.parse(existing) : [];
      
      pendingActions.push({
        ...action,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(key, JSON.stringify(pendingActions));
    } catch (error) {
      console.error('Error adding pending action:', error);
    }
  },

  // Get pending actions
  getPendingActions: (userId) => {
    try {
      const key = `pending_favorites_${userId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  }
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteTopics, setFavoriteTopics] = useState([]);
  const [favoriteConcepts, setFavoriteConcepts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'pending'

  // Sync pending actions
  const syncPendingActions = useCallback(async () => {
    if (!user?.uid || syncStatus === 'syncing') return;

    const pendingActions = FavoritesUtils.getPendingActions(user.uid);
    if (pendingActions.length === 0) {
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('syncing');
    try {
      const success = await FavoritesUtils.syncFavorites(user.uid, pendingActions);
      if (success) {
        setSyncStatus('synced');
        // Reload favorites after sync
        const topics = FavoritesUtils.loadFavorites(user.uid, 'topics');
        const concepts = FavoritesUtils.loadFavorites(user.uid, 'concepts');
        setFavoriteTopics(topics);
        setFavoriteConcepts(concepts);
      } else {
        setSyncStatus('pending');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('pending');
    }
  }, [user?.uid, syncStatus]);

  // Load favorites when user changes
  useEffect(() => {
    if (user?.uid) {
      const topics = FavoritesUtils.loadFavorites(user.uid, 'topics');
      const concepts = FavoritesUtils.loadFavorites(user.uid, 'concepts');
      
      setFavoriteTopics(topics);
      setFavoriteConcepts(concepts);
      
      // Check for pending sync actions
      const pendingActions = FavoritesUtils.getPendingActions(user.uid);
      if (pendingActions.length > 0) {
        setSyncStatus('pending');
      }
    } else {
      // Clear favorites when user logs out
      setFavoriteTopics([]);
      setFavoriteConcepts([]);
      setSyncStatus('synced');
    }
  }, [user?.uid]); // Only depend on user.uid to avoid unnecessary re-runs

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to sync pending actions when coming back online
      if (user?.uid) {
        syncPendingActions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user?.uid, syncPendingActions]);

  // Check if a topic is favorited
  const isTopicFavorited = (topicId) => {
    return favoriteTopics.includes(topicId);
  };

  // Check if a concept is favorited
  const isConceptFavorited = (conceptId) => {
    return favoriteConcepts.includes(conceptId);
  };

  // Toggle topic favorite status
  const toggleTopicFavorite = (topicId) => {
    if (!user?.uid) {
      console.warn('User must be logged in to manage favorites');
      return;
    }

    const isFavorited = favoriteTopics.includes(topicId);
    let updatedFavorites;

    if (isFavorited) {
      // Remove from favorites
      updatedFavorites = favoriteTopics.filter(id => id !== topicId);
    } else {
      // Add to favorites
      updatedFavorites = [...favoriteTopics, topicId];
    }

    // Update state immediately (optimistic update)
    setFavoriteTopics(updatedFavorites);
    
    // Save to localStorage
    FavoritesUtils.saveFavorites(user.uid, 'topics', updatedFavorites);

    // Add pending action for sync if offline
    if (!isOnline) {
      FavoritesUtils.addPendingAction(user.uid, {
        type: 'favorite',
        itemType: 'topics',
        itemId: topicId,
        operation: isFavorited ? 'remove' : 'add'
      });
      setSyncStatus('pending');
    }

    return !isFavorited; // Return new favorite status
  };

  // Toggle concept favorite status
  const toggleConceptFavorite = (conceptId) => {
    if (!user?.uid) {
      console.warn('User must be logged in to manage favorites');
      return;
    }

    const isFavorited = favoriteConcepts.includes(conceptId);
    let updatedFavorites;

    if (isFavorited) {
      // Remove from favorites
      updatedFavorites = favoriteConcepts.filter(id => id !== conceptId);
    } else {
      // Add to favorites
      updatedFavorites = [...favoriteConcepts, conceptId];
    }

    // Update state immediately (optimistic update)
    setFavoriteConcepts(updatedFavorites);
    
    // Save to localStorage
    FavoritesUtils.saveFavorites(user.uid, 'concepts', updatedFavorites);

    // Add pending action for sync if offline
    if (!isOnline) {
      FavoritesUtils.addPendingAction(user.uid, {
        type: 'favorite',
        itemType: 'concepts',
        itemId: conceptId,
        operation: isFavorited ? 'remove' : 'add'
      });
      setSyncStatus('pending');
    }

    return !isFavorited; // Return new favorite status
  };

  // Add topic to favorites
  const addTopicToFavorites = (topicId) => {
    if (!isTopicFavorited(topicId)) {
      toggleTopicFavorite(topicId);
    }
  };

  // Remove topic from favorites
  const removeTopicFromFavorites = (topicId) => {
    if (isTopicFavorited(topicId)) {
      toggleTopicFavorite(topicId);
    }
  };

  // Add concept to favorites
  const addConceptToFavorites = (conceptId) => {
    if (!isConceptFavorited(conceptId)) {
      toggleConceptFavorite(conceptId);
    }
  };

  // Remove concept from favorites
  const removeConceptFromFavorites = (conceptId) => {
    if (isConceptFavorited(conceptId)) {
      toggleConceptFavorite(conceptId);
    }
  };

  // Get all favorites organized by subject
  const getFavoritesBySubject = (subjects, topics, concepts) => {
    const favoritesBySubject = {};

    // Initialize subjects
    subjects.forEach(subject => {
      favoritesBySubject[subject.id] = {
        subject,
        topics: [],
        concepts: []
      };
    });

    // Add favorite topics
    favoriteTopics.forEach(topicId => {
      const topic = topics.find(t => t.id === topicId);
      if (topic) {
        const subjectData = favoritesBySubject[topic.subjectId];
        if (subjectData) {
          subjectData.topics.push(topic);
        }
      }
    });

    // Add favorite concepts
    favoriteConcepts.forEach(conceptId => {
      const concept = concepts.find(c => c.id === conceptId);
      if (concept) {
        const topic = topics.find(t => t.id === concept.topicId);
        if (topic) {
          const subjectData = favoritesBySubject[topic.subjectId];
          if (subjectData) {
            subjectData.concepts.push({
              ...concept,
              topicName: topic.name
            });
          }
        }
      }
    });

    // Filter out subjects with no favorites
    const result = {};
    Object.keys(favoritesBySubject).forEach(subjectId => {
      const subjectData = favoritesBySubject[subjectId];
      if (subjectData.topics.length > 0 || subjectData.concepts.length > 0) {
        result[subjectId] = subjectData;
      }
    });

    return result;
  };

  // Get total favorites count
  const getTotalFavoritesCount = () => {
    return favoriteTopics.length + favoriteConcepts.length;
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    if (!user?.uid) return;

    setFavoriteTopics([]);
    setFavoriteConcepts([]);
    
    FavoritesUtils.saveFavorites(user.uid, 'topics', []);
    FavoritesUtils.saveFavorites(user.uid, 'concepts', []);

    // Add pending actions for sync if offline
    if (!isOnline) {
      favoriteTopics.forEach(topicId => {
        FavoritesUtils.addPendingAction(user.uid, {
          type: 'favorite',
          itemType: 'topics',
          itemId: topicId,
          operation: 'remove'
        });
      });

      favoriteConcepts.forEach(conceptId => {
        FavoritesUtils.addPendingAction(user.uid, {
          type: 'favorite',
          itemType: 'concepts',
          itemId: conceptId,
          operation: 'remove'
        });
      });

      setSyncStatus('pending');
    }
  };

  const value = {
    // Favorite data
    favoriteTopics,
    favoriteConcepts,
    
    // Status
    isOnline,
    syncStatus,
    
    // Check functions
    isTopicFavorited,
    isConceptFavorited,
    
    // Toggle functions
    toggleTopicFavorite,
    toggleConceptFavorite,
    
    // Direct add/remove functions
    addTopicToFavorites,
    removeTopicFromFavorites,
    addConceptToFavorites,
    removeConceptFromFavorites,
    
    // Utility functions
    getFavoritesBySubject,
    getTotalFavoritesCount,
    clearAllFavorites,
    syncPendingActions,
    
    // Pending actions info
    getPendingActionsCount: () => FavoritesUtils.getPendingActions(user?.uid || '').length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;