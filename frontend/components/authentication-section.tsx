'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, AlertCircle, Sparkles, Zap, Lock, Shield, CheckCircle, Stars, ChevronRight } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

export function AuthenticationSection({ isSignUp: initialIsSignUp = false }) {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [isHovering, setIsHovering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();

  const features = [
    { icon: Shield, title: "Military-Grade Security", description: "End-to-end encryption", color: "from-blue-500 to-cyan-400" },
    { icon: Zap, title: "Lightning Fast", description: "Instant verification", color: "from-purple-500 to-pink-500" },
    { icon: Lock, title: "Zero Trust", description: "Blockchain-backed proofs", color: "from-amber-500 to-orange-500" },
    { icon: CheckCircle, title: "100% Accurate", description: "AI-powered validation", color: "from-emerald-500 to-teal-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  // Get the current feature icon component
  const FeatureIcon = features[activeFeature].icon;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D] p-4 overflow-hidden">
      {/* Enhanced Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left side - Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo & Title */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#51344D] via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <span className="text-3xl font-bold text-white">P</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-30 animate-pulse" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-purple-500/30 rounded-2xl"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                ProofFlow AI
              </h1>
              <p className="text-gray-300 text-sm mt-1">Next-Gen Verification Platform</p>
            </div>
          </motion.div>

          {/* Animated Feature Showcase */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} bg-opacity-10 border border-white/10 backdrop-blur-sm`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${features[activeFeature].color}`}>
                      <FeatureIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{features[activeFeature].title}</h3>
                      <p className="text-gray-300 text-sm">{features[activeFeature].description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "10K+", label: "Projects Verified" },
              { value: "99.9%", label: "Accuracy Rate" },
              { value: "24/7", label: "Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Card Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />

          <Card className="
            relative
            border-0
            shadow-2xl
            backdrop-blur-xl
            bg-gradient-to-br from-white/10 to-white/5
            border border-white/20
            overflow-hidden
            group
            h-full
          ">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]" />

            {/* Floating Particles Inside Card */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                  }}
                  animate={{
                    y: [null, `-${Math.random() * 20}px`, `-${Math.random() * 40}px`],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <CardHeader className="space-y-4 p-8 pb-6 relative z-10">
              {/* Animated Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                    <span>Welcome to</span>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ProofFlow AI
                    </span>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  </CardTitle>
                </div>
                
                <CardDescription className="text-gray-300 text-base">
                  {isSignUp ? "Join our community of verified developers" : "Sign in to access your dashboard"}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-8 pt-0 relative z-10">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-sm text-red-400 bg-red-400/10 p-4 rounded-xl mb-6 border border-red-400/20"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* GitHub Button with Enhanced Effects */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <Button
                  onClick={handleGithubLogin}
                  className="
                    w-full
                    h-14
                    rounded-xl
                    bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                    border border-gray-700/50
                    text-white
                    text-lg
                    font-semibold
                    relative
                    overflow-hidden
                    group/btn
                    transition-all
                    duration-300
                    hover:border-purple-500/50
                    hover:shadow-2xl
                    hover:shadow-purple-500/20
                  "
                >
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovering ? "100%" : "-100%" }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Button Content */}
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: isHovering ? 360 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Github className="w-6 h-6" />
                    </motion.div>
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <span>{isSignUp ? "Sign Up with GitHub" : "Continue with GitHub"}</span>
                        <motion.div
                          animate={{ x: isHovering ? 5 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {isSignUp ? "Create your account in seconds" : "Instant access to your dashboard"}
                      </div>
                    </div>
                  </div>

                  {/* Button Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500" />
                </Button>
              </motion.div>
            </CardContent>

            <CardFooter className="p-8 pt-4 relative z-10">
              {/* Toggle between Sign In/Sign Up */}
              <div className="w-full">
                <motion.div
                  className="
                    flex items-center justify-center gap-4 p-1
                    bg-white/5 rounded-xl border border-white/10
                    backdrop-blur-sm
                  "
                  whileHover={{ scale: 1.02 }}
                >
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`
                      flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300
                      ${!isSignUp 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      {!isSignUp && <Stars className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
                  
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`
                      flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300
                      ${isSignUp 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign Up</span>
                      {isSignUp && <Zap className="w-4 h-4" />}
                    </div>
                  </button>
                </motion.div>

                {/* Terms */}
                <p className="text-center text-xs text-gray-500 mt-6">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">All systems operational</span>
        </div>
      </motion.div>
    </div>
  );
}