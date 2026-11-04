import React from "react";
import Link from "next/link";

export default function EduLogo({ className = "", href = "/login" }) {
  const content = (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Graduation Cap Icon matching screenshot */}
      <div className="relative flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[#392C7D]"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diamond Cap */}
          <path
            d="M16 4L3 11L16 18L29 11L16 4Z"
            fill="#392C7D"
          />
          {/* Cap Skull Base */}
          <path
            d="M8 15V22C8 24.5 11.5 27 16 27C20.5 27 24 24.5 24 22V15"
            fill="#392C7D"
          />
          {/* Tassel */}
          <path
            d="M26 12.5V20"
            stroke="#FF4667"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="26" cy="21" r="2" fill="#FF4667" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex items-baseline">
        <span className="text-2xl font-black tracking-tight text-[#1E293B]">
          Edu<span className="text-[#FF4667]">Institute</span>
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
