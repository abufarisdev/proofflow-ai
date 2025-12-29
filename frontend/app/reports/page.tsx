'use client';

import { ReportView } from '@/components/report-view';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function ReportsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <ReportView />
        </main>
      </div>
    </AuthGuard>
  );
}
