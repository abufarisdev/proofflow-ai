import { ProjectsList } from "@/components/projects-list"
import { AuthGuard } from "@/components/auth-guard"

export default function ProjectsPage() {
    return (
        <AuthGuard>
            <ProjectsList />
        </AuthGuard>
    )
}
