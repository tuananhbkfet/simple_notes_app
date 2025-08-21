"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";

export function UserAccountMenu() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [isOpen, setIsOpen] = useState(false);

  if (loggedInUser === undefined) {
    return null;
  }

  if (loggedInUser === null) {
    return null;
  }

  const userName = loggedInUser.name ?? loggedInUser.email ?? "User";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">{userName}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <p className="font-semibold">Đăng nhập với</p>
            <p className="truncate">{userName}</p>
          </div>
          <div className="p-1">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}
