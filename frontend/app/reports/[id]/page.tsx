import { ReportView } from '@/components/report-view';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

type Props = {
  params: { id: string } | Promise<{ id: string }>
}

export default async function ReportDetailPage({ params }: Props) {
  // unwrap the promise if needed
  const { id } = await params;

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <ReportView reportId={id} />
        </main>
      </div>
    </AuthGuard>
  );
}
