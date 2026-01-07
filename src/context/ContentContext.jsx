import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { subjectService, topicService, conceptService, searchService } from "../services/firestoreService";
import { useLanguage } from "./LanguageContext";

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLanguage, getLocalizedContent } = useLanguage();

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [subjectsData, topicsData, conceptsData] = await Promise.all([
        subjectService.getAll(),
        topicService.getAll(),
        conceptService.getAll()
      ]);

      setSubjects(subjectsData);
      setTopics(topicsData);
      setConcepts(conceptsData);
    } catch (err) {
      console.error("Error loading content:", err);
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized getter functions to prevent re-renders
  const getTopicsBySubject = useCallback((subjectId) => {
    return topics.filter(topic => topic.subjectId === subjectId);
  }, [topics]);

  const getConceptsByTopic = useCallback((topicId) => {
    return concepts.filter(concept => concept.topicId === topicId);
  }, [concepts]);

  const getSubjectById = useCallback((subjectId) => {
    return subjects.find(subject => subject.id === subjectId);
  }, [subjects]);

  const getTopicById = useCallback((topicId) => {
    return topics.find(topic => topic.id === topicId);
  }, [topics]);

  const getConceptById = useCallback((conceptId) => {
    return concepts.find(concept => concept.id === conceptId);
  }, [concepts]);

  // Search content
  const searchContent = useCallback(async (query, scope = "all") => {
    try {
      if (!query.trim()) return [];

      // Use Firestore search service
      const results = await searchService.searchContent(query, scope);

      // Apply language localization to results asynchronously
      const localizedResults = await Promise.all(
        results.map(async (item) => {
          if (item.type === "concept" && item.content) {
            try {
              const localizedContent = await getLocalizedContent(item.content, item.id, "concept");
              return {
                ...item,
                localizedContent
              };
            } catch (err) {
              console.error("Error localizing search result:", err);
              return item;
            }
          }
          return item;
        })
      );

      return localizedResults;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  }, [getLocalizedContent]);

  // Load content with caching (for individual items)
  const loadContent = useCallback(async (contentId, contentType) => {
    try {
      let content = null;

      switch (contentType) {
        case "subject":
          content = await subjectService.getById(contentId);
          break;
        case "topic":
          content = await topicService.getById(contentId);
          break;
        case "concept":
          content = await conceptService.getById(contentId);
          if (content && content.content) {
            try {
              content.localizedContent = await getLocalizedContent(content.content, contentId, "concept");
            } catch (err) {
              console.error("Error localizing content:", err);
              // Fallback to original content
              content.localizedContent = content.content.en || Object.values(content.content)[0];
            }
          }
          break;
        default:
          throw new Error("Invalid content type");
      }

      return content;
    } catch (err) {
      console.error(`Error loading ${contentType}:`, err);
      return null;
    }
  }, [getLocalizedContent]);

  // Track user activity (keeping localStorage for now)
  const trackUserActivity = useCallback((userId, activityType, contentId, metadata = {}) => {
    try {
      const storageKey = `user_stats_${userId}`;
      const currentStats = JSON.parse(localStorage.getItem(storageKey) || '{}');

      // Initialize stats if not exists
      if (!currentStats.topicsViewed) currentStats.topicsViewed = 0;
      if (!currentStats.conceptsRead) currentStats.conceptsRead = 0;
      if (!currentStats.totalReadTime) currentStats.totalReadTime = 0;
      if (!currentStats.viewedTopics) currentStats.viewedTopics = [];
      if (!currentStats.readConcepts) currentStats.readConcepts = [];

      // Update stats based on activity type
      switch (activityType) {
        case "topic_viewed":
          if (!currentStats.viewedTopics.includes(contentId)) {
            currentStats.topicsViewed++;
            currentStats.viewedTopics.push(contentId);
          }
          break;
        case "concept_read":
          if (!currentStats.readConcepts.includes(contentId)) {
            currentStats.conceptsRead++;
            currentStats.readConcepts.push(contentId);
            if (metadata.readTime) {
              currentStats.totalReadTime += metadata.readTime;
            }
          }
          break;
      }

      currentStats.lastActivity = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify(currentStats));
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  }, []);

  // Get user statistics
  const getUserStats = useCallback((userId) => {
    try {
      const storageKey = `user_stats_${userId}`;
      const stats = JSON.parse(localStorage.getItem(storageKey) || '{}');

      return {
        topicsViewed: stats.topicsViewed || 0,
        conceptsRead: stats.conceptsRead || 0,
        totalReadTime: stats.totalReadTime || 0,
        lastActivity: stats.lastActivity || null,
        viewedTopics: stats.viewedTopics || [],
        readConcepts: stats.readConcepts || []
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        topicsViewed: 0,
        conceptsRead: 0,
        totalReadTime: 0,
        lastActivity: null,
        viewedTopics: [],
        readConcepts: []
      };
    }
  }, []);

  // Refresh data (useful after admin changes)
  const refreshData = useCallback(async () => {
    await loadAllData();
  }, [loadAllData]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // Data
    subjects,
    topics,
    concepts,
    loading,
    error,

    // Getters
    getTopicsBySubject,
    getConceptsByTopic,
    getSubjectById,
    getTopicById,
    getConceptById,

    // Operations
    searchContent,
    loadContent,
    trackUserActivity,
    getUserStats,
    refreshData,

    // Stats
    totalSubjects: subjects.length,
    totalTopics: topics.length,
    totalConcepts: concepts.length
  }), [
    subjects,
    topics,
    concepts,
    loading,
    error,
    getTopicsBySubject,
    getConceptsByTopic,
    getSubjectById,
    getTopicById,
    getConceptById,
    searchContent,
    loadContent,
    trackUserActivity,
    getUserStats,
    refreshData
  ]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentContext;