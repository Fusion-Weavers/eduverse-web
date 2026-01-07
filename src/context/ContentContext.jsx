import { createContext, useContext, useState, useEffect } from "react";

const ContentContext = createContext();

// Mock data for the four subjects
const mockSubjects = [
  {
    id: "physics",
    name: "Physics",
    description: "Study of matter, energy, and their interactions",
    icon: "⚛️",
    topicCount: 12,
    difficulty: "intermediate",
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Science of atoms, molecules, and chemical reactions",
    icon: "🧪",
    topicCount: 10,
    difficulty: "intermediate",
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "biology",
    name: "Biology",
    description: "Study of living organisms and life processes",
    icon: "🧬",
    topicCount: 15,
    difficulty: "beginner",
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Application of science and math to solve problems",
    icon: "⚙️",
    topicCount: 8,
    difficulty: "advanced",
    languages: ["en", "es", "fr", "de"]
  }
];

// Mock topics data
const mockTopics = [
  // Physics topics
  {
    id: "mechanics",
    subjectId: "physics",
    name: "Mechanics",
    description: "Motion, forces, and energy",
    difficulty: "beginner",
    conceptCount: 8,
    estimatedTime: 45,
    prerequisites: [],
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "thermodynamics",
    subjectId: "physics",
    name: "Thermodynamics",
    description: "Heat, temperature, and energy transfer",
    difficulty: "intermediate",
    conceptCount: 6,
    estimatedTime: 60,
    prerequisites: ["mechanics"],
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "electromagnetism",
    subjectId: "physics",
    name: "Electromagnetism",
    description: "Electric and magnetic fields and forces",
    difficulty: "advanced",
    conceptCount: 10,
    estimatedTime: 90,
    prerequisites: ["mechanics"],
    languages: ["en", "es", "fr", "de"]
  },
  // Chemistry topics
  {
    id: "atomic-structure",
    subjectId: "chemistry",
    name: "Atomic Structure",
    description: "Structure and properties of atoms",
    difficulty: "beginner",
    conceptCount: 5,
    estimatedTime: 30,
    prerequisites: [],
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "chemical-bonding",
    subjectId: "chemistry",
    name: "Chemical Bonding",
    description: "How atoms form bonds and molecules",
    difficulty: "intermediate",
    conceptCount: 7,
    estimatedTime: 50,
    prerequisites: ["atomic-structure"],
    languages: ["en", "es", "fr", "de"]
  },
  // Biology topics
  {
    id: "cell-biology",
    subjectId: "biology",
    name: "Cell Biology",
    description: "Structure and function of cells",
    difficulty: "beginner",
    conceptCount: 9,
    estimatedTime: 40,
    prerequisites: [],
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "genetics",
    subjectId: "biology",
    name: "Genetics",
    description: "Heredity and genetic variation",
    difficulty: "intermediate",
    conceptCount: 12,
    estimatedTime: 70,
    prerequisites: ["cell-biology"],
    languages: ["en", "es", "fr", "de"]
  },
  // Engineering topics
  {
    id: "structural-engineering",
    subjectId: "engineering",
    name: "Structural Engineering",
    description: "Design and analysis of structures",
    difficulty: "advanced",
    conceptCount: 6,
    estimatedTime: 80,
    prerequisites: [],
    languages: ["en", "es", "fr", "de"]
  },
  {
    id: "electrical-circuits",
    subjectId: "engineering",
    name: "Electrical Circuits",
    description: "Analysis and design of electrical circuits",
    difficulty: "intermediate",
    conceptCount: 8,
    estimatedTime: 65,
    prerequisites: [],
    languages: ["en", "es", "fr", "de"]
  }
];

// Mock concepts data
const mockConcepts = [
  // Mechanics concepts
  {
    id: "newtons-laws",
    topicId: "mechanics",
    title: "Newton's Laws of Motion",
    difficulty: "beginner",
    estimatedReadTime: 15,
    relatedConcepts: ["force-acceleration", "momentum"],
    languages: ["en", "es", "fr", "de"],
    lastUpdated: new Date("2024-01-15"),
    arEnabled: false,
    visualizationType: "none",
    content: {
      en: {
        title: "Newton's Laws of Motion",
        body: "Newton's three laws of motion describe the relationship between forces acting on a body and its motion.\n\nThe first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force. This is also known as the law of inertia.\n\nThe second law establishes that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma).\n\nThe third law states that for every action, there is an equal and opposite reaction.",
        summary: "Three fundamental laws describing motion and forces",
        examples: ["A ball rolling on a flat surface continues until friction stops it", "A car braking applies force to decelerate", "When you walk, you push back on the ground and it pushes you forward"],
        images: ["https://example.com/newtons-laws-diagram.jpg"],
        externalAssets: ["https://example.com/interactive-newton-simulation"]
      },
      es: {
        title: "Leyes del Movimiento de Newton",
        body: "Las tres leyes del movimiento de Newton describen la relación entre las fuerzas que actúan sobre un cuerpo y su movimiento.\n\nLa primera ley establece que un objeto en reposo permanece en reposo y un objeto en movimiento permanece en movimiento a menos que actúe sobre él una fuerza externa. Esto también se conoce como la ley de inercia.\n\nLa segunda ley establece que la aceleración de un objeto es directamente proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa (F = ma).\n\nLa tercera ley establece que para cada acción, hay una reacción igual y opuesta.",
        summary: "Tres leyes fundamentales que describen el movimiento y las fuerzas",
        examples: ["Una pelota rodando en una superficie plana continúa hasta que la fricción la detiene", "Un coche frenando aplica fuerza para desacelerar", "Cuando caminas, empujas hacia atrás el suelo y este te empuja hacia adelante"],
        images: ["https://example.com/newtons-laws-diagram-es.jpg"],
        externalAssets: ["https://example.com/interactive-newton-simulation-es"]
      }
    }
  },
  {
    id: "force-acceleration",
    topicId: "mechanics",
    title: "Force and Acceleration",
    difficulty: "beginner",
    estimatedReadTime: 12,
    relatedConcepts: ["newtons-laws"],
    languages: ["en", "es", "fr", "de"],
    lastUpdated: new Date("2024-01-20"),
    arEnabled: false,
    visualizationType: "none",
    content: {
      en: {
        title: "Force and Acceleration",
        body: "Force is a push or pull that can change an object's motion. According to Newton's second law, the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma).\n\nThis relationship means that:\n- Larger forces produce greater accelerations\n- More massive objects require more force to achieve the same acceleration\n- Acceleration is always in the same direction as the net force",
        summary: "Relationship between force, mass, and acceleration",
        examples: ["Pushing a shopping cart - more force makes it accelerate faster", "Throwing a baseball - the force determines how fast it accelerates", "A heavy truck needs more force than a car to accelerate at the same rate"]
      },
      es: {
        title: "Fuerza y Aceleración",
        body: "La fuerza es un empuje o tirón que puede cambiar el movimiento de un objeto. Según la segunda ley de Newton, la aceleración de un objeto es directamente proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa (F = ma).\n\nEsta relación significa que:\n- Fuerzas mayores producen aceleraciones mayores\n- Objetos más masivos requieren más fuerza para lograr la misma aceleración\n- La aceleración siempre está en la misma dirección que la fuerza neta",
        summary: "Relación entre fuerza, masa y aceleración",
        examples: ["Empujar un carrito de compras - más fuerza lo hace acelerar más rápido", "Lanzar una pelota de béisbol - la fuerza determina qué tan rápido acelera", "Un camión pesado necesita más fuerza que un coche para acelerar al mismo ritmo"]
      }
    }
  },
  // Atomic Structure concepts
  {
    id: "electron-configuration",
    topicId: "atomic-structure",
    title: "Electron Configuration",
    difficulty: "intermediate",
    estimatedReadTime: 20,
    relatedConcepts: ["atomic-orbitals"],
    languages: ["en", "es", "fr", "de"],
    lastUpdated: new Date("2024-01-10"),
    arEnabled: true,
    visualizationType: "3d-model",
    content: {
      en: {
        title: "Electron Configuration",
        body: "Electron configuration describes the distribution of electrons in an atom's orbitals. Electrons fill orbitals in order of increasing energy, following three key principles:\n\n1. **Aufbau Principle**: Electrons occupy the lowest energy orbitals first\n2. **Pauli Exclusion Principle**: No two electrons can have the same set of quantum numbers\n3. **Hund's Rule**: Electrons occupy orbitals singly before pairing up\n\nThe electron configuration determines many of an atom's chemical properties, including its reactivity and bonding behavior.",
        summary: "How electrons are arranged in atomic orbitals",
        examples: ["Hydrogen: 1s¹", "Carbon: 1s² 2s² 2p²", "Oxygen: 1s² 2s² 2p⁴", "Neon: 1s² 2s² 2p⁶"],
        images: ["https://example.com/electron-config-diagram.jpg", "https://example.com/orbital-shapes.jpg"]
      }
    }
  }
];

// Content loading and caching utilities
const ContentUtils = {
  // Load content from cache or fetch from external source
  loadContent: async (contentId, contentType = 'concept') => {
    try {
      // Check cache first
      const cached = ContentUtils.getFromCache(contentId);
      if (cached) {
        return cached;
      }

      // Simulate external content loading
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      
      let content;
      switch (contentType) {
        case 'subject':
          content = mockSubjects.find(s => s.id === contentId);
          break;
        case 'topic':
          content = mockTopics.find(t => t.id === contentId);
          break;
        case 'concept':
          content = mockConcepts.find(c => c.id === contentId);
          break;
        default:
          throw new Error(`Unknown content type: ${contentType}`);
      }

      if (!content) {
        throw new Error(`Content not found: ${contentId}`);
      }

      // Cache the content
      ContentUtils.saveToCache(contentId, content);
      return content;
    } catch (error) {
      console.error(`Error loading content ${contentId}:`, error);
      throw error;
    }
  },

  // Track user activity
  trackUserActivity: (userId, activityType, contentId, metadata = {}) => {
    if (!userId) return;

    try {
      // Load current stats
      const statsKey = `user_stats_${userId}`;
      const currentStats = JSON.parse(localStorage.getItem(statsKey) || '{}');
      
      // Initialize stats if needed
      const stats = {
        topicsViewed: currentStats.topicsViewed || 0,
        conceptsRead: currentStats.conceptsRead || 0,
        totalReadTime: currentStats.totalReadTime || 0,
        lastActivity: new Date().toISOString(),
        viewedTopics: currentStats.viewedTopics || [],
        readConcepts: currentStats.readConcepts || []
      };

      // Update based on activity type
      switch (activityType) {
        case 'topic_viewed':
          if (!stats.viewedTopics.includes(contentId)) {
            stats.viewedTopics.push(contentId);
            stats.topicsViewed = stats.viewedTopics.length;
          }
          break;
        
        case 'concept_read':
          if (!stats.readConcepts.includes(contentId)) {
            stats.readConcepts.push(contentId);
            stats.conceptsRead = stats.readConcepts.length;
          }
          // Add estimated read time
          if (metadata.estimatedReadTime) {
            stats.totalReadTime += metadata.estimatedReadTime;
          }
          break;
      }

      // Save updated stats
      localStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Error tracking user activity:', error);
    }
  },

  // Cache management
  getFromCache: (key) => {
    try {
      const cached = localStorage.getItem(`content_${key}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is still valid (24 hours)
        const cacheTime = new Date(parsed.timestamp);
        const now = new Date();
        const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return parsed.data;
        } else {
          // Remove expired cache
          localStorage.removeItem(`content_${key}`);
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  },

  saveToCache: (key, data) => {
    try {
      const cacheEntry = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`content_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Error saving to cache:', error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        ContentUtils.clearOldCache();
        // Try again after clearing
        try {
          const cacheEntry = {
            data,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(`content_${key}`, JSON.stringify(cacheEntry));
        } catch (retryError) {
          console.error('Failed to save to cache after cleanup:', retryError);
        }
      }
    }
  },

  clearOldCache: () => {
    try {
      const keys = Object.keys(localStorage);
      const contentKeys = keys.filter(key => key.startsWith('content_'));
      
      // Sort by timestamp and remove oldest entries
      const cacheEntries = contentKeys.map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          return { key, timestamp: new Date(data.timestamp) };
        } catch {
          return { key, timestamp: new Date(0) }; // Invalid entries get oldest timestamp
        }
      });

      cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest 25% of entries
      const toRemove = Math.ceil(cacheEntries.length * 0.25);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(cacheEntries[i].key);
      }
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  },

  // Get topics by subject
  getTopicsBySubject: (subjectId) => {
    return mockTopics.filter(topic => topic.subjectId === subjectId);
  },

  // Get concepts by topic
  getConceptsByTopic: (topicId) => {
    return mockConcepts.filter(concept => concept.topicId === topicId);
  },

  // Search functionality
  searchContent: (query, scope = 'all') => {
    const searchTerm = query.toLowerCase();
    const results = [];

    // Determine if scope is a specific subject
    const isSubjectScope = ['physics', 'chemistry', 'biology', 'engineering'].includes(scope);

    // Search subjects
    if (scope === 'all' || scope === 'subjects') {
      mockSubjects.forEach(subject => {
        if (subject.name.toLowerCase().includes(searchTerm) || 
            subject.description.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'subject',
            id: subject.id,
            title: subject.name,
            description: subject.description,
            relevanceScore: ContentUtils.calculateRelevance(searchTerm, subject.name, subject.description)
          });
        }
      });
    }

    // Search topics
    if (scope === 'all' || scope === 'topics' || isSubjectScope) {
      mockTopics.forEach(topic => {
        // If subject scope, only include topics from that subject
        if (isSubjectScope && topic.subjectId !== scope) {
          return;
        }

        if (topic.name.toLowerCase().includes(searchTerm) || 
            topic.description.toLowerCase().includes(searchTerm)) {
          const subject = mockSubjects.find(s => s.id === topic.subjectId);
          results.push({
            type: 'topic',
            id: topic.id,
            title: topic.name,
            description: topic.description,
            subjectName: subject?.name,
            relevanceScore: ContentUtils.calculateRelevance(searchTerm, topic.name, topic.description)
          });
        }
      });
    }

    // Search concepts
    if (scope === 'all' || scope === 'concepts' || isSubjectScope) {
      mockConcepts.forEach(concept => {
        const topic = mockTopics.find(t => t.id === concept.topicId);
        
        // If subject scope, only include concepts from that subject
        if (isSubjectScope && topic?.subjectId !== scope) {
          return;
        }

        const content = concept.content.en; // Default to English for search
        if (concept.title.toLowerCase().includes(searchTerm) || 
            content.title.toLowerCase().includes(searchTerm) ||
            content.body.toLowerCase().includes(searchTerm)) {
          const subject = mockSubjects.find(s => s.id === topic?.subjectId);
          results.push({
            type: 'concept',
            id: concept.id,
            title: concept.title,
            description: content.summary,
            topicName: topic?.name,
            subjectName: subject?.name,
            relevanceScore: ContentUtils.calculateRelevance(searchTerm, concept.title, content.body)
          });
        }
      });
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  },

  calculateRelevance: (searchTerm, title, description) => {
    let score = 0;
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Exact title match gets highest score
    if (titleLower === searchTerm) score += 100;
    // Title contains search term
    else if (titleLower.includes(searchTerm)) score += 50;
    // Description contains search term
    if (descLower.includes(searchTerm)) score += 25;
    
    // Bonus for search term at beginning of title
    if (titleLower.startsWith(searchTerm)) score += 25;
    
    return score;
  }
};

export const ContentProvider = ({ children }) => {
  const [subjects] = useState(mockSubjects);
  const [topics] = useState(mockTopics);
  const [concepts] = useState(mockConcepts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize content on mount
  useEffect(() => {
    // Content is already loaded from mock data
    // In a real app, this would fetch from an API
  }, []);

  const value = {
    // Data
    subjects,
    topics,
    concepts,
    loading,
    error,
    
    // Utility functions
    loadContent: ContentUtils.loadContent,
    getTopicsBySubject: ContentUtils.getTopicsBySubject,
    getConceptsByTopic: ContentUtils.getConceptsByTopic,
    searchContent: ContentUtils.searchContent,
    
    // User activity tracking
    trackUserActivity: ContentUtils.trackUserActivity,
    
    // Cache management
    clearCache: ContentUtils.clearOldCache,
    
    // State setters (for future use)
    setLoading,
    setError
  };

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