import { useState, useEffect } from "react";
import { 
  IoBookOutline, 
  IoGlassesOutline, 
  IoLeafOutline, 
  IoLibraryOutline, 
  IoSettingsOutline, 
  IoStatsChartOutline 
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import TopicManager from "../components/admin/TopicManager";
import SubjectManager from "../components/admin/SubjectManager";
import DataSeeder from "../components/admin/DataSeeder";
import ARManager from "../components/admin/ARManager";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subjects");

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  const tabs = [
    { 
      id: "subjects", 
      label: "Subjects", 
      icon: <IoLibraryOutline className="w-5 h-5" />,
      description: "Manage curriculum"
    },
    { 
      id: "topics", 
      label: "Topics", 
      icon: <IoBookOutline className="w-5 h-5" />,
      description: "Edit content & media"
    },
    { 
      id: "ar", 
      label: "3D Models", 
      icon: <IoGlassesOutline className="w-5 h-5" />,
      description: "AR configurations"
    },
    { 
      id: "seed", 
      label: "System Data", 
      icon: <IoLeafOutline className="w-5 h-5" />,
      description: "Database tools"
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative overflow-hidden font-sans text-slate-800">
      <Navbar />

      {/* Ambient Background Elements (The "Glow" behind the glass) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-200/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-200/40 rounded-full blur-[100px] opacity-60 mix-blend-multiply" />
        <div className="absolute top-[40%] left-[40%] w-[30rem] h-[30rem] bg-pink-200/30 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-slate-900/5 text-slate-600 border border-slate-900/5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Admin Console
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text tracking-tight">
              Dashboard
            </h1>
            <p className="text-lg text-slate-500 mt-2 font-medium">
              Manage your educational ecosystem.
            </p>
          </div>
          
          {/* Quick Stats or Status (Optional Visual Decoration) */}
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">System Status</span>
                <span className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full mt-1 border border-emerald-200">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   Operational
                </span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation (Glass Dock) */}
          <div className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 z-20">
            <div className="glass-panel p-2 rounded-2xl flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative group flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 min-w-[160px] lg:min-w-0
                      ${isActive 
                        ? "bg-white shadow-lg shadow-slate-200/50 text-slate-900 ring-1 ring-black/5" 
                        : "text-slate-500 hover:bg-white/40 hover:text-slate-900"
                      }
                    `}
                  >
                    {/* Active Indicator Dot */}
                    {isActive && (
                      <div className="absolute left-0 lg:-left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-800 rounded-r-full hidden lg:block" />
                    )}

                    <span className={`
                      p-2 rounded-lg transition-colors duration-300
                      ${isActive ? "bg-slate-100 text-slate-900" : "bg-transparent group-hover:bg-white/60"}
                    `}>
                      {tab.icon}
                    </span>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{tab.label}</span>
                      <span className={`text-[11px] transition-colors duration-300 ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                        {tab.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area (Glass Card) */}
          <div className="flex-1 w-full min-w-0">
            <div className="glass-panel min-h-[600px] p-1 rounded-[24px]">
              
              {/* Content Header inside Glass Card */}
              <div className="px-6 py-5 border-b border-slate-900/5 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {activeTabData?.icon}
                    {activeTabData?.label}
                 </h2>
                 <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                    <IoSettingsOutline className="w-5 h-5" />
                 </button>
              </div>

              {/* Dynamic Content */}
              <div className="p-6 md:p-8 animate-fadeIn">
                {activeTab === "subjects" && <SubjectManager />}
                {activeTab === "topics" && <TopicManager />}
                {activeTab === "ar" && <ARManager />}
                {activeTab === "seed" && <DataSeeder />}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        /* Glassmorphism Utility Class */
        .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.02),
            0 2px 4px -1px rgba(0, 0, 0, 0.02),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}