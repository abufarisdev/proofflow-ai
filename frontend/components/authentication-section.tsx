
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword, signUpWithEmailAndPassword } from '@/services/authService';
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Lock, AlertCircle } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";

export function AuthenticationSection({ isSignUp: initialIsSignUp = false }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, type: 'signin' | 'signup') => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Use type assertion to access elements safely
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      if (type === 'signup') {
        await signUpWithEmailAndPassword(email, password);
        toast({
          title: "Account created successfully",
          description: "Welcome to ProofFlow AI!",
          variant: "default",
          className: "bg-[#51344D] text-white border-none",
        });
      } else {
        await signInWithEmailAndPassword(email, password);
        toast({
          title: "Welcome back!",
          description: "You have signed in successfully.",
          variant: "default",
          className: "bg-[#51344D] text-white border-none",
        });
      }
      router.push('/');
    } catch (error: any) { // Type 'any' for Firebase error object flexibility
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
          case 'auth/invalid-credential':
            errorMessage = 'Invalid credentials provided.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      setError(errorMessage);
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("GitHub login failed:", error);
      setError("GitHub login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-[#51344D] to-[#6F5060] rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-[#51344D]">ProofFlow AI</h1>
          <p className="text-[#989788] text-sm">Verify project authenticity with confidence</p>
        </div>

        <Tabs defaultValue={initialIsSignUp ? "signup" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* SIGN IN TAB */}
          <TabsContent value="signin">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="signin-form" onSubmit={(e) => handleAuth(e, 'signin')}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="signin-email" name="email" type="email" placeholder="m@example.com" required className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="signin-password" name="password" type="password" required className="pl-10" />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" form="signin-form" className="w-full bg-[#51344D] hover:bg-[#51344D]/90" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button variant="outline" type="button" onClick={handleGithubLogin} className="w-full gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* SIGN UP TAB */}
          <TabsContent value="signup">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your email below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="signup-form" onSubmit={(e) => handleAuth(e, 'signup')}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-password" name="password" type="password" required className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="confirm-password" name="confirmPassword" type="password" required className="pl-10" />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" form="signup-form" className="w-full bg-[#51344D] hover:bg-[#51344D]/90" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button variant="outline" type="button" onClick={handleGithubLogin} className="w-full gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
