import React from "react";

export default function AuthBanner() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 min-h-screen bg-[#FEEEF0] p-12 select-none">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center">
        {/* Auth Banner Vector Illustration matching login.html auth-1.svg */}
        <div className="login-banner mb-8 flex items-center justify-center">
          <svg
            className="w-64 h-56 max-w-full"
            viewBox="0 0 260 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft ground circle */}
            <ellipse cx="130" cy="195" rx="100" ry="12" fill="#F8D7DA" opacity="0.6" />

            {/* Laptop Base */}
            <rect x="45" y="160" width="170" height="12" rx="6" fill="#392C7D" />
            <path d="M110 160H150V164H110V160Z" fill="#E2E8F0" />
            <rect x="62" y="85" width="136" height="78" rx="8" fill="#1E293B" />
            <rect x="68" y="91" width="124" height="66" rx="4" fill="#FFFFFF" />

            {/* Laptop Screen Content: Academic Chart & Elements */}
            <rect x="76" y="99" width="40" height="6" rx="3" fill="#392C7D" />
            <rect x="76" y="109" width="60" height="4" rx="2" fill="#E2E8F0" />
            <rect x="76" y="117" width="50" height="4" rx="2" fill="#E2E8F0" />

            <circle cx="160" cy="120" r="18" fill="#FEEEF0" />
            <path d="M160 106L148 113L160 120L172 113L160 106Z" fill="#392C7D" />
            <path d="M152 115V124C152 126 155.5 128 160 128C164.5 128 168 126 168 124V115" fill="#392C7D" />
            <circle cx="172" cy="119" r="1.5" fill="#FF4667" />

            {/* Left Stack of Books */}
            <rect x="25" y="152" width="38" height="8" rx="2" fill="#FF4667" />
            <rect x="28" y="142" width="32" height="8" rx="2" fill="#392C7D" />
            <rect x="24" y="132" width="36" height="8" rx="2" fill="#FF8C94" />

            {/* Right Academic Trophy & Badge */}
            <path d="M212 140H228V152C228 158 223 162 217 162H215C209 162 204 158 204 152V140H220" fill="#FFD166" />
            <rect x="212" y="162" width="6" height="8" fill="#F4A261" />
            <rect x="206" y="170" width="18" height="4" rx="2" fill="#392C7D" />

            {/* Floating Sparkles & Graduation Cap */}
            <path d="M130 36L85 60L130 84L175 60L130 36Z" fill="#392C7D" />
            <path d="M102 68V90C102 96 114 104 130 104C146 104 158 96 158 90V68" fill="#392C7D" />
            <path d="M175 60V86" stroke="#FF4667" strokeWidth="3" strokeLinecap="round" />
            <circle cx="175" cy="88" r="3.5" fill="#FF4667" />

            {/* Floating Star & Sparkles */}
            <circle cx="48" cy="70" r="3" fill="#FF4667" />
            <circle cx="210" cy="80" r="4" fill="#FFD166" />
            <circle cx="190" cy="40" r="2.5" fill="#392C7D" />
          </svg>
        </div>

        {/* Mentor Course Text Section matching screenshot */}
        <div className="mentor-course text-center max-w-sm">
          <h3 className="text-2xl sm:text-[28px] font-bold text-slate-900 mb-3 leading-snug">
            Welcome to <br />
            Edu<span className="text-[#FF4667]">Institute</span> Courses.
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.
          </p>
        </div>
      </div>
    </div>
  );
}
