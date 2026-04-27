'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import axiosInstance from '@/lib/api';
import type { AuthResponse } from '@/lib/types';

type Step = 'email' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect already-authenticated users
  useEffect(() => {
    const stored = localStorage.getItem('auth-store');
    if (!stored) return;
    try {
      const { state } = JSON.parse(stored);
      if (state?.token && state?.user?.role === 'super_admin') router.replace('/admin');
      else if (state?.token && state?.user?.role === 'creator') router.replace('/creator');
    } catch {}
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/request_otp', { email: email.trim() });
      setStep('otp');
      setResendTimer(60);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/verify_otp', {
        email: email.trim(),
        otp: otp.trim(),
      });
      const { user, token } = response.data;
      setAuth(user, token);
      if (user.role === 'super_admin') router.push('/admin');
      else router.push('/creator');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Invalid or expired code.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/request_otp', { email: email.trim() });
      setResendTimer(60);
    } catch {
      setError('Failed to resend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <img src="/icon.svg" alt="Reel Store" className="w-9 h-9" />
            <CardTitle className="text-3xl font-bold">Reel Store</CardTitle>
          </div>
          <CardDescription>
            {step === 'email' ? 'Sign in to manage your storefront' : `Enter the code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
                {isLoading ? 'Sending code…' : 'Send login code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">6-digit code</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  required
                  autoFocus
                  className="text-2xl tracking-[0.4em] text-center"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verifying…' : 'Sign in'}
              </Button>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                  onClick={() => { setStep('email'); setOtp(''); setError(null); }}
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors disabled:opacity-40"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
