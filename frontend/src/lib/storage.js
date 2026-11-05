// Client-side JSON Storage Engine (No database/backend required)
// Stores and persists Users, Session, Feedback, and Journal Documents in localStorage

const USERS_KEY = "edu_institute_users";
const SESSION_KEY = "edu_institute_current_user";
const FEEDBACKS_KEY = "edu_institute_feedbacks";
const DOCUMENTS_KEY = "edu_institute_journal_documents";

// Initial Demo Seed Data
const DEFAULT_USERS = [
  {
    id: "usr_101",
    fullName: "Alex Morgan",
    email: "user@sessionportal.com",
    password: "Password@123",
    role: "Member",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_102",
    fullName: "Alex Morgan",
    email: "student@eduinstitute.edu",
    password: "Password@123",
    role: "Member",
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_103",
    fullName: "Sarah Connor",
    email: "instructor@eduinstitute.edu",
    password: "Password@123",
    role: "Lead",
    createdAt: "2026-11-02T11:30:00Z",
  },
];

const DEFAULT_FEEDBACKS = [
  {
    id: "fb_001",
    studentName: "Alex Morgan",
    courseDetails: "Financial Management",
    rating: 5,
    feedback:
      "The financial management session provided invaluable clarity on fiscal planning, risk assessment, and investment strategies. Highly recommended.",
    createdAt: "2026-11-03T14:20:00Z",
  },
  {
    id: "fb_002",
    studentName: "Emily Davis",
    courseDetails: "Law Session",
    rating: 4,
    feedback:
      "Exceptional coverage of corporate governance, compliance requirements, and regulatory contracts. The case study discussions were very engaging.",
    createdAt: "2026-11-04T09:15:00Z",
  },
];

const DEFAULT_DOCUMENTS = [
  {
    id: "doc_001",
    title: "Financial Management: Strategic Capital Allocation & Analysis",
    category: "Financial Management",
    author: "Sarah Connor",
    contentHtml: `
      <h2>1. Session Overview & Key Objectives</h2>
      <p>Welcome to the <strong>Financial Management</strong> session. In this session, participants examine corporate financial planning, cash flow forecasting, and capital structure optimization.</p>
      
      <h3>2. Session Outline</h3>
      <ul>
        <li><strong>Section 1:</strong> Balance sheet analysis, liquidity ratios, and working capital dynamics</li>
        <li><strong>Section 2:</strong> Capital budgeting techniques, NPV, IRR, and risk mitigation</li>
        <li><strong>Section 3:</strong> Long-term financing, investor reporting, and financial valuation models</li>
      </ul>

      <blockquote>
        "An investment in knowledge pays the best interest." — Benjamin Franklin
      </blockquote>

      <h3>3. Key Takeaways & Deliverables</h3>
      <p>Session deliverables include <em>Interactive Financial Models (40%)</em>, <em>Case Study Evaluations (30%)</em>, and <em>Strategic Investment Briefings (30%)</em>.</p>
    `,
    createdAt: "2026-11-03T10:00:00Z",
    updatedAt: "2026-11-03T10:00:00Z",
  },
  {
    id: "doc_002",
    title: "Law Session: Corporate Governance & Legal Compliance Frameworks",
    category: "Law Session",
    author: "Robert Vance",
    contentHtml: `
      <h2>1. Executive Summary & Legal Scope</h2>
      <p>This session examines essential legal frameworks for corporate governance, cross-border commercial contracts, intellectual property protection, and regulatory risk management.</p>

      <h3>2. Core Legal Pillars</h3>
      <ul>
        <li><strong>Corporate Compliance:</strong> Statutory filings, director liabilities, and ethics frameworks</li>
        <li><strong>Contract Law:</strong> Enforceability, indemnification clauses, and dispute resolution</li>
        <li><strong>Regulatory Governance:</strong> Data protection directives, labor standards, and audit readiness</li>
      </ul>

      <blockquote>
        "The leading rule for the lawyer, as for the man of every other calling, is diligence." — Abraham Lincoln
      </blockquote>

      <h3>3. Practical Applications</h3>
      <p>Participating organizations establish <em>streamlined compliance checklists</em> and proactive risk mitigation strategies for all enterprise operations.</p>
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
  const currentFeedbacks = safeGet(FEEDBACKS_KEY, null);
  if (
    !currentFeedbacks ||
    !Array.isArray(currentFeedbacks) ||
    currentFeedbacks.length === 0 ||
    currentFeedbacks.some((f) => f.courseDetails === "Web Engineering & Architecture")
  ) {
    safeSet(FEEDBACKS_KEY, DEFAULT_FEEDBACKS);
  }

  const currentUsers = safeGet(USERS_KEY, null);
  if (
    !currentUsers ||
    !Array.isArray(currentUsers) ||
    currentUsers.length === 0 ||
    !currentUsers.some((u) => u.email === "user@sessionportal.com")
  ) {
    safeSet(USERS_KEY, DEFAULT_USERS);
  }

  const currentDocs = safeGet(DOCUMENTS_KEY, null);
  if (
    !currentDocs ||
    !Array.isArray(currentDocs) ||
    currentDocs.length === 0 ||
    currentDocs.some((d) => d.title && d.title.includes("Spring 2026 Academic Syllabus"))
  ) {
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
    role: "Member",
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
    studentName: feedbackData.studentName || "Anonymous Member",
    courseDetails: feedbackData.courseDetails || "Financial Management",
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
    title: doc.title || "Session Notes",
    category: doc.category || "Session Outline",
    author: doc.author || "Session Lead",
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

