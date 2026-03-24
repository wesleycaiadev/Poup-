"use client";

import { LoginView } from '@/components/auth/login-view';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#090b0e] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    }>
      <LoginView />
    </Suspense>
  );
}
