
"use client"

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signUpWithEmailAndPassword } from "@/services/authService";
import { Mail, Lock } from "lucide-react";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmailAndPassword(email, password);
      } else {
        await signInWithEmailAndPassword(email, password);
      }
      router.push('/');
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred.";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use. Please sign in.";
          setIsSignUp(false);
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-email":
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak. Please use at least 6 characters.";
          break;
        default:
          errorMessage = "An authentication error occurred. Please try again later.";
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{isSignUp ? "Create an Account" : "Welcome Back"}</h1>
        <p className="text-muted-foreground mt-2">{isSignUp ? "Get started with our service." : "Sign in to continue."}</p>
      </div>
      <form onSubmit={handleAuthAction} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-sm text-center text-destructive">{error}</p>}
        <button type="submit" className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
        <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-primary hover:underline">
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
