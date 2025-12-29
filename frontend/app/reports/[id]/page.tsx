'use client';

import { ReportView } from '@/components/report-view';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

type Props = {
    params: { id: string }
}

export default function ReportDetailPage({ params }: Props) {
    return (
        <AuthGuard requireAuth={true}>
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    <ReportView reportId={params.id} />
                </main>
            </div>
        </AuthGuard>
    );
}
