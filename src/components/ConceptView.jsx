import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoAttachOutline,
  IoBookOutline,
  IoDocumentTextOutline,
  IoGlassesOutline,
  IoGlobeOutline,
  IoInformationCircleOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoSparklesOutline,
  IoStar,
  IoWarningOutline
} from "react-icons/io5";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../context/NavigationContext";
import FavoriteButton from "./FavoriteButton";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";
import ErrorState from "./ErrorState";
import WebXRViewer from "./WebXRViewer";

export default function ConceptView({ topicId, conceptId, onBack }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getConceptsByTopic, topics, subjects, trackUserActivity, loading, error } = useContent();
  const {
    currentLanguage,
    getLocalizedContent,
    isTranslating,
    getLanguageDisplayName
  } = useLanguage();
  const { isConceptFavorited } = useFavorites();
  const { navigateWithState } = useNavigation();

  const [localizedContentCache, setLocalizedContentCache] = useState(new Map());
  const [localizedContent, setLocalizedContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(null);

  // Derive a clean embed URL (handles full iframe snippets saved from Sketchfab)
  const getEmbedUrl = (raw) => {
    if (!raw) return null;
    if (raw.includes('<iframe')) {
      const match = raw.match(/src="([^"]+)"/i);
      return match ? match[1] : null;
    }
    return raw;
  };

  const concepts = getConceptsByTopic(topicId);
  const topic = topics.find(t => t.id === topicId);
  const subject = subjects.find(s => s.id === topic?.subjectId);

  // Helper function to get content in selected language with fallback
  const getConceptLocalizedContent = async (concept) => {
    if (!concept || !concept.content) return null;

    const cacheKey = `${concept.id}_${currentLanguage}`;

    // Check cache first
    if (localizedContentCache.has(cacheKey)) {
      return localizedContentCache.get(cacheKey);
    }

    try {
      // Use the LanguageContext's getLocalizedContent method
      const context = {
        subject: subject?.name,
        topic: topic?.name,
        difficulty: concept.difficulty
      };

      const localizedContent = await getLocalizedContent(
        concept.content,
        concept.id,
        context
      );

      const result = {
        content: localizedContent,
        language: localizedContent.language,
        isFallback: localizedContent.isFallback || false,
        fallbackReason: localizedContent.fallbackReason,
        isTranslated: localizedContent.isTranslated || false
      };

      // Cache the result
      setLocalizedContentCache(prev => new Map(prev.set(cacheKey, result)));

      return result;
    } catch (error) {
      console.error('Error getting localized content:', error);

      // Fallback to English if available
      if (concept.content.en) {
        return {
          content: concept.content.en,
          language: "en",
          isFallback: currentLanguage !== "en",
          fallbackReason: 'error',
          isTranslated: false
        };
      }

      return null;
    }
  };

  // Helper function to render rich content with proper formatting
  const renderRichContent = (text) => {
    if (!text) return null;

    // Split text into paragraphs and render with proper spacing
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Check for special formatting
      const trimmedParagraph = paragraph.trim();

      // Handle code blocks (```code```)
      if (trimmedParagraph.startsWith('```') && trimmedParagraph.endsWith('```')) {
        const code = trimmedParagraph.slice(3, -3).trim();
        return (
          <div key={index} className="code-block">
            <pre><code>{code}</code></pre>
          </div>
        );
      }

      // Handle inline code (`code`)
      let formattedText = trimmedParagraph.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

      // Handle bold text (**text**)
      formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // Handle italic text (*text*)
      formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Handle mathematical expressions (LaTeX-style)
      formattedText = formattedText.replace(/\$([^$]+)\$/g, '<span class="math-expression">$1</span>');

      // Handle bullet points
      if (trimmedParagraph.startsWith('• ') || trimmedParagraph.startsWith('- ')) {
        return (
          <ul key={index} className="concept-list">
            <li dangerouslySetInnerHTML={{ __html: formattedText.replace(/^[•-]\s*/, '') }} />
          </ul>
        );
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(trimmedParagraph)) {
        return (
          <ol key={index} className="concept-numbered-list">
            <li dangerouslySetInnerHTML={{ __html: formattedText.replace(/^\d+\.\s*/, '') }} />
          </ol>
        );
      }

      // Handle headers (## Header)
      if (trimmedParagraph.startsWith('## ')) {
        return (
          <h4 key={index} className="concept-subheading">
            {trimmedParagraph.replace('## ', '')}
          </h4>
        );
      }

      // Handle blockquotes (> text)
      if (trimmedParagraph.startsWith('> ')) {
        return (
          <blockquote key={index} className="concept-quote">
            <div dangerouslySetInnerHTML={{ __html: formattedText.replace(/^>\s*/, '') }} />
          </blockquote>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="concept-paragraph" dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    });
  };

  // Use useMemo to derive selected concept from props and concepts
  const selectedConcept = useMemo(() => {
    if (conceptId) {
      return concepts.find(c => c.id === conceptId) || null;
    } else if (concepts.length > 0) {
      return concepts[0];
    }
    return null;
  }, [conceptId, concepts]);

  // Load localized content when concept or language changes
  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      if (!selectedConcept) {
        if (isMounted) {
          setLocalizedContent(null);
          setContentLoading(false);
          setContentError(null);
        }
        return;
      }

      if (isMounted) {
        setContentLoading(true);
        setContentError(null);
      }

      try {
        const content = await getConceptLocalizedContent(selectedConcept);
        if (isMounted) {
          setLocalizedContent(content);
          setContentLoading(false);
          setContentError(null);

          // Track that user has read this concept
          if (user?.uid) {
            trackUserActivity(user.uid, 'concept_read', selectedConcept.id, {
              estimatedReadTime: selectedConcept.estimatedReadTime || 0
            });
          }
        }
      } catch (error) {
        console.error('Error loading localized content:', error);
        if (isMounted) {
          setLocalizedContent(null);
          setContentLoading(false);
          setContentError(error.message || 'Failed to load content');
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [selectedConcept, currentLanguage, getLocalizedContent, subject?.name, topic?.name, user?.uid, trackUserActivity]);

  // Clear cache when language changes
  useEffect(() => {
    const clearCache = () => {
      setLocalizedContentCache(new Map());
    };

    // Use setTimeout to avoid synchronous setState in effect
    const timeoutId = setTimeout(clearCache, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentLanguage]);

  const handleConceptSelect = (concept) => {
    // Navigate to the selected concept using enhanced navigation
    navigateWithState(`/subjects/${topic.subjectId}/${topicId}/${concept.id}`, {
      breadcrumb: {
        title: topic.name,
        params: { subjectId: topic.subjectId, topicId }
      }
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(`/subjects/${topic.subjectId}`);
    }
  };

  // Loading state for entire component
  if (loading) {
    return <LoadingSpinner message="Loading concepts..." size="medium" />;
  }

  // Error state for entire component
  if (error) {
    return (
      <ErrorState
        title="Error Loading Content"
        message={`Failed to load concepts: ${error.message}`}
        icon={<IoDocumentTextOutline aria-hidden="true" />}
        variant="network"
        onRetry={() => window.location.reload()}
        showRetry={true}
      />
    );
  }

  if (!topic || !subject) {
    return (
      <ErrorState
        title="Content Not Found"
        message="The requested topic or subject could not be found."
        icon={<IoSearchOutline aria-hidden="true" />}
        variant="notFound"
        onRetry={handleBack}
        showRetry={true}
      />
    );
  }

  if (concepts.length === 0) {
    return (
      <ErrorBoundary>
        <ErrorState
          title="No Concepts Available"
          message="This topic doesn't have any concepts yet. Check back later for new content."
          icon={<IoBookOutline aria-hidden="true" />}
          variant="default"
          onRetry={handleBack}
          showRetry={true}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="concept-view">
        {/* Breadcrumb navigation */}
        <div className="breadcrumb">
          <button onClick={() => navigateWithState('/subjects')} className="breadcrumb-link">
            Subjects
          </button>
          <span className="breadcrumb-separator">›</span>
          <button onClick={handleBack} className="breadcrumb-link">
            {subject.name}
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{topic.name}</span>
        </div>

        <div className="concept-layout">
          {/* Concept list sidebar */}
          <div className="concept-sidebar">
            <div className="sidebar-header">
              <h4>Concepts in {topic.name}</h4>
              <FavoriteButton
                itemId={topicId}
                itemType="topic"
                size="small"
                showLabel={true}
              />
            </div>
            <div className="concept-list">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className={`concept-item ${selectedConcept?.id === concept.id ? 'active' : ''} ${isConceptFavorited(concept.id) ? 'favorited' : ''}`}
                  onClick={() => handleConceptSelect(concept)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleConceptSelect(concept);
                    }
                  }}
                >
                  <div className="concept-item-header">
                    <div className="concept-item-title">{concept.title}</div>
                    <FavoriteButton
                      itemId={concept.id}
                      itemType="concept"
                      size="small"
                    />
                  </div>
                  <div className="concept-item-meta">
                    <span className={`difficulty ${concept.difficulty}`}>
                      {concept.difficulty}
                    </span>
                    <span className="read-time">
                      {concept.estimatedReadTime} min
                    </span>
                    {isConceptFavorited(concept.id) && (
                      <span className="favorite-indicator" title="Favorited">
                        <IoStar aria-hidden="true" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main concept content */}
          <div className="concept-content">
            {contentLoading ? (
              <LoadingSpinner message={isTranslating ? `Translating to ${getLanguageDisplayName(currentLanguage)}...` : "Loading content..."} />
            ) : contentError ? (
              <ErrorState
                title="Error Loading Content"
                message={contentError}
                icon={<IoWarningOutline aria-hidden="true" />}
                variant="network"
                size="small"
                onRetry={() => {
                  // Force refresh of content
                  setLocalizedContentCache(new Map());
                  setContentError(null);
                  if (selectedConcept) {
                    setContentLoading(true);
                    getConceptLocalizedContent(selectedConcept)
                      .then(content => {
                        setLocalizedContent(content);
                        setContentLoading(false);
                      })
                      .catch(error => {
                        console.error('Error loading localized content:', error);
                        setLocalizedContent(null);
                        setContentLoading(false);
                        setContentError(error.message || 'Failed to load content');
                      });
                  }
                }}
                showRetry={true}
              />
            ) : selectedConcept && localizedContent ? (
              <>
                <div className="concept-header">
                  <div className="concept-title-section">
                    <div className="title-with-favorite">
                      <h2>{localizedContent.content.title || selectedConcept.title}</h2>
                      <FavoriteButton
                        itemId={selectedConcept.id}
                        itemType="concept"
                        size="large"
                        showLabel={true}
                      />
                    </div>

                    {/* Language and translation status notices */}
                    {localizedContent.isFallback && (
                      <div className={`language-fallback-notice ${localizedContent.fallbackReason || ''}`}>
                        <span className="fallback-icon" aria-hidden="true">
                          {localizedContent.fallbackReason === 'translating' ? (
                            <IoRefreshOutline />
                          ) : localizedContent.fallbackReason === 'translation_failed' ? (
                            <IoWarningOutline />
                          ) : (
                            <IoInformationCircleOutline />
                          )}
                        </span>
                        <div className="fallback-message">
                          {localizedContent.fallbackReason === 'translating' && (
                            <>
                              <strong>Translating...</strong><br />
                              Content is being translated to {getLanguageDisplayName(currentLanguage)}
                            </>
                          )}
                          {localizedContent.fallbackReason === 'translation_failed' && (
                            <>
                              <strong>Translation Failed</strong><br />
                              Showing content in {getLanguageDisplayName(localizedContent.language)}. Translation error occurred.
                            </>
                          )}
                          {localizedContent.fallbackReason === 'translation_unavailable' && (
                            <>
                              <strong>Translation Unavailable</strong><br />
                              Showing content in {getLanguageDisplayName(localizedContent.language)}. AI translation not available.
                            </>
                          )}
                          {localizedContent.fallbackReason === 'language_unavailable' && (
                            <>
                              <strong>Language Not Available</strong><br />
                              Showing content in {getLanguageDisplayName(localizedContent.language)} (available language).
                            </>
                          )}
                          {!localizedContent.fallbackReason && (
                            <>
                              Content shown in {getLanguageDisplayName(localizedContent.language)}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {localizedContent.isTranslated && !localizedContent.isFallback && (
                      <div className="language-fallback-notice translating">
                        <span className="fallback-icon" aria-hidden="true">
                          <IoSparklesOutline />
                        </span>
                        <div className="fallback-message">
                          <strong>AI Translated</strong><br />
                          This content was automatically translated to {getLanguageDisplayName(currentLanguage)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="concept-meta">
                    <span className={`difficulty ${selectedConcept.difficulty}`}>
                      {selectedConcept.difficulty}
                    </span>
                    <span className="read-time">
                      {selectedConcept.estimatedReadTime} min read
                    </span>
                    {selectedConcept.updatedAt && (
                      <span className="last-updated">
                        Updated {new Date(selectedConcept.updatedAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    )}
                    <span className="current-language">
                      Language: {getLanguageDisplayName(currentLanguage)}
                    </span>
                  </div>
                </div>

                <div className="concept-body">
                  {/* Summary section */}
                  {localizedContent.content.summary && (
                    <div className="concept-summary">
                      <strong>Summary:</strong> {localizedContent.content.summary}
                    </div>
                  )}

                  {/* Main content with rich formatting */}
                  <div className="concept-text">
                    {renderRichContent(localizedContent.content.body)}
                  </div>

                  {/* Images section */}
                  {localizedContent.content.images && localizedContent.content.images.length > 0 && (
                    <div className="concept-images">
                      <h4>Visual References:</h4>
                      <div className="images-grid">
                        {localizedContent.content.images.map((imageUrl, index) => (
                          <div key={index} className="concept-image">
                            <img
                              src={imageUrl}
                              alt={`Illustration ${index + 1} for ${selectedConcept.title}`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples section with enhanced formatting */}
                  {localizedContent.content.examples && localizedContent.content.examples.length > 0 && (
                    <div className="concept-examples">
                      <h4>Examples:</h4>
                      <div className="examples-list">
                        {localizedContent.content.examples.map((example, index) => (
                          <div key={index} className="example-item">
                            <span className="example-number">{index + 1}.</span>
                            <span className="example-text">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External assets section */}
                  {localizedContent.content.externalAssets && localizedContent.content.externalAssets.length > 0 && (
                    <div className="external-assets">
                      <h4>Additional Resources:</h4>
                      <div className="assets-list">
                        {localizedContent.content.externalAssets.map((assetUrl, index) => (
                          <a
                            key={index}
                            href={assetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="asset-link"
                          >
                            <IoAttachOutline aria-hidden="true" />
                            <span>Resource {index + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AR/3D Visualization */}
                  {selectedConcept.arEnabled && (selectedConcept.modelUrl || selectedConcept.embedUrl) && (
                    <WebXRViewer
                      modelUrl={selectedConcept.modelUrl}
                      embedUrl={getEmbedUrl(selectedConcept.embedUrl)}
                      title={`3D Model: ${selectedConcept.title}`}
                    />
                  )}

                  {/* AR/3D Visualization indicator for concepts without modelUrl/embedUrl */}
                  {selectedConcept.arEnabled && !selectedConcept.modelUrl && !selectedConcept.embedUrl && (
                    <div className="ar-indicator">
                      <div className="ar-badge">
                        <span className="ar-icon" aria-hidden="true"><IoGlassesOutline /></span>
                        <div className="ar-text">
                          <strong>3D Model Coming Soon</strong>
                          <p>This concept will support 3D visualization</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced related concepts navigation */}
                {selectedConcept.relatedConcepts && selectedConcept.relatedConcepts.length > 0 && (
                  <div className="related-concepts">
                    <h4>Related Concepts:</h4>
                    <div className="related-list">
                      {selectedConcept.relatedConcepts.map((relatedId) => {
                        const relatedConcept = concepts.find(c => c.id === relatedId);
                        if (!relatedConcept) return null;

                        return (
                          <button
                            key={relatedId}
                            className="related-concept-btn"
                            onClick={() => handleConceptSelect(relatedConcept)}
                          >
                            <div className="related-concept-info">
                              <span className="related-title">{relatedConcept.title}</span>
                              <span className={`related-difficulty ${relatedConcept.difficulty}`}>
                                {relatedConcept.difficulty}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : selectedConcept ? (
              <ErrorState
                title="Content Not Available"
                message="Content for this concept is not available in the selected language."
                icon={<IoGlobeOutline aria-hidden="true" />}
                variant="default"
                size="small"
                onRetry={() => {
                  // Force refresh of content
                  setLocalizedContentCache(new Map());
                  if (selectedConcept) {
                    setContentLoading(true);
                    getConceptLocalizedContent(selectedConcept)
                      .then(content => {
                        setLocalizedContent(content);
                        setContentLoading(false);
                      })
                      .catch(error => {
                        console.error('Error loading localized content:', error);
                        setLocalizedContent(null);
                        setContentLoading(false);
                      });
                  }
                }}
                showRetry={true}
              />
            ) : (
              <ErrorState
                title="Select a Concept"
                message="Choose a concept from the list to view its content."
                icon={<IoArrowBackOutline aria-hidden="true" />}
                variant="default"
                size="small"
                showRetry={false}
              />
            )}
          </div>
        </div>

        <style jsx>{`
        .concept-view {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          text-decoration: underline;
        }

        .breadcrumb-link:hover {
          color: #0056b3;
        }

        .breadcrumb-separator {
          color: #6c757d;
        }

        .breadcrumb-current {
          color: #495057;
          font-weight: 500;
        }

        .concept-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          min-height: 600px;
        }

        .concept-sidebar {
          background: #f8f9fa;
          border-radius: 0.75rem;
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: 1rem;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .sidebar-header h4 {
          margin: 0;
          color: #495057;
          font-size: 1rem;
          flex: 1;
        }

        .concept-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .concept-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .concept-item:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
        }

        .concept-item.active {
          border-color: #007bff;
          background-color: #e3f2fd;
        }

        .concept-item.favorited {
          border-color: #ffc107;
          background: linear-gradient(135deg, #fff 0%, #fffbf0 100%);
        }

        .concept-item.favorited.active {
          background: linear-gradient(135deg, #e3f2fd 0%, #fffbf0 100%);
        }

        .concept-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 0.5rem;
        }

        .concept-item-title {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
          flex: 1;
        }

        .concept-item-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .concept-content {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .concept-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .title-with-favorite {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .title-with-favorite h2 {
          margin: 0;
          color: #495057;
          flex: 1;
        }

        .concept-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .difficulty {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-block;
        }

        .difficulty.beginner {
          background-color: #d4edda;
          color: #155724;
        }

        .difficulty.intermediate {
          background-color: #fff3cd;
          color: #856404;
        }

        .difficulty.advanced {
          background-color: #f8d7da;
          color: #721c24;
        }

        .read-time,
        .last-updated,
        .current-language {
          color: #6c757d;
        }

        .favorite-indicator {
          color: #ffc107;
          font-size: 0.875rem;
          animation: twinkle 2s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .language-fallback-notice {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .language-fallback-notice.translating {
          background: #f3e5f5;
          border-color: #ce93d8;
        }

        .fallback-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .fallback-message {
          font-size: 0.875rem;
          color: #1976d2;
        }

        .language-fallback-notice.translating .fallback-message {
          color: #7b1fa2;
        }

        .concept-body {
          line-height: 1.6;
        }

        .concept-summary {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .concept-paragraph {
          margin-bottom: 1rem;
          color: #495057;
          line-height: 1.7;
        }

        .concept-subheading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #495057;
          margin: 2rem 0 1rem 0;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 0.5rem;
        }

        .code-block {
          margin: 1.5rem 0;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          overflow-x: auto;
        }

        .code-block pre {
          margin: 0;
          padding: 1rem;
          font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #495057;
        }

        .code-block code {
          background: none;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }

        .inline-code {
          background: #f8f9fa;
          color: #e83e8c;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
          font-size: 0.875em;
          border: 1px solid #e9ecef;
        }

        .math-expression {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Times New Roman', serif;
          font-style: italic;
          border: 1px solid #bbdefb;
        }

        .concept-list,
        .concept-numbered-list {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .concept-list li,
        .concept-numbered-list li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #495057;
        }

        .concept-quote {
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
          color: #6c757d;
        }

        .concept-quote div {
          margin: 0;
        }

        .concept-examples {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 0.75rem;
        }

        .concept-examples h4 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .example-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .example-number {
          background: #007bff;
          color: white;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .example-text {
          color: #495057;
          line-height: 1.5;
        }

        .concept-images {
          margin: 2rem 0;
        }

        .concept-images h4 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .concept-image img {
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .external-assets {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #e8f5e8;
          border-radius: 0.75rem;
        }

        .external-assets h4 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .assets-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .asset-link {
          color: #28a745;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
        }

        .asset-link:hover {
          background-color: rgba(40, 167, 69, 0.1);
          text-decoration: underline;
        }

        .ar-indicator {
          margin: 2rem 0;
          padding: 1.5rem;
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          border-radius: 0.75rem;
          border: 1px solid #bbdefb;
        }

        .ar-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ar-icon {
          font-size: 2rem;
        }

        .ar-text strong {
          color: #1976d2;
          display: block;
          margin-bottom: 0.25rem;
        }

        .ar-text p {
          margin: 0;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .related-concepts {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .related-concepts h4 {
          margin-bottom: 1rem;
          color: #495057;
        }

        .related-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .related-concept-btn {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .related-concept-btn:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
        }

        .related-concept-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .related-title {
          font-weight: 500;
          color: #495057;
          flex: 1;
        }

        .related-difficulty {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .related-difficulty.beginner {
          background-color: #d4edda;
          color: #155724;
        }

        .related-difficulty.intermediate {
          background-color: #fff3cd;
          color: #856404;
        }

        .related-difficulty.advanced {
          background-color: #f8d7da;
          color: #721c24;
        }

        .error-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #dc3545;
        }

        .error-state h3 {
          margin-bottom: 1rem;
          color: #dc3545;
        }

        .error-state p {
          color: #6c757d;
          margin-bottom: 2rem;
        }

        .retry-btn,
        .back-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          margin-top: 1rem;
          transition: background-color 0.2s ease;
        }

        .retry-btn:hover,
        .back-btn:hover {
          background: #0056b3;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .concept-view {
            padding: 0.5rem;
          }

          .concept-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .concept-sidebar {
            position: static;
            order: 2;
          }

          .concept-content {
            padding: 1rem;
            order: 1;
          }

          .title-with-favorite {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .concept-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .breadcrumb {
            flex-wrap: wrap;
          }

          .sidebar-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .concept-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .related-list {
            grid-template-columns: 1fr;
          }

          .images-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .concept-item,
          .related-concept-btn,
          .asset-link,
          .retry-btn,
          .back-btn,
          .favorite-indicator {
            transition: none;
            animation: none;
          }
        }
      `}</style>
      </div>
    </ErrorBoundary>
  );
}