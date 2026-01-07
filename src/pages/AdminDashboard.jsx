import { useState, useEffect } from "react";
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
    { id: "subjects", label: "Subjects", icon: "📚" },
    { id: "topics", label: "Topics", icon: "📖" },
    { id: "ar", label: "AR Management", icon: "🥽" },
    { id: "seed", label: "Data Seeder", icon: "🌱" }
  ];

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage educational content and AR experiences</p>
        </div>

        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {activeTab === "subjects" && <SubjectManager />}
          {activeTab === "topics" && <TopicManager />}
          {activeTab === "ar" && <ARManager />}
          {activeTab === "seed" && <DataSeeder />}
        </div>
      </div>
    </div>
  );
}