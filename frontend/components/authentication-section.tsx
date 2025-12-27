
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Github, Shield, LinkIcon } from "lucide-react"
import { getGithubAuthUrl, exchangeCodeForToken } from "@/services/authService"

export function AuthenticationSection() {
  const [githubConnected, setGithubConnected] = useState(false)
  const [showOAuthInfo, setShowOAuthInfo] = useState(false)
  const [githubUser, setGithubUser] = useState(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !githubConnected) {
      exchangeCodeForToken(code)
        .then((data) => {
          // Assuming the data returned includes user information
          setGithubConnected(true);
          setShowOAuthInfo(true);
        })
        .catch((error) => {
          console.error("Failed to exchange code for token", error);
        });
    }
  }, []);

  const handleGithubAction = async () => {
    if (githubConnected) {
      // Handle disconnection if necessary
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
              className={`px-6 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 ${
                githubConnected ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
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

          {/* JWT Info Placeholder */}
          <div className="p-6 border border-border rounded-lg bg-muted/30">
            <h4 className="font-medium text-foreground mb-2">Additional Authentication Methods</h4>
            <p className="text-sm text-muted-foreground mb-4">JWT tokens and other OAuth providers coming soon.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium text-foreground">JWT Token</span>
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium text-foreground">Google OAuth</span>
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
