// Em: components/auth/social-logins.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { Chrome } from "lucide-react";

export function SocialLogins() {
  const { signInWithGoogle } = useAuth();

  return (
    <>
      {/* ===== 1. SEPARADOR MELHORADO ===== */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-500/20" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#0e0321] px-2 text-purple-200/60 font-light">
            OR
          </span>
        </div>
      </div>
      
      {/* ===== 2. BOTÃO DO GOOGLE ESTILIZADO ===== */}
      <div className="grid grid-cols-1">
        <Button 
          variant="outline" 
          className="w-full bg-white/5 border-purple-500/20 text-purple-200/80 hover:bg-purple-500/10 hover:text-purple-100 transition-colors" 
          onClick={signInWithGoogle}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
      </div>
    </>
  );
}