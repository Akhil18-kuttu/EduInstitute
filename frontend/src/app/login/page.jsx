"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBanner from "../../components/AuthBanner";
import EduLogo from "../../components/EduLogo";
import { loginUser, initializeStorage } from "../../lib/storage";
import {
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    initializeStorage();
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setRegisteredSuccess(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setError("Please enter your account password.");
      return;
    }

    setLoading(true);
    try {
      loginUser(email, password);
      router.push("/feedback");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("student@eduinstitute.edu");
    setPassword("Password@123");
    setError("");
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans antialiased">
      {/* Left Column: Full-height #FEEEF0 banner (not a box/card) */}
      <AuthBanner />

      {/* Right Column: Full-height white section (not a box/card) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center px-6 sm:px-14 xl:px-24 py-10 bg-white">
        <div className="w-full max-w-[480px] mx-auto">
          {/* Header matching login.html: Logo on left, Back to Home on right */}
          <div className="flex items-center justify-between mb-8">
            <EduLogo href="/login" />
            <Link
              href="/feedback"
              className="text-sm font-semibold text-[#FF4667] hover:underline transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight mb-2">
            Sign into Your Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Access your course curriculum and academic evaluations.
          </p>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#FEEEF0] border border-rose-200/60 flex items-center justify-between text-xs">
            <div className="text-slate-700">
              <span className="font-bold text-slate-900">Demo Login:</span>{" "}
              <code className="font-mono text-[#FF4667]">student@eduinstitute.edu</code> / <code>Password@123</code>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="font-bold text-[#FF4667] hover:underline cursor-pointer"
            >
              Auto Fill
            </button>
          </div>

          {registeredSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Registration successful! Please sign in with your credentials.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form matching login.html */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Email <span className="text-[#FF4667]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.eduinstitute.edu"
                  className="w-full h-12 px-4 pr-11 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF4667] focus:ring-1 focus:ring-[#FF4667] transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Password <span className="text-[#FF4667]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-11 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF4667] focus:ring-1 focus:ring-[#FF4667] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#FF4667] focus:ring-[#FF4667]"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Password reset instructions will be delivered to your registered email.")}
                className="font-medium text-[#FF4667] hover:underline cursor-pointer"
              >
                Forgot Password ?
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#FF4667] hover:bg-[#ED1143] text-white font-bold rounded-xl text-base flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-rose-500/20 active:scale-[0.99]"
              >
                <span>{loading ? "Authenticating..." : "Login"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Or Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-sm font-medium text-slate-400">
              Or
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => alert("Google single sign-on demonstration.")}
              className="h-11 flex items-center justify-center space-x-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Facebook single sign-on demonstration.")}
              className="h-11 flex items-center justify-center space-x-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center text-sm text-slate-600">
            Don&apos;t you have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#FF4667] hover:underline ml-1"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
