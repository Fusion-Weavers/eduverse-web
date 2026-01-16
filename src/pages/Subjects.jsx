import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopicList from "../components/TopicList";
import ConceptView from "../components/ConceptView";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useContent } from "../context/ContentContext";
import { useNavigation } from "../context/NavigationContext";
import { getSubjectIcon } from "../utils/iconMap";
import { FiArrowLeft, FiAlertCircle, FiGrid, FiBookOpen } from "react-icons/fi";

// --- Design Components ---

const AmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px]" />
    <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
  </div>
);

const BackButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-slate-600 font-bold text-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-x-1"
  >
    <FiArrowLeft className="w-4 h-4" /> Back
  </button>
);

const PageHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-2">
      {Icon && (
        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
    {subtitle && <p className="text-lg text-slate-500 max-w-2xl font-medium ml-1">{subtitle}</p>}
  </div>
);

export default function Subjects() {
  const { subjectId, topicId, conceptId } = useParams();
  const navigate = useNavigate();
  const { subjects, topics, loading, error, getTopicsBySubject } = useContent();
  const { navigateWithState, goBack } = useNavigation();

  // --- Loading State ---
  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen relative font-sans">
          <AmbientBackground />
          <Navbar />
          <div className="flex-1 flex items-center justify-center min-h-[80vh]">
            <div className="p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50">
              <LoadingSpinner message="Loading curriculum..." />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen relative font-sans">
          <AmbientBackground />
          <Navbar />
          <div className="container mx-auto px-4 py-20 flex justify-center">
            <div className="max-w-md w-full text-center p-10 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-xl">
              <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <FiAlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Connection Issue</h2>
              <p className="text-slate-500 mb-8">{error.message}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold transition-transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // --- View 1: Specific Concept View ---
  if (subjectId && topicId) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen relative font-sans bg-slate-50">
           {/* Note: ConceptView likely has its own internal styling, but we wrap it to ensure background consistency */}
          <AmbientBackground />
          <Navbar />
          <div className="container mx-auto px-4 py-6">
            <ConceptView
              topicId={topicId}
              conceptId={conceptId}
              onBack={goBack}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // --- View 2: Topic List (Inside a Subject) ---
  if (subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) {
      return (
        <ErrorBoundary>
          <div className="min-h-screen relative font-sans">
            <AmbientBackground />
            <Navbar />
            <div className="container mx-auto px-4 py-20 flex justify-center">
              <div className="max-w-lg text-center p-10 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-slate-200 shadow-lg">
                <h2 className="text-2xl font-black text-slate-900 mb-4">Subject Not Found</h2>
                <p className="text-slate-500 mb-8">The requested subject ID does not exist in our curriculum.</p>
                <div className="flex gap-4 justify-center">
                  <BackButton onClick={goBack} />
                  <button onClick={() => navigateWithState('/subjects')} className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:shadow-lg transition-all">
                    View All Subjects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      );
    }

    const SubjectIcon = getSubjectIcon(subject.icon);

    return (
      <ErrorBoundary>
        <div className="min-h-screen relative font-sans">
          <AmbientBackground />
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Navigation & Header */}
            <div className="mb-8">
              <div className="mb-6">
                <BackButton onClick={goBack} />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner">
                  <SubjectIcon className="w-10 h-10" />
                </div>
                <div>
                   <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                    {subject.name}
                   </h1>
                   <p className="text-lg text-slate-500 font-medium">{subject.description}</p>
                </div>
              </div>
            </div>

            {/* Contextual Diagram Trigger for Specific Subject */}
            <div className="mb-8">
              
            </div>

            {/* Topic List Container */}
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-1 border border-white/40">
               <TopicList subjectId={subjectId} />
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  // --- View 3: All Subjects Grid (Default) ---
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
      <div className="min-h-screen relative font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <AmbientBackground />
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <PageHeader 
            icon={FiGrid}
            title="Course Catalog" 
            subtitle="Select a scientific discipline to begin your journey." 
          />
          
          {/* General STEM Overview Diagram Trigger */}
          <div className="mb-12 flex justify-center">
             
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => {
              const subjectTopics = getTopicsBySubject(subject.id);
              const topicCount = subjectTopics.length;
              const SubjectIcon = getSubjectIcon(subject.icon);

              return (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject)}
                  className="group relative flex flex-col p-8 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:bg-white/80"
                >
                  {/* Inner Shine */}
                  <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/50 pointer-events-none" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 shadow-inner">
                      <SubjectIcon className="w-8 h-8" />
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                      ${subject.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        subject.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {subject.difficulty || 'Beginner'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {subject.name}
                  </h3>
                  
                  <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                    {subject.description}
                  </p>

                  <div className="pt-6 border-t border-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                      <FiBookOpen className="w-4 h-4" />
                      <span>{topicCount} Topics</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                      Explore <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}