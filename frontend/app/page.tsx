
'use client';

import { useEffect, useState, useRef } from 'react';
import { auth } from '@/firebase';
import { User } from 'firebase/auth';
import { Dashboard } from '@/components/dashboard';
import LandingPage from '@/components/landing-page';
import { Spinner } from '@/components/ui/spinner';
import { Sidebar } from '@/components/sidebar';
import api from '@/lib/api';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userCreationAttempted = useRef(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);
      
      // Ensure user is created in Firestore after authentication
      if (user && !userCreationAttempted.current) {
        userCreationAttempted.current = true;
        try {
          // This call will trigger the backend middleware to create the user if they don't exist
          await api.get("/users/me");
          console.log("✅ User creation verified in Firestore");
        } catch (error: any) {
          console.error("❌ Error ensuring user exists in Firestore:", error);
          // Reset flag so we can retry
          userCreationAttempted.current = false;
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  );
}
