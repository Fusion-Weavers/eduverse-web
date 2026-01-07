import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireEmailVerification = false }) {
  const { user, isAuthenticated, isEmailVerified, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && !isEmailVerified) {
    return (
      <div className="email-verification-required">
        <div className="verification-card">
          <h2>Email Verification Required</h2>
          <p>Please verify your email address to access this feature.</p>
          <p>Check your inbox for a verification email.</p>
        </div>
      </div>
    );
  }

  return children;
}
