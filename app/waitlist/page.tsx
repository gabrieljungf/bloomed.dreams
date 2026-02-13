// FILE: app/waitlist/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { PageBackground } from "@/components/page-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const titleDisplayFontClass = 'font-display-cormorant'; // ou 'font-display-marcellus'
  const titleFontWeightClass = 'font-semibold';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      // Não precisa setar isSubmitting se a validação falhar no cliente
      return;
    }

    setIsSubmitting(true); // Começa o loading

    try {
      // --- CHAMADA REAL À API ---
      const response = await fetch('/api/join-waitlist', { // Chama seu endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), // Envia o email no corpo da requisição
      });

      const data = await response.json(); // Tenta parsear a resposta da API

      if (!response.ok) {
        // Se a resposta da API não for OK (ex: status 400, 500),
        // usa a mensagem de erro da API ou uma padrão.
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Se chegou aqui, a inscrição foi bem-sucedida (status 200 ou 201 da API)
      console.log("WaitlistPage: Email submission successful:", data.message);
      setSubmitted(true); // Mostra a mensagem de sucesso

    } catch (err: any) {
      console.error("WaitlistPage: Error submitting email:", err);
      setError(err.message || "An error occurred. Please try again.");
      setSubmitted(false); // Garante que o formulário ainda seja mostrado se houver erro na API
    } finally {
      setIsSubmitting(false); // Para o loading independentemente do resultado
    }
    // --- FIM DA CHAMADA REAL À API ---
  };

  return (
    <PageBackground>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-10 md:mb-12"
        >
          <Logo variant="large" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#1e1133]/80 via-[#23103f]/80 to-[#2a1a46]/80 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/20"
        >
          {!submitted ? (
            <>
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-5 sm:mb-6" />
              <h1
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl text-purple-100 mb-3", // Removi tracking-tight daqui, ajuste se necessário
                  titleDisplayFontClass,
                  titleFontWeightClass
                )}
              >
                dream without limits.
              </h1>
              <p className="text-purple-200/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed font-sans">
                <br />
                Your dreams are ready to bloom into something more: Unlimited interpretations, your personal dream journal, in-depth pattern analysis.
                <br />
                <br />
                Join our waitlist and be the first to decode the messages your dreams have been sending you.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <Input
                    type="email"
                    name="email"
                    id="waitlist-email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-black/50 border-purple-500/30 text-purple-100 placeholder-purple-300/60 focus:ring-purple-500 focus:border-purple-500 h-11 text-sm sm:text-base"
                  />
                  {error && <p className="text-red-400 text-xs text-left mt-2 px-1">{error}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-sm sm:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/40 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>
            </>
          ) : (
            // Mensagem de Sucesso (como você já tinha)
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 mx-auto mb-6" />
                <h2
                  className={cn(
                    "text-xl sm:text-2xl md:text-3xl text-purple-100 mb-3",
                    titleDisplayFontClass,
                    titleFontWeightClass
                  )}
                >
                  You're On The List!
                </h2>
                <p className="text-purple-200/80 mb-8 text-sm sm:text-base font-sans">
                  Thank you for your interest. We'll be in touch soon with updates on new features.
                </p>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-purple-500/40 text-purple-200 hover:bg-purple-500/10 hover:text-purple-100 text-sm sm:text-base"
                  >
                    Back to Dream Decoder
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
        <p className="text-xs text-purple-300/60 mt-10 sm:mt-12">
          © {new Date().getFullYear()} Bloomed Dreams.
        </p>
      </div>
    </PageBackground>
  );
}
