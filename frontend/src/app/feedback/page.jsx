"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  getFeedbacks,
  addFeedback,
  getCurrentUser,
  initializeStorage,
} from "../../lib/storage";
import {
  Star,
  MessageSquareHeart,
  Send,
  User,
  CheckCircle2,
  BookOpen,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "2026-11-04";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "2026-11-04" : d.toISOString().slice(0, 10);
  } catch {
    return "2026-11-04";
  }
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [studentName, setStudentName] = useState("");
  const [courseDetails, setCourseDetails] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();
    if (user?.fullName) {
      setStudentName(user.fullName);
    }
    setFeedbacks(getFeedbacks());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !courseDetails.trim() || !feedbackText.trim()) {
      alert("Please provide student name, course details, and your feedback comments.");
      return;
    }
    if (!rating || rating === 0) {
      alert("Please select a star rating for the course.");
      return;
    }

    const newEntry = addFeedback({
      studentName: studentName.trim(),
      courseDetails: courseDetails.trim(),
      rating,
      feedback: feedbackText.trim(),
    });

    setFeedbacks([newEntry, ...feedbacks]);
    setCourseDetails("");
    setFeedbackText("");
    setRating(0);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesRating =
      selectedRatingFilter === "all" ||
      item.rating === Number(selectedRatingFilter);
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.feedback.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 5), 0) /
          feedbacks.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Simple Page Header with Metrics */}
        <div className="mb-8 pb-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Course Feedback
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Submit your academic course evaluation and view live feedback from students.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-slate-500">Average:</span>
              <span className="text-sm font-extrabold text-[#392C7D]">{avgRating} / 5.0</span>
            </div>

            <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Evaluations:</span>
              <span className="text-sm font-extrabold text-[#FF4667]">{feedbacks.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feedback Submission Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-100 bg-[#FEEEF0]/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#392C7D] to-[#FF4667] flex items-center justify-center text-white shadow-2xs">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Share Your Feedback
                  </h2>
                  {/* <p className="text-[11px] text-slate-500">
                    Your evaluation directly shapes academic excellence
                  </p> */}
                </div>
              </div>

            </div>

            <div className="p-6 space-y-4">
              {submitted && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    Thank you! Your feedback has been recorded successfully.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Student Name <span className="text-[#FF4667]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#FF4667] focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course Details <span className="text-[#FF4667]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={courseDetails}
                      onChange={(e) => setCourseDetails(e.target.value)}
                      placeholder="e.g. CS204 - Software Engineering & Architecture"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#FF4667] focus:ring-2 focus:ring-rose-100 transition-all font-medium"
                      required
                    />
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Rating Component: Starts blank */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Overall Rating <span className="text-[#FF4667]">*</span>
                    </label>
                    <span className="text-[11px] font-bold text-slate-500">
                      {rating > 0 ? `${rating} of 5 Stars` : "Select star rating"}
                    </span>
                  </div>

                  <div className="flex items-center justify-start pt-1">
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-slate-300 hover:text-amber-400 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              (hoverRating || rating) >= star
                                ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                : "fill-transparent text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Feedback <span className="text-[#FF4667]">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {feedbackText.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write your feedback regarding the course curriculum, learning pace, and hands-on exercises..."
                    className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#FF4667] focus:ring-2 focus:ring-rose-100 transition-all leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#FF4667] hover:bg-[#ED1143] text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Feed of Feedback */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name or course..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#FF4667]"
                />
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedRatingFilter}
                  onChange={(e) => setSelectedRatingFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#FF4667]"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars only</option>
                  <option value="3">3 Stars only</option>
                  <option value="2">2 Stars only</option>
                  <option value="1">1 Star only</option>
                </select>
              </div>
            </div>

            <div className="space-y-3.5">
              {filteredFeedbacks.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs sm:text-sm shadow-xs">
                  No feedback found matching your criteria.
                </div>
              ) : (
                filteredFeedbacks.map((item) => {
                  const initial = item.studentName
                    ? item.studentName.charAt(0).toUpperCase()
                    : "S";

                  return (
                    <div
                      key={item.id}
                      className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200/80 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#392C7D] to-[#4d3d9e] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {initial}
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                              {item.studentName}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {item.courseDetails}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-xl shrink-0">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  item.rating >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-amber-800">
                            {item.rating}.0
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal">
                        &quot;{item.feedback}&quot;
                      </div>

                      <div className="flex items-center justify-end text-[11px] text-slate-400 pt-0.5 font-medium">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(item.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
