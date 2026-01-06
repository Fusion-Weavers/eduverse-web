import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="page">
  <h1>Welcome to Eduverse</h1>
  <p>
    Learn STEM concepts in your preferred language with structured,
    easy-to-understand explanations.
  </p>

  <div className="card">
    <h3>Get Started</h3>
    <p>
      Browse subjects, explore topics, and save your favorite concepts
      for quick revision.
    </p>
  </div>
</div>

    </>
  );
}
