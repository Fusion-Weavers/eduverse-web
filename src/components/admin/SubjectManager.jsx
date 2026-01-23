import { useState, useEffect } from "react";
import { subjectService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import ErrorState from "../ErrorState";
import { getSubjectIcon } from "../../utils/iconMap";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBook, FiGlobe, FiLayers } from "react-icons/fi";

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    difficulty: "beginner",
    languages: ["en"]
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      setError("Failed to load subjects: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingSubject) {
        await subjectService.update(editingSubject.id, formData);
      } else {
        await subjectService.create(formData);
      }

      await loadSubjects();
      resetForm();
    } catch (err) {
      setError("Failed to save subject: " + err.message);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      icon: subject.icon,
      difficulty: subject.difficulty,
      languages: subject.languages || ["en"]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
      await subjectService.delete(id);
      await loadSubjects();
    } catch (err) {
      setError("Failed to delete subject: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      difficulty: "beginner",
      languages: ["en"]
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error && subjects.length === 0) return <ErrorState message={error} />;

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
                Subject Management
              </h1>
              <p className="text-slate-500 text-lg">
                Create and manage educational subjects for your platform
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300/50"
            >
              <FiPlus className="text-xl" />
              Add New Subject
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/60 text-red-800 rounded-2xl p-6 mb-6 shadow-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full border border-white/50 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl p-3">
                    <FiBook className="text-2xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editingSubject ? "Edit Subject" : "Add New Subject"}
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
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Physics, Chemistry, Biology"
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
                    placeholder="Describe what students will learn in this subject..."
                    className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80 resize-none"
                  />
                </div>

                {/* Icon Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Icon (Ionicon key)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="library"
                    className="w-full bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 hover:bg-white/80"
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter an Ionicon name (e.g., library, flask, calculator)</p>
                </div>

                {/* Difficulty Field */}
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
                    {editingSubject ? "Update" : "Create"} Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => {
            const SubjectIcon = getSubjectIcon(subject.icon);
            return (
              <div
                key={subject.id}
                className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Subject Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl p-4">
                    <SubjectIcon className="text-3xl text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex-1">
                    {subject.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-500 leading-relaxed mb-4 flex-1">
                  {subject.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${subject.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    subject.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {subject.difficulty === 'beginner' ? '🌱' : subject.difficulty === 'intermediate' ? '🚀' : '⚡'}
                    {' '}{subject.difficulty}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <FiGlobe className="text-sm" />
                    {subject.languages?.join(", ") || "en"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-linear-to-r from-white/60 to-white/40 backdrop-blur-xl border border-slate-200/60 text-slate-700 font-semibold px-4 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiEdit2 className="text-sm" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200/60 text-red-700 font-semibold px-4 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiTrash2 className="text-sm" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {subjects.length === 0 && !loading && (
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-12 border border-white/50 shadow-lg text-center">
            <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiLayers className="text-4xl text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-slate-900 mb-2">No Subjects Found</p>
            <p className="text-slate-500 mb-6">Create your first subject to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FiPlus className="text-xl" />
              Add Your First Subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}