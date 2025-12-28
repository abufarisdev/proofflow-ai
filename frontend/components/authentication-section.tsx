
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signUpWithEmailAndPassword } from '@/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  handleAuth: (e: React.FormEvent) => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string | null;
  isSignUp: boolean;
  toggleMobile: () => void;
}

const AuthForm = ({ handleAuth, email, setEmail, password, setPassword, error, isSignUp, toggleMobile }: AuthFormProps) => (
  <form onSubmit={handleAuth} className="flex flex-col items-center justify-center h-full px-8 sm:px-12 text-center bg-white dark:bg-card">
    <h1 className="text-2xl font-bold mb-4 text-foreground">{isSignUp ? 'Create Account' : 'Sign in'}</h1>
    <div className="w-full space-y-4">
      <div className="space-y-1 text-left">
        <Label htmlFor={`${isSignUp ? 'signup' : 'signin'}-email`}>Email</Label>
        <Input 
          id={`${isSignUp ? 'signup' : 'signin'}-email`} 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full"
        />
      </div>
      <div className="space-y-1 text-left">
        <Label htmlFor={`${isSignUp ? 'signup' : 'signin'}-password`}>Password</Label>
        <Input 
          id={`${isSignUp ? 'signup' : 'signin'}-password`} 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full"
        />
      </div>
    </div>
    {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    <Button type="submit" className="mt-6 w-full">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
    
    <div className="mt-6 sm:hidden">
      <p className="text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
        <button type="button" onClick={toggleMobile} className="ml-2 font-semibold text-primary">
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  </form>
);

const OverlayPanel = ({ title, description, buttonText, onClick }: { title: string, description: string, buttonText: string, onClick: () => void }) => (
  <div className="overlay-panel flex flex-col items-center justify-center px-10 text-center h-full">
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="mt-4 text-sm text-white opacity-90">{description}</p>
    <Button 
      variant="outline" 
      className="mt-8 border-white bg-transparent text-white hover:bg-white hover:text-[#3b82f6] transition-all font-semibold" 
      onClick={onClick}
    >
      {buttonText}
    </Button>
  </div>
);

export function AuthenticationSection({ isSignUp: initialIsSignUp = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await signUpWithEmailAndPassword(email, password);
      } else {
        await signInWithEmailAndPassword(email, password);
      }
      router.push('/');
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className={`auth-container shadow-2xl relative overflow-hidden w-full max-w-[768px] min-h-[480px] rounded-xl bg-white ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full sm:w-1/2 z-[1] ${isSignUp ? 'sm:translate-x-full opacity-100 z-[5] animate-show' : 'opacity-0'}`}>
          <AuthForm 
            handleAuth={handleAuth} 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            error={error} 
            isSignUp={true}
            toggleMobile={() => setIsSignUp(false)}
          />
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full sm:w-1/2 z-[2] ${isSignUp ? 'sm:translate-x-full opacity-0' : 'opacity-100'}`}>
          <AuthForm 
            handleAuth={handleAuth} 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            error={error} 
            isSignUp={false}
            toggleMobile={() => setIsSignUp(true)}
          />
        </div>

        {/* Overlay - Hidden on mobile */}
        <div className="hidden sm:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-[100] transform translate-x-0 right-panel-active:-translate-x-full">
          <div className={`overlay bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white relative -left-full h-full w-[200%] transform translate-x-0 transition-transform duration-600 ease-in-out ${isSignUp ? 'translate-x-1/2' : ''}`}>
            <div className={`absolute top-0 h-full w-1/2 transition-transform duration-600 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <OverlayPanel 
                title="Welcome Back!" 
                description="To keep connected with us please login with your personal info" 
                buttonText="Sign In" 
                onClick={() => setIsSignUp(false)} 
              />
            </div>
            <div className={`absolute top-0 right-0 h-full w-1/2 transition-transform duration-600 ease-in-out ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <OverlayPanel 
                title="Hello, Friend!" 
                description="Enter your personal details and start your journey with us" 
                buttonText="Sign Up" 
                onClick={() => setIsSignUp(true)} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
