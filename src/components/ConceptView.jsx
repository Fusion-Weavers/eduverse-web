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
  const { currentLanguage, getLocalizedContent, isTranslating, getLanguageDisplayName } = useLanguage();
  const { isConceptFavorited } = useFavorites();
  const { navigateWithState } = useNavigation();

  const [localizedContentCache, setLocalizedContentCache] = useState(new Map());
  const [localizedContent, setLocalizedContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(null);

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

  const getConceptLocalizedContent = async (concept) => {
    if (!concept || !concept.content) return null;
    const cacheKey = `${concept.id}_${currentLanguage}`;
    if (localizedContentCache.has(cacheKey)) {
      return localizedContentCache.get(cacheKey);
    }

    try {
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

      setLocalizedContentCache(prev => new Map(prev.set(cacheKey, result)));
      return result;

    } catch (error) {
      console.error('Error getting localized content:', error);

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

  const renderRichContent = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
        const code = trimmed.slice(3, -3).trim();
        return (
          <pre key={index} className="my-4 bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-800">
            {code}
          </pre>
        );
      }

      let formatted = trimmed
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\$([^$]+)\$/g, '<span class="math-expression">$1</span>');

      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        return (
          <ul key={index} className="list-disc pl-6 my-3 space-y-1 text-gray-700">
            <li dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s*/, '') }} />
          </ul>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <ol key={index} className="list-decimal pl-6 my-3 space-y-1 text-gray-700">
            <li dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\.\s*/, '') }} />
          </ol>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h4 key={index} className="text-xl font-semibold text-gray-800 mt-8 mb-3 border-b border-gray-200 pb-2">
            {trimmed.replace('## ', '')}
          </h4>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className="my-4 p-4 bg-gray-100 border-l-4 border-blue-500 italic text-gray-600 rounded">
            <div dangerouslySetInnerHTML={{ __html: formatted.replace(/^>\s*/, '') }} />
          </blockquote>
        );
      }

      return (
        <p key={index} className="mb-4 text-gray-800 leading-7" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  const selectedConcept = useMemo(() => {
    if (conceptId) return concepts.find(c => c.id === conceptId) || null;
    return concepts.length > 0 ? concepts[0] : null;
  }, [conceptId, concepts]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
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

          if (user?.uid) {
            trackUserActivity(user.uid, 'concept_read', selectedConcept.id, {
              estimatedReadTime: selectedConcept.estimatedReadTime || 0
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          setLocalizedContent(null);
          setContentLoading(false);
          setContentError(error.message || 'Failed to load content');
        }
      }
    };

    load();
    return () => { isMounted = false; };
  }, [selectedConcept, currentLanguage, getLocalizedContent]);

  useEffect(() => {
    const timeout = setTimeout(() => setLocalizedContentCache(new Map()), 0);
    return () => clearTimeout(timeout);
  }, [currentLanguage]);

  const handleConceptSelect = (concept) => {
    navigateWithState(`/subjects/${topic.subjectId}/${topicId}/${concept.id}`, {
      breadcrumb: {
        title: topic.name,
        params: { subjectId: topic.subjectId, topicId }
      }
    });
  };

  const handleBack = () => {
    onBack ? onBack() : navigate(`/subjects/${topic.subjectId}`);
  };

  if (loading) return <LoadingSpinner message="Loading concepts..." size="medium" />;

  if (error) {
    return (
      <ErrorState
        title="Error Loading Content"
        message={`Failed to load concepts: ${error.message}`}
        icon={<IoDocumentTextOutline />}
        variant="network"
        onRetry={() => window.location.reload()}
        showRetry
      />
    );
  }

  if (!topic || !subject) {
    return (
      <ErrorState
        title="Content Not Found"
        message="The requested topic or subject could not be found."
        icon={<IoSearchOutline />}
        variant="notFound"
        onRetry={handleBack}
        showRetry
      />
    );
  }

  if (concepts.length === 0) {
    return (
      <ErrorBoundary>
        <ErrorState
          title="No Concepts Available"
          message="This topic doesn't have any concepts yet."
          icon={<IoBookOutline />}
          variant="default"
          onRetry={handleBack}
          showRetry
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4 max-w-6xl mx-auto">
        
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-3 mb-8 text-black bg-white border-2 border-black uppercase text-sm font-semibold tracking-wide hover:bg-black hover:text-white transition-all"
        >
          <IoArrowBackOutline />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-[300px_1fr] gap-8 min-h-600px max-md:grid-cols-1">

          <div className="bg-gray-100 rounded-xl p-6 sticky top-4 max-md:static h-fit">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-medium text-base">Concepts in {topic.name}</h4>
              <FavoriteButton itemId={topicId} itemType="topic" size="small" showLabel />
            </div>

            <div className="flex flex-col gap-2">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  onClick={() => handleConceptSelect(concept)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleConceptSelect(concept); }}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition shadow-sm
                    ${selectedConcept?.id === concept.id ? "border-blue-500 bg-blue-50" : "bg-white border-gray-300"}
                    ${isConceptFavorited(concept.id) ? "border-yellow-400 bg-yellow-50" : ""}
                  `}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-700 flex-1">{concept.title}</div>
                    <FavoriteButton itemId={concept.id} itemType="concept" size="small" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span
                      className={`
                        px-2 py-1 rounded-full font-semibold uppercase
                        ${concept.difficulty === "beginner" && "bg-green-100 text-green-800"}
                        ${concept.difficulty === "intermediate" && "bg-yellow-100 text-yellow-800"}
                        ${concept.difficulty === "advanced" && "bg-red-100 text-red-800"}
                      `}
                    >
                      {concept.difficulty}
                    </span>
                    <span>{concept.estimatedReadTime} min</span>
                    {isConceptFavorited(concept.id) && (
                      <IoStar className="text-yellow-500 text-sm" title="Favorited" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md max-md:p-4">
            {contentLoading ? (
              <LoadingSpinner message={isTranslating ? `Translating to ${getLanguageDisplayName(currentLanguage)}...` : "Loading content..."} />
            ) : contentError ? (
              <ErrorState
                title="Error Loading Content"
                message={contentError}
                icon={<IoWarningOutline />}
                variant="network"
                size="small"
                showRetry
                onRetry={() => {
                  setLocalizedContentCache(new Map());
                  setContentError(null);
                  setContentLoading(true);
                  getConceptLocalizedContent(selectedConcept)
                    .then(content => {
                      setLocalizedContent(content);
                      setContentLoading(false);
                    })
                    .catch(error => {
                      setLocalizedContent(null);
                      setContentLoading(false);
                      setContentError(error.message);
                    });
                }}
              />
            ) : selectedConcept && localizedContent ? (
              <>
                <div className="mb-8 pb-4 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4 max-md:flex-col mb-2">
                    <h2 className="text-gray-800 text-2xl font-semibold flex-1">
                      {localizedContent.content.title || selectedConcept.title}
                    </h2>
                    <FavoriteButton itemId={selectedConcept.id} itemType="concept" size="large" showLabel />
                  </div>

                  {localizedContent.isFallback && (
                    <div className={`flex gap-3 p-4 mb-4 rounded-lg border items-start
                      ${localizedContent.fallbackReason === 'translating'
                        ? "bg-purple-50 border-purple-200 text-purple-700"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                      }`}
                    >
                      <span className="text-xl shrink-0">
                        {localizedContent.fallbackReason === 'translating' ? <IoRefreshOutline /> :
                          localizedContent.fallbackReason === 'translation_failed' ? <IoWarningOutline /> :
                            <IoInformationCircleOutline />}
                      </span>
                      <div className="text-sm leading-5">
                        {localizedContent.fallbackReason === 'translating' && (
                          <>
                            <strong>Translating...</strong><br />
                            Content is being translated to {getLanguageDisplayName(currentLanguage)}
                          </>
                        )}
                        {localizedContent.fallbackReason === 'translation_failed' && (
                          <>
                            <strong>Translation Failed</strong><br />
                            Showing content in {getLanguageDisplayName(localizedContent.language)}
                          </>
                        )}
                        {!localizedContent.fallbackReason && (
                          <>Content shown in {getLanguageDisplayName(localizedContent.language)}</>
                        )}
                      </div>
                    </div>
                  )}

                  {localizedContent.isTranslated && !localizedContent.isFallback && (
                    <div className="flex gap-3 p-4 mb-4 rounded-lg border bg-purple-50 border-purple-200 text-purple-700">
                      <span className="text-xl"><IoSparklesOutline /></span>
                      <div className="text-sm">
                        <strong>AI Translated</strong><br />
                        This content was automatically translated
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                        ${selectedConcept.difficulty === "beginner" && "bg-green-100 text-green-700"}
                        ${selectedConcept.difficulty === "intermediate" && "bg-yellow-100 text-yellow-700"}
                        ${selectedConcept.difficulty === "advanced" && "bg-red-100 text-red-700"}
                      `}
                    >
                      {selectedConcept.difficulty}
                    </span>
                    <span>{selectedConcept.estimatedReadTime} min read</span>
                    {selectedConcept.updatedAt && (
                      <span>
                        Updated {new Date(selectedConcept.updatedAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    )}
                    <span>Language: {getLanguageDisplayName(currentLanguage)}</span>
                  </div>
                </div>

                <div className="leading-relaxed text-gray-800">
                  {localizedContent.content.summary && (
                    <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                      <strong>Summary:</strong> {localizedContent.content.summary}
                    </div>
                  )}

                  <div>{renderRichContent(localizedContent.content.body)}</div>

                  {localizedContent.content.images?.length > 0 && (
                    <div className="my-6">
                      <h4 className="text-gray-800 font-semibold mb-3">Visual References:</h4>
                      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                        {localizedContent.content.images.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            onError={e => e.target.style.display = 'none'}
                            alt=""
                            className="rounded-lg shadow w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {localizedContent.content.examples?.length > 0 && (
                    <div className="bg-gray-100 p-6 rounded-xl my-8">
                      <h4 className="text-gray-800 font-semibold mb-3">Examples:</h4>
                      <div className="flex flex-col gap-3">
                        {localizedContent.content.examples.map((example, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-gray-800">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {localizedContent.content.externalAssets?.length > 0 && (
                    <div className="bg-green-50 p-6 rounded-xl my-8">
                      <h4 className="font-semibold text-gray-800 mb-3">Additional Resources:</h4>
                      <div className="flex flex-col gap-2">
                        {localizedContent.content.externalAssets.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            className="text-green-700 hover:underline flex items-center gap-2"
                            target="_blank" rel="noreferrer"
                          >
                            <IoAttachOutline />
                            <span>Resource {idx + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedConcept.arEnabled && (selectedConcept.modelUrl || selectedConcept.embedUrl) && (
                    <WebXRViewer
                      modelUrl={selectedConcept.modelUrl}
                      embedUrl={getEmbedUrl(selectedConcept.embedUrl)}
                      title={`3D Model: ${selectedConcept.title}`}
                    />
                  )}

                  {selectedConcept.arEnabled && !selectedConcept.modelUrl && !selectedConcept.embedUrl && (
                    <div className="my-8 p-6 rounded-xl border bg-linear-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <IoGlassesOutline className="text-2xl" />
                        <div>
                          <strong className="text-blue-700 block">3D Model Coming Soon</strong>
                          <p className="text-gray-600 text-sm m-0">This concept will support 3D visualization</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedConcept.relatedConcepts?.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h4 className="text-gray-800 font-semibold mb-4">Related Concepts:</h4>
                    <div className="grid gap-4 grid-cols-2 max-md:grid-cols-1">
                      {selectedConcept.relatedConcepts.map(id => {
                        const related = concepts.find(c => c.id === id);
                        if (!related) return null;

                        return (
                          <button
                            key={id}
                            onClick={() => handleConceptSelect(related)}
                            className="p-4 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow transition"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">{related.title}</span>
                              <span
                                className={`
                                  px-2 py-1 rounded text-xs uppercase font-semibold
                                  ${related.difficulty === "beginner" && "bg-green-100 text-green-700"}
                                  ${related.difficulty === "intermediate" && "bg-yellow-100 text-yellow-700"}
                                  ${related.difficulty === "advanced" && "bg-red-100 text-red-700"}
                                `}
                              >
                                {related.difficulty}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ErrorState
                title="Select a Concept"
                message="Choose a concept from the list."
                icon={<IoArrowBackOutline />}
                variant="default"
                size="small"
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
