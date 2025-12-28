
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signUpWithEmailAndPassword } from '@/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthForm = ({ isSignUp, onSubmit, error, onToggle }) => (
  <div className={`form-container ${isSignUp ? 'sign-up-container' : 'sign-in-container'}`}>
    <form onSubmit={onSubmit} className="flex flex-col items-center justify-center h-full px-12 text-center bg-white dark:bg-card">
      <h1 className="text-2xl font-bold mb-4 text-foreground">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
      <div className="w-full space-y-4">
        <div className="space-y-1 text-left">
          <Label htmlFor={`${isSignUp ? 'signup' : 'signin'}-email`}>Email</Label>
          <Input id={`${isSignUp ? 'signup' : 'signin'}-email`} type="email" placeholder="Email" name="email" />
        </div>
        <div className="space-y-1 text-left">
          <Label htmlFor={`${isSignUp ? 'signup' : 'signin'}-password`}>Password</Label>
          <Input id={`${isSignUp ? 'signup' : 'signin'}-password`} type="password" placeholder="Password" name="password" />
        </div>
      </div>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      <Button type="submit" className="mt-6 w-full">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
      <p className="sm:hidden mt-4 text-sm">
        {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
        <button type="button" className="text-blue-500 font-bold" onClick={onToggle}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </form>
  </div>
);

const Overlay = ({ onSignInClick, onSignUpClick }) => (
  <div className="overlay-container">
    <div className="overlay">
      <div className="overlay-panel overlay-left">
        <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <p className="mt-4 px-8 text-sm opacity-90">To keep connected with us please login with your personal info</p>
        <Button variant="outline" className="mt-8 border-white text-white hover:bg-white hover:text-primary transition-all" onClick={onSignInClick}>Sign In</Button>
      </div>
      <div className="overlay-panel overlay-right">
        <h1 className="text-2xl font-bold">Hello, Friend!</h1>
        <p className="mt-4 px-8 text-sm opacity-90">Enter your personal details and start your journey with us</p>
        <Button variant="outline" className="mt-8 border-white text-white hover:bg-white hover:text-primary transition-all" onClick={onSignUpClick}>Sign Up</Button>
      </div>
    </div>
  </div>
);

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
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.code) {
        switch (error.code) {
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
            errorMessage = error.message;
        }
      }
      setError(errorMessage);
    }
  };

  const handleToggle = () => setIsSignUp(!isSignUp);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className={`auth-container shadow-2xl ${isSignUp ? 'right-panel-active' : ''}`}>
        <AuthForm 
          isSignUp={true} 
          onSubmit={handleAuth} 
          error={isSignUp ? error : null} 
          onToggle={handleToggle} 
        />
        <AuthForm 
          isSignUp={false} 
          onSubmit={handleAuth} 
          error={!isSignUp ? error : null} 
          onToggle={handleToggle} 
        />
        <Overlay onSignInClick={() => setIsSignUp(false)} onSignUpClick={() => setIsSignUp(true)} />
      </div>
    </div>
  );
}
