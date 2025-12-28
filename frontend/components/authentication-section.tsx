
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Github, Shield, LinkIcon, Mail } from "lucide-react"
import {
  getGithubAuthUrl,
  exchangeCodeForToken,
  getGithubToken,
  logout,
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword
} from "@/services/authService"

export function AuthenticationSection() {
  const [githubConnected, setGithubConnected] = useState(false)
  const [showOAuthInfo, setShowOAuthInfo] = useState(false)
  const [githubUser, setGithubUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getGithubToken();
    if (token) {
      setGithubConnected(true);
      setShowOAuthInfo(true);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !githubConnected) {
      exchangeCodeForToken(code)
        .then((data) => {
          setGithubConnected(true);
          setShowOAuthInfo(true);
        })
        .catch((error) => {
          console.error("Failed to exchange code for token", error);
        });
    }
  }, [githubConnected]);

  const handleGithubAction = async () => {
    if (githubConnected) {
      logout();
      setGithubConnected(false);
      setShowOAuthInfo(false);
      setGithubUser(null);
    } else {
      try {
        const authUrl = await getGithubAuthUrl();
        window.location.href = authUrl;
      } catch (error) {
        console.error("Failed to get GitHub auth URL", error);
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await signUpWithEmailAndPassword(email, password);
      } else {
        await signInWithEmailAndPassword(email, password);
      }
      // Handle successful login/signup (e.g., redirect)
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-8">
        <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border">
          <div className="p-3 bg-muted rounded-lg">
            <Shield className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Identity & Security</h2>
            <p className="text-sm text-muted-foreground mt-1">Connect authentication providers for secure access</p>
          </div>
        </div>

        {/* GitHub Authentication */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-foreground rounded-lg">
                <Github className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">GitHub Authentication</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {githubConnected ? `Connected as @${githubUser}` : "GitHub Not Connected"}
                </p>
              </div>
            </div>
            <button
              onClick={handleGithubAction}
              className={`px-6 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 ${githubConnected ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                }`}
            >
              {githubConnected ? "Revoke" : "Connect GitHub"}
            </button>
          </div>

          {/* OAuth Info Section */}
          {showOAuthInfo && (
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <LinkIcon size={16} />
                  OAuth Connection Details
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Your GitHub account is now linked for authentication.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">GitHub Username</p>
                  <p className="text-foreground font-medium mt-1">@{githubUser}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Connected Since</p>
                  <p className="text-foreground font-medium mt-1">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">Token Status</p>
                  <p className="text-foreground font-medium mt-1">Active & Valid</p>
                </div>
              </div>
            </div>
          )}

          {/* Email/Password Authentication */}
          <div className="p-6 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-foreground rounded-lg">
                <Mail className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email & Password</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSignUp ? "Create a new account" : "Sign in with your email"}
                </p>
              </div>
            </div>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-medium bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don\'t have an account? Sign Up"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Card>
  )
}
