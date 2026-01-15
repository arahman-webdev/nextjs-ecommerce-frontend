"use client";

import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#83B734]/5 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#83B734]/15">
            <ShieldAlert className="w-8 h-8 text-[#83B734]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          You don’t have permission to access this page.
          <br />
          Please log in with the correct account or return to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#83B734] px-6 py-3 text-white font-semibold shadow hover:bg-[#72a12f] transition"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#83B734] px-6 py-3 text-[#83B734] font-semibold hover:bg-[#83B734]/10 transition"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-gray-400">
          Error code: 403 – Unauthorized
        </p>
      </div>
    </div>
  );
}
