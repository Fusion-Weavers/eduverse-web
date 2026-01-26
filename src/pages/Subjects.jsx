import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopicList from "../components/TopicList";
import ConceptView from "../components/ConceptView";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { useContent } from "../context/ContentContext";
import { useNavigation } from "../context/NavigationContext";
import { useLanguage } from "../context/LanguageContext";
import { getSubjectIcon } from "../utils/iconMap";
import { FiArrowLeft, FiAlertCircle, FiGrid, FiBookOpen } from "react-icons/fi";
import { AmbientBackground, GlassCard, BackButton, PageHeader } from "../components/ui/DesignSystem";

// --- Design Components ---

export default function Subjects() {
  const { subjectId, topicId, conceptId } = useParams();
  const navigate = useNavigate();
  const { subjects, topics, loading, error, getTopicsBySubject } = useContent();
  const { navigateWithState, goBack } = useNavigation();
  const { currentLanguage, getUITranslation } = useLanguage();

  // --- Loading State ---
  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen relative font-sans">
          <AmbientBackground />
          <Navbar />
          <div className="flex flex-1 items-center justify-center min-h-[80vh]">
            <GlassCard className="p-12" hoverEffect={false}>
              <LoadingSpinner message={getUITranslation('loadingCurriculum', currentLanguage)} />
            </GlassCard>
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
            <GlassCard className="max-w-md w-full text-center p-10" hoverEffect={false}>
              <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <FiAlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">{getUITranslation('connectionIssue', currentLanguage)}</h2>
              <p className="text-slate-500 mb-8">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold transition-transform hover:scale-105"
              >
                {getUITranslation('tryAgain', currentLanguage)}
              </button>
            </GlassCard>
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
              <GlassCard className="max-w-lg text-center p-10" hoverEffect={false}>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{getUITranslation('subjectNotFound', currentLanguage)}</h2>
                <p className="text-slate-500 mb-8">{getUITranslation('subjectNotFoundDesc', currentLanguage)}</p>
                <div className="flex gap-4 justify-center">
                  <BackButton onClick={goBack} />
                  <button onClick={() => navigateWithState('/subjects')} className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:shadow-lg transition-all">
                    {getUITranslation('viewAllSubjects', currentLanguage)}
                  </button>
                </div>
              </GlassCard>
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

              <div className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm">
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
            <GlassCard className="p-1" hoverEffect={false}>
              <TopicList subjectId={subjectId} />
            </GlassCard>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  // --- View 3: All Subjects Grid (Default) ---
  const handleSubjectClick = (subject) => {
    navigateWithState(`/subjects/${subject.id}`, {
      breadcrumb: {
        title: getUITranslation('subjects', currentLanguage),
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
            title={getUITranslation('courseCatalog', currentLanguage)}
            subtitle={getUITranslation('catalogSubtitle', currentLanguage)}
          />

          {/* General STEM Overview Diagram Trigger */}
          <div className="mb-12 flex justify-center">

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => {
              const subjectTopics = getTopicsBySubject(subject.id);
              const topicCount = subjectTopics?.length || 0;
              const SubjectIcon = getSubjectIcon(subject.icon);

              return (
                <GlassCard
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject)}
                  className="flex flex-col p-8"
                >

                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 shadow-inner">
                      <SubjectIcon className="w-8 h-8" />
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${subject.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : subject.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
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
                      <span>{topicCount} {getUITranslation('topicsCount', currentLanguage)}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                      {getUITranslation('explore', currentLanguage)} <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}