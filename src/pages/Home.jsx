import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="page">
        <h1>Welcome to Eduverse</h1>
        <p>
          Learn STEM concepts in your preferred language with structured,
          easy-to-understand explanations.
        </p>

        {/* Prominent search interface */}
        <div className="home-search-section">
          <h2>Find What You're Looking For</h2>
          <SearchBar placeholder="Search subjects, topics, and concepts..." />
        </div>

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
