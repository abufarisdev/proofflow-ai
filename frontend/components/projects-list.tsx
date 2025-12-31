"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Folder, Plus, Trash2, GitBranch, Calendar, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Mock data
const INITIAL_PROJECTS = [
    {
        id: "1",
        name: "ProofFlow AI",
        repoUrl: "https://github.com/abufarisdev/proofflow-ai",
        status: "active",
        createdAt: "2025-12-01",
        description: "AI-powered code authenticity platform"
    },
    {
        id: "2",
        name: "E-Commerce V2",
        repoUrl: "https://github.com/client-a/shop-v2",
        status: "archived",
        createdAt: "2025-11-15",
        description: "Next.js e-commerce storefront"
    },
    {
        id: "3",
        name: "Legacy CRM",
        repoUrl: "https://github.com/internal/crm-legacy",
        status: "maintenance",
        createdAt: "2025-10-10",
        description: "Old CRM system needing migration"
    }
]

export function ProjectsList() {
    const [projects, setProjects] = useState(INITIAL_PROJECTS)
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    // New Project State
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectRepo, setNewProjectRepo] = useState("")
    const [newProjectDesc, setNewProjectDesc] = useState("")
    const [nameError, setNameError] = useState("")
    const [repoError, setRepoError] = useState("")

    // Selection Logic
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProjects(projects.map(p => p.id))
        } else {
            setSelectedProjects([])
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedProjects([...selectedProjects, id])
        } else {
            setSelectedProjects(selectedProjects.filter(pid => pid !== id))
        }
    }

    // Delete Logic
    const handleDeleteConfirm = () => {
        setProjects(projects.filter(p => !selectedProjects.includes(p.id)))
        setSelectedProjects([])
        setIsDeleteOpen(false)
    }

    // Create Logic
    const handleCreateProject = () => {
        // Validation
        let isValid = true
        setNameError("")
        setRepoError("")

        if (!newProjectName.trim()) {
            setNameError("Project name is required")
            isValid = false
        }

        const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-._]+$/
        if (!newProjectRepo.trim() || !githubRegex.test(newProjectRepo)) {
            setRepoError("Please enter a valid GitHub repository URL")
            isValid = false
        }

        if (!isValid) return

        const newProject = {
            id: Date.now().toString(),
            name: newProjectName,
            repoUrl: newProjectRepo,
            status: "active",
            createdAt: new Date().toISOString().split('T')[0],
            description: newProjectDesc
        }

        setProjects([newProject, ...projects])
        setIsCreateOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setNewProjectName("")
        setNewProjectRepo("")
        setNewProjectDesc("")
        setNameError("")
        setRepoError("")
    }

    return (
        <div className="p-8 bg-background min-h-screen animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
                    <p className="text-muted-foreground">Manage your repositories and projects.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        disabled={selectedProjects.length === 0}
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete Selected ({selectedProjects.length})
                    </Button>
                    <Button
                        className="bg-[#51344D] hover:bg-[#6F5060] text-white"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus size={16} className="mr-2" />
                        Create Project
                    </Button>
                </div>
            </div>

            <Card className="border-border shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] pl-4">
                                    <Checkbox
                                        checked={projects.length > 0 && selectedProjects.length === projects.length}
                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                    />
                                </TableHead>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Repository</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No projects found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : projects.map((project) => (
                                <TableRow key={project.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="pl-4">
                                        <Checkbox
                                            checked={selectedProjects.includes(project.id)}
                                            onCheckedChange={(checked) => handleSelectOne(project.id, checked as boolean)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-muted/20 rounded-md group-hover:bg-[#51344D]/10 transition-colors">
                                                <Folder size={16} className="text-[#51344D]" />
                                            </div>
                                            <span className="whitespace-nowrap">{project.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
                                            <GitBranch size={14} />
                                            {project.repoUrl.replace('https://github.com/', '')}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                          ${project.status === 'active' ? 'bg-green-500/10 text-green-700 border-green-200' : ''}
                          ${project.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200' : ''}
                          ${project.status === 'archived' ? 'bg-gray-500/10 text-gray-700 border-gray-200' : ''}
                        `}
                                        >
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                                            <Calendar size={14} />
                                            {project.createdAt}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`#`}>
                                            <Button variant="ghost" size="sm" className="hover:bg-[#51344D]/10 hover:text-[#51344D]">
                                                <Eye size={16} className="mr-2" />
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Project Modal */}
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
                if (!open) resetForm();
                setIsCreateOpen(open);
            }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                        <DialogDescription>
                            Add a new project to track and analyze.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="name"
                                placeholder="e.g. My Awesome App"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className={nameError ? "border-destructive" : ""}
                            />
                            {nameError && <span className="text-xs text-destructive">{nameError}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="repo">GitHub Repository URL <span className="text-destructive">*</span></Label>
                            <Input
                                id="repo"
                                placeholder="https://github.com/username/repo"
                                value={newProjectRepo}
                                onChange={(e) => setNewProjectRepo(e.target.value)}
                                className={repoError ? "border-destructive" : ""}
                            />
                            {repoError && <span className="text-xs text-destructive">{repoError}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                placeholder="Brief description of the project..."
                                value={newProjectDesc}
                                onChange={(e) => setNewProjectDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateProject} className="bg-[#51344D] hover:bg-[#6F5060] text-white">Create Project</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {selectedProjects.length} selected project{selectedProjects.length > 1 ? 's' : ''} and remove the data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
