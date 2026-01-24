'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { User } from 'firebase/auth';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const userCreationAttempted = useRef(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            setLoading(false);

            // Ensure user is created in Firestore when authenticated
            if (user && requireAuth && !userCreationAttempted.current) {
                userCreationAttempted.current = true;
                try {
                    // This call will trigger the backend middleware to create the user if they don't exist
                    await api.get("/users/me");
                    console.log("✅ User creation verified in Firestore");
                } catch (error: any) {
                    console.error("❌ Error ensuring user exists in Firestore:", error);
                    // Reset flag so we can retry on next route
                    userCreationAttempted.current = false;
                }
            }

            if (!loading) {
                // If auth is required but user is not logged in -> Redirect to Login
                if (requireAuth && !user) {
                    router.push('/login');
                }

                // If auth is NOT required (public page like login) but user IS logged in -> Redirect to Dashboard
                if (!requireAuth && user) {
                    router.push('/');
                }
            }
        });

        return () => unsubscribe();
    }, [requireAuth, router, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Spinner />
            </div>
        );
    }

    // If requires auth and no user, don't render children (redirecting)
    if (requireAuth && !user) {
        return null;
    }

    // If public only and user exists, don't render children (redirecting)
    if (!requireAuth && user) {
        return null;
    }

    return <>{children}</>;
}
