import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoMailUnreadOutline, IoShieldCheckmarkOutline, IoArrowForwardOutline } from "react-icons/io5";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, requireEmailVerification = false }) {
  const { user, isAuthenticated, isEmailVerified, loading } = useAuth();
  const location = useLocation();

  // --- 1. PREMIUM LOADING STATE ---
  if (loading) {
    return <LoadingSpinner overlay message="Securing Session..." />;
  }

  // --- 2. AUTH REDIRECT ---
  if (!isAuthenticated) {
    // Save the location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- 3. EMAIL VERIFICATION REQUIRED (Glass Card) ---
  if (requireEmailVerification && !isEmailVerified) {
    return (
      <div className="relative flex items-center justify-center min-h-[80vh] w-full p-6 overflow-hidden">
        {/* Ambient Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-400px h-400px bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 text-center">
          
          {/* Visual Icon Group */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-indigo-50 rounded-2rem rotate-12" />
            <div className="absolute inset-0 bg-white rounded-2rem shadow-sm border border-indigo-100 flex items-center justify-center text-4xl text-indigo-600 transition-transform duration-500 hover:rotate-0">
              <IoMailUnreadOutline />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-xl border-4 border-white">
              <IoShieldCheckmarkOutline />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
            Verification <span className="text-indigo-600">Required</span>
          </h2>
          
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            To maintain the security of your account, please verify your email address. We sent a link to <span className="text-slate-900 font-bold">{user?.email}</span>.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => window.open('https://mail.google.com', '_blank')}
              className="group w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-indigo-600 hover:-translate-y-1 active:scale-95"
            >
              Check Inbox
              <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              className="w-full py-4 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors uppercase tracking-widest"
              onClick={() => {/* Trigger resend logic here */}}
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. SUCCESS STATE ---
  return (
    <div className="animate-in fade-in duration-700">
      {children}
    </div>
  );
}