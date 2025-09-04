import React from "react";
import { Hero } from "@/components/ui/animated-hero";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10">
        <div className="bg-[#C4282B] h-16 flex justify-between items-center px-4 shadow-sm">
          <h2 className="text-2xl font-bold text-white w-[260px] text-center flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            ANT Notes
          </h2>
          <div className="w-[260px] flex justify-end">
            <Button 
              onClick={handleSignIn}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <Hero onGetStartedClick={handleSignIn} />
      
      <div className="container mx-auto mt-12 mb-20 flex flex-col items-center justify-center">
        <div className="max-w-3xl text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Why Choose ANT Notes?</h2>
          <p className="text-muted-foreground">Our app makes it easy to organize and manage your notes with powerful features.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#C4282B]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C4282B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
            <p className="text-muted-foreground text-sm">Simple interface that makes note-taking and organization a breeze.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#C4282B]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C4282B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Stay Organized</h3>
            <p className="text-muted-foreground text-sm">Create note groups and categories to keep everything in order.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#C4282B]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#C4282B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
            <p className="text-muted-foreground text-sm">Your notes are protected with secure authentication and available anywhere.</p>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="gap-4 mt-12 bg-[#C4282B] hover:bg-[#A52224]" 
          onClick={handleSignIn}
        >
          Start using ANT Notes now <MoveRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
