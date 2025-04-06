"use client";
import SignInForm from '@/components/form/SignInForm';
import { useEffect } from 'react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SignInPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && status === 'authenticated') {
      router.push('/');
    }
  }, [session, router, status]);

  return (
    <div className="w-full relative min-h-screen">
      <SignInForm />
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SignInPage;
