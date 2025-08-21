import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { NotesApp } from "./NotesApp";
import { UserAccountMenu } from "./UserAccountMenu";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-gray-800">Ghi chú nhanh</h2>
        <Authenticated>
          <UserAccountMenu />
        </Authenticated>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Ghi chú của bạn</h1>
          <p className="text-xl text-gray-600 mb-8">Đăng nhập để bắt đầu ghi chú</p>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
