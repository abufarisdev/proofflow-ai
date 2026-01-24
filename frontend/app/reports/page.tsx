'use client';

import { ReportsList } from '@/components/reports-list';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function ReportsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <ReportsList />
        </main>
      </div>
    </AuthGuard>
  );
}
