import Navbar from "../components/Navbar";

const subjects = [
  {
    title: "Physics",
    description: "Motion, energy, forces and laws of nature",
    icon: "⚛️",
  },
  {
    title: "Chemistry",
    description: "Atoms, molecules, reactions and compounds",
    icon: "🧪",
  },
  {
    title: "Biology",
    description: "Life, cells, human body and ecosystems",
    icon: "🧬",
  },
  {
    title: "Engineering",
    description: "Applied science and real-world problem solving",
    icon: "⚙️",
  },
];

export default function Subjects() {
  return (
    <>
      <Navbar />
      <div className="page">
        <h2>Subjects</h2>
        <p>Select a subject to start exploring topics.</p>

        <div className="subjects-grid">
          {subjects.map((sub, index) => (
            <div className="subject-card" key={index}>
              <div className="subject-icon">{sub.icon}</div>
              <h3>{sub.title}</h3>
              <p>{sub.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
