import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector({ 
  variant = "dropdown", // "dropdown" | "compact" | "inline"
  showLabel = true,
  className = ""
}) {
  const {
    currentLanguage,
    supportedLanguages,
    changeLanguage,
    isTranslating,
    isGeminiAvailable
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLanguage);

  // Compact variant for navbar
  if (variant === "compact") {
    return (
      <div className={`language-selector compact ${className}`}>
        <button 
          className="language-toggle"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating}
          title={`Current language: ${currentLanguageInfo?.nativeName}`}
        >
          🌐 {currentLanguageInfo?.code.toUpperCase()}
          {isTranslating && <span className="translating-indicator">⟳</span>}
        </button>
        
        {isOpen && (
          <div className="language-dropdown">
            <div className="language-dropdown-header">
              <span>Select Language</span>
              {!isGeminiAvailable && (
                <small className="translation-notice">
                  Limited translation available
                </small>
              )}
            </div>
            
            <div className="language-options">
              {supportedLanguages.map(language => (
                <button
                  key={language.code}
                  className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="language-native">{language.nativeName}</span>
                  <span className="language-english">{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isOpen && (
          <div 
            className="language-overlay" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // Inline variant for forms
  if (variant === "inline") {
    return (
      <div className={`language-selector inline ${className}`}>
        {showLabel && <label htmlFor="language-select">Language:</label>}
        <select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={isTranslating}
        >
          {supportedLanguages.map(language => (
            <option key={language.code} value={language.code}>
              {language.nativeName} ({language.name})
            </option>
          ))}
        </select>
        {isTranslating && (
          <span className="translating-indicator" title="Translating content...">
            ⟳
          </span>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`language-selector dropdown ${className}`}>
      {showLabel && (
        <label className="language-label">
          Language Preference
          {!isGeminiAvailable && (
            <small className="translation-notice">
              (Limited translation available)
            </small>
          )}
        </label>
      )}
      
      <div className="language-dropdown-container">
        <button 
          className={`language-dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating}
        >
          <span className="selected-language">
            <span className="language-flag">🌐</span>
            <span className="language-name">{currentLanguageInfo?.nativeName}</span>
            <span className="language-english">({currentLanguageInfo?.name})</span>
          </span>
          <span className="dropdown-arrow">▼</span>
          {isTranslating && (
            <span className="translating-indicator" title="Translating content...">
              ⟳
            </span>
          )}
        </button>
        
        {isOpen && (
          <div className="language-dropdown-menu">
            <div className="language-search">
              <input 
                type="text" 
                placeholder="Search languages..."
                className="language-search-input"
              />
            </div>
            
            <div className="language-options-list">
              {supportedLanguages.map(language => (
                <button
                  key={language.code}
                  className={`language-option ${currentLanguage === language.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="language-info">
                    <span className="language-native">{language.nativeName}</span>
                    <span className="language-english">{language.name}</span>
                  </span>
                  {currentLanguage === language.code && (
                    <span className="selected-indicator">✓</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="language-dropdown-footer">
              <small>
                {isGeminiAvailable 
                  ? "Content will be translated automatically" 
                  : "Only pre-translated content available"
                }
              </small>
            </div>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="language-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}