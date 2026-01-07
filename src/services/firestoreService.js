import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

// Collections
const COLLECTIONS = {
  SUBJECTS: "subjects",
  TOPICS: "topics",
  CONCEPTS: "concepts",
  USERS: "users",
};

// Subject operations
export const subjectService = {
  // Get all subjects
  async getAll() {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.SUBJECTS), orderBy("name"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get subject by ID
  async getById(id) {
    const docRef = doc(db, COLLECTIONS.SUBJECTS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Create subject
  async create(subjectData) {
    const docRef = await addDoc(collection(db, COLLECTIONS.SUBJECTS), {
      ...subjectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update subject
  async update(id, updates) {
    const docRef = doc(db, COLLECTIONS.SUBJECTS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete subject
  async delete(id) {
    const docRef = doc(db, COLLECTIONS.SUBJECTS, id);
    await deleteDoc(docRef);
  },
};

// Topic operations
export const topicService = {
  // Get all topics
  async getAll() {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.TOPICS), orderBy("name"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get topics by subject
  async getBySubject(subjectId) {
    const q = query(
      collection(db, COLLECTIONS.TOPICS),
      where("subjectId", "==", subjectId),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get topic by ID
  async getById(id) {
    const docRef = doc(db, COLLECTIONS.TOPICS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Create topic
  async create(topicData) {
    const docRef = await addDoc(collection(db, COLLECTIONS.TOPICS), {
      ...topicData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update topic
  async update(id, updates) {
    const docRef = doc(db, COLLECTIONS.TOPICS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete topic
  async delete(id) {
    const docRef = doc(db, COLLECTIONS.TOPICS, id);
    await deleteDoc(docRef);
  },
};

// Concept operations
export const conceptService = {
  // Get all concepts
  async getAll() {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.CONCEPTS), orderBy("title"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get concepts by topic
  async getByTopic(topicId) {
    const q = query(
      collection(db, COLLECTIONS.CONCEPTS),
      where("topicId", "==", topicId),
      orderBy("title")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get concept by ID
  async getById(id) {
    const docRef = doc(db, COLLECTIONS.CONCEPTS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Create concept
  async create(conceptData) {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONCEPTS), {
      ...conceptData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update concept
  async update(id, updates) {
    const docRef = doc(db, COLLECTIONS.CONCEPTS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete concept
  async delete(id) {
    const docRef = doc(db, COLLECTIONS.CONCEPTS, id);
    await deleteDoc(docRef);
  },

  // Update AR availability
  async updateARAvailability(id, arEnabled, visualizationType = null) {
    const docRef = doc(db, COLLECTIONS.CONCEPTS, id);
    await updateDoc(docRef, {
      arEnabled,
      visualizationType,
      updatedAt: serverTimestamp(),
    });
  },
};

// Batch operations for seeding data
export const batchService = {
  // Seed subjects
  async seedSubjects(subjects) {
    const results = [];
    const BATCH_SIZE = 500; // Firestore batch limit

    // Process subjects in batches of 500
    for (let i = 0; i < subjects.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchSubjects = subjects.slice(i, i + BATCH_SIZE);

      for (const subject of batchSubjects) {
        const { id, ...subjectData } = subject;
        const docRef = doc(db, COLLECTIONS.SUBJECTS, id);
        batch.set(docRef, {
          ...subjectData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        results.push({ id, ...subjectData });
      }

      await batch.commit();
    }

    return results;
  },

  // Seed topics
  async seedTopics(topics) {
    const results = [];
    const BATCH_SIZE = 500; // Firestore batch limit

    // Process topics in batches of 500
    for (let i = 0; i < topics.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchTopics = topics.slice(i, i + BATCH_SIZE);

      for (const topic of batchTopics) {
        const { id, ...topicData } = topic;
        const docRef = doc(db, COLLECTIONS.TOPICS, id);
        batch.set(docRef, {
          ...topicData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        results.push({ id, ...topicData });
      }

      await batch.commit();
    }

    return results;
  },

  // Seed concepts
  async seedConcepts(concepts) {
    const results = [];
    const BATCH_SIZE = 500; // Firestore batch limit

    // Process concepts in batches of 500
    for (let i = 0; i < concepts.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchConcepts = concepts.slice(i, i + BATCH_SIZE);

      for (const concept of batchConcepts) {
        const { id, ...conceptData } = concept;
        const docRef = doc(db, COLLECTIONS.CONCEPTS, id);
        batch.set(docRef, {
          ...conceptData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        results.push({ id, ...conceptData });
      }

      await batch.commit();
    }

    return results;
  },

  // Clear all data (for re-seeding)
  async clearAllData() {
    const batch = writeBatch(db);

    // Get all documents from each collection
    const [subjects, topics, concepts] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.SUBJECTS)),
      getDocs(collection(db, COLLECTIONS.TOPICS)),
      getDocs(collection(db, COLLECTIONS.CONCEPTS)),
    ]);

    // Add delete operations to batch
    subjects.docs.forEach((doc) => batch.delete(doc.ref));
    topics.docs.forEach((doc) => batch.delete(doc.ref));
    concepts.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
  },
};

// Search operations
export const searchService = {
  // Search across all content
  async searchContent(query, contentType = "all") {
    const results = [];
    const searchTerm = query.toLowerCase();

    if (contentType === "all" || contentType === "subjects") {
      const subjects = await subjectService.getAll();
      const matchingSubjects = subjects.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm) ||
          subject.description.toLowerCase().includes(searchTerm)
      );
      results.push(...matchingSubjects.map((s) => ({ ...s, type: "subject" })));
    }

    if (contentType === "all" || contentType === "topics") {
      const topics = await topicService.getAll();
      const matchingTopics = topics.filter(
        (topic) =>
          topic.name.toLowerCase().includes(searchTerm) ||
          topic.description.toLowerCase().includes(searchTerm)
      );
      results.push(...matchingTopics.map((t) => ({ ...t, type: "topic" })));
    }

    if (contentType === "all" || contentType === "concepts") {
      const concepts = await conceptService.getAll();
      const matchingConcepts = concepts.filter(
        (concept) =>
          concept.title.toLowerCase().includes(searchTerm) ||
          (concept.content?.en?.body &&
            concept.content.en.body.toLowerCase().includes(searchTerm))
      );
      results.push(...matchingConcepts.map((c) => ({ ...c, type: "concept" })));
    }

    return results;
  },
};
