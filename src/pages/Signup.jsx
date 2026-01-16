import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoArrowForward, 
  IoAlertCircleOutline,
  IoPersonAddOutline 
} from "react-icons/io5";
import { AmbientBackground, GlassCard, Input, PrimaryButton, Alert } from "../components/ui/DesignSystem";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        email,
        preferredLanguage: "en",
        role: "learner",
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (err) {
      // Map Firebase error codes to user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setError("This email address is already in use.");
      } else if (err.code === 'auth/weak-password') {
        setError("The password provided is too weak.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
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
            <IoPersonAddOutline className="text-3xl text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Create Account</h2>
          <p className="mt-2 text-slate-500">Join us to start your learning journey today.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" icon={IoAlertCircleOutline} className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={signup} className="space-y-6">
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
          <Input
            type="password"
            label="Password"
            placeholder="Min 6 characters"
            icon={IoLockClosedOutline}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={password && password.length < 6 ? "Password must be at least 6 characters" : ""}
          />

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={isLoading}
            className="w-full mt-8"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Creating account...
              </span>
            ) : (
              <>
                Create Account
                <IoArrowForward className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </PrimaryButton>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="font-bold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
          >
            Log in here
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}