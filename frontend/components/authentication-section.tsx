'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, AlertCircle } from 'lucide-react';

export function AuthenticationSection({ isSignUp: initialIsSignUp = false }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("GitHub login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-2 overflow-x-hidden">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">

        {/* HEADER */}
        <div className="mb-8 text-center space-y-2">
          <div className="w-16 h-16 bg-linear-to-br from-[#51344D] to-[#6F5060] rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4 animate-pulse-slow">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-[#ffffff] animate-slide-up">ProofFlow AI</h1>
          <p className="text-[#989788] text-sm animate-slide-up animation-delay-100">
            Verify project authenticity with confidence
          </p>
        </div>

        <Tabs defaultValue={initialIsSignUp ? "signup" : "signin"} className="w-full">

          {/* TOGGLE TABS */}
          <div className="w-full flex justify-center mb-4">
            <TabsList
              className="
                flex w-full bg-[#F3F4F6] dark:bg-[#51344D]
                px-2 py-1 rounded-xl
                border border-[#F3F4F6] dark:border-[#2c3340]
                backdrop-blur-sm
              "
            >
              <TabsTrigger
                value="signin"
                className="
                  flex-1 py-1 rounded-lg font-medium transition-all duration-300
                  text-white
                  data-[state=active]:bg-white
                  dark:data-[state=active]:bg-[#1F141E]
                  data-[state=active]:text-black
                  dark:data-[state=active]:text-white
                  data-[state=active]:shadow-lg
                  data-[state=active]:scale-105
                  hover:scale-[1.02] hover:bg-white/10
                  active:scale-95
                "
              >
                Sign In
              </TabsTrigger>

              <TabsTrigger
                value="signup"
                className="
                  flex-1 py-1 rounded-lg font-medium transition-all duration-300
                  text-white
                  data-[state=active]:bg-white
                  dark:data-[state=active]:bg-[#1F141E]
                  data-[state=active]:text-black
                  dark:data-[state=active]:text-white
                  data-[state=active]:shadow-lg
                  data-[state=active]:scale-105
                  hover:scale-[1.02] hover:bg-white/10
                  active:scale-95
                "
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </div>

          {/* SIGN IN */}
          <TabsContent value="signin">
            <Card className="
              border-border shadow-lg 
              transition-all duration-300 
              hover:shadow-2xl hover:shadow-[#51344D]/20 
              hover:-translate-y-1
              backdrop-blur-sm bg-white/95 dark:bg-[#1F141E]/95
              border border-white/10 dark:border-[#51344D]/30
              group
            ">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription className="transition-colors duration-300 group-hover:text-[#989788]/80">
                  Continue to your dashboard using GitHub
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                {error && (
                  <div className="flex items-center justify-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGithubLogin}
                  className="
                    w-full gap-2 
                    transition-all duration-300 
                    hover:bg-white hover:text-black 
                    dark:hover:bg-white dark:hover:text-black
                    hover:scale-[1.02]
                    active:scale-95
                    border-2
                    hover:border-white/30
                    dark:hover:border-white/20
                    hover:shadow-lg hover:shadow-[#51344D]/10
                    group/button
                  "
                >
                  <Github className="h-4 w-4 transition-transform duration-300 group-hover/button:scale-110" />
                  <span className="transition-all duration-300">Continue with GitHub</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* SIGN UP */}
          <TabsContent value="signup">
            <Card className="
              border-border shadow-lg 
              transition-all duration-300 
              hover:shadow-2xl hover:shadow-[#51344D]/20 
              hover:-translate-y-1
              backdrop-blur-sm bg-white/95 dark:bg-[#1F141E]/95
              border border-white/10 dark:border-[#51344D]/30
              group
            ">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription className="transition-colors duration-300 group-hover:text-[#989788]/80">
                  Sign up instantly using your GitHub account
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                {error && (
                  <div className="flex items-center justify-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGithubLogin}
                  className="
                    w-full gap-2 
                    transition-all duration-300 
                    hover:bg-white hover:text-black 
                    dark:hover:bg-white dark:hover:text-black
                    hover:scale-[1.02]
                    active:scale-95
                    border-2
                    hover:border-white/30
                    dark:hover:border-white/20
                    hover:shadow-lg hover:shadow-[#51344D]/10
                    group/button
                  "
                >
                  <Github className="h-4 w-4 transition-transform duration-300 group-hover/button:scale-110" />
                  <span className="transition-all duration-300">Sign Up with GitHub</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}