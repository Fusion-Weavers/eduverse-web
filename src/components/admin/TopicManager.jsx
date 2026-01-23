import { useState, useEffect } from "react";
import { IoGlassesOutline } from "react-icons/io5";
import { topicService, subjectService, conceptService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import ErrorState from "../ErrorState";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBook, FiClock, FiEye, FiLayers, FiBookOpen, FiFileText } from "react-icons/fi";

export default function TopicManager() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showConceptForm, setShowConceptForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingConcept, setEditingConcept] = useState(null);
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
      if (editingConcept) {
        await conceptService.update(editingConcept.id, conceptFormData);
      } else {
        await conceptService.create({
          ...conceptFormData,
          topicId: selectedTopic.id
        });
      }

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
      modelUrl: "",
      embedUrl: "",
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
    setEditingConcept(null);
    setShowConceptForm(false);
  };

  const handleEditConcept = (concept) => {
    setEditingConcept(concept);
    setConceptFormData({
      title: concept.title || "",
      difficulty: concept.difficulty || "beginner",
      estimatedReadTime: concept.estimatedReadTime || 10,
      arEnabled: concept.arEnabled || false,
      visualizationType: concept.visualizationType || "",
      modelUrl: concept.modelUrl || "",
      embedUrl: concept.embedUrl || "",
      content: concept.content || {
        en: {
          title: concept.title || "",
          body: "",
          summary: "",
          examples: [],
          images: [],
          externalAssets: []
        }
      }
    });
    setShowConceptForm(true);
  };

  const handleDeleteConcept = async (conceptId) => {
    if (!confirm("Are you sure you want to delete this concept?")) return;

    try {
      await conceptService.delete(conceptId);
      await loadConcepts(selectedTopic.id);
    } catch (err) {
      setError("Failed to delete concept: " + err.message);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  if (loading) return <LoadingSpinner />;
  if (error && topics.length === 0) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-50 p-4 md:p-8 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-400/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 mb-6 border border-white/50 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                Topic Management
              </h1>
              <p className="text-slate-500 text-lg">
                Organize and manage topics within your subjects
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300/50"
            >
              <FiPlus className="text-xl" />
              Add New Topic
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/60 text-red-800 rounded-2xl p-6 mb-6 shadow-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Topic Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full border border-white/50 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl p-3">
                    <FiBookOpen className="text-2xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editingTopic ? "Edit Topic" : "Add New Topic"}
                  </h2>
                </div>
                <button
                  onClick={resetForm}
                  className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-all duration-300"
                >
                  <FiX className="text-xl text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    required
                    className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Topic Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Newton's Laws, Cell Structure"
                    className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Describe what students will learn in this topic..."
                    className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80 resize-none"
                  />
                </div>

                {/* Difficulty & Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Difficulty Level</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
                    >
                      <option value="beginner">🌱 Beginner</option>
                      <option value="intermediate">🚀 Intermediate</option>
                      <option value="advanced">⚡ Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Estimated Time (minutes)</label>
                    <input
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                      min="1"
                      className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300/50"
                  >
                    {editingTopic ? "Update" : "Create"} Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Concepts Modal */}
        {selectedTopic && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 max-w-6xl w-full border border-white/50 shadow-2xl my-8 h-[85vh] flex flex-col">
              {/* Concepts Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-3">
                    <FiLayers className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Concepts
                    </h2>
                    <p className="text-slate-500">{selectedTopic.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConceptForm(true)}
                    className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <FiPlus className="text-lg" />
                    Add Concept
                  </button>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="bg-slate-100 hover:bg-slate-200 rounded-full p-2.5 transition-all duration-300"
                  >
                    <FiX className="text-xl text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Concept Form */}
              {showConceptForm && (
                <div className="bg-linear-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-200/60 flex-shrink-0">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {editingConcept ? "Edit Concept" : "Add New Concept"}
                  </h3>
                  <form onSubmit={handleConceptSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Concept Title</label>
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
                        placeholder="e.g., Newton's First Law"
                        className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                      />
                    </div>

                    {/* Content Body */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Content Body</label>
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
                        placeholder="Detailed explanation of the concept..."
                        className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Summary</label>
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
                        placeholder="Brief summary..."
                        className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Difficulty & Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Difficulty</label>
                        <select
                          value={conceptFormData.difficulty}
                          onChange={(e) => setConceptFormData({ ...conceptFormData, difficulty: e.target.value })}
                          className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                        >
                          <option value="beginner">🌱 Beginner</option>
                          <option value="intermediate">🚀 Intermediate</option>
                          <option value="advanced">⚡ Advanced</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Read Time (min)</label>
                        <input
                          type="number"
                          value={conceptFormData.estimatedReadTime}
                          onChange={(e) => setConceptFormData({ ...conceptFormData, estimatedReadTime: parseInt(e.target.value) })}
                          min="1"
                          className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* AR Enable Checkbox */}
                    <div className="bg-white/40 rounded-xl p-4 border border-slate-200/60">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={conceptFormData.arEnabled}
                          onChange={(e) => setConceptFormData({ ...conceptFormData, arEnabled: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        />
                        <span className="text-sm font-semibold text-slate-700">Enable AR Visualization</span>
                      </label>
                    </div>

                    {/* AR Fields */}
                    {conceptFormData.arEnabled && (
                      <div className="space-y-4 bg-purple-50/50 rounded-xl p-4 border border-purple-200/60">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Visualization Type</label>
                          <select
                            value={conceptFormData.visualizationType}
                            onChange={(e) => setConceptFormData({ ...conceptFormData, visualizationType: e.target.value })}
                            className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                          >
                            <option value="">Select Type</option>
                            <option value="3d-model">🎨 3D Model</option>
                            <option value="animation">✨ Animation</option>
                            <option value="interactive">🎮 Interactive</option>
                            <option value="simulation">⚡ Simulation</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Model URL (GLB/GLTF)</label>
                          <input
                            type="url"
                            value={conceptFormData.modelUrl}
                            onChange={(e) => setConceptFormData({ ...conceptFormData, modelUrl: e.target.value })}
                            placeholder="https://example.com/model.glb"
                            className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                          />
                          <p className="text-xs text-slate-500">Direct link to a GLB or GLTF 3D model file</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Embed URL (Sketchfab, etc.)</label>
                          <textarea
                            value={conceptFormData.embedUrl}
                            onChange={(e) => setConceptFormData({ ...conceptFormData, embedUrl: e.target.value })}
                            rows="3"
                            placeholder="Paste Sketchfab embed code or iframe src URL"
                            className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 resize-none"
                          />
                          <p className="text-xs text-slate-500">Paste full embed code or just the iframe src URL from Sketchfab</p>
                        </div>
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={resetConceptForm}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                      >
                        {editingConcept ? "Update" : "Create"} Concept
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Concepts List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
                {concepts.length === 0 ? (
                  <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 text-center">
                    <FiFileText className="text-4xl text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No concepts yet. Add your first concept to get started.</p>
                  </div>
                ) : (
                  concepts.map(concept => (
                    <div
                      key={concept.id}
                      className="bg-linear-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{concept.title}</h4>
                          <p className="text-slate-500 text-sm mb-3">{concept.content?.en?.summary || "No summary"}</p>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${concept.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              concept.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                              {concept.difficulty}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                              <FiClock className="text-xs" />
                              {concept.estimatedReadTime}min
                            </span>
                            {concept.arEnabled && (
                              <span className="flex items-center gap-1 bg-linear-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                <IoGlassesOutline className="text-sm" />
                                AR Enabled
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex lg:flex-col gap-2">
                          <button
                            onClick={() => handleEditConcept(concept)}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xl border border-slate-200/60 text-slate-700 font-semibold px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
                          >
                            <FiEdit2 className="text-xs" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConcept(concept.id)}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200/60 text-red-700 font-semibold px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm"
                          >
                            <FiTrash2 className="text-xs" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Topics Grid */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/50 shadow-lg shadow-slate-200/50 h-[calc(100vh-280px)] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Topic Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {topic.name}
                      </h3>
                    </div>
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {getSubjectName(topic.subjectId)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 leading-relaxed mb-4 flex-1">
                    {topic.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${topic.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {topic.difficulty}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <FiClock className="text-sm" />
                      {topic.estimatedTime}min
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleViewConcepts(topic)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <FiEye className="text-sm" />
                      View Concepts
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-linear-to-r from-white/60 to-white/40 backdrop-blur-xl border border-slate-200/60 text-slate-700 font-semibold px-4 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <FiEdit2 className="text-sm" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200/60 text-red-700 font-semibold px-4 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <FiTrash2 className="text-sm" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {topics.length === 0 && !loading && (
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-12 border border-white/50 shadow-lg text-center">
            <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiBook className="text-4xl text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-slate-900 mb-2">No Topics Found</p>
            <p className="text-slate-500 mb-6">Create your first topic to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FiPlus className="text-xl" />
              Add Your First Topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}