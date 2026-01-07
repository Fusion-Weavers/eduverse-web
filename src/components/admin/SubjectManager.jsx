import { useState, useEffect } from "react";
import { subjectService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import ErrorState from "../ErrorState";
import { getSubjectIcon } from "../../utils/iconMap";

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
    <div className="subject-manager">
      <div className="manager-header">
        <h2>Subject Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Subject
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h3>{editingSubject ? "Edit Subject" : "Add New Subject"}</h3>

            <form onSubmit={handleSubmit}>
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

              <div className="form-group">
                <label>Icon (Ionicon key)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="library"
                />
              </div>

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

              <div className="form-actions">
                <button type="button" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingSubject ? "Update" : "Create"} Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="subjects-grid">
        {subjects.map(subject => (
          <div key={subject.id} className="subject-card">
            <div className="subject-header">
              <span className="subject-icon" aria-hidden="true">
                {(() => {
                  const SubjectIcon = getSubjectIcon(subject.icon);
                  return <SubjectIcon />;
                })()}
              </span>
              <h3>{subject.name}</h3>
            </div>

            <p className="subject-description">{subject.description}</p>

            <div className="subject-meta">
              <span className={`difficulty ${subject.difficulty}`}>
                {subject.difficulty}
              </span>
              <span className="languages">
                {subject.languages?.join(", ") || "en"}
              </span>
            </div>

            <div className="subject-actions">
              <button onClick={() => handleEdit(subject)}>Edit</button>
              <button
                onClick={() => handleDelete(subject.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {subjects.length === 0 && !loading && (
        <div className="empty-state">
          <p>No subjects found. Create your first subject to get started.</p>
        </div>
      )}
    </div>
  );
}