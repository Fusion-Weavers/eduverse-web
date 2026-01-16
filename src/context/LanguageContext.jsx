import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const LanguageContext = createContext();

// Supported languages with their display names and codes
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" }
];

const DEFAULT_LANGUAGE = "en";
const FALLBACK_LANGUAGE = "en";

// Google Translate API configuration
const TRANSLATE_API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2";

// Static translations for UI elements
const UI_TRANSLATIONS = {
  en: {
    loading: "Loading",
    error: "Error",
    notFound: "Not Found",
    backButton: "Back",
    searchPlaceholder: "Search...",
    favorites: "Favorites",
    profile: "Profile",
    subjects: "Subjects",
    topics: "Topics",
    concepts: "Concepts",
    difficulty: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced"
    }
  },
  hi: {
    loading: "लोड हो रहा है",
    error: "त्रुटि",
    notFound: "नहीं मिला",
    backButton: "वापस",
    searchPlaceholder: "खोजें...",
    favorites: "पसंदीदा",
    profile: "प्रोफ़ाइल",
    subjects: "विषय",
    topics: "विषय-सूची",
    concepts: "अवधारणाएं",
    difficulty: {
      beginner: "शुरुआती",
      intermediate: "मध्यवर्ती",
      advanced: "उन्नत"
    }
  },
  bn: {
    loading: "লোড হচ্ছে",
    error: "ত্রুটি",
    notFound: "পাওয়া যায়নি",
    backButton: "ফিরে যান",
    searchPlaceholder: "অনুসন্ধান করুন...",
    favorites: "প্রিয়",
    profile: "প্রোফাইল",
    subjects: "বিষয়",
    topics: "বিষয়সূচি",
    concepts: "ধারণা",
    difficulty: {
      beginner: "শিক্ষানবিস",
      intermediate: "মধ্যবর্তী",
      advanced: "উন্নত"
    }
  }
};

// Translation utilities
const TranslationUtils = {
  // Get cached translation
  getCachedTranslation: (contentId, language, contentHash) => {
    try {
      const cacheKey = `translation_${contentId}_${language}_${contentHash}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is still valid (30 days for translations)
        const cacheTime = new Date(parsed.timestamp);
        const now = new Date();
        const daysDiff = (now - cacheTime) / (1000 * 60 * 60 * 24);

        if (daysDiff < 30) {
          console.log(`✅ Using cached translation for ${contentId} in ${language}`);
          return parsed.data;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.error('Error reading translation cache:', error);
    }
    return null;
  },

  // Save translation to cache
  saveTranslationToCache: (contentId, language, contentHash, translation) => {
    try {
      const cacheKey = `translation_${contentId}_${language}_${contentHash}`;
      const cacheEntry = {
        data: translation,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      console.log(`💾 Cached translation for ${contentId} in ${language}`);
    } catch (error) {
      console.error('Error saving translation to cache:', error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        TranslationUtils.clearOldTranslationCache();
      }
    }
  },

  // Clear old translation cache
  clearOldTranslationCache: () => {
    try {
      const keys = Object.keys(localStorage);
      const translationKeys = keys.filter(key => key.startsWith('translation_'));

      // Sort by timestamp and remove oldest entries
      const cacheEntries = translationKeys.map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          return { key, timestamp: new Date(data.timestamp) };
        } catch {
          return { key, timestamp: new Date(0) };
        }
      });

      cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest 30% of translation entries
      const toRemove = Math.ceil(cacheEntries.length * 0.3);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(cacheEntries[i].key);
      }
      console.log(`🧹 Cleared ${toRemove} old translation cache entries`);
    } catch (error) {
      console.error('Error clearing old translation cache:', error);
    }
  },

  // Generate content hash for caching
  generateContentHash: (content) => {
    // Simple hash function for content identification
    let hash = 0;
    const str = JSON.stringify(content);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },

  // Translate text using Google Translate API
  translateText: async (text, targetLanguage, sourceLanguage = 'en') => {
    if (!TRANSLATE_API_KEY) {
      throw new Error("Translation API key not configured");
    }

    try {
      const response = await fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation API error:', error);
      throw error;
    }
  },

  // Translate content object with smart batching
  translateContent: async (content, targetLanguage, sourceLanguage = 'en') => {
    if (!TRANSLATE_API_KEY) {
      throw new Error("Translation API key not configured");
    }

    try {
      // Extract all text fields to translate
      const textsToTranslate = [];
      const textMap = {};

      // Helper to extract text recursively
      const extractTexts = (obj, path = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'string' && value.trim()) {
            textsToTranslate.push(value);
            textMap[textsToTranslate.length - 1] = currentPath;
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'string' && item.trim()) {
                textsToTranslate.push(item);
                textMap[textsToTranslate.length - 1] = `${currentPath}[${index}]`;
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            extractTexts(value, currentPath);
          }
        }
      };

      extractTexts(content);

      if (textsToTranslate.length === 0) {
        return content;
      }

      console.log(`🌐 Translating ${textsToTranslate.length} text segments to ${targetLanguage}...`);

      // Batch translate all texts
      const response = await fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: textsToTranslate,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Translation API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const translations = data.data.translations;

      // Reconstruct the content object with translations
      const translatedContent = JSON.parse(JSON.stringify(content));

      translations.forEach((translation, index) => {
        const path = textMap[index];
        const translatedText = translation.translatedText;

        // Set the translated text at the correct path
        const pathParts = path.split('.');
        let current = translatedContent;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          const arrayMatch = part.match(/(.+)\[(\d+)\]/);
          
          if (arrayMatch) {
            const [, key, idx] = arrayMatch;
            current = current[key][parseInt(idx)];
          } else {
            current = current[part];
          }
        }

        const lastPart = pathParts[pathParts.length - 1];
        const arrayMatch = lastPart.match(/(.+)\[(\d+)\]/);
        
        if (arrayMatch) {
          const [, key, idx] = arrayMatch;
          current[key][parseInt(idx)] = translatedText;
        } else {
          current[lastPart] = translatedText;
        }
      });

      console.log(`✅ Translation completed for ${targetLanguage}`);
      return translatedContent;

    } catch (error) {
      console.error('Content translation error:', error);
      throw error;
    }
  },

  // Get UI translation
  getUITranslation: (key, language = DEFAULT_LANGUAGE) => {
    const translations = UI_TRANSLATIONS[language] || UI_TRANSLATIONS[DEFAULT_LANGUAGE];
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || key;
  },

  // Get language display name
  getLanguageDisplayName: (languageCode) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    return language ? language.nativeName : languageCode;
  },

  // Check if language is supported
  isLanguageSupported: (languageCode) => {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [fallbackLanguage, setFallbackLanguage] = useState(FALLBACK_LANGUAGE);
  const [translationError, setTranslationError] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationQueue, setTranslationQueue] = useState(new Map());

  // Load language preference from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferred_language');
      const savedFallback = localStorage.getItem('fallback_language');

      if (savedLanguage && TranslationUtils.isLanguageSupported(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }

      if (savedFallback && TranslationUtils.isLanguageSupported(savedFallback)) {
        setFallbackLanguage(savedFallback);
      }
    } catch (error) {
      console.error('Error loading language preferences:', error);
    }
  }, []);

  // Save language preference to localStorage
  const saveLanguagePreference = (language, fallback = null) => {
    try {
      localStorage.setItem('preferred_language', language);
      if (fallback) {
        localStorage.setItem('fallback_language', fallback);
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Change current language
  const changeLanguage = useCallback((languageCode) => {
    if (TranslationUtils.isLanguageSupported(languageCode)) {
      setCurrentLanguage(languageCode);
      saveLanguagePreference(languageCode, fallbackLanguage);
      setTranslationError(null);
    } else {
      console.error(`Unsupported language: ${languageCode}`);
    }
  }, [fallbackLanguage]);

  // Change fallback language
  const changeFallbackLanguage = useCallback((languageCode) => {
    if (TranslationUtils.isLanguageSupported(languageCode)) {
      setFallbackLanguage(languageCode);
      saveLanguagePreference(currentLanguage, languageCode);
    }
  }, [currentLanguage]);

  // Get localized content for a concept/topic
  const getLocalizedContent = useCallback(async (content, contentId = 'unknown') => {
    // If content already exists in current language, return it
    if (content[currentLanguage]) {
      return {
        ...content[currentLanguage],
        language: currentLanguage,
        isTranslated: false
      };
    }

    // If no source content available, return first available
    if (!content[fallbackLanguage] && !content.en) {
      const availableLanguages = Object.keys(content);
      if (availableLanguages.length > 0) {
        const firstAvailable = availableLanguages[0];
        return {
          ...content[firstAvailable],
          language: firstAvailable,
          isTranslated: false,
          isFallback: true,
          fallbackReason: 'language_unavailable'
        };
      }
      throw new Error('No content available in any language');
    }

    // Get source content (prefer fallback language, then English)
    const sourceContent = content[fallbackLanguage] || content.en;
    const sourceLanguage = content[fallbackLanguage] ? fallbackLanguage : 'en';
    
    // Generate content hash for caching
    const contentHash = TranslationUtils.generateContentHash(sourceContent);

    // Check cache first
    const cached = TranslationUtils.getCachedTranslation(contentId, currentLanguage, contentHash);
    if (cached) {
      return {
        ...cached,
        language: currentLanguage,
        isTranslated: true,
        fromCache: true
      };
    }

    // Check if translation API is available
    if (!TRANSLATE_API_KEY) {
      console.warn('Translation API key not configured, using fallback');
      return {
        ...sourceContent,
        language: sourceLanguage,
        isTranslated: false,
        isFallback: true,
        fallbackReason: 'translation_unavailable'
      };
    }

    // Check if already translating this content
    const queueKey = `${contentId}_${currentLanguage}`;
    if (translationQueue.has(queueKey)) {
      console.log(`⏳ Translation already in progress for ${contentId}`);
      return translationQueue.get(queueKey);
    }

    // Start translation
    setIsTranslating(true);
    setTranslationError(null);

    const translationPromise = (async () => {
      try {
        console.log(`🔄 Translating ${contentId} from ${sourceLanguage} to ${currentLanguage}...`);
        
        const translated = await TranslationUtils.translateContent(
          sourceContent,
          currentLanguage,
          sourceLanguage
        );

        // Cache the translation
        TranslationUtils.saveTranslationToCache(contentId, currentLanguage, contentHash, translated);

        const result = {
          ...translated,
          language: currentLanguage,
          isTranslated: true,
          fromCache: false
        };

        // Remove from queue
        setTranslationQueue(prev => {
          const newQueue = new Map(prev);
          newQueue.delete(queueKey);
          return newQueue;
        });

        return result;

      } catch (error) {
        console.error('Translation failed:', error);
        setTranslationError(error.message);

        // Remove from queue
        setTranslationQueue(prev => {
          const newQueue = new Map(prev);
          newQueue.delete(queueKey);
          return newQueue;
        });

        // Return fallback content
        return {
          ...sourceContent,
          language: sourceLanguage,
          isTranslated: false,
          isFallback: true,
          fallbackReason: 'translation_failed',
          error: error.message
        };
      } finally {
        setIsTranslating(false);
      }
    })();

    // Add to queue
    setTranslationQueue(prev => new Map(prev.set(queueKey, translationPromise)));

    return translationPromise;
  }, [currentLanguage, fallbackLanguage, translationQueue]);

  // Clear all translation cache
  const clearTranslationCache = useCallback(() => {
    TranslationUtils.clearOldTranslationCache();
  }, []);

  const value = useMemo(() => ({
    // Current state
    currentLanguage,
    fallbackLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isTranslating,
    translationError,

    // Actions
    changeLanguage,
    changeFallbackLanguage,
    getLocalizedContent,
    clearTranslationCache,

    // Utilities
    getLanguageDisplayName: TranslationUtils.getLanguageDisplayName,
    isLanguageSupported: TranslationUtils.isLanguageSupported,
    getUITranslation: TranslationUtils.getUITranslation,

    // API availability
    isTranslateApiAvailable: !!TRANSLATE_API_KEY
  }), [
    currentLanguage,
    fallbackLanguage,
    isTranslating,
    translationError,
    changeLanguage,
    changeFallbackLanguage,
    getLocalizedContent,
    clearTranslationCache
  ]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
