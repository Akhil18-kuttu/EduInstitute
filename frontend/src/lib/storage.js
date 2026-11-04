// Client-side JSON Storage Engine (No database/backend required)
// Stores and persists Users, Session, Course Feedbacks, and Journal Documents in localStorage

const USERS_KEY = "edu_institute_users";
const SESSION_KEY = "edu_institute_current_user";
const FEEDBACKS_KEY = "edu_institute_feedbacks";
const DOCUMENTS_KEY = "edu_institute_journal_documents";

// Initial Demo Seed Data
const DEFAULT_USERS = [
  {
    id: "usr_101",
    fullName: "Alex Morgan",
    email: "student@eduinstitute.edu",
    password: "Password@123",
    role: "Student",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_102",
    fullName: "Alex Morgan",
    email: "student@dreamslms.edu",
    password: "Password@123",
    role: "Student",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_103",
    fullName: "Dr. Sarah Connor",
    email: "instructor@eduinstitute.edu",
    password: "Password@123",
    role: "Faculty",
    createdAt: "2026-11-02T11:30:00Z",
  },
];

const DEFAULT_FEEDBACKS = [
  {
    id: "fb_001",
    studentName: "Alex Morgan",
    courseDetails: "Web Engineering & Architecture",
    rating: 5,
    feedback:
      "The curriculum provides an exceptional blend of computer science foundations and modern frontend systems. Real-world lab exercises were very engaging and clear.",
    createdAt: "2026-11-03T14:20:00Z",
  },
  {
    id: "fb_002",
    studentName: "Emily Davis",
    courseDetails: "Cloud Computing & Microservices",
    rating: 4,
    feedback:
      "Comprehensive course material with great clarity on distributed network protocols and infrastructure scaling. Highly recommended for students.",
    createdAt: "2026-11-04T09:15:00Z",
  },
];

const DEFAULT_DOCUMENTS = [
  {
    id: "doc_001",
    title: "Spring 2026 Academic Syllabus & Architecture Guidelines",
    category: "Academic Syllabus",
    author: "Prof. Sarah Connor",
    contentHtml: `
      <h2>1. Course Overview & Learning Objectives</h2>
      <p>Welcome to the <strong>Software Systems & Architecture</strong> curriculum at Edu Institute. In this module, students investigate component lifecycles, state architecture, and client-side data pipelines.</p>
      
      <h3>2. Weekly Milestones</h3>
      <ul>
        <li><strong>Week 1-2:</strong> App Router architecture, component composition, and layout orchestration</li>
        <li><strong>Week 3-4:</strong> WYSIWYG editor integration, live preview synchronization, and dynamic DOM parsing</li>
        <li><strong>Week 5-6:</strong> High-performance client-side data stores, accessibility, and UX benchmarks</li>
      </ul>

      <blockquote>
        "Continuous learning is the minimum requirement for success in any field." — Brian Tracy
      </blockquote>

      <h3>3. Grading & Evaluation Scheme</h3>
      <p>Assessment is divided into <em>Hands-on Project Lab work (40%)</em>, <em>Midterm Course Evaluation (30%)</em>, and <em>Capstone Submission (30%)</em>.</p>
    `,
    createdAt: "2026-11-03T10:00:00Z",
    updatedAt: "2026-11-03T10:00:00Z",
  },
  {
    id: "doc_002",
    title: "Modern Distributed Systems & Cloud Microservices Analysis",
    category: "Research & Methodology",
    author: "Dr. Robert Vance",
    contentHtml: `
      <h2>1. Executive Summary & Research Scope</h2>
      <p>This academic journal document examines modern engineering practices for horizontal scalability, API gateway orchestration, and event-driven microservices deployed across enterprise cloud environments.</p>

      <h3>2. Core Architectural Pillars</h3>
      <ul>
        <li><strong>Service Discovery:</strong> Autonomous registry synchronization and health check protocols</li>
        <li><strong>Resilience Patterns:</strong> Circuit breakers, exponential backoff retries, and graceful degradation</li>
        <li><strong>Data Consistency:</strong> Eventual consistency models via Saga orchestrators and distributed state sync</li>
      </ul>

      <blockquote>
        "Architecture is the decisions that you wish you could get right early in a project." — Ralph Johnson
      </blockquote>

      <h3>3. Performance Benchmarks</h3>
      <p>Benchmarked distributed systems demonstrate a <em>42% reduction in p99 latency</em> and zero downtime during blue-green deployment cycles.</p>
    `,
    createdAt: "2026-11-04T09:15:00Z",
    updatedAt: "2026-11-04T09:15:00Z",
  },
];

const isBrowser = typeof window !== "undefined";

function safeGet(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing key ${key} to localStorage:`, err);
  }
}

export function initializeStorage() {
  if (!isBrowser) return;
  if (!localStorage.getItem(USERS_KEY)) {
    safeSet(USERS_KEY, DEFAULT_USERS);
  }
  if (!localStorage.getItem(FEEDBACKS_KEY)) {
    safeSet(FEEDBACKS_KEY, DEFAULT_FEEDBACKS);
  }
  const currentDocs = safeGet(DOCUMENTS_KEY, null);
  if (!currentDocs || !Array.isArray(currentDocs) || currentDocs.length === 0) {
    safeSet(DOCUMENTS_KEY, DEFAULT_DOCUMENTS);
  } else if (currentDocs.length === 1 && currentDocs[0].id === "doc_001") {
    // Seamlessly upgrade from single sample to both sample journals
    safeSet(DOCUMENTS_KEY, DEFAULT_DOCUMENTS);
  }
}

// User Operations
export function getUsers() {
  return safeGet(USERS_KEY, DEFAULT_USERS);
}

export function registerUser({ fullName, email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: password,
    role: "Student",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  safeSet(USERS_KEY, users);
  return newUser;
}

export function loginUser(email, password) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password. Please verify your credentials.");
  }

  const sessionData = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };

  safeSet(SESSION_KEY, sessionData);
  return sessionData;
}

export function getCurrentUser() {
  return safeGet(SESSION_KEY, null);
}

export function logoutUser() {
  if (!isBrowser) return;
  localStorage.removeItem(SESSION_KEY);
}

// Feedback Operations
export function getFeedbacks() {
  return safeGet(FEEDBACKS_KEY, DEFAULT_FEEDBACKS);
}

export function addFeedback(feedbackData) {
  const feedbacks = getFeedbacks();
  const newFeedback = {
    id: `fb_${Date.now()}`,
    studentName: feedbackData.studentName || "Anonymous Student",
    courseDetails: feedbackData.courseDetails || "Course Module",
    rating: Number(feedbackData.rating) || 5,
    feedback: feedbackData.feedback || "",
    createdAt: new Date().toISOString(),
  };

  const updated = [newFeedback, ...feedbacks];
  safeSet(FEEDBACKS_KEY, updated);
  return newFeedback;
}

// Journal Documents Operations
export function getJournalDocuments() {
  return safeGet(DOCUMENTS_KEY, DEFAULT_DOCUMENTS);
}

export function saveJournalDocument(doc) {
  const docs = getJournalDocuments();
  const existingIndex = doc.id ? docs.findIndex((d) => d.id === doc.id) : -1;

  const now = new Date().toISOString();
  const documentToSave = {
    id: doc.id || `doc_${Date.now()}`,
    title: doc.title || "Journal Title",
    category: doc.category || "Academic Syllabus",
    author: doc.author || "Faculty Member",
    contentHtml: doc.contentHtml || "",
    createdAt: existingIndex >= 0 ? (docs[existingIndex].createdAt || now) : now,
    updatedAt: now,
  };

  let updated;
  if (existingIndex >= 0) {
    updated = [...docs];
    updated[existingIndex] = documentToSave;
  } else {
    updated = [documentToSave, ...docs];
  }

  safeSet(DOCUMENTS_KEY, updated);
  return documentToSave;
}

export function deleteJournalDocument(id) {
  const docs = getJournalDocuments();
  const updated = docs.filter((d) => d.id !== id);
  safeSet(DOCUMENTS_KEY, updated);
  return updated;
}

export function resetJournalDocuments() {
  safeSet(DOCUMENTS_KEY, DEFAULT_DOCUMENTS);
  return DEFAULT_DOCUMENTS;
}

