import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const LanguageContext = createContext();

// Supported languages with their display names and codes
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" }
];

const DEFAULT_LANGUAGE = "en";
const FALLBACK_LANGUAGE = "en";

// Initialize Gemini AI (API key should be set in environment variables)
let genAI = null;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.warn("Gemini API not available:", error);
}

// Translation utilities
const TranslationUtils = {
  // Get cached translation
  getCachedTranslation: (contentId, language, contentHash) => {
    try {
      const cacheKey = `translation_${contentId}_${language}_${contentHash}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is still valid (7 days for translations)
        const cacheTime = new Date(parsed.timestamp);
        const now = new Date();
        const daysDiff = (now - cacheTime) / (1000 * 60 * 60 * 24);

        if (daysDiff < 7) {
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

  // Translate content using Gemini API
  translateWithGemini: async (content, targetLanguage, context = {}) => {
    if (!genAI) {
      throw new Error("Gemini API not available");
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const languageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLanguage);
      const targetLanguageName = languageInfo?.name || targetLanguage;

      const prompt = `You are an expert educational content translator specializing in STEM subjects. 
      
Translate the following educational content to ${targetLanguageName}. 

IMPORTANT REQUIREMENTS:
1. Maintain technical accuracy and scientific terminology precision
2. Adapt explanations for educational clarity while preserving meaning
3. Keep the same JSON structure in your response
4. Translate all text fields but keep field names in English
5. Ensure age-appropriate language for ${context.difficulty || 'intermediate'} level students
6. Preserve any mathematical formulas, chemical equations, or scientific notation exactly

Context: Subject: ${context.subject || 'General STEM'}, Difficulty: ${context.difficulty || 'intermediate'}

Content to translate:
${JSON.stringify(content, null, 2)}

Respond with ONLY the translated JSON object, no additional text or explanation.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let translatedText = response.text();

      // Parse the JSON response - handle markdown code blocks
      try {
        // Remove markdown code block wrappers if present
        translatedText = translatedText.trim();
        if (translatedText.startsWith('```json')) {
          translatedText = translatedText.slice(7);
        } else if (translatedText.startsWith('```')) {
          translatedText = translatedText.slice(3);
        }
        if (translatedText.endsWith('```')) {
          translatedText = translatedText.slice(0, -3);
        }
        translatedText = translatedText.trim();

        const translatedContent = JSON.parse(translatedText);
        return {
          ...translatedContent,
          translatedBy: "gemini-api",
          translationQuality: 0.9 // High confidence for Gemini translations
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini translation response:', parseError);
        console.error('Raw response:', translatedText);
        throw new Error('Invalid translation response format');
      }
    } catch (error) {
      console.error('Gemini translation error:', error);
      throw error;
    }
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

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
  const getLocalizedContent = useCallback(async (content, contentId, context = {}) => {
    // If content already exists in current language, return it
    if (content[currentLanguage]) {
      return {
        ...content[currentLanguage],
        language: currentLanguage,
        isTranslated: false
      };
    }

    // If content exists in fallback language, check if we should translate
    if (content[fallbackLanguage] && currentLanguage !== fallbackLanguage) {
      const sourceContent = content[fallbackLanguage];
      const contentHash = TranslationUtils.generateContentHash(sourceContent);

      // Check cache first
      const cached = TranslationUtils.getCachedTranslation(contentId, currentLanguage, contentHash);
      if (cached) {
        return {
          ...cached,
          language: currentLanguage,
          isTranslated: true
        };
      }

      // Attempt translation if Gemini API is available
      if (genAI && !isTranslating) {
        try {
          setIsTranslating(true);
          setTranslationError(null);

          const translated = await TranslationUtils.translateWithGemini(
            sourceContent,
            currentLanguage,
            context
          );

          // Cache the translation
          TranslationUtils.saveTranslationToCache(contentId, currentLanguage, contentHash, translated);

          return {
            ...translated,
            language: currentLanguage,
            isTranslated: true
          };
        } catch (error) {
          console.error('Translation failed:', error);
          setTranslationError(error.message);
          // Fall through to return fallback content
        } finally {
          setIsTranslating(false);
        }
      }

      // Return fallback content with notification
      return {
        ...sourceContent,
        language: fallbackLanguage,
        isTranslated: false,
        isFallback: true,
        fallbackReason: isTranslating ? 'translating' : (genAI ? 'translation_failed' : 'translation_unavailable')
      };
    }

    // If no content available in current or fallback language, return first available
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

    // No content available at all
    throw new Error('No content available in any language');
  }, [currentLanguage, fallbackLanguage, isTranslating]);

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

    // API availability
    isGeminiAvailable: !!genAI
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