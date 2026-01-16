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
      
      {/* Ambient Background Decorations */}
      <div className="absolute left-1/2 top-1/2 -z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-[100px]" />
      <div className="absolute left-0 top-0 -z-0 h-[300px] w-[300px] rounded-full bg-purple-300/20 blur-[80px]" />
      <div className="absolute bottom-0 right-0 -z-0 h-[400px] w-[400px] rounded-full bg-blue-200/20 blur-[80px]" />

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
        
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
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600 backdrop-blur-sm animate-fadeIn">
            <IoAlertCircleOutline className="mt-0.5 shrink-0 text-lg" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={login} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <IoMailOutline className="text-xl" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border-0 bg-slate-50/80 py-4 pl-12 pr-4 text-slate-900 shadow-inner ring-1 ring-slate-200/50 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:scale-[1.01]"
              />
            </div>
          </div>

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
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <IoLockClosedOutline className="text-xl" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border-0 bg-slate-50/80 py-4 pl-12 pr-4 text-slate-900 shadow-inner ring-1 ring-slate-200/50 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:scale-[1.01]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 mt-8"
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
          </button>
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
      </div>
    </div>
  );
}