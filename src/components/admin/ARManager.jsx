import { useState, useEffect } from "react";
import { conceptService, topicService, subjectService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import ErrorState from "../ErrorState";

export default function ARManager() {
  const [concepts, setConcepts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, ar-enabled, ar-disabled
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [conceptsData, topicsData, subjectsData] = await Promise.all([
        conceptService.getAll(),
        topicService.getAll(),
        subjectService.getAll()
      ]);
      setConcepts(conceptsData);
      setTopics(topicsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleARToggle = async (conceptId, currentStatus) => {
    const previousConcept = concepts.find((concept) => concept.id === conceptId);
    const nextStatus = !currentStatus;

    // Optimistically update local state to avoid full reload/spinner
    setConcepts((prevConcepts) =>
      prevConcepts.map((concept) =>
        concept.id === conceptId
          ? {
            ...concept,
            arEnabled: nextStatus,
            // Clear visualization type when AR is disabled so UI stays in sync
            visualizationType: nextStatus ? concept.visualizationType : null,
          }
          : concept
      )
    );

    try {
      await conceptService.updateARAvailability(
        conceptId,
        nextStatus,
        nextStatus ? previousConcept?.visualizationType ?? null : null
      );
    } catch (err) {
      // Revert on failure
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) =>
          concept.id === conceptId
            ? { ...concept, arEnabled: currentStatus, visualizationType: previousConcept?.visualizationType ?? null }
            : concept
        )
      );
      setError("Failed to update AR status: " + err.message);
    }
  };

  const handleVisualizationTypeChange = async (conceptId, visualizationType) => {
    const previousConcept = concepts.find((concept) => concept.id === conceptId);

    // Optimistic UI update keeps the list responsive
    setConcepts((prevConcepts) =>
      prevConcepts.map((concept) =>
        concept.id === conceptId
          ? { ...concept, visualizationType, arEnabled: true }
          : concept
      )
    );

    try {
      await conceptService.updateARAvailability(conceptId, true, visualizationType);
    } catch (err) {
      // Revert to previous state on failure
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) =>
          concept.id === conceptId
            ? {
              ...concept,
              visualizationType: previousConcept?.visualizationType ?? null,
              arEnabled: previousConcept?.arEnabled ?? false,
            }
            : concept
        )
      );
      setError("Failed to update visualization type: " + err.message);
    }
  };

  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : "Unknown Topic";
  };

  const getSubjectName = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return "Unknown Subject";
    const subject = subjects.find(s => s.id === topic.subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  const filteredConcepts = concepts.filter(concept => {
    // Filter by AR status
    if (filter === "ar-enabled" && !concept.arEnabled) return false;
    if (filter === "ar-disabled" && concept.arEnabled) return false;

    // Filter by subject
    if (selectedSubject) {
      const topic = topics.find(t => t.id === concept.topicId);
      if (!topic || topic.subjectId !== selectedSubject) return false;
    }

    return true;
  });

  const arStats = {
    total: concepts.length,
    enabled: concepts.filter(c => c.arEnabled).length,
    disabled: concepts.filter(c => !c.arEnabled).length,
    byType: concepts.reduce((acc, concept) => {
      if (concept.arEnabled && concept.visualizationType) {
        acc[concept.visualizationType] = (acc[concept.visualizationType] || 0) + 1;
      }
      return acc;
    }, {})
  };

  if (loading) return <LoadingSpinner />;
  if (error && concepts.length === 0) return <ErrorState message={error} />;

  return (
    <div className="ar-manager">
      <div className="manager-header">
        <h2>AR Management</h2>
        <div className="ar-stats">
          <div className="stat-item">
            <span className="stat-number">{arStats.total}</span>
            <span className="stat-label">Total Concepts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{arStats.enabled}</span>
            <span className="stat-label">AR Enabled</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{arStats.disabled}</span>
            <span className="stat-label">AR Disabled</span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="ar-filters">
        <div className="filter-group">
          <label>Filter by AR Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Concepts</option>
            <option value="ar-enabled">AR Enabled</option>
            <option value="ar-disabled">AR Disabled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(arStats.byType).length > 0 && (
        <div className="visualization-stats">
          <h3>AR Visualization Types</h3>
          <div className="type-stats">
            {Object.entries(arStats.byType).map(([type, count]) => (
              <div key={type} className="type-stat">
                <span className="type-name">{type}</span>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="concepts-list">
        {filteredConcepts.map(concept => (
          <div key={concept.id} className="concept-ar-item">
            <div className="concept-info">
              <h3>{concept.title}</h3>
              <div className="concept-path">
                <span className="subject">{getSubjectName(concept.topicId)}</span>
                <span className="separator">→</span>
                <span className="topic">{getTopicName(concept.topicId)}</span>
              </div>
              <p className="concept-summary">
                {concept.content?.en?.summary || "No summary available"}
              </p>
            </div>

            <div className="ar-controls">
              <div className="ar-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={concept.arEnabled || false}
                    onChange={() => handleARToggle(concept.id, concept.arEnabled)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">
                  {concept.arEnabled ? "AR Enabled" : "AR Disabled"}
                </span>
              </div>

              {concept.arEnabled && (
                <div className="visualization-type">
                  <label>Visualization Type:</label>
                  <select
                    value={concept.visualizationType || ""}
                    onChange={(e) => handleVisualizationTypeChange(concept.id, e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="3d-model">3D Model</option>
                    <option value="animation">Animation</option>
                    <option value="interactive">Interactive</option>
                    <option value="simulation">Simulation</option>
                  </select>
                </div>
              )}
            </div>

            <div className="concept-meta">
              <span className={`difficulty ${concept.difficulty}`}>
                {concept.difficulty}
              </span>
              <span className="read-time">{concept.estimatedReadTime}min</span>
              {concept.arEnabled && concept.visualizationType && (
                <span className="ar-type">{concept.visualizationType}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredConcepts.length === 0 && !loading && (
        <div className="empty-state">
          <p>No concepts found matching the current filters.</p>
        </div>
      )}
    </div>
  );
}