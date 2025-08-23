import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { NotesApp } from "./NotesApp";
import { UserAccountMenu } from "./UserAccountMenu";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10">
        <div className="bg-[#C4282B] h-16 flex justify-between items-center px-4 shadow-sm">
          <h2 className="text-2xl font-bold text-white w-[260px] text-center flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            ANT Notes
          </h2>
          <div className="flex-1 overflow-hidden mx-4">
            <div className="whitespace-nowrap animate-marquee text-center text-yellow-400 font-bold text-2xl">
              ★ VIỆT NAM ★ VIỆT NAM ★ VIỆT NAM ★ 
              VIỆT NAM ★ VIỆT NAM ★ VIỆT NAM ★ VIỆT NAM ★
            </div>
          </div>
          <div className="w-[260px] flex justify-end">
            <Authenticated>
              <UserAccountMenu />
            </Authenticated>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <NotesApp />
      </Authenticated>
      <Unauthenticated>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">TUẤN ANH</h1>
          <p className="text-xl text-gray-600 mb-8">Ghi chú cá nhân</p>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
