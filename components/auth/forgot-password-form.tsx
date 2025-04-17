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
import { resetPassword } from '@/lib/auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { error } = await resetPassword(data.email);
      if (error) throw error;
      
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error sending reset instructions. Please try again.');
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-200/90 font-display">Check Your Email</h2>
          <p className="text-purple-200/60 text-sm font-light">
            We've sent password reset instructions to your email address.
          </p>
        </div>
        
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm text-purple-200/60 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-gray-200/90 font-display">Reset Password</h2>
        <p className="text-purple-200/60 text-sm font-light">
          Enter your email to receive reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <p className="text-sm text-red-400/90 text-center">{error}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-purple-200/80 font-light">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="hello@example.com"
            disabled={isSubmitting}
            className="bg-white/5 border-white/10 text-purple-100 placeholder:text-purple-200/30"
          />
          {errors.email && (
            <p className="text-sm text-red-400/90">{errors.email.message}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#9F7AEA] to-[#9F7AEA] hover:from-[#805AD5] hover:to-[#6B46C1]
            transform hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-purple-500/25
            text-white/90 font-medium rounded-[6px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
      </form>

      <div className="text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm text-purple-200/60 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>
    </div>
  );
}