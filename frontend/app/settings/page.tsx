'use client';

import { SettingsPage } from '@/components/settings-page';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function Settings() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <SettingsPage />
        </main>
      </div>
    </AuthGuard>
  );
}
