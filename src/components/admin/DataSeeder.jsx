import { useState } from "react";
import { batchService } from "../../services/firestoreService";
import LoadingSpinner from "../LoadingSpinner";
import {
  IoBookOutline,
  IoDocumentTextOutline,
  IoGlassesOutline,
  IoLeafOutline,
  IoLibraryOutline
} from "react-icons/io5";
import { getSubjectIcon } from "../../utils/iconMap";

export default function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [seedProgress, setSeedProgress] = useState("");

  const seedData = {
    subjects: [
      {
        id: "physics",
        name: "Physics",
        description: "Study of matter, energy, and their interactions in the universe",
        icon: "physics",
        difficulty: "intermediate",
        languages: ["en"]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        description: "Science of atoms, molecules, and chemical reactions",
        icon: "chemistry",
        difficulty: "intermediate",
        languages: ["en"]
      },
      {
        id: "biology",
        name: "Biology",
        description: "Study of living organisms and life processes",
        icon: "biology",
        difficulty: "beginner",
        languages: ["en"]
      },
      {
        id: "engineering",
        name: "Engineering",
        description: "Application of science and mathematics to solve real-world problems",
        icon: "engineering",
        difficulty: "advanced",
        languages: ["en"]
      }
    ],

    topics: [
      // ================= PHYSICS TOPICS (12) =================
      {
        id: "classical-mechanics",
        name: "Classical Mechanics",
        description: "Motion, forces, and energy in macroscopic systems",
        subjectName: "Physics",
        difficulty: "beginner",
        estimatedTime: 45,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "thermodynamics",
        name: "Thermodynamics",
        description: "Heat, temperature, and energy transfer systems",
        subjectName: "Physics",
        difficulty: "intermediate",
        estimatedTime: 60,
        prerequisites: ["Classical Mechanics"],
        languages: ["en"]
      },
      {
        id: "electromagnetism",
        name: "Electromagnetism",
        description: "Electric and magnetic fields and their interactions",
        subjectName: "Physics",
        difficulty: "advanced",
        estimatedTime: 90,
        prerequisites: ["Classical Mechanics"],
        languages: ["en"]
      },
      {
        id: "optics",
        name: "Optics",
        description: "The behavior and properties of light",
        subjectName: "Physics",
        difficulty: "intermediate",
        estimatedTime: 50,
        prerequisites: ["Electromagnetism"],
        languages: ["en"]
      },
      {
        id: "fluid-dynamics",
        name: "Fluid Dynamics",
        description: "Flow of liquids and gases",
        subjectName: "Physics",
        difficulty: "intermediate",
        estimatedTime: 55,
        prerequisites: ["Classical Mechanics"],
        languages: ["en"]
      },
      {
        id: "quantum-mechanics",
        name: "Quantum Mechanics",
        description: "Physics of the very small (atoms and subatomic particles)",
        subjectName: "Physics",
        difficulty: "advanced",
        estimatedTime: 120,
        prerequisites: ["Electromagnetism", "Optics"],
        languages: ["en"]
      },
      {
        id: "relativity",
        name: "Relativity",
        description: "Space, time, and gravity at high speeds and massive scales",
        subjectName: "Physics",
        difficulty: "advanced",
        estimatedTime: 100,
        prerequisites: ["Classical Mechanics"],
        languages: ["en"]
      },
      {
        id: "acoustics",
        name: "Acoustics",
        description: "The physics of sound and vibration",
        subjectName: "Physics",
        difficulty: "beginner",
        estimatedTime: 40,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "nuclear-physics",
        name: "Nuclear Physics",
        description: "Constituents and interactions of atomic nuclei",
        subjectName: "Physics",
        difficulty: "advanced",
        estimatedTime: 80,
        prerequisites: ["Quantum Mechanics"],
        languages: ["en"]
      },
      {
        id: "astrophysics",
        name: "Astrophysics",
        description: "Physics of stars, galaxies, and the universe",
        subjectName: "Physics",
        difficulty: "intermediate",
        estimatedTime: 70,
        prerequisites: ["Classical Mechanics", "Thermodynamics"],
        languages: ["en"]
      },
      {
        id: "particle-physics",
        name: "Particle Physics",
        description: "The nature of particles that constitute matter and radiation",
        subjectName: "Physics",
        difficulty: "advanced",
        estimatedTime: 95,
        prerequisites: ["Quantum Mechanics"],
        languages: ["en"]
      },
      {
        id: "solid-state-physics",
        name: "Solid State Physics",
        description: "Properties of rigid matter and crystalline structures",
        subjectName: "Physics",
        difficulty: "advanced",
        estimatedTime: 85,
        prerequisites: ["Quantum Mechanics", "Thermodynamics"],
        languages: ["en"]
      },

      // ================= CHEMISTRY TOPICS (12) =================
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        description: "Protons, neutrons, electrons, and orbitals",
        subjectName: "Chemistry",
        difficulty: "beginner",
        estimatedTime: 30,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "periodic-trends",
        name: "Periodic Trends",
        description: "Patterns in the periodic table of elements",
        subjectName: "Chemistry",
        difficulty: "beginner",
        estimatedTime: 35,
        prerequisites: ["Atomic Structure"],
        languages: ["en"]
      },
      {
        id: "chemical-bonding",
        name: "Chemical Bonding",
        description: "Ionic, covalent, and metallic bonds",
        subjectName: "Chemistry",
        difficulty: "intermediate",
        estimatedTime: 50,
        prerequisites: ["Atomic Structure", "Periodic Trends"],
        languages: ["en"]
      },
      {
        id: "stoichiometry",
        name: "Stoichiometry",
        description: "Calculating reactants and products in chemical reactions",
        subjectName: "Chemistry",
        difficulty: "intermediate",
        estimatedTime: 60,
        prerequisites: ["Chemical Bonding"],
        languages: ["en"]
      },
      {
        id: "states-of-matter",
        name: "States of Matter",
        description: "Gases, liquids, solids, and phase changes",
        subjectName: "Chemistry",
        difficulty: "beginner",
        estimatedTime: 40,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "chemical-kinetics",
        name: "Chemical Kinetics",
        description: "Rates of chemical reactions and mechanisms",
        subjectName: "Chemistry",
        difficulty: "advanced",
        estimatedTime: 75,
        prerequisites: ["Stoichiometry"],
        languages: ["en"]
      },
      {
        id: "chemical-equilibrium",
        name: "Chemical Equilibrium",
        description: "Reversible reactions and dynamic balance",
        subjectName: "Chemistry",
        difficulty: "advanced",
        estimatedTime: 80,
        prerequisites: ["Chemical Kinetics"],
        languages: ["en"]
      },
      {
        id: "acids-and-bases",
        name: "Acids and Bases",
        description: "pH, pOH, titrations, and buffer systems",
        subjectName: "Chemistry",
        difficulty: "intermediate",
        estimatedTime: 55,
        prerequisites: ["Chemical Equilibrium"],
        languages: ["en"]
      },
      {
        id: "organic-chemistry",
        name: "Organic Chemistry",
        description: "Carbon-based compounds and functional groups",
        subjectName: "Chemistry",
        difficulty: "advanced",
        estimatedTime: 120,
        prerequisites: ["Chemical Bonding"],
        languages: ["en"]
      },
      {
        id: "electrochemistry",
        name: "Electrochemistry",
        description: "Chemical processes that cause electrons to move",
        subjectName: "Chemistry",
        difficulty: "advanced",
        estimatedTime: 70,
        prerequisites: ["Stoichiometry"],
        languages: ["en"]
      },
      {
        id: "thermochemistry",
        name: "Thermochemistry",
        description: "Energy and heat changes in chemical reactions",
        subjectName: "Chemistry",
        difficulty: "intermediate",
        estimatedTime: 45,
        prerequisites: ["Stoichiometry"],
        languages: ["en"]
      },
      {
        id: "polymer-chemistry",
        name: "Polymer Chemistry",
        description: "Synthesis and properties of macromolecules",
        subjectName: "Chemistry",
        difficulty: "intermediate",
        estimatedTime: 55,
        prerequisites: ["Organic Chemistry"],
        languages: ["en"]
      },

      // ================= BIOLOGY TOPICS (12) =================
      {
        id: "cell-biology",
        name: "Cell Biology",
        description: "Structure and function of the basic unit of life",
        subjectName: "Biology",
        difficulty: "beginner",
        estimatedTime: 40,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "genetics",
        name: "Genetics",
        description: "Heredity, DNA, and gene expression",
        subjectName: "Biology",
        difficulty: "intermediate",
        estimatedTime: 70,
        prerequisites: ["Cell Biology"],
        languages: ["en"]
      },
      {
        id: "evolution",
        name: "Evolution",
        description: "Natural selection and the history of life",
        subjectName: "Biology",
        difficulty: "intermediate",
        estimatedTime: 60,
        prerequisites: ["Genetics"],
        languages: ["en"]
      },
      {
        id: "ecology",
        name: "Ecology",
        description: "Interactions between organisms and their environment",
        subjectName: "Biology",
        difficulty: "beginner",
        estimatedTime: 45,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "human-anatomy",
        name: "Human Anatomy",
        description: "Structure of the human body systems",
        subjectName: "Biology",
        difficulty: "intermediate",
        estimatedTime: 90,
        prerequisites: ["Cell Biology"],
        languages: ["en"]
      },
      {
        id: "plant-biology",
        name: "Plant Biology",
        description: "Botany, photosynthesis, and plant structure",
        subjectName: "Biology",
        difficulty: "intermediate",
        estimatedTime: 50,
        prerequisites: ["Cell Biology"],
        languages: ["en"]
      },
      {
        id: "microbiology",
        name: "Microbiology",
        description: "Study of bacteria, viruses, and fungi",
        subjectName: "Biology",
        difficulty: "advanced",
        estimatedTime: 65,
        prerequisites: ["Cell Biology"],
        languages: ["en"]
      },
      {
        id: "biochemistry",
        name: "Biochemistry",
        description: "Chemical processes within and related to living organisms",
        subjectName: "Biology",
        difficulty: "advanced",
        estimatedTime: 100,
        prerequisites: ["Cell Biology"],
        languages: ["en"]
      },
      {
        id: "immunology",
        name: "Immunology",
        description: "The immune system and defense mechanisms",
        subjectName: "Biology",
        difficulty: "advanced",
        estimatedTime: 80,
        prerequisites: ["Human Anatomy", "Microbiology"],
        languages: ["en"]
      },
      {
        id: "biotechnology",
        name: "Biotechnology",
        description: "Using biological systems for technological applications",
        subjectName: "Biology",
        difficulty: "advanced",
        estimatedTime: 75,
        prerequisites: ["Genetics", "Biochemistry"],
        languages: ["en"]
      },
      {
        id: "physiology",
        name: "Physiology",
        description: "Functions and mechanisms of living systems",
        subjectName: "Biology",
        difficulty: "intermediate",
        estimatedTime: 85,
        prerequisites: ["Human Anatomy"],
        languages: ["en"]
      },
      {
        id: "molecular-biology",
        name: "Molecular Biology",
        description: "Molecular basis of biological activity",
        subjectName: "Biology",
        difficulty: "advanced",
        estimatedTime: 90,
        prerequisites: ["Genetics", "Biochemistry"],
        languages: ["en"]
      },

      // ================= ENGINEERING TOPICS (12) =================
      {
        id: "structural-engineering",
        name: "Structural Engineering",
        description: "Analysis of loads and structural integrity",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 100,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "electrical-engineering",
        name: "Electrical Engineering",
        description: "Circuits, electronics, and power systems",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 110,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "mechanical-engineering",
        name: "Mechanical Engineering",
        description: "Machinery, mechanics, and thermodynamic systems",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 105,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "civil-engineering",
        name: "Civil Engineering",
        description: "Infrastructure, transport, and water systems",
        subjectName: "Engineering",
        difficulty: "intermediate",
        estimatedTime: 95,
        prerequisites: ["Structural Engineering"],
        languages: ["en"]
      },
      {
        id: "software-engineering",
        name: "Software Engineering",
        description: "Design, development, and maintenance of software",
        subjectName: "Engineering",
        difficulty: "intermediate",
        estimatedTime: 85,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "aerospace-engineering",
        name: "Aerospace Engineering",
        description: "Aircraft and spacecraft design",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 120,
        prerequisites: ["Mechanical Engineering"],
        languages: ["en"]
      },
      {
        id: "materials-science",
        name: "Materials Science",
        description: "Properties and applications of engineering materials",
        subjectName: "Engineering",
        difficulty: "intermediate",
        estimatedTime: 70,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "robotics",
        name: "Robotics",
        description: "Design and operation of robots and automation",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 90,
        prerequisites: ["Electrical Engineering", "Software Engineering"],
        languages: ["en"]
      },
      {
        id: "chemical-engineering",
        name: "Chemical Engineering",
        description: "Industrial chemical processes and plant design",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 115,
        prerequisites: [],
        languages: ["en"]
      },
      {
        id: "environmental-engineering",
        name: "Environmental Engineering",
        description: "Waste management and sustainable design",
        subjectName: "Engineering",
        difficulty: "intermediate",
        estimatedTime: 65,
        prerequisites: ["Civil Engineering"],
        languages: ["en"]
      },
      {
        id: "biomedical-engineering",
        name: "Biomedical Engineering",
        description: "Application of engineering principles to medicine and biology",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 90,
        prerequisites: ["Materials Science"],
        languages: ["en"]
      },
      {
        id: "computer-engineering",
        name: "Computer Engineering",
        description: "Integration of computer science and electronic engineering",
        subjectName: "Engineering",
        difficulty: "advanced",
        estimatedTime: 100,
        prerequisites: ["Electrical Engineering", "Software Engineering"],
        languages: ["en"]
      }
    ],

    concepts: [
      // ================= CLASSICAL MECHANICS =================
      {
        id: "newtons-laws-of-motion",
        title: "Newton's Laws of Motion",
        topicName: "Classical Mechanics",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Newton's Laws of Motion",
            body: "**First Law:** Inertia. Objects retain their state of motion unless acted upon.\n**Second Law:** F=ma. Force equals mass times acceleration.\n**Third Law:** Action/Reaction. Every force has an equal and opposite counter-force.",
            summary: "The three fundamental laws that govern motion in the universe.",
            examples: ["Rocket launch (3rd law)", "Seatbelts (1st law)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "conservation-of-momentum",
        title: "Conservation of Momentum",
        topicName: "Classical Mechanics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Conservation of Momentum",
            body: "In a closed system with no external forces, the total momentum remains constant. This applies to collisions and explosions.",
            summary: "Momentum is never lost, only transferred between objects.",
            examples: ["Billiard balls colliding", "Recoil of a gun"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "work-and-energy",
        title: "Work and Energy",
        topicName: "Classical Mechanics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Work and Energy",
            body: "Work is done when a force moves an object. Energy is the capacity to do work, existing in forms like Kinetic (motion) and Potential (stored).",
            summary: "The relationship between applying force and transferring energy.",
            examples: ["Lifting a weight", "A moving car"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "rotational-motion-torque",
        title: "Rotational Motion & Torque",
        topicName: "Classical Mechanics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Rotational Motion & Torque",
            body: "Torque is the rotational equivalent of force. It depends on the magnitude of the force and the distance from the pivot point (lever arm).",
            summary: "How forces cause objects to rotate.",
            examples: ["Opening a door", "Using a wrench"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "universal-gravitation",
        title: "Universal Gravitation",
        topicName: "Classical Mechanics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Universal Gravitation",
            body: "Every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between them.",
            summary: "The force that keeps planets in orbit and feet on the ground.",
            examples: ["Earth orbiting the Sun", "Tides"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= THERMODYNAMICS =================
      {
        id: "the-laws-of-thermodynamics",
        title: "The Laws of Thermodynamics",
        topicName: "Thermodynamics",
        difficulty: "intermediate",
        estimatedReadTime: 20,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "The Laws of Thermodynamics",
            body: "0th: Thermal Equilibrium. 1st: Energy Conservation. 2nd: Entropy increases. 3rd: Absolute zero is unattainable.",
            summary: "The four fundamental rules governing heat and energy.",
            examples: ["Perpetual motion is impossible", "Heat flows from hot to cold"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "entropy-and-disorder",
        title: "Entropy and Disorder",
        topicName: "Thermodynamics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Entropy and Disorder",
            body: "Entropy is a measure of the disorder or randomness in a system. The Second Law states that the total entropy of an isolated system can never decrease.",
            summary: "Why time moves forward and things tend to break down.",
            examples: ["Melting ice", "Mixing dye in water"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "heat-transfer-mechanisms",
        title: "Heat Transfer Mechanisms",
        topicName: "Thermodynamics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Heat Transfer Mechanisms",
            body: "**Conduction:** Direct contact. **Convection:** Fluid movement. **Radiation:** Electromagnetic waves.",
            summary: "How thermal energy moves from one place to another.",
            examples: ["Touching a hot pan", "Sunlight warming Earth"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-carnot-cycle",
        title: "The Carnot Cycle",
        topicName: "Thermodynamics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "The Carnot Cycle",
            body: "A theoretical ideal thermodynamic cycle that provides the maximum possible efficiency for a heat engine operating between two temperatures.",
            summary: "The theoretical limit of engine efficiency.",
            examples: ["Ideal heat engines", "Refrigerators"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "ideal-gas-law",
        title: "Ideal Gas Law",
        topicName: "Thermodynamics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Ideal Gas Law",
            body: "PV = nRT. Relates Pressure, Volume, and Temperature of a hypothetical ideal gas.",
            summary: "Predicting how gases behave under different conditions.",
            examples: ["Inflating a balloon", "Pressure cookers"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ELECTROMAGNETISM =================
      {
        id: "coulombs-law",
        title: "Coulomb's Law",
        topicName: "Electromagnetism",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Coulomb's Law",
            body: "Like charges repel, opposite charges attract. The force is inversely proportional to the square of the distance between them.",
            summary: "The fundamental rule of electric force.",
            examples: ["Static electricity", "Atomic structure"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "electromagnetic-induction",
        title: "Electromagnetic Induction",
        topicName: "Electromagnetism",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Electromagnetic Induction",
            body: "A changing magnetic field creates an electric current in a conductor. This is the principle behind generators.",
            summary: "Turning magnetism into electricity.",
            examples: ["Electric generators", "Transformers"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "maxwells-equations",
        title: "Maxwell's Equations",
        topicName: "Electromagnetism",
        difficulty: "advanced",
        estimatedReadTime: 25,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Maxwell's Equations",
            body: "Four equations that describe how electric and magnetic fields are generated and altered by each other and by charges and currents.",
            summary: "The unified theory of electricity and magnetism.",
            examples: ["Light propagation", "Radio waves"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "electric-circuits-ohms-law",
        title: "Electric Circuits (Ohm's Law)",
        topicName: "Electromagnetism",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Electric Circuits (Ohm's Law)",
            body: "V = IR. Voltage equals Current times Resistance. Describes the flow of electricity through a circuit.",
            summary: "The basics of powering electronics.",
            examples: ["Light bulbs", "Battery power"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "lorentz-force",
        title: "Lorentz Force",
        topicName: "Electromagnetism",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Lorentz Force",
            body: "The force exerted on a charged particle moving through electric and magnetic fields.",
            summary: "How magnetic fields steer moving charges.",
            examples: ["CRT Monitors", "Particle Accelerators"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= OPTICS =================
      {
        id: "reflection-and-refraction",
        title: "Reflection and Refraction",
        topicName: "Optics",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Reflection and Refraction",
            body: "Reflection is light bouncing off a surface. Refraction is light bending as it passes between materials (Snell's Law).",
            summary: "How light interacts with surfaces and materials.",
            examples: ["Mirrors", "Straw looking bent in water"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "lenses-and-mirrors",
        title: "Lenses and Mirrors",
        topicName: "Optics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Lenses and Mirrors",
            body: "Concave and convex shapes can converge or diverge light to form images. Used in telescopes, microscopes, and glasses.",
            summary: "Manipulating light to see better.",
            examples: ["Eyeglasses", "Telescopes"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "diffraction-and-interference",
        title: "Diffraction and Interference",
        topicName: "Optics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Diffraction and Interference",
            body: "Light behaves as a wave, bending around obstacles (diffraction) and combining to form patterns (interference).",
            summary: "Evidence for the wave nature of light.",
            examples: ["Double-slit experiment", "Oil slick rainbows"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "polarization",
        title: "Polarization",
        topicName: "Optics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Polarization",
            body: "Filtering light waves so they oscillate in a single plane. Useful for reducing glare.",
            summary: "Structuring the orientation of light waves.",
            examples: ["Sunglasses", "LCD screens"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "fiber-optics",
        title: "Fiber Optics",
        topicName: "Optics",
        difficulty: "intermediate",
        estimatedReadTime: 14,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Fiber Optics",
            body: "Using 'Total Internal Reflection' to trap light inside a glass cable, allowing it to travel long distances without loss.",
            summary: "How the internet travels via light.",
            examples: ["Internet cables", "Endoscopes"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= FLUID DYNAMICS =================
      {
        id: "bernoullis-principle",
        title: "Bernoulli's Principle",
        topicName: "Fluid Dynamics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Bernoulli's Principle",
            body: "As the speed of a fluid increases, its pressure decreases. This principle explains aerodynamic lift.",
            summary: "Why airplanes fly.",
            examples: ["Airplane wings", "Curveballs in baseball"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "archimedes-principle",
        title: "Archimedes' Principle",
        topicName: "Fluid Dynamics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Archimedes' Principle",
            body: "The buoyant force on a submerged object is equal to the weight of the fluid it displaces.",
            summary: "Why huge metal ships float.",
            examples: ["Boats", "Hot air balloons"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "viscosity",
        title: "Viscosity",
        topicName: "Fluid Dynamics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "video",
        content: {
          en: {
            title: "Viscosity",
            body: "A measure of a fluid's resistance to flow. Honey has high viscosity; water has low viscosity.",
            summary: "How 'thick' or 'runny' a liquid is.",
            examples: ["Honey vs. Water", "Motor oil grades"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "pascals-law",
        title: "Pascal's Law",
        topicName: "Fluid Dynamics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Pascal's Law",
            body: "Pressure applied to a confined fluid is transmitted undiminished in every direction.",
            summary: "The physics behind hydraulic machines.",
            examples: ["Hydraulic brakes", "Car lifts"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "laminar-vs-turbulent-flow",
        title: "Laminar vs. Turbulent Flow",
        topicName: "Fluid Dynamics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Laminar vs. Turbulent Flow",
            body: "Laminar flow is smooth and orderly. Turbulent flow is chaotic and mixing. The Reynolds number predicts which will occur.",
            summary: "The two main types of fluid motion.",
            examples: ["Smoke rising", "Whitewater rapids"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= QUANTUM MECHANICS =================
      {
        id: "wave-particle-duality",
        title: "Wave-Particle Duality",
        topicName: "Quantum Mechanics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Wave-Particle Duality",
            body: "Matter and light exhibit behaviors of both waves and particles, depending on how they are measured.",
            summary: "Light is both a particle and a wave.",
            examples: ["Photoelectric effect", "Electron diffraction"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "heisenberg-uncertainty-principle",
        title: "Heisenberg Uncertainty Principle",
        topicName: "Quantum Mechanics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Heisenberg Uncertainty Principle",
            body: "It is impossible to know both the position and momentum of a particle with perfect precision simultaneously.",
            summary: "The fundamental limit of knowledge in nature.",
            examples: ["Electron position", "Quantum tunneling"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "schrodingers-cat",
        title: "Schrödinger's Cat",
        topicName: "Quantum Mechanics",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Schrödinger's Cat",
            body: "A thought experiment illustrating quantum superposition, where a system exists in all possible states until observed.",
            summary: "Being dead and alive at the same time.",
            examples: ["Superposition", "Quantum computing bits"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "quantum-entanglement",
        title: "Quantum Entanglement",
        topicName: "Quantum Mechanics",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Quantum Entanglement",
            body: "Pairs of particles become linked such that the state of one instantly affects the other, regardless of distance.",
            summary: "Spooky action at a distance.",
            examples: ["Quantum cryptography", "Teleportation experiments"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "quantum-tunneling",
        title: "Quantum Tunneling",
        topicName: "Quantum Mechanics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Quantum Tunneling",
            body: "Particles can pass through energy barriers they shouldn't be able to cross according to classical physics.",
            summary: "Walking through walls at the atomic level.",
            examples: ["Sun's fusion", "Scanning Tunneling Microscopes"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= RELATIVITY =================
      {
        id: "special-relativity-time-dilation",
        title: "Special Relativity: Time Dilation",
        topicName: "Relativity",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Special Relativity: Time Dilation",
            body: "Time moves slower for objects moving at high speeds relative to an observer. The faster you go, the slower you age.",
            summary: "Moving clocks run slow.",
            examples: ["GPS satellite correction", "Twin paradox"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "length-contraction",
        title: "Length Contraction",
        topicName: "Relativity",
        difficulty: "advanced",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Length Contraction",
            body: "Objects moving at relativistic speeds appear shorter in the direction of motion to a stationary observer.",
            summary: "Fast objects get squashed.",
            examples: ["Relativistic trains", "Muon decay atmosphere"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "mass-energy-equivalence",
        title: "Mass-Energy Equivalence",
        topicName: "Relativity",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Mass-Energy Equivalence",
            body: "E=mc². Mass and energy are interchangeable. A small amount of mass can be converted into a massive amount of energy.",
            summary: "Matter is frozen energy.",
            examples: ["Nuclear bombs", "Stars shining"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "general-relativity-spacetime",
        title: "General Relativity: Spacetime",
        topicName: "Relativity",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "General Relativity: Spacetime",
            body: "Gravity is not a force, but a curvature of the 4D fabric of spacetime caused by mass and energy.",
            summary: "Mass tells space how to curve; space tells matter how to move.",
            examples: ["Orbit of Mercury", "Bending of light by stars"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "black-holes",
        title: "Black Holes",
        topicName: "Relativity",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Black Holes",
            body: "Regions of spacetime where gravity is so strong that nothing, not even light, can escape the event horizon.",
            summary: "The ultimate gravitational trap.",
            examples: ["Sagittarius A*", "Cygnus X-1"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ACOUSTICS =================
      {
        id: "nature-of-sound-waves",
        title: "Nature of Sound Waves",
        topicName: "Acoustics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Nature of Sound Waves",
            body: "Sound is a longitudinal wave created by vibrating objects, requiring a medium (air, water) to travel.",
            summary: "How sound moves through air.",
            examples: ["Speaker cones", "Vocal cords"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-doppler-effect",
        title: "The Doppler Effect",
        topicName: "Acoustics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "The Doppler Effect",
            body: "The change in frequency of a wave in relation to an observer who is moving relative to the wave source.",
            summary: "Why a passing siren changes pitch.",
            examples: ["Ambulance siren", "Red shift in stars"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "resonance",
        title: "Resonance",
        topicName: "Acoustics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Resonance",
            body: "When an object is forced to vibrate at its natural frequency, the amplitude increases dramatically.",
            summary: "Breaking glass with your voice.",
            examples: ["Tacoma Narrows Bridge", "Musical instruments"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "decibels-and-loudness",
        title: "Decibels and Loudness",
        topicName: "Acoustics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Decibels and Loudness",
            body: "The decibel (dB) is a logarithmic unit used to express the ratio of two values of a physical quantity, often power or intensity.",
            summary: "Measuring sound intensity.",
            examples: ["Whisper (30dB)", "Jet engine (140dB)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "harmonics-and-overtones",
        title: "Harmonics and Overtones",
        topicName: "Acoustics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Harmonics and Overtones",
            body: "A fundamental frequency accompanied by higher frequency multiples. This gives instruments their unique 'timbre'.",
            summary: "Why a piano sounds different from a violin.",
            examples: ["Guitar strings", "Flutes"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= NUCLEAR PHYSICS =================
      {
        id: "radioactive-decay",
        title: "Radioactive Decay",
        topicName: "Nuclear Physics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Radioactive Decay",
            body: "Unstable atomic nuclei lose energy by radiation. Types include Alpha (helium nucleus), Beta (electron), and Gamma (photon).",
            summary: "Atoms breaking down over time.",
            examples: ["Carbon dating", "Uranium decay"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "nuclear-fission",
        title: "Nuclear Fission",
        topicName: "Nuclear Physics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Nuclear Fission",
            body: "The splitting of a heavy nucleus into lighter nuclei, releasing massive amounts of energy.",
            summary: "Splitting the atom.",
            examples: ["Nuclear power plants", "Atomic bombs"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "nuclear-fusion",
        title: "Nuclear Fusion",
        topicName: "Nuclear Physics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Nuclear Fusion",
            body: "Combining light nuclei to form heavier ones. This powers stars but requires extreme temperature and pressure.",
            summary: "The power source of the Sun.",
            examples: ["The Sun", "Fusion reactors (ITER)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "half-life",
        title: "Half-Life",
        topicName: "Nuclear Physics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Half-Life",
            body: "The time required for half of the radioactive atoms in a sample to decay.",
            summary: "Predicting radioactive lifespan.",
            examples: ["Carbon-14 (5730 years)", "Medical tracers"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "binding-energy",
        title: "Binding Energy",
        topicName: "Nuclear Physics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Binding Energy",
            body: "The energy required to disassemble a nucleus into its protons and neutrons. Higher binding energy means a more stable nucleus.",
            summary: "What holds the nucleus together.",
            examples: ["Iron-56 stability", "Mass defect"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ASTROPHYSICS =================
      {
        id: "life-cycle-of-stars",
        title: "Life Cycle of Stars",
        topicName: "Astrophysics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Life Cycle of Stars",
            body: "Stars form from nebulae, fuse hydrogen, expand into giants, and end as white dwarfs, neutron stars, or black holes.",
            summary: "Birth, life, and death of stars.",
            examples: ["Supernova", "Red Giant"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-big-bang-theory",
        title: "The Big Bang Theory",
        topicName: "Astrophysics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "The Big Bang Theory",
            body: "The prevailing cosmological model explaining the early development of the universe from a hot, dense state.",
            summary: "The origin of the universe.",
            examples: ["Expanding universe", "Cosmic background radiation"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "dark-matter-dark-energy",
        title: "Dark Matter & Dark Energy",
        topicName: "Astrophysics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Dark Matter & Dark Energy",
            body: "Invisible components of the universe. Dark matter holds galaxies together; dark energy accelerates expansion.",
            summary: "The 95% of the universe we can't see.",
            examples: ["Galaxy rotation curves", "Universe expansion rate"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "exoplanets",
        title: "Exoplanets",
        topicName: "Astrophysics",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Exoplanets",
            body: "Planets orbiting stars other than our Sun. Detected via transit photometry or radial velocity.",
            summary: "Worlds beyond our solar system.",
            examples: ["Kepler-186f", "Trappist-1 system"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "cosmic-microwave-background",
        title: "Cosmic Microwave Background",
        topicName: "Astrophysics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Cosmic Microwave Background",
            body: "The faint remnant radiation left over from the Big Bang, filling the universe in every direction.",
            summary: "The afterglow of creation.",
            examples: ["TV static (partial)", "CMB maps"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= PARTICLE PHYSICS =================
      {
        id: "the-standard-model",
        title: "The Standard Model",
        topicName: "Particle Physics",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "The Standard Model",
            body: "The theory describing three of the four known fundamental forces and classifying all known elementary particles.",
            summary: "The periodic table of subatomic particles.",
            examples: ["Quarks", "Leptons"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-higgs-boson",
        title: "The Higgs Boson",
        topicName: "Particle Physics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Higgs Boson",
            body: "A particle associated with the Higgs field, which gives mass to other fundamental particles.",
            summary: "The 'God particle' that grants mass.",
            examples: ["Large Hadron Collider discovery", "Mass generation"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "antimatter",
        title: "Antimatter",
        topicName: "Particle Physics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Antimatter",
            body: "Matter composed of antiparticles (e.g., antiprotons, positrons). Contact with normal matter causes mutual annihilation.",
            summary: "Mirror image matter.",
            examples: ["Positron Emission Tomography (PET)", "CERN traps"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "fundamental-forces",
        title: "Fundamental Forces",
        topicName: "Particle Physics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Fundamental Forces",
            body: "Gravity, Electromagnetism, Strong Nuclear, and Weak Nuclear. These forces govern all interactions in nature.",
            summary: "The four pillars of physics.",
            examples: ["Holding nuclei together (Strong)", "Radioactive decay (Weak)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "particle-accelerators",
        title: "Particle Accelerators",
        topicName: "Particle Physics",
        difficulty: "intermediate",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Particle Accelerators",
            body: "Machines that propel charged particles to high speeds using electromagnetic fields to study collision byproducts.",
            summary: "Smashing atoms to see what's inside.",
            examples: ["Large Hadron Collider (LHC)", "Cyclotrons"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= SOLID STATE PHYSICS =================
      {
        id: "crystal-lattices",
        title: "Crystal Lattices",
        topicName: "Solid State Physics",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Crystal Lattices",
            body: "The ordered, repeating arrangement of atoms in a solid material.",
            summary: "The geometric structure of solids.",
            examples: ["Salt crystals (Cubic)", "Diamond structure"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "semiconductors",
        title: "Semiconductors",
        topicName: "Solid State Physics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Semiconductors",
            body: "Materials with conductivity between conductors and insulators. Doping allows control of electron flow.",
            summary: "The foundation of modern electronics.",
            examples: ["Silicon chips", "Transistors"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "superconductivity",
        title: "Superconductivity",
        topicName: "Solid State Physics",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Superconductivity",
            body: "A phenomenon where a material conducts electricity with zero resistance at very low temperatures.",
            summary: "Perfect electrical flow.",
            examples: ["MRI machines", "Maglev trains"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "band-theory",
        title: "Band Theory",
        topicName: "Solid State Physics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Band Theory",
            body: "Describes the range of energy levels electrons can occupy (Valence Band) and jump to (Conduction Band).",
            summary: "Why metals conduct and wood doesn't.",
            examples: ["Band gap", "Insulators vs Conductors"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "ferromagnetism",
        title: "Ferromagnetism",
        topicName: "Solid State Physics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Ferromagnetism",
            body: "The mechanism by which certain materials (like iron) form permanent magnets through aligned electron spins.",
            summary: "How permanent magnets work.",
            examples: ["Refrigerator magnets", "Hard drives"],
            images: [], externalAssets: []
          }
        }
      },


      // ================= ATOMIC STRUCTURE =================
      {
        id: "the-bohr-model",
        title: "The Bohr Model",
        topicName: "Atomic Structure",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Bohr Model",
            body: "Proposed by Niels Bohr, this model depicts the atom as a small, positively charged nucleus surrounded by electrons that travel in circular orbits (energy levels) like planets around the sun.",
            summary: "Planetary model of the atom with discrete energy levels.",
            examples: ["Hydrogen atom spectrum", "Energy jumps"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "electron-configuration",
        title: "Electron Configuration",
        topicName: "Atomic Structure",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Electron Configuration",
            body: "The distribution of electrons of an atom or molecule in atomic or molecular orbitals. It follows the Aufbau principle, Pauli exclusion principle, and Hund's rule.",
            summary: "The address system for electrons in an atom.",
            examples: ["1s² 2s² 2p⁶", "Noble gas notation"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "quantum-numbers",
        title: "Quantum Numbers",
        topicName: "Atomic Structure",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Quantum Numbers",
            body: "Four numbers (n, l, ml, ms) that fully describe the state of an electron in an atom, defining its energy, shape, orientation, and spin.",
            summary: "Coordinates describing an electron's position and spin.",
            examples: ["Principal quantum number (n)", "Spin (ms)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "isotopes",
        title: "Isotopes",
        topicName: "Atomic Structure",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Isotopes",
            body: "Variants of a particular chemical element which differ in neutron number, and consequently in nucleon number. All isotopes of a given element have the same number of protons.",
            summary: "Same element, different weight.",
            examples: ["Carbon-12 vs Carbon-14", "Heavy water (Deuterium)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "atomic-orbitals",
        title: "Atomic Orbitals (s, p, d, f)",
        topicName: "Atomic Structure",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Atomic Orbitals",
            body: "Regions of space around the nucleus where there is a high probability of finding an electron. Shapes include spheres (s), dumbbells (p), and complex clovers (d, f).",
            summary: "The 3D shapes where electrons live.",
            examples: ["Spherical s-orbital", "Dumbbell p-orbital"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= PERIODIC TRENDS =================
      {
        id: "atomic-radius",
        title: "Atomic Radius",
        topicName: "Periodic Trends",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Atomic Radius",
            body: "A measure of the size of its atoms. Generally decreases across a period (left to right) and increases down a group (top to bottom).",
            summary: "How big an atom is.",
            examples: ["Francium (largest)", "Helium (smallest)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "ionization-energy",
        title: "Ionization Energy",
        topicName: "Periodic Trends",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Ionization Energy",
            body: "The energy required to remove an electron from a gaseous atom or ion. It generally increases across a period and decreases down a group.",
            summary: "How hard it is to steal an electron.",
            examples: ["High for Noble Gases", "Low for Alkali Metals"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "electronegativity",
        title: "Electronegativity",
        topicName: "Periodic Trends",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "chart",
        content: {
          en: {
            title: "Electronegativity",
            body: "A measure of the tendency of an atom to attract a bonding pair of electrons. Fluorine is the most electronegative element.",
            summary: "How greedy an atom is for electrons.",
            examples: ["Fluorine (4.0)", "Cesium (0.7)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "electron-affinity",
        title: "Electron Affinity",
        topicName: "Periodic Trends",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Electron Affinity",
            body: "The energy change that occurs when an electron is acquired by a neutral atom. It measures the attraction between the incoming electron and the nucleus.",
            summary: "Energy released when gaining an electron.",
            examples: ["Chlorine's high affinity", "Noble gases (positive affinity)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "metallic-character",
        title: "Metallic Character",
        topicName: "Periodic Trends",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Metallic Character",
            body: "The level of reactivity of a metal. Metals tend to lose electrons in chemical reactions. Metallic character increases down a group and decreases across a period.",
            summary: "How 'metal-like' an element behaves.",
            examples: ["Shiny surface", "Conductivity"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= CHEMICAL BONDING =================
      {
        id: "ionic-vs-covalent-bonds",
        title: "Ionic vs. Covalent Bonds",
        topicName: "Chemical Bonding",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Ionic vs. Covalent Bonds",
            body: "Ionic bonds involve the transfer of electrons (creating ions). Covalent bonds involve the sharing of electrons between atoms.",
            summary: "Stealing vs. Sharing electrons.",
            examples: ["NaCl (Ionic)", "H2O (Covalent)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "lewis-structures",
        title: "Lewis Structures",
        topicName: "Chemical Bonding",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Lewis Structures",
            body: "Diagrams that show the bonding between atoms of a molecule and the lone pairs of electrons that may exist in the molecule.",
            summary: "Drawing molecules with dots and lines.",
            examples: ["Methane (CH4)", "Ammonia (NH3)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "vsepr-theory",
        title: "VSEPR Theory",
        topicName: "Chemical Bonding",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "VSEPR Theory",
            body: "Valence Shell Electron Pair Repulsion theory predicts the geometry of individual molecules from the number of electron pairs surrounding their central atoms.",
            summary: "Why molecules have specific 3D shapes.",
            examples: ["Linear", "Tetrahedral"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "intermolecular-forces",
        title: "Intermolecular Forces",
        topicName: "Chemical Bonding",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Intermolecular Forces",
            body: "Forces of attraction between molecules, including Hydrogen bonding, Dipole-dipole interactions, and London dispersion forces.",
            summary: "The glue that holds liquids and solids together.",
            examples: ["Surface tension", "Water's high boiling point"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "hybridization",
        title: "Hybridization",
        topicName: "Chemical Bonding",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Hybridization",
            body: "The concept of mixing atomic orbitals into new hybrid orbitals (like sp, sp2, sp3) suitable for the pairing of electrons to form chemical bonds.",
            summary: "Mixing orbitals to make bonds fit.",
            examples: ["sp3 in Methane", "sp2 in Ethene"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= STOICHIOMETRY =================
      {
        id: "the-mole-concept",
        title: "The Mole Concept",
        topicName: "Stoichiometry",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "The Mole Concept",
            body: "A mole is a unit measuring the amount of substance. One mole contains exactly 6.022 × 10²³ elementary entities (Avogadro's number).",
            summary: "The chemist's dozen.",
            examples: ["1 mole of Carbon = 12g", "Avogadro's number"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "limiting-reactant",
        title: "Limiting Reactant",
        topicName: "Stoichiometry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Limiting Reactant",
            body: "The substance that is totally consumed when the chemical reaction is complete. The amount of product formed is limited by this reagent.",
            summary: "The ingredient you run out of first.",
            examples: ["Making sandwiches (bread vs cheese)", "Combustion limits"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "balancing-chemical-equations",
        title: "Balancing Chemical Equations",
        topicName: "Stoichiometry",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Balancing Chemical Equations",
            body: "Ensuring that the number of atoms for each element in the reaction and the total charge are the same for both the reactants and the products.",
            summary: "Conservation of mass in reactions.",
            examples: ["2H₂ + O₂ → 2H₂O", "Combustion of methane"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "percent-yield",
        title: "Percent Yield",
        topicName: "Stoichiometry",
        difficulty: "intermediate",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Percent Yield",
            body: "The ratio of the actual yield (what you got) to the theoretical yield (what math said you'd get), multiplied by 100.",
            summary: "Efficiency of a chemical reaction.",
            examples: ["Lab error calculations", "Industrial efficiency"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "molarity-and-solutions",
        title: "Molarity and Solutions",
        topicName: "Stoichiometry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Molarity and Solutions",
            body: "Molarity (M) is the concentration of a solution expressed as the number of moles of solute per liter of solution.",
            summary: "How strong a solution is.",
            examples: ["Diluting acids", "Saline solution"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= STATES OF MATTER =================
      {
        id: "phase-changes",
        title: "Phase Changes",
        topicName: "States of Matter",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Phase Changes",
            body: "Transitions between solid, liquid, gas, and plasma states. Includes melting, freezing, vaporization, condensation, sublimation, and deposition.",
            summary: "Transforming between states.",
            examples: ["Ice melting", "Dry ice sublimating"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "gas-laws",
        title: "Gas Laws (Boyle's & Charles's)",
        topicName: "States of Matter",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Gas Laws",
            body: "Boyle's Law: Pressure/Volume inverse relationship. Charles's Law: Volume/Temperature direct relationship.",
            summary: "Rules governing how gases behave.",
            examples: ["Syringes (Boyle's)", "Hot air balloons (Charles's)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "phase-diagrams",
        title: "Phase Diagrams",
        topicName: "States of Matter",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Phase Diagrams",
            body: "A graphical representation of the physical states of a substance under different conditions of temperature and pressure.",
            summary: "Map of states of matter.",
            examples: ["Triple point", "Critical point"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "crystalline-solids",
        title: "Crystalline Solids",
        topicName: "States of Matter",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Crystalline Solids",
            body: "Solids where atoms, ions, or molecules are arranged in an ordered and symmetrical pattern that is repeated over the entire crystal.",
            summary: "Highly ordered solid structures.",
            examples: ["Salt cubes", "Quartz"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "vapor-pressure",
        title: "Vapor Pressure",
        topicName: "States of Matter",
        difficulty: "advanced",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Vapor Pressure",
            body: "The pressure exerted by a vapor in thermodynamic equilibrium with its condensed phases (solid or liquid) at a given temperature in a closed system.",
            summary: "Tendency of a liquid to evaporate.",
            examples: ["Boiling point relation", "Volatile liquids"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= CHEMICAL KINETICS =================
      {
        id: "reaction-rates",
        title: "Reaction Rates",
        topicName: "Chemical Kinetics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Reaction Rates",
            body: "The speed at which reactants are converted into products. Influenced by concentration, surface area, and temperature.",
            summary: "How fast a reaction happens.",
            examples: ["Rusting iron (slow)", "Explosion (fast)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "collision-theory",
        title: "Collision Theory",
        topicName: "Chemical Kinetics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Collision Theory",
            body: "For a reaction to occur, particles must collide with the correct orientation and sufficient energy (activation energy).",
            summary: "Molecular bumper cars.",
            examples: ["Successful vs ineffective collisions"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "activation-energy",
        title: "Activation Energy",
        topicName: "Chemical Kinetics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Activation Energy",
            body: "The minimum amount of energy required to start a chemical reaction. It's like the 'hump' you need to get over.",
            summary: "The energy barrier to reaction.",
            examples: ["Lighting a match", "Enzymes lowering the barrier"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "catalysts",
        title: "Catalysts",
        topicName: "Chemical Kinetics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Catalysts",
            body: "Substances that increase the rate of a chemical reaction without itself undergoing any permanent chemical change.",
            summary: "Speeding up reactions without being used up.",
            examples: ["Catalytic converters", "Biological enzymes"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "rate-laws",
        title: "Rate Laws",
        topicName: "Chemical Kinetics",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Rate Laws",
            body: "Mathematical expressions that describe the relationship between the rate of a chemical reaction and the concentration of its reactants.",
            summary: "Calculating speed from concentration.",
            examples: ["First order reactions", "Half-life calculations"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= CHEMICAL EQUILIBRIUM =================
      {
        id: "dynamic-equilibrium",
        title: "Dynamic Equilibrium",
        topicName: "Chemical Equilibrium",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Dynamic Equilibrium",
            body: "A state where the forward and reverse reactions occur at the same rate, resulting in no net change in concentrations.",
            summary: "Balance in a reversible reaction.",
            examples: ["Closed soda bottle", "Saturated solution"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "le-chateliers-principle",
        title: "Le Chatelier's Principle",
        topicName: "Chemical Equilibrium",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Le Chatelier's Principle",
            body: "If a dynamic equilibrium is disturbed by changing the conditions, the position of equilibrium moves to counteract the change.",
            summary: "How systems react to stress.",
            examples: ["Adding pressure to gas", "Changing temperature"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-equilibrium-constant",
        title: "The Equilibrium Constant (K)",
        topicName: "Chemical Equilibrium",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "The Equilibrium Constant",
            body: "A number that expresses the relationship between the amounts of products and reactants present at equilibrium at a given temperature.",
            summary: "Quantifying the balance point.",
            examples: ["K > 1 favors products", "K < 1 favors reactants"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "solubility-product",
        title: "Solubility Product (Ksp)",
        topicName: "Chemical Equilibrium",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Solubility Product (Ksp)",
            body: "The equilibrium constant for a solid substance dissolving in an aqueous solution. It represents the level at which a solute dissolves in solution.",
            summary: "Predicting if a precipitate will form.",
            examples: ["Kidney stones", "Hard water scale"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "reaction-quotient",
        title: "Reaction Quotient (Q)",
        topicName: "Chemical Equilibrium",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Reaction Quotient (Q)",
            body: "Measures the relative amounts of products and reactants present at any given time. Comparing Q to K tells you which direction the reaction will shift.",
            summary: "Are we there yet? (Equilibrium check)",
            examples: ["Q < K shift right", "Q > K shift left"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ACIDS AND BASES =================
      {
        id: "the-ph-scale",
        title: "The pH Scale",
        topicName: "Acids and Bases",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "The pH Scale",
            body: "A logarithmic scale used to specify the acidity or basicity of an aqueous solution. 7 is neutral, <7 is acidic, >7 is basic.",
            summary: "Measuring acidity.",
            examples: ["Lemon juice (pH 2)", "Bleach (pH 12)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "bronsted-lowry-theory",
        title: "Bronsted-Lowry Theory",
        topicName: "Acids and Bases",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Bronsted-Lowry Theory",
            body: "Defines an acid as a proton (H+) donor and a base as a proton acceptor. This broadens the definition beyond just OH- groups.",
            summary: "Acids give protons; bases take them.",
            examples: ["HCl donating H+", "Ammonia accepting H+"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "strong-vs-weak-acids",
        title: "Strong vs. Weak Acids",
        topicName: "Acids and Bases",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Strong vs. Weak Acids",
            body: "Strong acids dissociate completely in water (releasing all H+). Weak acids only partially dissociate, establishing an equilibrium.",
            summary: "Complete vs. partial ionization.",
            examples: ["Sulfuric acid (Strong)", "Acetic acid (Weak)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "buffer-solutions",
        title: "Buffer Solutions",
        topicName: "Acids and Bases",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Buffer Solutions",
            body: "A solution that resists changes in pH when small amounts of acid or base are added. Crucial in biological systems.",
            summary: "Maintaining a stable pH.",
            examples: ["Blood plasma", "Fermentation"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "titration",
        title: "Titration",
        topicName: "Acids and Bases",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Titration",
            body: "A laboratory method to determine the concentration of an analyte. A reagent of known concentration (titrant) is reacted with the solution.",
            summary: "Finding unknown concentrations.",
            examples: ["Phenolphthalein indicator", "Neutralization"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ORGANIC CHEMISTRY =================
      {
        id: "hydrocarbons",
        title: "Alkanes, Alkenes, Alkynes",
        topicName: "Organic Chemistry",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Hydrocarbons",
            body: "The simplest organic compounds. Alkanes have single bonds, Alkenes have double bonds, and Alkynes have triple bonds between carbons.",
            summary: "The backbone of organic chemistry.",
            examples: ["Methane", "Ethylene", "Acetylene"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "functional-groups",
        title: "Functional Groups",
        topicName: "Organic Chemistry",
        difficulty: "intermediate",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "chart",
        content: {
          en: {
            title: "Functional Groups",
            body: "Specific groups of atoms within molecules that are responsible for the characteristic chemical reactions of those molecules.",
            summary: "The active parts of organic molecules.",
            examples: ["Alcohols (-OH)", "Carboxylic Acids (-COOH)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "isomerism",
        title: "Isomerism",
        topicName: "Organic Chemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Isomerism",
            body: "Compounds with the same molecular formula but different structural arrangements. Can be structural isomers or stereoisomers.",
            summary: "Same parts, different build.",
            examples: ["Butane vs Isobutane", "Chirality"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "aromatic-compounds",
        title: "Aromatic Compounds",
        topicName: "Organic Chemistry",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Aromatic Compounds",
            body: "Cyclic, planar compounds with delocalized pi electrons, often based on the benzene ring. They are unusually stable.",
            summary: "Benzene rings and resonance stability.",
            examples: ["Benzene", "Toluene"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "substitution-reactions",
        title: "Substitution Reactions (SN1/SN2)",
        topicName: "Organic Chemistry",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Substitution Reactions",
            body: "Mechanisms where one functional group is replaced by another. SN1 is a two-step process; SN2 is a one-step concerted process.",
            summary: "Swapping parts on a molecule.",
            examples: ["Synthesizing alcohols", "Backside attack"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ELECTROCHEMISTRY =================
      {
        id: "redox-reactions",
        title: "Redox Reactions",
        topicName: "Electrochemistry",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Redox Reactions",
            body: "Reduction-Oxidation reactions involve the transfer of electrons. Oxidation is loss of electrons; Reduction is gain of electrons (OIL RIG).",
            summary: "Electron exchange reactions.",
            examples: ["Rusting", "Combustion"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "galvanic-cells",
        title: "Galvanic (Voltaic) Cells",
        topicName: "Electrochemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Galvanic Cells",
            body: "Devices that convert chemical energy from spontaneous redox reactions into electrical energy. A battery is a galvanic cell.",
            summary: "Generating electricity from chemistry.",
            examples: ["AA Batteries", "Daniell Cell"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "electrolysis",
        title: "Electrolysis",
        topicName: "Electrochemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Electrolysis",
            body: "The process of using electrical energy to drive a non-spontaneous chemical reaction, often used to split compounds.",
            summary: "Using electricity to break bonds.",
            examples: ["Splitting water into H2 and O2", "Electroplating"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "standard-reduction-potentials",
        title: "Standard Reduction Potentials",
        topicName: "Electrochemistry",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Standard Reduction Potentials",
            body: "A measure of the tendency of a chemical species to acquire electrons and be reduced. Used to predict voltage.",
            summary: "Predicting battery voltage.",
            examples: ["E° values", "Zinc vs Copper"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-nernst-equation",
        title: "The Nernst Equation",
        topicName: "Electrochemistry",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "The Nernst Equation",
            body: "Relates the reduction potential of an electrochemical reaction to the standard electrode potential, temperature, and activities.",
            summary: "Calculating voltage under non-standard conditions.",
            examples: ["Dying batteries", "Concentration cells"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= THERMOCHEMISTRY =================
      {
        id: "enthalpy",
        title: "Enthalpy (H)",
        topicName: "Thermochemistry",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Enthalpy",
            body: "A thermodynamic quantity equivalent to the total heat content of a system. Change in enthalpy indicates if heat is absorbed or released.",
            summary: "Heat content of a system.",
            examples: ["ΔH", "Heat of combustion"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "endothermic-vs-exothermic",
        title: "Endothermic vs. Exothermic",
        topicName: "Thermochemistry",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Endothermic vs. Exothermic",
            body: "Exothermic reactions release heat (get hot). Endothermic reactions absorb heat (get cold).",
            summary: "Hot vs. Cold reactions.",
            examples: ["Hand warmers (Exo)", "Instant ice packs (Endo)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "hesss-law",
        title: "Hess's Law",
        topicName: "Thermochemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Hess's Law",
            body: "States that the total enthalpy change for a reaction is the same whether it occurs in one step or a series of steps.",
            summary: "Path independence of heat change.",
            examples: ["Calculating ΔH indirectly", "Energy cycles"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "calorimetry",
        title: "Calorimetry",
        topicName: "Thermochemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Calorimetry",
            body: "The science of measuring the heat change of chemical reactions or physical changes using a calorimeter.",
            summary: "Measuring heat flow.",
            examples: ["Coffee cup calorimeter", "Bomb calorimeter"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "gibbs-free-energy",
        title: "Gibbs Free Energy",
        topicName: "Thermochemistry",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Gibbs Free Energy",
            body: "A thermodynamic potential that measures the maximum or reversible work a system can perform. It predicts spontaneity.",
            summary: "Will the reaction happen spontaneously?",
            examples: ["ΔG < 0 (Spontaneous)", "Entropy vs Enthalpy"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= POLYMER CHEMISTRY =================
      {
        id: "introduction-to-polymers",
        title: "Introduction to Polymers",
        topicName: "Polymer Chemistry",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Introduction to Polymers",
            body: "Polymers are large molecules composed of many repeated subunits called monomers. They can be natural (DNA, protein) or synthetic (plastic).",
            summary: "Chains of repeating molecules.",
            examples: ["DNA", "Polystyrene"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "addition-polymerization",
        title: "Addition Polymerization",
        topicName: "Polymer Chemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Addition Polymerization",
            body: "A reaction where monomers add together without the loss of any small molecules. Typically involves breaking double bonds.",
            summary: "Linking monomers by opening bonds.",
            examples: ["Polyethylene (PE)", "PVC"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "condensation-polymerization",
        title: "Condensation Polymerization",
        topicName: "Polymer Chemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Condensation Polymerization",
            body: "A reaction where monomers join together with the loss of a small molecule, usually water or methanol.",
            summary: "Linking monomers by releasing water.",
            examples: ["Nylon", "Polyester"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "thermoplastics-vs-thermosets",
        title: "Thermoplastics vs. Thermosets",
        topicName: "Polymer Chemistry",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Thermoplastics vs. Thermosets",
            body: "Thermoplastics can be melted and reshaped. Thermosets harden permanently after curing and cannot be remelted.",
            summary: "Recyclable vs. Permanent plastics.",
            examples: ["LEGO bricks (Thermoplastic)", "Epoxy resin (Thermoset)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "cross-linking",
        title: "Cross-linking",
        topicName: "Polymer Chemistry",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Cross-linking",
            body: "Bonds that link one polymer chain to another. Cross-linking changes the physical properties, making materials stronger and more heat resistant.",
            summary: "Tying the chains together.",
            examples: ["Vulcanized rubber", "Slime"],
            images: [], externalAssets: []
          }
        }
      },


      // ================= CELL BIOLOGY =================
      {
        id: "prokaryotic-vs-eukaryotic-cells",
        title: "Prokaryotic vs. Eukaryotic Cells",
        topicName: "Cell Biology",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Prokaryotic vs. Eukaryotic Cells",
            body: "Prokaryotes (bacteria) lack a nucleus and membrane-bound organelles. Eukaryotes (plants, animals) have complex internal structures.",
            summary: "The two fundamental types of cells.",
            examples: ["Bacteria (Prokaryote)", "Human skin cell (Eukaryote)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "mitosis",
        title: "Mitosis",
        topicName: "Cell Biology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Mitosis",
            body: "The process of cell division where one cell splits into two identical daughter cells. Phases: Prophase, Metaphase, Anaphase, Telophase.",
            summary: "How body cells replicate.",
            examples: ["Skin healing", "Growth"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-cell-membrane",
        title: "The Cell Membrane",
        topicName: "Cell Biology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Cell Membrane",
            body: "A fluid mosaic phospholipid bilayer that controls what enters and exits the cell using transport proteins.",
            summary: "The cell's security guard.",
            examples: ["Active transport", "Osmosis"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "cellular-respiration",
        title: "Cellular Respiration",
        topicName: "Cell Biology",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Cellular Respiration",
            body: "The metabolic process in mitochondria that converts glucose into ATP (energy). C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP.",
            summary: "How cells generate energy.",
            examples: ["Aerobic respiration", "Krebs cycle"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "meiosis",
        title: "Meiosis",
        topicName: "Cell Biology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Meiosis",
            body: "Cell division that produces reproductive cells (gametes) with half the number of chromosomes.",
            summary: "Making sperm and eggs.",
            examples: ["Sexual reproduction", "Genetic variation"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= GENETICS =================
      {
        id: "dna-structure",
        title: "DNA Structure",
        topicName: "Genetics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "DNA Structure",
            body: "The double helix composed of nucleotides (Adenine, Thymine, Cytosine, Guanine). A pairs with T, C pairs with G.",
            summary: "The blueprint of life.",
            examples: ["Watson & Crick model", "Chromosomes"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "mendelian-inheritance",
        title: "Mendelian Inheritance",
        topicName: "Genetics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Mendelian Inheritance",
            body: "Laws of heredity discovered by Gregor Mendel. Traits are dominant or recessive. Punnett squares predict offspring probability.",
            summary: "Why you have your mother's eyes.",
            examples: ["Pea plant height", "Eye color"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "transcription-and-translation",
        title: "Transcription and Translation",
        topicName: "Genetics",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Transcription and Translation",
            body: "The central dogma: DNA is transcribed into mRNA, which is then translated by ribosomes into proteins.",
            summary: "Reading the blueprint to build the machine.",
            examples: ["mRNA synthesis", "Protein folding"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "mutations",
        title: "Mutations",
        topicName: "Genetics",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Mutations",
            body: "Changes in the DNA sequence. Can be harmful, beneficial, or neutral. Types include point mutations, insertions, and deletions.",
            summary: "Errors in the genetic code.",
            examples: ["Sickle cell anemia", "Cancer"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "gene-regulation",
        title: "Gene Regulation",
        topicName: "Genetics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Gene Regulation",
            body: "Mechanisms that turn genes on or off, ensuring cells only produce specific proteins when needed.",
            summary: "Controlling the genetic switches.",
            examples: ["Lac operon", "Epigenetics"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= EVOLUTION =================
      {
        id: "natural-selection",
        title: "Natural Selection",
        topicName: "Evolution",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Natural Selection",
            body: "Organisms better adapted to their environment tend to survive and produce more offspring. Darwin's survival of the fittest.",
            summary: "Nature selecting the best traits.",
            examples: ["Peppered moths", "Antibiotic resistance"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "speciation",
        title: "Speciation",
        topicName: "Evolution",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Speciation",
            body: "The evolutionary process by which populations evolve to become distinct species, often due to geographic isolation.",
            summary: "How new species arise.",
            examples: ["Darwin's finches", "Grand Canyon squirrels"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "evidence-for-evolution",
        title: "Evidence for Evolution",
        topicName: "Evolution",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Evidence for Evolution",
            body: "Scientific evidence includes the fossil record, homologous structures, embryology, and DNA similarities.",
            summary: "Proof that life changes over time.",
            examples: ["Whale leg bones", "Human tailbone"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "phylogenetic-trees",
        title: "Phylogenetic Trees",
        topicName: "Evolution",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Phylogenetic Trees",
            body: "Diagrams that represent evolutionary relationships among organisms based on physical or genetic characteristics.",
            summary: "The family tree of life.",
            examples: ["Cladograms", "Common ancestors"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "genetic-drift",
        title: "Genetic Drift",
        topicName: "Evolution",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Genetic Drift",
            body: "Change in the frequency of an existing gene variant in a population due to random sampling of organisms.",
            summary: "Evolution by luck, not skill.",
            examples: ["Founder effect", "Bottleneck effect"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ECOLOGY =================
      {
        id: "food-webs-and-chains",
        title: "Food Webs and Chains",
        topicName: "Ecology",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Food Webs and Chains",
            body: "Models that show the flow of energy through an ecosystem from producers to consumers to decomposers.",
            summary: "Who eats whom.",
            examples: ["Grass → Rabbit → Fox", "Apex predators"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "biogeochemical-cycles",
        title: "Biogeochemical Cycles",
        topicName: "Ecology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Biogeochemical Cycles",
            body: "Pathways by which chemical substances move through biotic and abiotic compartments of Earth (Water, Carbon, Nitrogen cycles).",
            summary: "Recycling nature's nutrients.",
            examples: ["Rain cycle", "Carbon sequestration"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "population-dynamics",
        title: "Population Dynamics",
        topicName: "Ecology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Population Dynamics",
            body: "Study of how populations change over time. Includes carrying capacity, exponential growth, and logistic growth.",
            summary: "Math of population growth.",
            examples: ["Rabbit overpopulation", "Predator-prey curves"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "symbiosis",
        title: "Symbiosis",
        topicName: "Ecology",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Symbiosis",
            body: "Interactions between two different organisms living in close physical association. Mutualism, Commensalism, Parasitism.",
            summary: "Living together.",
            examples: ["Clownfish and Anemone", "Ticks on a dog"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "ecological-succession",
        title: "Ecological Succession",
        topicName: "Ecology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Ecological Succession",
            body: "The process of change in the species structure of an ecological community over time (Primary vs Secondary succession).",
            summary: "Nature reclaiming the land.",
            examples: ["Forest after fire", "Lichens on rock"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= HUMAN ANATOMY =================
      {
        id: "the-skeletal-system",
        title: "The Skeletal System",
        topicName: "Human Anatomy",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Skeletal System",
            body: "The framework of the body, consisting of bones and connective tissues that protect organs and support movement.",
            summary: "The bones holding you up.",
            examples: ["Femur", "Ribcage"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-circulatory-system",
        title: "The Circulatory System",
        topicName: "Human Anatomy",
        difficulty: "intermediate",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Circulatory System",
            body: "Transports blood, nutrients, gases, and wastes. Key components: Heart, Arteries, Veins, Capillaries.",
            summary: "The body's transport highway.",
            examples: ["Heart pumping", "Oxygen delivery"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-nervous-system",
        title: "The Nervous System",
        topicName: "Human Anatomy",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Nervous System",
            body: "The network of nerve cells and fibers that transmits nerve impulses between parts of the body. Central (CNS) and Peripheral (PNS).",
            summary: "The body's electrical wiring.",
            examples: ["Brain", "Spinal cord"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-digestive-system",
        title: "The Digestive System",
        topicName: "Human Anatomy",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "The Digestive System",
            body: "Organs responsible for breaking down food into nutrients. Mouth, Esophagus, Stomach, Intestines.",
            summary: "From food to energy.",
            examples: ["Stomach acid", "Nutrient absorption"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-respiratory-system",
        title: "The Respiratory System",
        topicName: "Human Anatomy",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Respiratory System",
            body: "Organs involved in breathing and gas exchange. Lungs, Trachea, Bronchi, Alveoli.",
            summary: "How we breathe.",
            examples: ["Lungs inflating", "Oxygen exchange"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= PLANT BIOLOGY =================
      {
        id: "photosynthesis",
        title: "Photosynthesis",
        topicName: "Plant Biology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Photosynthesis",
            body: "Process by which plants use sunlight to synthesize foods from carbon dioxide and water. 6CO2 + 6H2O + Light → C6H12O6 + 6O2.",
            summary: "Making food from light.",
            examples: ["Chloroplast function", "Oxygen production"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "vascular-tissue",
        title: "Vascular Tissue (Xylem & Phloem)",
        topicName: "Plant Biology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Vascular Tissue",
            body: "Xylem transports water up from roots. Phloem transports sugars down from leaves.",
            summary: "The plant's plumbing system.",
            examples: ["Tree rings", "Sap flow"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "plant-reproduction",
        title: "Plant Reproduction",
        topicName: "Plant Biology",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Plant Reproduction",
            body: "Sexual reproduction involves flowers, pollination, and seeds. Asexual reproduction involves cuttings and runners.",
            summary: "How plants spread.",
            examples: ["Bees pollinating", "Seed dispersal"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "transpiration",
        title: "Transpiration",
        topicName: "Plant Biology",
        difficulty: "intermediate",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Transpiration",
            body: "The exhalation of water vapor through the stomata. This creates a suction force that pulls water up the plant.",
            summary: "Plants sweating to pull water up.",
            examples: ["Stomata opening", "Water cycle contribution"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "plant-tropisms",
        title: "Plant Tropisms",
        topicName: "Plant Biology",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Plant Tropisms",
            body: "Growth responses to stimuli. Phototropism (light), Gravitropism (gravity), Thigmotropism (touch).",
            summary: "Plants moving towards needs.",
            examples: ["Sunflowers tracking sun", "Roots growing down"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= MICROBIOLOGY =================
      {
        id: "bacteria-structure",
        title: "Bacteria Structure",
        topicName: "Microbiology",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Bacteria Structure",
            body: "Single-celled prokaryotes. diverse shapes (cocci, bacilli, spirilla). Some have flagella for movement.",
            summary: "The anatomy of germs.",
            examples: ["E. coli", "Strep throat"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "viruses-and-replication",
        title: "Viruses and Replication",
        topicName: "Microbiology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Viruses",
            body: "Non-living infectious agents consisting of genetic material inside a protein coat. They hijack host cells to replicate.",
            summary: "Code that hijacks cells.",
            examples: ["Flu virus", "Bacteriophage"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "antibiotic-resistance",
        title: "Antibiotic Resistance",
        topicName: "Microbiology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Antibiotic Resistance",
            body: "When bacteria evolve to survive drugs designed to kill them, often due to misuse of antibiotics.",
            summary: "Superbugs evolving.",
            examples: ["MRSA", "Survival of the fittest bacteria"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "fungi-kingdom",
        title: "Fungi Kingdom",
        topicName: "Microbiology",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Fungi Kingdom",
            body: "Eukaryotic organisms that digest food externally. Includes yeasts, molds, and mushrooms.",
            summary: "Nature's recyclers.",
            examples: ["Penicillin mold", "Bread yeast"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-human-microbiome",
        title: "The Human Microbiome",
        topicName: "Microbiology",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "The Human Microbiome",
            body: "The community of trillions of microorganisms living in and on the human body, essential for health and digestion.",
            summary: "The ecosystem inside you.",
            examples: ["Gut bacteria", "Skin flora"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= BIOCHEMISTRY =================
      {
        id: "protein-structure",
        title: "Protein Structure",
        topicName: "Biochemistry",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Protein Structure",
            body: "Four levels of structure: Primary (sequence), Secondary (helices/sheets), Tertiary (3D folding), Quaternary (multiple subunits).",
            summary: "The complex shapes of molecular machines.",
            examples: ["Hemoglobin", "Enzymes"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "enzymes-and-catalysis",
        title: "Enzymes and Catalysis",
        topicName: "Biochemistry",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Enzymes",
            body: "Biological catalysts that speed up chemical reactions by lowering activation energy. Lock and key model.",
            summary: "Speeding up life's reactions.",
            examples: ["Lactase", "Pepsin"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "carbohydrates",
        title: "Carbohydrates",
        topicName: "Biochemistry",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Carbohydrates",
            body: "Sugars and starches. They provide quick energy (glucose) and structure (cellulose).",
            summary: "Life's main fuel source.",
            examples: ["Glucose", "Starch"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "lipids",
        title: "Lipids",
        topicName: "Biochemistry",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Lipids",
            body: "Fats, oils, and waxes. Hydrophobic molecules used for long-term energy storage and cell membranes.",
            summary: "Fats and membranes.",
            examples: ["Triglycerides", "Phospholipids"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "metabolic-pathways",
        title: "Metabolic Pathways",
        topicName: "Biochemistry",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Metabolic Pathways",
            body: "Series of linked chemical reactions within a cell. Anabolic (building up) and Catabolic (breaking down).",
            summary: "The chemical roadmaps of life.",
            examples: ["Glycolysis", "Photosynthesis"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= IMMUNOLOGY =================
      {
        id: "innate-vs-adaptive-immunity",
        title: "Innate vs. Adaptive Immunity",
        topicName: "Immunology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Innate vs. Adaptive Immunity",
            body: "Innate: General, immediate defense (skin, fever). Adaptive: Specific, learned defense (antibodies, memory cells).",
            summary: "General guards vs. Special forces.",
            examples: ["Inflammation", "Vaccine memory"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "antibodies-and-antigens",
        title: "Antibodies and Antigens",
        topicName: "Immunology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Antibodies and Antigens",
            body: "Antigens are foreign markers. Antibodies are Y-shaped proteins that tag antigens for destruction.",
            summary: "Tagging the invaders.",
            examples: ["Y-shape binding", "Blood types"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "t-cells-and-b-cells",
        title: "T-Cells and B-Cells",
        topicName: "Immunology",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "T-Cells and B-Cells",
            body: "B-Cells produce antibodies. Killer T-Cells destroy infected host cells. Helper T-Cells coordinate the attack.",
            summary: "The commanders of the immune system.",
            examples: ["White blood cells", "HIV targeting T-cells"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "vaccines",
        title: "Vaccines",
        topicName: "Immunology",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Vaccines",
            body: "Biological preparations that provide active acquired immunity by training the immune system to recognize a pathogen.",
            summary: "Training the immune system.",
            examples: ["Flu shot", "mRNA vaccines"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-inflammatory-response",
        title: "The Inflammatory Response",
        topicName: "Immunology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "The Inflammatory Response",
            body: "The body's reaction to injury or infection, characterized by redness, swelling, heat, and pain to localize and eliminate the threat.",
            summary: "Calling for help.",
            examples: ["Swollen ankle", "Infection heat"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= BIOTECHNOLOGY =================
      {
        id: "pcr",
        title: "PCR (Polymerase Chain Reaction)",
        topicName: "Biotechnology",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "PCR",
            body: "A technique used to amplify a single copy of DNA into millions of copies, allowing for detailed study.",
            summary: "The DNA photocopier.",
            examples: ["Crime scene analysis", "Paternity tests"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "crispr-cas9",
        title: "CRISPR-Cas9",
        topicName: "Biotechnology",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "CRISPR-Cas9",
            body: "A gene-editing technology that allows scientists to cut and alter DNA sequences with extreme precision.",
            summary: "Molecular scissors for DNA.",
            examples: ["Gene therapy", "Designer crops"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "gel-electrophoresis",
        title: "Gel Electrophoresis",
        topicName: "Biotechnology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Gel Electrophoresis",
            body: "A method for separating DNA, RNA, or proteins based on their size and charge.",
            summary: "Sorting DNA by size.",
            examples: ["DNA fingerprinting"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "cloning",
        title: "Cloning",
        topicName: "Biotechnology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Cloning",
            body: "The process of producing individuals with identical or virtually identical DNA, either naturally or artificially.",
            summary: "Making genetic copies.",
            examples: ["Dolly the sheep", "Stem cell research"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "gmos",
        title: "GMOs",
        topicName: "Biotechnology",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Genetically Modified Organisms",
            body: "Organisms whose genetic material has been altered using genetic engineering techniques.",
            summary: "Engineering better crops.",
            examples: ["Golden rice", "Pest-resistant corn"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= PHYSIOLOGY =================
      {
        id: "homeostasis",
        title: "Homeostasis",
        topicName: "Physiology",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Homeostasis",
            body: "The state of steady internal, physical, and chemical conditions maintained by living systems.",
            summary: "Keeping the body balanced.",
            examples: ["Thermoregulation", "Blood sugar control"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "action-potential",
        title: "Action Potential",
        topicName: "Physiology",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Action Potential",
            body: "A rapid rise and fall in voltage across a cellular membrane. This is how neurons transmit signals.",
            summary: "The nerve impulse spark.",
            examples: ["Neuron firing", "Reflex arc"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "muscle-contraction",
        title: "Muscle Contraction",
        topicName: "Physiology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Muscle Contraction",
            body: "Sliding Filament Theory: Actin and myosin filaments slide past each other to shorten the muscle fiber.",
            summary: "How muscles move.",
            examples: ["Flexing biceps", "Heartbeat"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "gas-exchange",
        title: "Gas Exchange",
        topicName: "Physiology",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Gas Exchange",
            body: "Diffusion of oxygen into the blood and carbon dioxide out of the blood at the alveoli.",
            summary: "Swapping good air for bad.",
            examples: ["Breathing", "Alveoli function"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "endocrine-signaling",
        title: "Endocrine Signaling",
        topicName: "Physiology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Endocrine Signaling",
            body: "Hormones released by glands travel through the blood to target distant organs to regulate physiology.",
            summary: "Chemical messaging system.",
            examples: ["Adrenaline rush", "Insulin spike"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= MOLECULAR BIOLOGY =================
      {
        id: "dna-replication",
        title: "DNA Replication",
        topicName: "Molecular Biology",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "DNA Replication",
            body: "The process by which DNA makes a copy of itself during cell division. Involves Helicase and Polymerase enzymes.",
            summary: "Copying the code.",
            examples: ["Leading vs Lagging strand", "Okazaki fragments"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "rna-splicing",
        title: "RNA Splicing",
        topicName: "Molecular Biology",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "RNA Splicing",
            body: "Modification of pre-mRNA where introns (non-coding) are removed and exons (coding) are joined.",
            summary: "Editing the message.",
            examples: ["Alternative splicing"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "epigenetics",
        title: "Epigenetics",
        topicName: "Molecular Biology",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Epigenetics",
            body: "Heritable changes in gene expression that do not involve changes to the underlying DNA sequence.",
            summary: "Switches above the genes.",
            examples: ["DNA methylation", "Histone modification"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "signal-transduction",
        title: "Signal Transduction",
        topicName: "Molecular Biology",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "chart",
        content: {
          en: {
            title: "Signal Transduction",
            body: "The transmission of molecular signals from a cell's exterior to its interior, triggering a response.",
            summary: "Cellular telephone game.",
            examples: ["G-protein coupled receptors", "Kinase cascades"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "protein-synthesis",
        title: "Protein Synthesis",
        topicName: "Molecular Biology",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Protein Synthesis",
            body: "The creation of proteins by cells using DNA, RNA, and ribosomes. Translation of codons into amino acids.",
            summary: "Building life's machines.",
            examples: ["Ribosome function", "tRNA delivery"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= STRUCTURAL ENGINEERING =================
      {
        id: "stress-and-strain",
        title: "Stress and Strain",
        topicName: "Structural Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Stress and Strain",
            body: "Stress is the internal force per unit area. Strain is the deformation or displacement of material that results from stress.",
            summary: "How materials react to force.",
            examples: ["Stretching a rubber band", "Crushing a can"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "truss-analysis",
        title: "Truss Analysis",
        topicName: "Structural Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Truss Analysis",
            body: "Trusses are triangular structures that distribute weight efficiently. Analysis involves calculating forces in each member (tension or compression).",
            summary: "Triangles making things strong.",
            examples: ["Roof supports", "Steel bridges"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "load-paths",
        title: "Load Paths",
        topicName: "Structural Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Load Paths",
            body: "The direction in which each consecutive load will pass through connected members. Loads must eventually transfer to the ground.",
            summary: "Tracing gravity's path to the earth.",
            examples: ["Column to foundation", "Beam to girder"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "resonance-and-damping",
        title: "Resonance and Damping",
        topicName: "Structural Engineering",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Resonance and Damping",
            body: "Structures vibrate at natural frequencies. If external forces match this frequency, resonance occurs, potentially causing collapse. Tuned mass dampers prevent this.",
            summary: "Preventing buildings from shaking apart.",
            examples: ["Tacoma Narrows Bridge", "Taipei 101 Damper"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "reinforced-concrete",
        title: "Reinforced Concrete",
        topicName: "Structural Engineering",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Reinforced Concrete",
            body: "Concrete is strong in compression but weak in tension. Steel rebar is added to provide tensile strength.",
            summary: "The perfect marriage of materials.",
            examples: ["Sidewalks", "Skyscrapers"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ELECTRICAL ENGINEERING =================
      {
        id: "kirchhoffs-laws",
        title: "Kirchhoff's Laws",
        topicName: "Electrical Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Kirchhoff's Laws",
            body: "Current Law (KCL): Current into a node equals current out. Voltage Law (KVL): Sum of voltages in a loop is zero.",
            summary: "The fundamental rules of circuits.",
            examples: ["Circuit analysis", "Wiring diagrams"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "ac-vs-dc-power",
        title: "AC vs. DC Power",
        topicName: "Electrical Engineering",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "AC vs. DC Power",
            body: "Direct Current (DC) flows one way. Alternating Current (AC) reverses direction periodically. AC is better for long-distance transmission.",
            summary: "The War of Currents.",
            examples: ["Batteries (DC)", "Wall outlets (AC)"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "transistors",
        title: "Transistors",
        topicName: "Electrical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Transistors",
            body: "Semiconductor devices used to amplify or switch electrical signals and power. The fundamental building block of modern electronics.",
            summary: "The switch that changed the world.",
            examples: ["Computer processors", "Amplifiers"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "transformers",
        title: "Transformers",
        topicName: "Electrical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Transformers",
            body: "Devices that transfer electrical energy between circuits through electromagnetic induction, usually to step voltage up or down.",
            summary: "Changing voltage levels safely.",
            examples: ["Power substations", "Phone chargers"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "logic-gates",
        title: "Logic Gates",
        topicName: "Electrical Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Logic Gates",
            body: "Digital circuits that perform boolean operations (AND, OR, NOT). They are the physical implementation of computer logic.",
            summary: "How computers think.",
            examples: ["Binary addition", "Digital clocks"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= MECHANICAL ENGINEERING =================
      {
        id: "gear-ratios",
        title: "Gear Ratios",
        topicName: "Mechanical Engineering",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Gear Ratios",
            body: "The relationship between the number of teeth on two meshing gears. Determines torque vs. speed output.",
            summary: "Trading speed for power.",
            examples: ["Bicycle gears", "Car transmission"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "the-four-stroke-engine",
        title: "The Four-Stroke Engine",
        topicName: "Mechanical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Four-Stroke Engine",
            body: "Intake, Compression, Combustion, Exhaust. The cycle that powers most internal combustion cars.",
            summary: "Suck, Squeeze, Bang, Blow.",
            examples: ["Car engines", "Lawn mowers"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "thermodynamic-cycles",
        title: "Thermodynamic Cycles",
        topicName: "Mechanical Engineering",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Thermodynamic Cycles",
            body: "Theoretical cycles like Otto, Diesel, and Rankine that describe how heat engines convert thermal energy to work.",
            summary: "The math of efficiency.",
            examples: ["Steam power plants", "Jet engines"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "fluid-mechanics-lift",
        title: "Fluid Mechanics: Lift",
        topicName: "Mechanical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Fluid Mechanics: Lift",
            body: "The force generated perpendicular to the flow direction. Essential for aerodynamics and pump design.",
            summary: "Making heavy things fly.",
            examples: ["Airfoils", "Turbine blades"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "finite-element-analysis",
        title: "Finite Element Analysis (FEA)",
        topicName: "Mechanical Engineering",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Finite Element Analysis",
            body: "A computational method used to predict how a product reacts to real-world forces, vibration, heat, and fluid flow.",
            summary: "Simulating stress on a computer.",
            examples: ["Crash testing", "Bridge safety"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= CIVIL ENGINEERING =================
      {
        id: "foundation-types",
        title: "Foundation Types",
        topicName: "Civil Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Foundation Types",
            body: "Shallow foundations (spread footings) for small loads, deep foundations (piles) for heavy loads or weak soil.",
            summary: "The feet of a building.",
            examples: ["Slab-on-grade", "Pile drivers"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "surveying-and-geomatics",
        title: "Surveying and Geomatics",
        topicName: "Civil Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Surveying and Geomatics",
            body: "The science of measuring positions on Earth's surface. Uses Theodolites, GPS, and Total Stations.",
            summary: "Mapping the land.",
            examples: ["Road layout", "Property lines"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "hydrology-and-drainage",
        title: "Hydrology and Drainage",
        topicName: "Civil Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Hydrology and Drainage",
            body: "Managing water flow to prevent flooding. Involves calculating runoff, storm sewers, and retention ponds.",
            summary: "Controlling the rain.",
            examples: ["Storm drains", "Dams"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "traffic-engineering",
        title: "Traffic Engineering",
        topicName: "Civil Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Traffic Engineering",
            body: "Optimizing the movement of people and goods. Involves signal timing, lane design, and roundabouts.",
            summary: "Unclogging the roads.",
            examples: ["Stoplights", "Interchange design"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "suspension-bridges",
        title: "Suspension Bridges",
        topicName: "Civil Engineering",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Suspension Bridges",
            body: "A bridge where the deck is hung below suspension cables on vertical suspenders. Capable of spanning long distances.",
            summary: "Spanning the impossible gap.",
            examples: ["Golden Gate Bridge", "Brooklyn Bridge"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= SOFTWARE ENGINEERING =================
      {
        id: "object-oriented-programming",
        title: "Object-Oriented Programming",
        topicName: "Software Engineering",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Object-Oriented Programming",
            body: "A paradigm based on 'objects' containing data and code. Key concepts: Encapsulation, Abstraction, Inheritance, Polymorphism.",
            summary: "Coding with virtual objects.",
            examples: ["Java classes", "Game characters"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "algorithms-and-complexity",
        title: "Algorithms and Complexity",
        topicName: "Software Engineering",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Algorithms and Complexity",
            body: "Big O notation describes how an algorithm's runtime grows with input size. Efficient algorithms are crucial for scale.",
            summary: "How fast is your code?",
            examples: ["Sorting lists", "Google search"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "sdlc",
        title: "Software Development Life Cycle",
        topicName: "Software Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "SDLC",
            body: "The process for planning, creating, testing, and deploying information systems. Models include Agile and Waterfall.",
            summary: "The roadmap of building software.",
            examples: ["Scrum meetings", "DevOps"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "databases-and-sql",
        title: "Databases and SQL",
        topicName: "Software Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Databases and SQL",
            body: "Structured Query Language is used to communicate with databases. Concepts include Tables, Primary Keys, and Joins.",
            summary: "Organizing the world's data.",
            examples: ["User login systems", "Bank records"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "version-control-git",
        title: "Version Control (Git)",
        topicName: "Software Engineering",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Version Control (Git)",
            body: "A system that records changes to a file or set of files over time so that you can recall specific versions later.",
            summary: "A time machine for code.",
            examples: ["GitHub", "Merging branches"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= AEROSPACE ENGINEERING =================
      {
        id: "the-four-forces-of-flight",
        title: "The Four Forces of Flight",
        topicName: "Aerospace Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "The Four Forces of Flight",
            body: "Lift (up), Weight (down), Thrust (forward), Drag (backward). Flight occurs when these forces are balanced or manipulated.",
            summary: "How planes stay in the air.",
            examples: ["Airplane takeoff", "Cruising altitude"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "orbital-mechanics",
        title: "Orbital Mechanics",
        topicName: "Aerospace Engineering",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Orbital Mechanics",
            body: "The physics of objects in space. Concepts include escape velocity, Hohmann transfer orbits, and delta-v.",
            summary: "Navigating in space.",
            examples: ["Satellite orbits", "Mars missions"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "rocket-propulsion",
        title: "Rocket Propulsion",
        topicName: "Aerospace Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Rocket Propulsion",
            body: "Based on Newton's 3rd Law. Expelling mass at high speed backwards pushes the rocket forwards.",
            summary: "Controlled explosions for thrust.",
            examples: ["SpaceX Falcon 9", "Solid rocket boosters"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "supersonic-flight",
        title: "Supersonic Flight",
        topicName: "Aerospace Engineering",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Supersonic Flight",
            body: "Flying faster than the speed of sound (Mach 1). Creates shock waves and sonic booms.",
            summary: "Breaking the sound barrier.",
            examples: ["Concorde", "Fighter jets"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "aircraft-stability",
        title: "Aircraft Stability",
        topicName: "Aerospace Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Aircraft Stability",
            body: "The tendency of an aircraft to return to equilibrium after a disturbance. Pitch, Roll, and Yaw axes.",
            summary: "Keeping the plane level.",
            examples: ["Tail fins", "Dihedral wings"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= MATERIALS SCIENCE =================
      {
        id: "stress-strain-curve",
        title: "Stress-Strain Curve",
        topicName: "Materials Science",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Stress-Strain Curve",
            body: "A graph showing how a material behaves under load. Regions include Elastic (returns to shape) and Plastic (permanently deformed).",
            summary: "Measuring material limits.",
            examples: ["Yield point", "Breaking point"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "crystal-structures",
        title: "Crystal Structures",
        topicName: "Materials Science",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Crystal Structures",
            body: "The arrangement of atoms in solids. Common types include FCC (Face Centered Cubic) and BCC (Body Centered Cubic).",
            summary: "Atomic packing patterns.",
            examples: ["Iron atoms", "Diamond lattice"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "alloys-and-composites",
        title: "Alloys and Composites",
        topicName: "Materials Science",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Alloys and Composites",
            body: "Alloys mix metals (Steel = Iron + Carbon). Composites mix materials (Carbon Fiber = Fiber + Resin) for superior properties.",
            summary: "Mixing ingredients for strength.",
            examples: ["Stainless steel", "Kevlar"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "failure-analysis",
        title: "Failure Analysis",
        topicName: "Materials Science",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Failure Analysis",
            body: "Understanding how and why materials break. Mechanisms include Fatigue (cyclic loading), Creep (constant load), and Fracture.",
            summary: "Why things break.",
            examples: ["Metal fatigue", "Cracks in glass"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "nanomaterials",
        title: "Nanomaterials",
        topicName: "Materials Science",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Nanomaterials",
            body: "Materials with structures on the nanoscale (1-100nm). They exhibit unique properties different from bulk materials.",
            summary: "Engineering at the atomic scale.",
            examples: ["Graphene", "Carbon nanotubes"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ROBOTICS =================
      {
        id: "kinematics",
        title: "Kinematics",
        topicName: "Robotics",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Kinematics",
            body: "The geometry of motion. Forward Kinematics calculates end-effector position from joint angles. Inverse Kinematics does the reverse.",
            summary: "Calculating robot arm movement.",
            examples: ["Robot arm reaching", "Walking gait"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "sensors-and-perception",
        title: "Sensors and Perception",
        topicName: "Robotics",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Sensors and Perception",
            body: "How robots see the world. Includes LIDAR (lasers), Ultrasonic, Cameras, and IMUs (Inertial Measurement Units).",
            summary: "Robot eyes and ears.",
            examples: ["Self-driving cars", "Roomba sensors"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "pid-control",
        title: "PID Control",
        topicName: "Robotics",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "PID Control",
            body: "Proportional-Integral-Derivative controller. A control loop mechanism that corrects errors to keep a system at a target setpoint.",
            summary: "Keeping movements smooth and accurate.",
            examples: ["Cruise control", "Drone stabilization"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "actuators",
        title: "Actuators",
        topicName: "Robotics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Actuators",
            body: "The 'muscles' of a robot. Includes electric motors (DC, Stepper, Servo), hydraulics, and pneumatics.",
            summary: "What makes robots move.",
            examples: ["Servo motors", "Hydraulic pistons"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "degrees-of-freedom",
        title: "Degrees of Freedom (DOF)",
        topicName: "Robotics",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Degrees of Freedom",
            body: "The number of independent parameters that define the configuration of a mechanical system. A human arm has 7 DOF.",
            summary: "Flexibility of movement.",
            examples: ["Robot wrist", "Joint rotation"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= CHEMICAL ENGINEERING =================
      {
        id: "distillation",
        title: "Distillation",
        topicName: "Chemical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Distillation",
            body: "Separating components of a liquid mixture based on differences in boiling points. Used heavily in oil refineries.",
            summary: "Boiling apart mixtures.",
            examples: ["Refining crude oil", "Making spirits"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "heat-exchangers",
        title: "Heat Exchangers",
        topicName: "Chemical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Heat Exchangers",
            body: "Devices designed to transfer heat between two or more fluids. Shell and tube is a common design.",
            summary: "Managing thermal energy.",
            examples: ["Car radiator", "Industrial cooling"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "mass-balance",
        title: "Mass Balance",
        topicName: "Chemical Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Mass Balance",
            body: "The application of conservation of mass to a physical system. Input + Generation = Output + Accumulation + Consumption.",
            summary: "Tracking every atom.",
            examples: ["Chemical reactors", "Production lines"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "reaction-engineering",
        title: "Reaction Engineering",
        topicName: "Chemical Engineering",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Reaction Engineering",
            body: "Designing reactors (CSTR, PFR) to optimize chemical conversion, selectivity, and safety.",
            summary: "Building the perfect mixing pot.",
            examples: ["Pharmaceutical batches", "Plastic manufacturing"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "process-control",
        title: "Process Control",
        topicName: "Chemical Engineering",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "chart",
        content: {
          en: {
            title: "Process Control",
            body: "Maintaining process variables (temperature, pressure, flow) at a desired range using automated sensors and valves.",
            summary: "Automating the factory.",
            examples: ["Thermostats", "Safety valves"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= ENVIRONMENTAL ENGINEERING =================
      {
        id: "water-treatment",
        title: "Water Treatment",
        topicName: "Environmental Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Water Treatment",
            body: "The process of removing contaminants from water. Steps: Coagulation, Sedimentation, Filtration, Disinfection.",
            summary: "Making water safe to drink.",
            examples: ["Municipal water plants", "Desalination"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "air-pollution-control",
        title: "Air Pollution Control",
        topicName: "Environmental Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Air Pollution Control",
            body: "Technologies to reduce emissions. Scrubbers remove gases; Electrostatic Precipitators remove particulate matter.",
            summary: "Cleaning the air.",
            examples: ["Smokestack scrubbers", "Catalytic converters"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "waste-management",
        title: "Waste Management",
        topicName: "Environmental Engineering",
        difficulty: "beginner",
        estimatedReadTime: 10,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Waste Management",
            body: "The collection, transport, treatment, and disposal of waste. Includes recycling, composting, and landfill design.",
            summary: "Dealing with trash.",
            examples: ["Sanitary landfills", "Recycling sorting"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "renewable-energy-systems",
        title: "Renewable Energy Systems",
        topicName: "Environmental Engineering",
        difficulty: "beginner",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Renewable Energy Systems",
            body: "Designing systems for sustainable energy. Solar panels, wind turbines, and geothermal plants.",
            summary: "Clean power for the future.",
            examples: ["Wind farms", "Solar arrays"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "environmental-impact-assessment",
        title: "Environmental Impact Assessment",
        topicName: "Environmental Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Environmental Impact Assessment",
            body: "A systematic process to evaluate the potential environmental effects of a proposed project before it is carried out.",
            summary: "Checking before building.",
            examples: ["Construction permits", "Highway planning"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= BIOMEDICAL ENGINEERING =================
      {
        id: "medical-imaging",
        title: "Medical Imaging (MRI/CT)",
        topicName: "Biomedical Engineering",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Medical Imaging",
            body: "Technologies to view the inside of the body. MRI uses magnetic fields; CT uses X-rays.",
            summary: "Looking inside the body.",
            examples: ["MRI Scans", "Ultrasound"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "prosthetics-and-orthotics",
        title: "Prosthetics and Orthotics",
        topicName: "Biomedical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Prosthetics",
            body: "Designing artificial limbs and support devices. Modern prosthetics use myoelectric sensors to control movement.",
            summary: "Replacing lost limbs.",
            examples: ["Artificial legs", "Bionic hands"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "tissue-engineering",
        title: "Tissue Engineering",
        topicName: "Biomedical Engineering",
        difficulty: "advanced",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "Tissue Engineering",
            body: "Growing functional tissues or organs in the lab using scaffolds and stem cells to replace damaged biological tissues.",
            summary: "Growing spare parts.",
            examples: ["Lab-grown skin", "Organ scaffolds"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "biomechanics",
        title: "Biomechanics",
        topicName: "Biomedical Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "interactive-simulation",
        content: {
          en: {
            title: "Biomechanics",
            body: "Applying mechanical principles to biological systems. Analyzing gait, joint forces, and bone strength.",
            summary: "The physics of the body.",
            examples: ["Sports science", "Implant design"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "biomaterials",
        title: "Biomaterials",
        topicName: "Biomedical Engineering",
        difficulty: "beginner",
        estimatedReadTime: 12,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Biomaterials",
            body: "Synthetic or natural materials used in contact with biological systems. Must be biocompatible (not toxic).",
            summary: "Materials that the body accepts.",
            examples: ["Titanium hips", "Contact lenses"],
            images: [], externalAssets: []
          }
        }
      },

      // ================= COMPUTER ENGINEERING =================
      {
        id: "computer-architecture",
        title: "Computer Architecture (Von Neumann)",
        topicName: "Computer Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Computer Architecture",
            body: "The design of computer systems. The Von Neumann architecture describes a system with CPU, Memory, and I/O sharing a bus.",
            summary: "The blueprint of a computer.",
            examples: ["CPU design", "Bus systems"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "embedded-systems",
        title: "Embedded Systems",
        topicName: "Computer Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 15,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "Embedded Systems",
            body: "Computing systems with a dedicated function within a larger mechanical or electrical system. Often real-time constraints.",
            summary: "Computers inside things.",
            examples: ["Car ECU", "Microwave controller"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "fpga-design",
        title: "FPGA Design",
        topicName: "Computer Engineering",
        difficulty: "advanced",
        estimatedReadTime: 20,
        arEnabled: true,
        visualizationType: "video",
        content: {
          en: {
            title: "FPGA Design",
            body: "Field-Programmable Gate Arrays are chips that can be reconfigured after manufacturing to perform specific hardware logic.",
            summary: "Rewiring chips via code.",
            examples: ["Hardware acceleration", "Prototyping"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "memory-hierarchy",
        title: "Memory Hierarchy",
        topicName: "Computer Engineering",
        difficulty: "intermediate",
        estimatedReadTime: 12,
        arEnabled: false,
        visualizationType: "chart",
        content: {
          en: {
            title: "Memory Hierarchy",
            body: "The organization of storage from fast/small (Registers, Cache) to slow/large (RAM, Hard Drive).",
            summary: "Balancing speed and size.",
            examples: ["L1/L2 Cache", "SSD vs HDD"],
            images: [], externalAssets: []
          }
        }
      },
      {
        id: "vlsi-design",
        title: "VLSI Design",
        topicName: "Computer Engineering",
        difficulty: "advanced",
        estimatedReadTime: 18,
        arEnabled: true,
        visualizationType: "3d-model",
        content: {
          en: {
            title: "VLSI Design",
            body: "Very Large Scale Integration. The process of creating an integrated circuit (IC) by combining millions of transistors into a single chip.",
            summary: "Designing microchips.",
            examples: ["Microprocessors", "Graphics cards"],
            images: [], externalAssets: []
          }
        }
      }
    ]
  };

  const handleSeedData = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setSeedProgress("");

    try {
      // Step 1: Clear existing data
      setSeedProgress("Clearing existing data...");
      await batchService.clearAllData();

      // Step 2: Seed subjects
      setSeedProgress("Seeding subjects...");
      const seededSubjects = await batchService.seedSubjects(seedData.subjects);

      // Create subject name to ID mapping
      const subjectMap = {};
      seededSubjects.forEach(subject => {
        subjectMap[subject.name] = subject.id;
      });

      // Step 3: Prepare and seed topics
      setSeedProgress("Seeding topics...");
      const topicsWithSubjectIds = seedData.topics.map(topic => {
        const subjectId = subjectMap[topic.subjectName];
        if (!subjectId) {
          throw new Error(`Subject not found for topic: ${topic.name} (looking for subject: ${topic.subjectName})`);
        }
        return {
          ...topic,
          subjectId
        };
      });

      const seededTopics = await batchService.seedTopics(topicsWithSubjectIds);

      // Create topic name to ID mapping
      const topicMap = {};
      seededTopics.forEach(topic => {
        topicMap[topic.name] = topic.id;
      });

      // Step 4: Prepare and seed concepts
      setSeedProgress("Seeding concepts...");
      const conceptsWithTopicIds = seedData.concepts.map((concept, index) => {
        // Validate concept has required fields
        if (!concept.id) {
          throw new Error(`Concept at index ${index} is missing an id field. Title: ${concept.title || 'unknown'}`);
        }
        if (!concept.topicName) {
          throw new Error(`Concept "${concept.title}" (id: ${concept.id}) is missing topicName field`);
        }

        const topicId = topicMap[concept.topicName];
        if (!topicId) {
          throw new Error(`Topic not found for concept: ${concept.title} (looking for topic: ${concept.topicName})`);
        }

        // Remove topicName and add topicId
        const { topicName, ...conceptData } = concept;
        return {
          ...conceptData,
          topicId
        };
      });

      setSeedProgress(`Seeding ${conceptsWithTopicIds.length} concepts to Firestore...`);
      await batchService.seedConcepts(conceptsWithTopicIds);

      setSeedProgress("");
      setSuccess(`Successfully seeded:
        • ${seededSubjects.length} subjects
        • ${seededTopics.length} topics  
        • ${conceptsWithTopicIds.length} concepts
        
        Data is now available in Firestore and ready for use!`);

    } catch (err) {
      setError("Failed to seed data: " + err.message);
      setSeedProgress("");
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await batchService.clearAllData();
      setSuccess("All data has been cleared from Firestore.");
    } catch (err) {
      setError("Failed to clear data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-seeder">
      <div className="seeder-header">
        <h2>Data Seeder</h2>
        <p>Populate Firestore with educational content in English</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {seedProgress && <div className="progress-message">{seedProgress}</div>}

      <div className="seed-info">
        <h3>What will be seeded:</h3>
        <div className="seed-stats">
          <div className="stat-card">
            <h4>
              <IoLibraryOutline aria-hidden="true" /> Subjects
            </h4>
            <p>{seedData.subjects.length} subjects</p>
            <ul>
              {seedData.subjects.map(subject => {
                const SubjectIcon = getSubjectIcon(subject.icon);
                return (
                  <li key={subject.name}>
                    <SubjectIcon aria-hidden="true" /> {subject.name}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="stat-card">
            <h4>
              <IoBookOutline aria-hidden="true" /> Topics
            </h4>
            <p>{seedData.topics.length} topics</p>
            <ul>
              {seedData.topics.slice(0, 6).map(topic => (
                <li key={topic.name}>{topic.name}</li>
              ))}
              {seedData.topics.length > 6 && <li>...and {seedData.topics.length - 6} more</li>}
            </ul>
          </div>

          <div className="stat-card">
            <h4>
              <IoDocumentTextOutline aria-hidden="true" /> Concepts
            </h4>
            <p>{seedData.concepts.length} concepts</p>
            <p>{seedData.concepts.filter(c => c.arEnabled).length} with AR enabled</p>
            <ul>
              {seedData.concepts.slice(0, 4).map(concept => (
                <li key={concept.title}>
                  {concept.title} {concept.arEnabled && <IoGlassesOutline aria-hidden="true" />}
                </li>
              ))}
              {seedData.concepts.length > 4 && <li>...and {seedData.concepts.length - 4} more</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="seeder-actions">
        <button
          className="btn-primary btn-large"
          onClick={handleSeedData}
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="small" /> : (
            <>
              <IoLeafOutline aria-hidden="true" /> Seed Database
            </>
          )}
        </button>

        <button
          className="btn-danger"
          onClick={handleClearData}
          disabled={loading}
        >
          🗑️ Clear All Data
        </button>
      </div>

      <div className="seeder-notes">
        <h3>Notes:</h3>
        <ul>
          <li>All content is seeded in English and will be translated by Gemini API when users change language</li>
          <li>AR visualizations are enabled for selected concepts with different types (3D models, animations, etc.)</li>
          <li>Topics include prerequisites and difficulty levels for proper learning progression</li>
          <li>Clearing data will remove all subjects, topics, and concepts from Firestore</li>
          <li>This operation may take a few moments to complete</li>
        </ul>
      </div>
    </div>
  );
}