"use client";

import React from "react";

export function getPasswordSecurity(password) {
  if (!password) {
    return { score: 0, level: "", color: "bg-slate-200", textColor: "text-slate-400" };
  }

  const length = password.length;
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumbersOrSymbols = /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password);

  if (length >= 9 && hasMixed && hasNumbersOrSymbols) {
    return { score: 4, level: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600" };
  } else if (length >= 6) {
    return { score: 2, level: "Medium", color: "bg-amber-500", textColor: "text-amber-600" };
  } else {
    return { score: 1, level: "Weak", color: "bg-[#FF4667]", textColor: "text-[#FF4667]" };
  }
}

export default function PasswordStrength({ password }) {
  const { score, level, color, textColor } = getPasswordSecurity(password);

  return (
    <div className="mt-2.5 space-y-1.5">
      {/* 4 Horizontal Segment Bars matching register.html and screenshot */}
      <div className="grid grid-cols-4 gap-2 h-1.5 w-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 1 ? color : "bg-slate-200"
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 2 ? color : "bg-slate-200"
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 3 ? color : "bg-slate-200"
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 4 ? color : "bg-slate-200"
          }`}
        />
      </div>

      {level && (
        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-slate-500">Password Security:</span>
          <span className={`font-bold ${textColor}`}>
            {level}
          </span>
        </div>
      )}
    </div>
  );
}
