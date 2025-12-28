
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { User } from 'firebase/auth';
import { ProfilePage } from '@/components/profile-page';
import LandingPage from '@/components/landing-page';
import { Spinner } from '@/components/ui/spinner';
import { Sidebar } from '@/components/sidebar';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user && !loading) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ProfilePage />
      </main>
    </div>
  );
}
