import SignInForm from '@/components/form/SignInForm';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from '@/components/theme-toggle';

const SignInPage = async () => {
  return (
    <div className='w-full relative min-h-screen'>
      <SignInForm />
      <div className='fixed bottom-4 right-4'>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SignInPage;