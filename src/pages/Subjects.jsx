import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopicList from "../components/TopicList";
import ConceptView from "../components/ConceptView";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useContent } from "../context/ContentContext";
import { useNavigation } from "../context/NavigationContext";

export default function Subjects() {
  const { subjectId, topicId, conceptId } = useParams();
  const navigate = useNavigate();
  const { subjects, loading, error } = useContent();
  const { navigateWithState, goBack } = useNavigation();

  if (loading) {
    return (
      <ErrorBoundary>
        <Navbar />
        <div className="page">
          <LoadingSpinner message="Loading subjects..." />
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
            <h2>Error Loading Subjects</h2>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Handle concept view
  if (subjectId && topicId) {
    return (
      <ErrorBoundary>
        <Navbar />
        <div className="page">
          <ConceptView 
            topicId={topicId}
            conceptId={conceptId}
            onBack={goBack}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Handle topic list view
  if (subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) {
      return (
        <ErrorBoundary>
          <Navbar />
          <div className="page">
            <div className="error-state">
              <h2>Subject Not Found</h2>
              <p>The requested subject could not be found.</p>
              <button onClick={goBack} className="back-btn">
                ← Go Back
              </button>
              <button onClick={() => navigateWithState('/subjects')} className="home-btn">
                View All Subjects
              </button>
            </div>
          </div>
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <Navbar />
        <div className="page">
          <div className="page-header">
            <button onClick={goBack} className="back-btn">
              ← Back
            </button>
            <div className="subject-info">
              <div className="subject-title">
                <span className="subject-icon">{subject.icon}</span>
                <h2>{subject.name}</h2>
              </div>
              <p>{subject.description}</p>
            </div>
          </div>
          <TopicList subjectId={subjectId} />
        </div>
      </ErrorBoundary>
    );
  }

  // Default subjects grid view
  const handleSubjectClick = (subject) => {
    navigateWithState(`/subjects/${subject.id}`, {
      breadcrumb: {
        title: 'All Subjects',
        params: {}
      }
    });
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="page">
        <h2>Subjects</h2>
        <p>Select a subject to start exploring topics.</p>

        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div 
              className="subject-card" 
              key={subject.id}
              onClick={() => handleSubjectClick(subject)}
            >
              <div className="subject-icon">{subject.icon}</div>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
              <div className="subject-meta">
                <span>{subject.topicCount} topics</span>
                <span className={`difficulty ${subject.difficulty}`}>
                  {subject.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .error-state {
            text-align: center;
            padding: 3rem 1rem;
          }

          .error-state h2 {
            color: #dc3545;
            margin-bottom: 1rem;
          }

          .error-state p {
            color: #6c757d;
            margin-bottom: 2rem;
          }

          .retry-btn,
          .back-btn,
          .home-btn {
            padding: 0.75rem 1.5rem;
            margin: 0.5rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .retry-btn {
            background-color: #007bff;
            color: white;
          }

          .retry-btn:hover {
            background-color: #0056b3;
          }

          .back-btn {
            background-color: #6c757d;
            color: white;
          }

          .back-btn:hover {
            background-color: #545b62;
          }

          .home-btn {
            background-color: #28a745;
            color: white;
          }

          .home-btn:hover {
            background-color: #1e7e34;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
