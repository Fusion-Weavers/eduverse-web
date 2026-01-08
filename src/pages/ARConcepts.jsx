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
                                    <div className="subject-icon" aria-hidden="true">
                                        <SubjectIcon />
                                    </div>
                                    <span className="ar-badge">{(concept.visualizationType || "AR").toUpperCase()}</span>
                                </div>
                                <h3 className="ar-title">{concept.name}</h3>
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
          .page-header { text-align: center; margin-bottom: 1.5rem; }
          .page-header h2 { margin-bottom: 0.25rem; color: #2a4365; }
          .page-header p { color: #6c757d; }

          .vis-filter { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; justify-content:center; margin: 0.5rem 0 1rem; }
          .vis-filter span { color:#6c757d; font-weight:600; margin-right:0.25rem; }
          .chip { padding:0.4rem 0.8rem; border:1px solid #e2e8f0; background:white; border-radius:999px; font-size:0.85rem; cursor:pointer; transition:all 0.2s ease; }
          .chip:hover { border-color:#4A90E2; color:#4A90E2; }
          .chip.active { background:#4A90E2; color:white; border-color:#4A90E2; }
          .sort-control { margin-left:0.5rem; }
          .sort-btn { padding:0.4rem 0.8rem; border:1px solid #e2e8f0; background:white; border-radius:0.5rem; cursor:pointer; font-size:0.85rem; }
          .sort-btn:hover { border-color:#4A90E2; color:#4A90E2; }

          .ar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
          }
          .ar-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .ar-card:hover { border-color: #4A90E2; box-shadow: 0 4px 12px rgba(74,144,226,0.12); transform: translateY(-2px); }
          .ar-card-header { display:flex; align-items:center; justify-content:space-between; }
          .subject-icon { color:#4A90E2; font-size: 1.25rem; }
          .ar-badge { background:#4A90E2; color:white; font-weight:600; padding:0.25rem 0.5rem; border-radius:0.375rem; font-size:0.75rem; }
          .ar-title { margin:0.5rem 0; color:#2d3748; font-size:1.1rem; }
          .ar-meta { color:#718096; font-size:0.9rem; }

          @media (max-width: 768px) {
            .ar-grid { grid-template-columns: 1fr; }
          }
        `}</style>
            </div>
        </ErrorBoundary>
    );
}
