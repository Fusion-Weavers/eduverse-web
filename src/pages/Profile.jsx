import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const [language, setLanguage] = useState("English");

  return (
    <>
      <Navbar />

      <div className="page">
        <h2>Profile</h2>
        <p>Manage your account and preferences</p>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user.email}</h3>
            <p className="muted">Student</p>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="profile-grid">
          {/* Account Info */}
          <div className="profile-card">
            <h4>Account Information</h4>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> Learner</p>
          </div>

          {/* Language Preference */}
          <div className="profile-card">
            <h4>Language Preference</h4>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
              <option>Tamil</option>
              <option>Telegu</option>
              <option>Urdu</option>
            </select>
            <p className="hint">
              Content will be shown in your selected language.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
