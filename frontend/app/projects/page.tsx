import { ProjectsList } from "@/components/projects-list"
import { Sidebar } from "@/components/sidebar"
import { AuthGuard } from "@/components/auth-guard"

export default function ProjectsPage() {
    return (
        <AuthGuard requireAuth={true}>
            <div className="flex h-screen flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    <ProjectsList />
                </main>
            </div>
        </AuthGuard>
    )
}
