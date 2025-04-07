'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

const FormSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

const SignInForm = () => {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const signInData = await signIn('credentials', {
        identifier: values.identifier,
        password: values.password,
        redirect: false,
      });

      if (signInData?.error) {
        toast('Hibás felhasználónév/email vagy jelszó');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error('Hiba történt a bejelentkezés során');
    }
  };

  return (
    <section className='min-h-screen bg-indigo-50 dark:bg-gray-900'>
      <Form {...form}>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0'>
          <a href="#" className="flex items-center mb-8 text-3xl font-bold text-white">
            <Image width={50} height={50} className="w-10 h-10 mr-3" src="/logo/logo.png" alt="logo" />
            LightHosting
          </a>
          <div className="w-full backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl md:mt-0 sm:max-w-md xl:p-0 border border-white/20">
            <div className="p-8 space-y-6">
              <h1 className="text-2xl font-bold text-center text-white md:text-3xl">
                Lépj be a fiókodba
              </h1>
              <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
                <FormField
                  control={form.control}
                  name='identifier'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email vagy Felhasználónév</FormLabel>
                      <FormControl>
                        <Input 
                          type='text' 
                          placeholder='mail@example.com' 
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Jelszó</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter your password'
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />
                <Button 
                  className='w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]' 
                  type='submit'
                >
                  Bejelentkezés
                </Button>
              </form>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400 mt-6'>
                <Link className='text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold hover:underline transition-all duration-200' href='/forgot-password'>
                  Elfelejtetted a jelszavadat?
                </Link>
              </p>
              <div className='mx-auto my-6 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-gray-300 dark:before:bg-gray-600 after:ml-4 after:block after:h-px after:flex-grow after:bg-gray-300 dark:after:bg-gray-600'>
                <span className="text-gray-500 dark:text-gray-400">vagy</span>
              </div>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400 mt-6'>
                Még nem rendelkezik fiókkal?{' '}
                <Link className='text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold hover:underline transition-all duration-200' href='/sign-up'>
                  Regisztráció
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Form>
    </section>
  );
};

export default SignInForm;
