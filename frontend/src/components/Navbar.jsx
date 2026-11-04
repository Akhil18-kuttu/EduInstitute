"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "../lib/storage";
import EduLogo from "./EduLogo";
import {
  MessageSquareHeart,
  FileEdit,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* New Edu Institute Brand Logo */}
          <EduLogo href="/feedback" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/feedback"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === "/feedback"
                  ? "bg-rose-50 text-[#FF4667] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Feedback</span>
            </Link>

            <Link
              href="/journal"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === "/journal"
                  ? "bg-rose-50 text-[#FF4667] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Journal</span>
            </Link>
          </nav>

          {/* Right Profile & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center pl-3 border-l border-slate-200 space-x-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#392C7D] to-[#4d3d9e] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {user.role || "Student"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#FF4667] hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#392C7D]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF4667] hover:bg-[#ED1143] rounded-xl shadow-md shadow-rose-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/feedback"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-[#FF4667]"
          >
            <MessageSquareHeart className="w-4 h-4 text-[#FF4667]" />
            <span>Feedback</span>
          </Link>

          <Link
            href="/journal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-[#FF4667]"
          >
            <FileEdit className="w-4 h-4 text-indigo-500" />
            <span>Journal</span>
          </Link>

          {user && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-600">
                  Signed in as <strong>{user.fullName}</strong>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-[#FF4667] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
