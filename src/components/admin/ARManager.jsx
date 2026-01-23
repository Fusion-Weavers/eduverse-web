import { useState, useEffect } from "react";
import { conceptService, topicService, subjectService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import ErrorState from "../ErrorState";
import { FiEye, FiEyeOff, FiFilter, FiBox, FiClock, FiLayers } from "react-icons/fi";

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
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                AR Management
              </h1>
              <p className="text-slate-500 text-lg">
                Manage augmented reality features for your educational concepts
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Concepts */}
              <div className="bg-linear-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 rounded-2xl p-4">
                    <FiLayers className="text-3xl text-slate-900" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-900">{arStats.total}</p>
                    <p className="text-sm text-slate-500 font-medium">Total Concepts</p>
                  </div>
                </div>
              </div>

              {/* AR Enabled */}
              <div className="bg-linear-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 rounded-2xl p-4">
                    <FiEye className="text-3xl text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-emerald-600">{arStats.enabled}</p>
                    <p className="text-sm text-slate-500 font-medium">AR Enabled</p>
                  </div>
                </div>
              </div>

              {/* AR Disabled */}
              <div className="bg-linear-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 rounded-2xl p-4">
                    <FiEyeOff className="text-3xl text-slate-400" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-600">{arStats.disabled}</p>
                    <p className="text-sm text-slate-500 font-medium">AR Disabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/60 text-red-800 rounded-2xl p-6 mb-6 shadow-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 mb-6 border border-white/50 shadow-lg shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 rounded-xl p-2">
              <FiFilter className="text-xl text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AR Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">AR Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
              >
                <option value="all">All Concepts</option>
                <option value="ar-enabled">AR Enabled</option>
                <option value="ar-disabled">AR Disabled</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Visualization Types Stats */}
        {Object.keys(arStats.byType).length > 0 && (
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 mb-6 border border-white/50 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 rounded-xl p-2">
                <FiBox className="text-xl text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">AR Visualization Types</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(arStats.byType).map(([type, count]) => (
                <div
                  key={type}
                  className="bg-linear-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 text-center hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <p className="text-3xl font-bold text-slate-900">{count}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1 capitalize">
                    {type.replace('-', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concepts List */}
        <div className="space-y-4">
          {filteredConcepts.map(concept => (
            <div
              key={concept.id}
              className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Concept Info */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {concept.title}
                  </h3>

                  {/* Breadcrumb Path */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                      {getSubjectName(concept.topicId)}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      {getTopicName(concept.topicId)}
                    </span>
                  </div>

                  <p className="text-slate-500 leading-relaxed">
                    {concept.content?.en?.summary || "No summary available"}
                  </p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${concept.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      concept.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {concept.difficulty}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <FiClock className="text-sm" />
                      {concept.estimatedReadTime}min
                    </span>
                    {concept.arEnabled && concept.visualizationType && (
                      <span className="bg-linear-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {concept.visualizationType.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* AR Controls */}
                <div className="lg:w-80 space-y-4">
                  {/* Toggle Switch */}
                  <div className="bg-linear-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2 ${concept.arEnabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          {concept.arEnabled ? (
                            <FiEye className="text-xl text-emerald-600" />
                          ) : (
                            <FiEyeOff className="text-xl text-slate-400" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {concept.arEnabled ? "AR Enabled" : "AR Disabled"}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={concept.arEnabled || false}
                          onChange={() => handleARToggle(concept.id, concept.arEnabled)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 shadow-inner"></div>
                      </div>
                    </label>
                  </div>

                  {/* Visualization Type Selector */}
                  {concept.arEnabled && (
                    <div className="bg-linear-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Visualization Type
                      </label>
                      <select
                        value={concept.visualizationType || ""}
                        onChange={(e) => handleVisualizationTypeChange(concept.id, e.target.value)}
                        className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-2.5 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:bg-white/80"
                      >
                        <option value="">Select Type</option>
                        <option value="3d-model">🎨 3D Model</option>
                        <option value="animation">✨ Animation</option>
                        <option value="interactive">🎮 Interactive</option>
                        <option value="simulation">⚡ Simulation</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredConcepts.length === 0 && !loading && (
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-12 border border-white/50 shadow-lg text-center">
            <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiFilter className="text-4xl text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-slate-900 mb-2">No Concepts Found</p>
            <p className="text-slate-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}