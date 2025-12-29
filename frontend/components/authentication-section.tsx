
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signUpWithEmailAndPassword, getGithubAuthUrl } from '@/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthenticationSection({ isSignUp: initialIsSignUp = false }) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    try {
      if (isSignUp) {
        await signUpWithEmailAndPassword(email, password);
      } else {
        await signInWithEmailAndPassword(email, password);
      }
      router.push('/');
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code?: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          default:
            errorMessage = firebaseError.message || errorMessage;
        }
      }
      setError(errorMessage);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const url = await getGithubAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('GitHub login error:', error);
      setError('Failed to initiate GitHub login');
    }
  };

  const handleToggle = () => setIsSignUp(!isSignUp);

  const AuthForm = ({ isSignUp, onSubmit, error, onToggle, onGithubLogin }: {
    isSignUp: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    error: string | null;
    onToggle: () => void;
    onGithubLogin: () => void;
  }) => (
    <div className={`form-container ${isSignUp ? 'sign-up-container' : 'sign-in-container'} text-black transition-all ease-in-out duration-700`}>
      <form onSubmit={onSubmit} className="flex flex-col items-center justify-center h-full px-12 text-center bg-white dark:bg-card transition-all ease-in-out duration-700">
        <h1 className="text-2xl font-bold mb-4 text-foreground">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
        <div className="w-full space-y-4">
          <div className="space-y-1 text-left">
            <Label htmlFor={`${isSignUp ? 'signup' : 'signin'}-email`}>Email</Label>
            <Input className='border border-[#00000050]' id={`${isSignUp ? 'signup' : 'signin'}-email`} type="email" placeholder="Email" name="email" />
          </div>
          <div className="space-y-1 text-left">
            <Label htmlFor={`${isSignUp ? 'signup' : 'signin'}-password`}>Password</Label>
            <Input className='border border-[#00000050]' id={`${isSignUp ? 'signup' : 'signin'}-password`} type="password" placeholder="Password" name="password" />
          </div>
        </div>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        <Button type="submit" className="mt-6 w-full border border-[#00000050] hover:bg-[#00000010]">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
        <p className="sm:hidden mt-4 text-sm">
          {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button type="button" className="text-blue-700 font-bold" onClick={onToggle}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
        <div className="relative w-full mb-4">
          <div className="relative flex justify-center text-xs uppercase p-2">
            <span className="bg-background px-2 py-4 text-muted-foreground">Or continue with</span>
          </div>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-b border-muted" />
          </div>
        <div className="social-container mb-4">
          <button type="button" onClick={onGithubLogin} className="social">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
        </div>
        </div>
      </form>
    </div>
  );

  const Overlay = ({ onSignInClick, onSignUpClick }: {
    onSignInClick: () => void;
    onSignUpClick: () => void;
  }) => (
    <div className="overlay-container transition-all ease-in-out duration-700">
      <div className="overlay transition-all ease-in-out duration-700">
        <div className="overlay-panel overlay-left">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="mt-4 px-8 text-sm opacity-90">To keep connected with us please login with your personal info</p>
          <Button variant="outline" className="mt-8 border-white text-white hover:bg-[#00000049] hover:text-primary transition-all" onClick={onSignInClick}>Sign In</Button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1 className="text-2xl font-bold">Hello, Friend!</h1>
          <p className="mt-4 px-8 text-sm opacity-90">Enter your personal details and start your journey with us</p>
          <Button variant="outline" className="mt-8 border-white text-white hover:bg-[#00000049] hover:text-primary transition-all" onClick={onSignUpClick}>Sign Up</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4 transition-all ease-in-out duration-700">
      <div className={`auth-container shadow-2xl ${isSignUp ? 'right-panel-active' : ''}`}>
        <AuthForm 
          isSignUp={true} 
          onSubmit={handleAuth} 
          error={isSignUp ? error : null} 
          onToggle={handleToggle}
          onGithubLogin={handleGithubLogin}
        />
        <AuthForm 
          isSignUp={false} 
          onSubmit={handleAuth} 
          error={!isSignUp ? error : null} 
          onToggle={handleToggle}
          onGithubLogin={handleGithubLogin}
        />
        <Overlay onSignInClick={() => setIsSignUp(false)} onSignUpClick={() => setIsSignUp(true)} />
      </div>
    </div>
  );
}
