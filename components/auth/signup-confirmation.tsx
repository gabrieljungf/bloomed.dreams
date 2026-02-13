// Em: components/auth/signup-confirmation.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MailCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';

interface SignupConfirmationProps {
  email: string;
}

export function SignupConfirmation({ email }: SignupConfirmationProps) {
  const { resendConfirmation } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const [cooldown, setCooldown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else if (cooldown === 0) {
      setIsCountingDown(false);
    }
    return () => clearTimeout(timer);
  }, [cooldown, isCountingDown]);

  const parseCooldownSeconds = (message: string): number => {
    const match = message.match(/after (\d+) seconds/);
    return match ? parseInt(match[1], 10) : 60; 
  };
  
  const handleResend = async () => {
    if (isCountingDown) return;

    setIsLoading(true);
    setStatusMessage('');
    setIsError(false);

    try {
      await resendConfirmation(email);
      setStatusMessage('A new confirmation link has been sent!');
      setIsError(false);
    } catch (err: any) {
      // Adicionado para depuração - isso nos mostrará a estrutura exata do erro no console
      console.error("Full resend error object:", err);

      const errorMessage = err.message || 'Failed to resend.';
      
      // --- A CORREÇÃO ESTÁ AQUI ---
      // Verificamos err.status diretamente, em vez de err.response.status
      if (err.status === 429) {
        const seconds = parseCooldownSeconds(errorMessage);
        setCooldown(seconds);
        setIsCountingDown(true);
        setStatusMessage(''); 
      } else {
        setStatusMessage('Failed to resend. Please try again later.');
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        // Só limpa a mensagem de status se NÃO estivermos no meio de uma contagem regressiva
        if (!isCountingDown) {
          setStatusMessage('');
        }
      }, 5000);
    }
  };

  const renderResendButton = () => {
    if (isCountingDown) {
        return (
          <Button variant="link" className="text-xs text-purple-300/100 p-0 h-auto cursor-not-allowed" disabled>
            Try again in {cooldown} seconds...
          </Button>
        );
      }
  
      if (isLoading) {
        return (
          <Button variant="link" className="text-xs text-purple-300/70 p-0 h-auto" disabled>
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Sending...
            </span>
          </Button>
        );
      }
  
      return (
        <Button
          variant="link"
          className="text-xs text-purple-300/70 hover:text-purple-200 p-0 h-auto"
          onClick={handleResend}
        >
          Click here to resend the confirmation email
        </Button>
      );
  };

  // O JSX do return permanece o mesmo
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 text-center"
    >
      <div className="flex justify-center">
        <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
          <MailCheck className="w-10 h-10 text-purple-300" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-200/90 font-display">
          Just one more step...
        </h2>
        <p className="text-purple-200/70 text-sm font-light leading-relaxed max-w-sm mx-auto">
          We've sent a confirmation link to <br />
          <strong className="font-medium text-purple-200">{email}</strong>.
        </p>
        <p className="text-purple-200/60 text-xs font-light">
          Please click the link in that email to activate your account.
        </p>
      </div>
      
      <div className="pt-4">
        <Link href="/login">
          <Button 
            variant="outline"
            className="w-full border-purple-500/20 text-purple-200 hover:bg-purple-500/10"
          >
            Back to Login
          </Button>
        </Link>
      </div>

      <div className="text-xs text-purple-300/50 space-y-2">
        <p>Didn't receive the email? Check your spam folder, or</p>
        <div className="h-6 flex items-center justify-center">
          {statusMessage ? (
            <p className={cn('transition-opacity duration-300', isError ? 'text-red-400' : 'text-green-400')}>
              {statusMessage}
            </p>
          ) : (
            renderResendButton()
          )}
        </div>
      </div>
    </motion.div>
  );
}