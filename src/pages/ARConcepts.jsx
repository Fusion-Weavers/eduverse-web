import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import { useContent } from "../context/ContentContext";
import { useNavigation } from "../context/NavigationContext";
import { getSubjectIcon } from "../utils/iconMap";
import { useMemo, useState } from "react";

export default function ARConcepts() {
    const { concepts, topics, subjects, loading, error } = useContent();
    const { navigateWithState } = useNavigation();
    const [visFilter, setVisFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");

    // Always compute these hooks before any conditional returns
    const arConcepts = concepts?.filter(c => c.arEnabled) || [];

    // Available visualization types from content
    const availableTypes = useMemo(() => {
        const types = new Set(
            arConcepts.map(c => (c.visualizationType || "ar").toLowerCase())
        );
        return Array.from(types).sort();
    }, [arConcepts]);

    const filteredAndSorted = useMemo(() => {
        const filtered = arConcepts.filter(c => {
            const t = (c.visualizationType || "ar").toLowerCase();
            return visFilter === "all" ? true : t === visFilter;
        });
        return filtered.sort((a, b) => {
            const ta = (a.visualizationType || "ar").toLowerCase();
            const tb = (b.visualizationType || "ar").toLowerCase();
            const cmp = ta.localeCompare(tb);
            return sortOrder === "asc" ? cmp : -cmp;
        });
    }, [arConcepts, visFilter, sortOrder]);

    // Now handle conditional renders after all hooks
    if (loading) {
        return (
            <ErrorBoundary>
                <Navbar />
                <div className="page">
                    <LoadingSpinner message="Loading AR concepts..." />
                </div>
            </ErrorBoundary>
        );
    }

    if (error) {
        return (
            <ErrorBoundary>
                <Navbar />
                <div className="page">
                    <div className="error-state">
                        <h2>Error Loading Content</h2>
                        <p>{error.message}</p>
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    const handleOpenConcept = (concept) => {
        const topic = topics.find(t => t.id === concept.topicId);
        if (!topic) return;
        navigateWithState(`/subjects/${topic.subjectId}/${topic.id}/${concept.id}`, {
            breadcrumb: {
                title: topic.name,
                params: { subjectId: topic.subjectId, topicId: topic.id }
            }
        });
    };

    return (
        <ErrorBoundary>
            <Navbar />
            <div className="page">
                <div className="page-header">
                    <h2>3D Concepts</h2>
                    <p>{arConcepts.length} concepts available with interactive visualization</p>
                </div>

                <div className="vis-filter">
                    <span>Visualization:</span>
                    <button
                        className={`chip ${visFilter === "all" ? "active" : ""}`}
                        onClick={() => setVisFilter("all")}
                    >All</button>
                    {availableTypes.map((t) => (
                        <button
                            key={t}
                            className={`chip ${visFilter === t ? "active" : ""}`}
                            onClick={() => setVisFilter(t)}
                        >{t.toUpperCase()}</button>
                    ))}
                    <div className="sort-control">
                        <button className="sort-btn" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                            Sort by type: {sortOrder === "asc" ? "A→Z" : "Z→A"}
                        </button>
                    </div>
                </div>

                <div className="ar-grid">
                    {filteredAndSorted.map((concept) => {
                        const topic = topics.find(t => t.id === concept.topicId);
                        const subject = subjects.find(s => s.id === topic?.subjectId);
                        const SubjectIcon = getSubjectIcon(subject?.icon);

                        return (
                            <div key={concept.id} className="ar-card" onClick={() => handleOpenConcept(concept)}>
                                <div className="ar-card-header">
                                    <div className="ar-header-content">
                                        <div className="subject-icon" aria-hidden="true">
                                            <SubjectIcon />
                                        </div>
                                        <h3 className="ar-title">{concept.title}</h3>
                                    </div>
                                    <span className="ar-badge">{(concept.visualizationType || "AR").toUpperCase()}</span>
                                </div>
                                <p className="ar-meta">
                                    {subject?.name} · {topic?.name} · {concept.difficulty}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {arConcepts.length === 0 && (
                    <div className="no-results">
                        <p>No 3D-enabled concepts available yet.</p>
                    </div>
                )}

                <style jsx>{`
          .page-header {
            margin-bottom: 3rem;
          }

          .page-header h2 {
            margin: 0 0 0.75rem;
            font-size: 48px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #000000;
            line-height: 1.2;
          }

          .page-header p {
            font-size: 14px;
            color: #666666;
            margin: 0;
            line-height: 1.6;
          }

          .vis-filter {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin: 3rem 0;
            padding-bottom: 2rem;
            border-bottom: 2px solid #000000;
          }

          .vis-filter span {
            color: #000000;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .chip {
            padding: 10px 20px;
            border: 1px solid #000000;
            background: white;
            border-radius: 0;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #000000;
          }

          .chip:hover {
            background: #f0f0f0;
            opacity: 1;
          }

          .chip.active {
            background: #000000;
            color: white;
          }

          .chip.active:hover {
            background: #333333;
            border-color: #333333;
          }

          .sort-control {
            margin-left: auto;
          }

          .sort-btn {
            padding: 10px 20px;
            border: 2px solid #000000;
            background: white;
            border-radius: 0;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
            color: #000000;
          }

          .sort-btn:hover {
            background: #f0f0f0;
          }

          .ar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 32px;
            margin-top: 2rem;
          }

          .ar-card {
            background: white;
            padding: 0;
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #000000;
            cursor: pointer;
            transition: transform 0.2s ease;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .ar-card:hover {
            transform: translateY(-2px);
          }

          .ar-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 1.5rem 2rem;
            background: #f8f8f8;
            border-bottom: 1px solid #000000;
            gap: 1rem;
          }

          .ar-header-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            flex: 1;
          }

          .subject-icon {
            color: #000000;
            font-size: 32px;
            flex-shrink: 0;
            margin-top: 0.25rem;
          }

          .ar-title {
            margin: 0;
            color: #000000;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.5px;
            line-height: 1.3;
            flex-grow: 1;
          }

          .ar-badge {
            background: #000000;
            color: white;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 0;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
            flex-shrink: 0;
            display: inline-block;
            white-space: nowrap;
          }

          .ar-meta {
            color: #666666;
            font-size: 13px;
            margin: 0;
            padding: 1.5rem 2rem;
            line-height: 1.6;
          }

          .no-results {
            text-align: center;
            padding: 3rem 1rem;
            color: #666666;
          }

          .no-results p {
            font-size: 14px;
            margin: 0;
            line-height: 1.6;
          }

          @media (max-width: 768px) {
            .ar-grid {
              grid-template-columns: 1fr;
            }

            .page-header h2 {
              font-size: 28px;
            }

            .vis-filter {
              flex-direction: column;
              align-items: stretch;
              gap: 0.5rem;
              padding-bottom: 1.5rem;
            }

            .vis-filter span {
              margin-bottom: 0.5rem;
            }

            .chip {
              width: 100%;
              text-align: center;
            }

            .sort-control {
              margin-left: 0;
              width: 100%;
            }

            .sort-btn {
              width: 100%;
            }

            .ar-card-header {
              flex-direction: column;
              gap: 0.75rem;
            }

            .ar-header-content {
              width: 100%;
            }

            .ar-badge {
              align-self: flex-start;
            }
          }
        `}</style>
            </div>
        </ErrorBoundary>
    );
}
