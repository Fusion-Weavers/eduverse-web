import { useMemo, useState } from "react";
import { 
  IoCubeOutline, 
  IoFilterOutline, 
  IoSwapVerticalOutline, 
  IoArrowForward, 
  IoLayersOutline, 
  IoSearchOutline 
} from "react-icons/io5";
import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import { useContent } from "../context/ContentContext";
import { useNavigation } from "../context/NavigationContext";
import { getSubjectIcon } from "../utils/iconMap";

export default function ARConcepts() {
  const { concepts, topics, subjects, loading, error } = useContent();
  const { navigateWithState } = useNavigation();
  const [visFilter, setVisFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  // Logic: Filter for AR Enabled content
  const arConcepts = useMemo(() => {
    return concepts?.filter((c) => c.arEnabled) || [];
  }, [concepts]);

  // Logic: Extract available visualization types
  const availableTypes = useMemo(() => {
    const types = new Set(
      arConcepts.map((c) => (c.visualizationType || "ar").toLowerCase())
    );
    return Array.from(types).sort();
  }, [arConcepts]);

  // Logic: Apply Filters and Sort
  const filteredAndSorted = useMemo(() => {
    const filtered = arConcepts.filter((c) => {
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

  const handleOpenConcept = (concept) => {
    const topic = topics.find((t) => t.id === concept.topicId);
    if (!topic) return;
    navigateWithState(`/subjects/${topic.subjectId}/${topic.id}/${concept.id}`, {
      breadcrumb: {
        title: topic.name,
        params: { subjectId: topic.subjectId, topicId: topic.id },
      },
    });
  };

  // --- Design Components ---

  // Ambient Background
  const AmbientBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-300/20 blur-[100px]" />
      <div className="absolute top-[40%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-300/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-blue-200/20 blur-[100px]" />
    </div>
  );

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="relative flex min-h-screen flex-col bg-slate-50 overflow-hidden">
          <AmbientBackground />
          <Navbar />
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-3xl border border-white/50 bg-white/40 p-12 backdrop-blur-xl">
               <LoadingSpinner message="Loading 3D Experience..." />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="relative flex min-h-screen flex-col bg-slate-50">
          <AmbientBackground />
          <Navbar />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="mx-auto max-w-lg rounded-3xl border border-slate-200/60 bg-white/70 p-10 text-center shadow-xl backdrop-blur-2xl">
              <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900">System Notification</h2>
              <p className="text-lg text-slate-500">{typeof error === "string" ? error : error.message}</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <AmbientBackground />
        <Navbar />

        <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-12 max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-bold uppercase tracking-wider text-indigo-600 shadow-sm backdrop-blur-md">
              <IoCubeOutline className="h-4 w-4" /> 3D Learning
            </div>
            <h1 className="mb-6 text-5xl font-black tracking-tight text-slate-900 leading-[1.1] sm:text-6xl lg:text-7xl">
              Immersive <br />
              <span className="bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                Visual Concepts
              </span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-slate-500">
              Explore {arConcepts.length} interactive visualizations. Interact with complex STEM topics through Augmented Reality and 3D modeling directly in your browser.
            </p>
          </div>

          {/* Controls Glass Bar (Sticky) */}
          <div className="sticky top-4 z-30 mb-12 flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/50 bg-white/70 p-2 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-white/80 hover:shadow-md md:flex-row">
            
            {/* Filter Pills */}
            <div className="flex w-full flex-wrap items-center gap-1 p-1 md:w-auto">
              <div className="hidden items-center gap-2 px-4 text-sm font-medium text-slate-400 md:flex">
                <IoFilterOutline />
              </div>
              
              <button
                onClick={() => setVisFilter("all")}
                className={`rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 ${
                  visFilter === "all"
                    ? "bg-slate-900 text-white shadow-lg scale-100"
                    : "bg-transparent text-slate-500 hover:bg-slate-100"
                }`}
              >
                All
              </button>

              {availableTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setVisFilter(t)}
                  className={`rounded-full px-6 py-3 text-sm font-bold capitalize transition-all duration-300 ${
                    visFilter === t
                        ? "bg-slate-900 text-white shadow-lg scale-100"
                        : "bg-transparent text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Sort Button */}
            <div className="flex w-full justify-end pr-2 md:w-auto">
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 rounded-full border border-transparent bg-slate-100/50 px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-300 hover:border-slate-200 hover:bg-white"
              >
                <span className="text-xs uppercase tracking-wide">Sort</span>
                <IoSwapVerticalOutline className={sortOrder === "asc" ? "rotate-0" : "rotate-180 transition-transform"} />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          {arConcepts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSorted.map((concept) => {
                const topic = topics.find((t) => t.id === concept.topicId);
                const subject = subjects.find((s) => s.id === topic?.subjectId);
                const SubjectIcon = getSubjectIcon(subject?.icon);

                return (
                  <div
                    key={concept.id}
                    onClick={() => handleOpenConcept(concept)}
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    {/* Inner Shine Effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/50" />

                    {/* Top Row */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <SubjectIcon className="h-6 w-6 text-slate-700 group-hover:text-indigo-600" />
                      </div>
                      
                      {/* Action Icon */}
                      <div className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-slate-900 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        <IoArrowForward className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Badges */}
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                         <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {concept.visualizationType || "AR Model"}
                        </span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-opacity-10 
                          ${concept.difficulty === 'Easy' ? 'bg-emerald-500 text-emerald-700' : 
                            concept.difficulty === 'Medium' ? 'bg-amber-500 text-amber-700' : 'bg-rose-500 text-rose-700'}`}>
                          {concept.difficulty || 'Medium'}
                        </span>
                      </div>

                      <h3 className="mb-2 text-2xl font-bold leading-tight text-slate-900 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600">
                        {concept.title}
                      </h3>
                      
                      <p className="mb-6 line-clamp-2 text-sm font-medium text-slate-400">
                        {topic?.name} • {subject?.name}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-center border-t border-slate-200/60 pt-6 text-sm font-medium text-slate-400 transition-colors group-hover:text-slate-600">
                      <span>Click to launch experience</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/60 bg-white/40 py-24 px-4 text-center backdrop-blur-xl">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/50 shadow-sm backdrop-blur-sm ring-1 ring-white/60">
                <IoLayersOutline className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">No 3D concepts found</h3>
              <p className="mx-auto max-w-md text-slate-500">
                We couldn't find any concepts matching your current filters. Try selecting a different category.
              </p>
              <button 
                onClick={() => setVisFilter('all')}
                className="mt-8 rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}