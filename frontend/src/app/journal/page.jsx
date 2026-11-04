"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import RichTextEditor from "../../components/RichTextEditor";
import {
  getJournalDocuments,
  saveJournalDocument,
  getCurrentUser,
  initializeStorage,
} from "../../lib/storage";
import {
  Save,
  RotateCcw,
  Calendar,
  User,
  Tag,
  CheckCircle2,
} from "lucide-react";

const SAMPLE_DOCS = [
  {
    title: "Spring 2026 Academic Syllabus & Guidelines",
    category: "Academic Syllabus",
    author: "Prof. Sarah Connor",
    html: `
      <h2>1. Course Overview & Learning Objectives</h2>
      <p>Welcome to the <strong>Software Systems & Architecture</strong> course at Edu Institute. In this module, students investigate component lifecycles, state architecture, and client-side data pipelines.</p>
      
      <h3>2. Weekly Milestones</h3>
      <ul>
        <li><strong>Week 1-2:</strong> App Router architecture and nested layout orchestration</li>
        <li><strong>Week 3-4:</strong> WYSIWYG editor integration, live preview synchronization, and DOM parsing</li>
        <li><strong>Week 5-6:</strong> High-performance client-side data stores and UX design</li>
      </ul>

      <blockquote>
        "Continuous learning is the minimum requirement for success in any field." — Brian Tracy
      </blockquote>

      <h3>3. Grading & Evaluation Scheme</h3>
      <p>Assessment is divided into <em>Hands-on Project Lab work (40%)</em>, <em>Midterm Course Evaluation (30%)</em>, and <em>Capstone Submission (30%)</em>.</p>
    `,
  },
];

export default function JournalPage() {
  const [selectedDocId, setSelectedDocId] = useState(null);

  const [title, setTitle] = useState("Spring 2026 Academic Syllabus & Guidelines");
  const [category, setCategory] = useState("Academic Syllabus");
  const [author, setAuthor] = useState("Prof. Sarah Connor");
  const [contentHtml, setContentHtml] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();

    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );

    const docs = getJournalDocuments();

    if (docs.length > 0) {
      setSelectedDocId(docs[0].id);
      setTitle(docs[0].title);
      setCategory(docs[0].category || "Academic Syllabus");
      setAuthor(docs[0].author || (user?.fullName || "Prof. Sarah Connor"));
      setContentHtml(docs[0].contentHtml || "");
    } else {
      setContentHtml(SAMPLE_DOCS[0].html);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for the journal description.");
      return;
    }

    const savedDoc = saveJournalDocument({
      id: selectedDocId,
      title: title.trim(),
      category: category.trim(),
      author: author.trim() || "Edu Institute Faculty",
      contentHtml: contentHtml,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setSelectedDocId(savedDoc.id);
  };

  const handleReset = () => {
    if (confirm("Reset editor contents to default sample?")) {
      const sample = SAMPLE_DOCS[0];
      setTitle(sample.title);
      setCategory(sample.category);
      setAuthor(sample.author);
      setContentHtml(sample.html);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Simple Page Header */}
        <div className="mb-6 pb-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Journal Description &amp; Content Editor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Edit course descriptions, academic announcements, and journal syllabus details with instant live preview.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to Sample</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2.5 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Journal entry saved successfully!
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Form & Editor */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col space-y-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Journal Description Title <span className="text-[#FF4667]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter journal description title"
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#FF4667] focus:ring-2 focus:ring-rose-100 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author <span className="text-[#FF4667]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Prof. Sarah Connor"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF4667]"
                      required
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF4667]"
                  >
                    <option value="Academic Syllabus">Academic Syllabus</option>
                    <option value="Course Module Overview">Course Module Overview</option>
                    <option value="Institutional Notice">Institutional Notice</option>
                    <option value="Lab & Project Manual">Lab & Project Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Content &amp; Description
                </label>
                <RichTextEditor
                  value={contentHtml}
                  onChange={(newHtml) => setContentHtml(newHtml)}
                  placeholder="Enter detailed content, guidelines, or journal description..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FF4667] hover:bg-[#ED1143] text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Document Preview */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden flex flex-col">
            <div className="p-8 space-y-6 flex-1 min-h-[500px]">
              <div className="border-b border-slate-200/80 pb-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span className="flex items-center space-x-1 font-bold text-[#FF4667] bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
                    <Tag className="w-3.5 h-3.5 mr-1 text-[#FF4667]" />
                    {category}
                  </span>
                  <span className="flex items-center space-x-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {currentDate || "Nov 4, 2026"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
                  {title || "Journal Description Title"}
                </h2>

                <div className="flex items-center space-x-2 mt-3 text-xs text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Author: <strong className="text-slate-800">{author || "Edu Institute Faculty"}</strong>
                  </span>
                  <span>•</span>
                  <span>Edu Institute</span>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm">
                {contentHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    className="[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-4 [&>h1]:mb-2 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-4 [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-1.5 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-[#FF4667] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:my-3 [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>hr]:my-4 [&>hr]:border-slate-200"
                  />
                ) : (
                  <p className="text-slate-400 italic">
                    Content will render here in real time...
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live View</span>
              </span>
              <span>Edu Institute Portal</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
