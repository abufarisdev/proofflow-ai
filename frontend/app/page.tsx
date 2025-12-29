
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { User } from 'firebase/auth';
import { Dashboard } from '@/components/dashboard';
import LandingPage from '@/components/landing-page';
import { Spinner } from '@/components/ui/spinner';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
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
