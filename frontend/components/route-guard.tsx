
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isLandingPage = pathname === '/landing';

      if (user) {
        // If user is logged in and on the landing page, redirect them away.
        if (isLandingPage) {
          router.push('/'); // Redirect to the main app page
        } else {
          setLoading(false); // User is logged in and on a protected page
        }
      } else {
        // If user is not logged in and not on the landing page, redirect them.
        if (!isLandingPage) {
          router.push('/landing');
        } else {
          setLoading(false); // User is not logged in and on the landing page.
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
};

export default RouteGuard;
