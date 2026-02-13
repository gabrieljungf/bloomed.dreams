// Em: components/auth/login-form.tsx
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
import { useAuth } from '@/components/auth/auth-provider';
import { Logo } from '@/components/brand/logo'; // 1. IMPORTAR A LOGO
import { cn } from '@/lib/utils'; // 2. IMPORTAR CN

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error("ERRO DETALHADO NO LOGIN:", err);
      if (err.message === 'Email not confirmed') {
        setError('Your account is waiting for activation. Please check your email for the confirmation link.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    // 3. ESTRUTURA ATUALIZADA (MESMA DO SIGNUP)
    <div className="space-y-10">
      <div className="flex flex-col items-center text-center mb-6">
        <Logo variant="small" />
      </div>

      <div className="space-y-1 text-center">
        <h2 className={cn(
          "text-2xl font-semibold text-gray-200/90",
          'font-display-marcellus'
        )}>
          Welcome Back
        </h2>
        <p className="text-purple-200/60 text-xs font-light">
          Enter your credentials to continue
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
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-purple-200/80 text-xs font-light">Password</Label>
            <Link 
              href="/forgot-password" 
              className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register('password')}
            disabled={isSubmitting}
            className="bg-white/5 border-white/10 text-purple-100 text-xs"
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
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="text-center space-y-2">
        <p className="text-xs text-purple-200/60">
          Don't have an account?{' '}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign up
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