'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { GithubAuthProvider, signInWithCredential } from 'firebase/auth';

export default function GitHubCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          // Exchange the code for a token (this would typically be done on the backend)
          // For now, redirect to home since Firebase handles the popup flow
          router.push('/');
        } else {
          // If no code, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('GitHub callback error:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white">Completing GitHub authentication...</p>
      </div>
    </div>
  );
}