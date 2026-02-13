// Em: components/auth/signup-form.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider'; // Verifique se o caminho está correto
import { SignupConfirmation } from './signup-confirmation'; // <-- 1. IMPORTAR O NOVO COMPONENTE
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/utils';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  // --- 2. ADICIONAR NOVO ESTADO ---
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  // ------------------------------

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('');
      await signUp(data.email, data.password);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      // ---------------------------------------------
    } catch (err: any) {
      console.error("ERRO DETALHADO NO SIGNUP:", err);
      // Aqui podemos ser mais específicos se quisermos
      if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists.');
      } else {
        setError(err.message || 'Error creating account. Please try again.');
      }
      setIsSubmitted(false); // Garante que o formulário continue visível em caso de erro
    }
  };

  if (isSubmitted) {
    return <SignupConfirmation email={submittedEmail} />;
  }
  // ------------------------------------

  return (
    // O seu JSX do formulário existente permanece aqui
    <div className="space-y-10">
      <div className="flex flex-col items-center text-center mb-6">
        <Logo 
          variant="small" // <-- É esta linha que garante que o formulário use a versão compacta.
        />
      </div>
      <div className="space-y-1 text-center">
        <h2 className={cn(
          "text-2xl font-semibold text-gray-200/90",
          'font-display-marcellus' 
        )}>
          Create Account
        </h2>
        <p className="text-purple-200/60 text-xs font-light">
          Begin your journey of dream exploration
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <p className="text-sm text-red-400/90 text-center">{error}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-purple-200/80 text-xs font-light">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="hello@example.com"
            disabled={isSubmitting}
            className="bg-white/5 border-white/10 text-purple-100 placeholder:text-purple-200/30 text-xs"
          />
          {errors.email && (
            <p className="text-sm text-red-400/90">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-purple-200/80 text-xs font-light">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            disabled={isSubmitting}
            className="bg-white/5 border-white/10 text-purple-100"
          />
          {errors.password && (
            <p className="text-sm text-red-400/90">{errors.password.message}</p>
          )}
        </div>
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#9F7AEA] to-[#9F7AEA] hover:from-[#805AD5] hover:to-[#6B46C1]
              transform hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-purple-500/25
              text-white/90 font-medium rounded-[6px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </div>
      </form>

      <div className="text-center space-y-2">
        <p className="text-xs text-purple-200/60">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
          </Link>
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center text-xs text-purple-200/60 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </div>
    </div>
  );
}