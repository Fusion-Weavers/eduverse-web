import { useState, useEffect } from "react";
import { IoBookOutline, IoGlassesOutline, IoLeafOutline, IoLibraryOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import TopicManager from "../components/admin/TopicManager";
import SubjectManager from "../components/admin/SubjectManager";
import DataSeeder from "../components/admin/DataSeeder";
import ARManager from "../components/admin/ARManager";
import "../components/admin/admin.css";

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
    { id: "subjects", label: "Subjects", icon: <IoLibraryOutline aria-hidden="true" /> },
    { id: "topics", label: "Topics", icon: <IoBookOutline aria-hidden="true" /> },
    { id: "ar", label: "AR Management", icon: <IoGlassesOutline aria-hidden="true" /> },
    { id: "seed", label: "Data Seeder", icon: <IoLeafOutline aria-hidden="true" /> }
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