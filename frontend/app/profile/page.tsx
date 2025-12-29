
'use client';

import { ProfilePage } from '@/components/profile-page';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function Profile() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <ProfilePage />
        </main>
      </div>
    </AuthGuard>
  );
}
