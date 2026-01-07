import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email,
        preferredLanguage: "en",
        role: isAdmin ? "admin" : "learner",
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>Signup</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={signup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="admin-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <span className="checkmark"></span>
            Create as Admin Account
          </label>
          <p className="admin-note">
            Admin accounts can manage educational content and AR features
          </p>
        </div>

        <button type="submit">Create Account</button>
      </form>

      <div className="link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
