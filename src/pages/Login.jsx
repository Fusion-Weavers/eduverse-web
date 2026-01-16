import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoArrowForward, 
  IoAlertCircleOutline,
  IoFingerPrintOutline 
} from "react-icons/io5";
import { AmbientBackground, GlassCard, Input, PrimaryButton, Alert } from "../components/ui/DesignSystem";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields to continue.");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      // Simplify Firebase error messages for the UI
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 font-sans text-slate-900 overflow-hidden">
      <AmbientBackground />

      {/* Glass Card */}
      <GlassCard className="relative z-10 w-full max-w-md p-8 sm:p-10" hoverEffect={false}>
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5">
            <IoFingerPrintOutline className="text-3xl text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-slate-500">Enter your credentials to access your account.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" icon={IoAlertCircleOutline} className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={login} className="space-y-6">
          {/* Email Input */}
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            icon={IoMailOutline}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              icon={IoLockClosedOutline}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={isLoading}
            className="w-full mt-8"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Signing in...
              </span>
            ) : (
              <>
                Sign In
                <IoArrowForward className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </PrimaryButton>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <Link 
            to="/signup" 
            className="font-bold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
          >
            Create account
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}