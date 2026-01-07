import { useState, useEffect } from "react";
import { IoGlassesOutline } from "react-icons/io5";
import { topicService, subjectService, conceptService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import ErrorState from "../ErrorState";

export default function TopicManager() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showConceptForm, setShowConceptForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subjectId: "",
    difficulty: "beginner",
    estimatedTime: 30,
    prerequisites: [],
    languages: ["en"]
  });
  const [conceptFormData, setConceptFormData] = useState({
    title: "",
    difficulty: "beginner",
    estimatedReadTime: 10,
    arEnabled: false,
    visualizationType: "",
    content: {
      en: {
        title: "",
        body: "",
        summary: "",
        examples: [],
        images: [],
        externalAssets: []
      }
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [topicsData, subjectsData] = await Promise.all([
        topicService.getAll(),
        subjectService.getAll()
      ]);
      setTopics(topicsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadConcepts = async (topicId) => {
    try {
      const conceptsData = await conceptService.getByTopic(topicId);
      setConcepts(conceptsData);
    } catch (err) {
      setError("Failed to load concepts: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingTopic) {
        await topicService.update(editingTopic.id, formData);
      } else {
        await topicService.create(formData);
      }

      await loadData();
      resetForm();
    } catch (err) {
      setError("Failed to save topic: " + err.message);
    }
  };

  const handleConceptSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await conceptService.create({
        ...conceptFormData,
        topicId: selectedTopic.id
      });

      await loadConcepts(selectedTopic.id);
      resetConceptForm();
    } catch (err) {
      setError("Failed to save concept: " + err.message);
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      subjectId: topic.subjectId,
      difficulty: topic.difficulty,
      estimatedTime: topic.estimatedTime,
      prerequisites: topic.prerequisites || [],
      languages: topic.languages || ["en"]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      await topicService.delete(id);
      await loadData();
    } catch (err) {
      setError("Failed to delete topic: " + err.message);
    }
  };

  const handleViewConcepts = async (topic) => {
    setSelectedTopic(topic);
    await loadConcepts(topic.id);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      subjectId: "",
      difficulty: "beginner",
      estimatedTime: 30,
      prerequisites: [],
      languages: ["en"]
    });
    setEditingTopic(null);
    setShowForm(false);
  };

  const resetConceptForm = () => {
    setConceptFormData({
      title: "",
      difficulty: "beginner",
      estimatedReadTime: 10,
      arEnabled: false,
      visualizationType: "",
      content: {
        en: {
          title: "",
          body: "",
          summary: "",
          examples: [],
          images: [],
          externalAssets: []
        }
      }
    });
    setShowConceptForm(false);
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  if (loading) return <LoadingSpinner />;
  if (error && topics.length === 0) return <ErrorState message={error} />;

  return (
    <div className="topic-manager">
      <div className="manager-header">
        <h2>Topic Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Topic
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h3>{editingTopic ? "Edit Topic" : "Add New Topic"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingTopic ? "Update" : "Create"} Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTopic && (
        <div className="concepts-modal">
          <div className="concepts-container">
            <div className="concepts-header">
              <h3>Concepts for: {selectedTopic.name}</h3>
              <div>
                <button
                  className="btn-primary"
                  onClick={() => setShowConceptForm(true)}
                >
                  Add Concept
                </button>
                <button onClick={() => setSelectedTopic(null)}>Close</button>
              </div>
            </div>

            {showConceptForm && (
              <div className="concept-form">
                <h4>Add New Concept</h4>
                <form onSubmit={handleConceptSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={conceptFormData.title}
                      onChange={(e) => setConceptFormData({
                        ...conceptFormData,
                        title: e.target.value,
                        content: {
                          ...conceptFormData.content,
                          en: {
                            ...conceptFormData.content.en,
                            title: e.target.value
                          }
                        }
                      })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Content Body</label>
                    <textarea
                      value={conceptFormData.content.en.body}
                      onChange={(e) => setConceptFormData({
                        ...conceptFormData,
                        content: {
                          ...conceptFormData.content,
                          en: {
                            ...conceptFormData.content.en,
                            body: e.target.value
                          }
                        }
                      })}
                      rows="6"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Summary</label>
                    <textarea
                      value={conceptFormData.content.en.summary}
                      onChange={(e) => setConceptFormData({
                        ...conceptFormData,
                        content: {
                          ...conceptFormData.content,
                          en: {
                            ...conceptFormData.content.en,
                            summary: e.target.value
                          }
                        }
                      })}
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Difficulty</label>
                      <select
                        value={conceptFormData.difficulty}
                        onChange={(e) => setConceptFormData({ ...conceptFormData, difficulty: e.target.value })}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Read Time (minutes)</label>
                      <input
                        type="number"
                        value={conceptFormData.estimatedReadTime}
                        onChange={(e) => setConceptFormData({ ...conceptFormData, estimatedReadTime: parseInt(e.target.value) })}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={conceptFormData.arEnabled}
                        onChange={(e) => setConceptFormData({ ...conceptFormData, arEnabled: e.target.checked })}
                      />
                      Enable AR Visualization
                    </label>
                  </div>

                  {conceptFormData.arEnabled && (
                    <div className="form-group">
                      <label>Visualization Type</label>
                      <select
                        value={conceptFormData.visualizationType}
                        onChange={(e) => setConceptFormData({ ...conceptFormData, visualizationType: e.target.value })}
                      >
                        <option value="">Select Type</option>
                        <option value="3d-model">3D Model</option>
                        <option value="animation">Animation</option>
                        <option value="interactive">Interactive</option>
                        <option value="simulation">Simulation</option>
                      </select>
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="button" onClick={resetConceptForm}>Cancel</button>
                    <button type="submit" className="btn-primary">Create Concept</button>
                  </div>
                </form>
              </div>
            )}

            <div className="concepts-list">
              {concepts.map(concept => (
                <div key={concept.id} className="concept-item">
                  <h4>{concept.title}</h4>
                  <p>{concept.content?.en?.summary || "No summary"}</p>
                  <div className="concept-meta">
                    <span className={`difficulty ${concept.difficulty}`}>
                      {concept.difficulty}
                    </span>
                    <span className="read-time">{concept.estimatedReadTime}min</span>
                    {concept.arEnabled && (
                      <span className="ar-enabled">
                        <IoGlassesOutline aria-hidden="true" /> AR
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="topics-grid">
        {topics.map(topic => (
          <div key={topic.id} className="topic-card">
            <div className="topic-header">
              <h3>{topic.name}</h3>
              <span className="subject-name">{getSubjectName(topic.subjectId)}</span>
            </div>

            <p className="topic-description">{topic.description}</p>

            <div className="topic-meta">
              <span className={`difficulty ${topic.difficulty}`}>
                {topic.difficulty}
              </span>
              <span className="time">{topic.estimatedTime}min</span>
            </div>

            <div className="topic-actions">
              <button onClick={() => handleViewConcepts(topic)}>
                View Concepts
              </button>
              <button onClick={() => handleEdit(topic)}>Edit</button>
              <button
                onClick={() => handleDelete(topic.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {topics.length === 0 && !loading && (
        <div className="empty-state">
          <p>No topics found. Create your first topic to get started.</p>
        </div>
      )}
    </div>
  );
}