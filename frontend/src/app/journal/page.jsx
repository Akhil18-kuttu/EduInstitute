"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import RichTextEditor from "../../components/RichTextEditor";
import {
  getJournalDocuments,
  saveJournalDocument,
  resetJournalDocuments,
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
  X,
  BookOpen,
  Eye,
  ArrowRight,
  PenLine,
} from "lucide-react";

function getExcerpt(html, maxLength = 140) {
  if (!html) return "No content preview available.";
  const clean = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return "No content preview available.";
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength) + "...";
}

function formatDate(dateStr) {
  if (!dateStr) return "Nov 4, 2026";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Nov 4, 2026";
  }
}

export default function JournalPage() {
  const [journals, setJournals] = useState([]);
  const [activeModalDoc, setActiveModalDoc] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Editor Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic Syllabus");
  const [author, setAuthor] = useState("Prof. Sarah Connor");
  const [contentHtml, setContentHtml] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    initializeStorage();
    const user = getCurrentUser();
    if (user?.fullName) {
      setAuthor(user.fullName);
    }
    const docs = getJournalDocuments();
    setJournals(docs);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalDoc(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for the journal.");
      return;
    }
    if (!contentHtml.trim() || contentHtml.trim() === "<p><br></p>") {
      alert("Please enter description or content for the journal.");
      return;
    }

    saveJournalDocument({
      id: editingId,
      title: title.trim(),
      category: category.trim(),
      author: author.trim() || "Edu Institute Faculty",
      contentHtml: contentHtml,
    });

    // Refresh list from storage
    const updated = getJournalDocuments();
    setJournals(updated);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    // Reset Form for next entry
    setTitle("");
    setContentHtml("");
    setEditingId(null);
    setShowLivePreview(false);
  };

  const handleClearForm = () => {
    setEditingId(null);
    setTitle("");
    setContentHtml("");
    setShowLivePreview(false);
  };

  const handleEditFromModal = (doc) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setCategory(doc.category || "Academic Syllabus");
    setAuthor(doc.author || "Prof. Sarah Connor");
    setContentHtml(doc.contentHtml || "");
    setActiveModalDoc(null);
  };

  const handleResetToSamples = () => {
    if (confirm("Reset journals to default 2 sample journals?")) {
      const samples = resetJournalDocuments();
      setJournals(samples);
      handleClearForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Page Top Header */}
        <div className="pb-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Academic Journals &amp; Course Syllabi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compose journals on the left. Browse published journal cards on the right and click any card to inspect full content in a popup.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetToSamples}
              className="text-xs font-semibold px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center space-x-1.5"
              title="Reset to 2 sample journals"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2.5 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Journal saved successfully!</span>
              <span className="ml-1 text-emerald-700">
                Added to the journals list on the right. Click the card anytime to view the full popup.
              </span>
            </div>
          </div>
        )}

        {/* TWO COLUMN LAYOUT: LEFT SIDE STICKY EDITOR, RIGHT SIDE SCROLLING JOURNALS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: STICKY EDITOR (Remains in position while scrolling) */}
          <div className="lg:col-span-6 lg:sticky lg:top-6 self-start space-y-4">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <PenLine className="w-4 h-4 text-[#FF4667]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">
                    {editingId ? "Edit Journal Entry" : "Compose New Journal"}
                  </h2>
                </div>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="text-xs font-bold text-[#FF4667] hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Journal Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Journal Title <span className="text-[#FF4667]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Systems & Cloud Microservices"
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#FF4667] focus:ring-2 focus:ring-rose-100 transition-all"
                    required
                  />
                </div>

                {/* Author & Category Grid */}
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
                        className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF4667]"
                        required
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF4667]"
                    >
                      <option value="Academic Syllabus">Academic Syllabus</option>
                      <option value="Research & Methodology">Research & Methodology</option>
                      <option value="Course Module Overview">Course Module Overview</option>
                      <option value="Institutional Notice">Institutional Notice</option>
                      <option value="Lab & Project Manual">Lab & Project Manual</option>
                    </select>
                  </div>
                </div>

                {/* Content & Rich Text Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Content &amp; Description <span className="text-[#FF4667]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className="text-xs font-semibold text-slate-500 hover:text-[#FF4667] transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showLivePreview ? "Hide Preview" : "Live Preview"}</span>
                    </button>
                  </div>

                  <RichTextEditor
                    value={contentHtml}
                    onChange={(newHtml) => setContentHtml(newHtml)}
                    placeholder="Enter journal description, milestones, or syllabus details..."
                    editorHeight="min-h-[160px] max-h-[240px]"
                  />

                  {/* Optional Live Preview inside Editor */}
                  {showLivePreview && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 max-h-[180px] overflow-y-auto animate-in fade-in">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Live Preview
                      </div>
                      {contentHtml ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: contentHtml }}
                          className="prose prose-slate max-w-none text-xs text-slate-800 leading-relaxed [&>h1]:text-base [&>h1]:font-bold [&>h2]:text-sm [&>h2]:font-bold [&>h3]:text-xs [&>h3]:font-semibold [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>blockquote]:border-l-2 [&>blockquote]:border-[#FF4667] [&>blockquote]:pl-2 [&>blockquote]:italic"
                        />
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Type content above to preview here...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#FF4667] hover:bg-[#ED1143] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? "Update Journal" : "Save & Add Journal"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE: JOURNALS CARDS (Scrolls up while editor remains sticky) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">
                  Published Journals
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                  {isMounted ? journals.length : 2}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Click card to open popup
              </span>
            </div>

            {/* List of Journal Cards */}
            <div className="space-y-4">
              {journals.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setActiveModalDoc(doc)}
                  className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-[#FF4667]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Category and Date Row */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#FF4667] border border-rose-200/60">
                        <Tag className="w-3 h-3 mr-1" />
                        {doc.category || "Academic Syllabus"}
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {isMounted ? formatDate(doc.createdAt || doc.updatedAt) : "Nov 4, 2026"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] group-hover:text-[#FF4667] transition-colors leading-snug line-clamp-2 mb-2">
                      {doc.title}
                    </h3>

                    {/* Excerpt preview */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {getExcerpt(doc.contentHtml, 150)}
                    </p>
                  </div>

                  {/* Footer of Card */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-[140px] sm:max-w-[180px]">
                        {doc.author || "Faculty Member"}
                      </span>
                    </div>

                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#FF4667] group-hover:translate-x-1 transition-transform">
                      <span>View Journal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* POPUP MODAL: DISPLAY FULL JOURNAL ON CARD CLICK */}
      {activeModalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalDoc(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="inline-flex items-center px-3 py-1 rounded-full font-bold bg-rose-50 text-[#FF4667] border border-rose-200/60">
                    <Tag className="w-3 h-3 mr-1" />
                    {activeModalDoc.category || "Academic Syllabus"}
                  </span>
                  <span className="flex items-center text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {formatDate(activeModalDoc.createdAt || activeModalDoc.updatedAt)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
                  {activeModalDoc.title}
                </h2>

                <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Author:{" "}
                    <strong className="text-slate-800">
                      {activeModalDoc.author || "Faculty Member"}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>Edu Institute</span>
                </div>
              </div>

              {/* Close (X) button */}
              <button
                type="button"
                onClick={() => setActiveModalDoc(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Close Popup (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body - Full Formatted HTML Content */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 text-slate-800">
              <div
                dangerouslySetInnerHTML={{ __html: activeModalDoc.contentHtml }}
                className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-4 [&>h1]:mb-2 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-4 [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-1.5 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-[#FF4667] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>blockquote]:my-3 [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>hr]:my-4 [&>hr]:border-slate-200"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleEditFromModal(activeModalDoc)}
                className="inline-flex items-center space-x-1.5 text-slate-700 hover:text-[#FF4667] font-bold cursor-pointer transition-colors"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Edit in Left Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalDoc(null)}
                className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
