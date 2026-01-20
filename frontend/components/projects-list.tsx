"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, Folder, Plus, Trash2, GitBranch, Calendar, Search, Sparkles, Zap, Shield } from "lucide-react"
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
import { motion, AnimatePresence } from "framer-motion"
import ParticleBackground from "./ParticleBackground"
import { createProject, getAllProjects, deleteProject } from "@/services/projectService" // Add deleteProject import
import { toast } from "@/hooks/use-toast"
import { Project } from "@/types"

export function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // New Project State
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectRepo, setNewProjectRepo] = useState("")
    const [newProjectDesc, setNewProjectDesc] = useState("")
    const [nameError, setNameError] = useState("")
    const [repoError, setRepoError] = useState("")

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await getAllProjects()
            if (response.success) {
                // Map backend data to frontend format
                const mappedProjects: Project[] = response.projects.map((project: any) => ({
                    id: project.id,
                    name: project.repoName,
                    repoName: project.repoName,
                    repoUrl: project.repoUrl,
                    status: "active" as Project['status'],
                    createdAt: project.createdAt?.toDate ? 
                        project.createdAt.toDate().toISOString().split('T')[0] : 
                        new Date().toISOString().split('T')[0],
                    description: project.description || ""
                }))
                setProjects(mappedProjects)
            }
        } catch (error) {
            console.error("Error fetching projects:", error)
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

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
    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            // Delete each selected project
            for (const projectId of selectedProjects) {
                await deleteProject(projectId);
            }
            
            // Update frontend state after successful deletion
            setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
            setSelectedProjects([]);
            setIsDeleteOpen(false);
            
            toast({
                title: "Success",
                description: `Deleted ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} successfully`
            });
        } catch (error) {
            console.error("Error deleting projects:", error);
            toast({
                title: "Error",
                description: "Failed to delete projects. Please try again.",
                variant: "destructive"
            });
        } finally {
            setDeleting(false);
        }
    }

    // Create Logic
    const handleCreateProject = async () => {
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

        setCreating(true)
        try {
            const response = await createProject({
                repoName: newProjectName,
                repoUrl: newProjectRepo,
                description: newProjectDesc
            })

            if (response.success) {
                // Add the new project to the list
                const newProject = {
                    id: response.project.id,
                    name: response.project.repoName,
                    repoUrl: response.project.repoUrl,
                    status: "active",
                    createdAt: response.project.createdAt?.toDate ? 
                        response.project.createdAt.toDate().toISOString().split('T')[0] : 
                        new Date().toISOString().split('T')[0],
                    description: response.project.description || ""
                }
                setProjects([newProject, ...projects])
                setIsCreateOpen(false)
                resetForm()
                toast({
                    title: "Success",
                    description: "Project created successfully"
                })
            }
        } catch (error) {
            console.error("Error creating project:", error)
            toast({
                title: "Error",
                description: "Failed to create project",
                variant: "destructive"
            })
        } finally {
            setCreating(false)
        }
    }

    const resetForm = () => {
        setNewProjectName("")
        setNewProjectRepo("")
        setNewProjectDesc("")
        setNameError("")
        setRepoError("")
    }

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D] overflow-x-hidden min-h-screen">
            {/* Particle Background - Adjusted to not cover sidebar */}
            <div className="fixed inset-0 z-0">
                <ParticleBackground />
            </div>

            {/* Animated gradient orbs - Adjusted positions and sizes */}
            <div className="fixed top-0 right-[-100px] w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-0 left-[-100px] w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="fixed top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500" />

            <div className="relative z-10 p-4 sm:p-8 min-h-screen">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 text-white shadow-2xl backdrop-blur-xl border border-white/10 relative overflow-hidden group"
                >
                    {/* Header Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-indigo-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-6 h-6 text-purple-400" />
                                    </motion.div>
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                                        Projects
                                    </h1>
                                </div>
                                <p className="text-gray-300">Manage your repositories and projects.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="destructive"
                                        disabled={selectedProjects.length === 0}
                                        onClick={() => setIsDeleteOpen(true)}
                                        className="bg-gradient-to-r from-red-600 to-rose-600 border-none hover:shadow-lg hover:shadow-red-500/30 text-white hover:text-white"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete ({selectedProjects.length})
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={() => setIsCreateOpen(true)}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-purple-500/30 text-white hover:text-white"
                                    >
                                        <Plus size={16} className="mr-2" />
                                        Create Project
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative flex-grow"
                >
                    {/* Card Glow Effect - Reduced inset to prevent overflow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
                    
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10 overflow-hidden min-h-[500px]">
                        <CardContent className="p-0 h-full">
                            <div className="overflow-x-auto h-full">
                                <div className="min-w-full h-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                <TableHead className="w-[60px] pl-6 pr-2 text-gray-300">
                                                    <Checkbox
                                                        checked={projects.length > 0 && selectedProjects.length === projects.length}
                                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                        className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                    />
                                                </TableHead>
                                                <TableHead className="text-gray-300 min-w-[220px] px-4">Project Name</TableHead>
                                                <TableHead className="text-gray-300 min-w-[300px] px-4">Repository</TableHead>
                                                <TableHead className="text-gray-300 min-w-[140px] px-4">Status</TableHead>
                                                <TableHead className="text-gray-300 min-w-[160px] px-4">Created At</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow className="border-white/10 hover:bg-white/5">
                                                    <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                                                        Loading projects...
                                                    </TableCell>
                                                </TableRow>
                                            ) : projects.length === 0 ? (
                                                <TableRow className="border-white/10 hover:bg-white/5">
                                                    <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                                                        No projects found. Create one to get started.
                                                    </TableCell>
                                                </TableRow>
                                            ) : projects.map((project, index) => (
                                                <motion.tr 
                                                    key={project.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                                    className="border-white/10 group"
                                                >
                                                    <TableCell className="pl-6 pr-2">
                                                        <Checkbox
                                                            checked={selectedProjects.includes(project.id)}
                                                            onCheckedChange={(checked) => handleSelectOne(project.id, checked as boolean)}
                                                            className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium px-4">
                                                        <motion.div 
                                                            className="flex items-center gap-3"
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                                                <Folder size={18} className="text-purple-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-medium">{project.name}</span>
                                                                {project.description && (
                                                                    <span className="text-xs text-gray-400 truncate max-w-[180px]">
                                                                        {project.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    </TableCell>
                                                    <TableCell className="px-4 min-w-[300px]">
                                                        <motion.a 
                                                            href={project.repoUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors group/repo"
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <div className="p-1.5 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/20">
                                                                <GitBranch size={16} className="text-cyan-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="truncate max-w-[250px] group-hover/repo:text-purple-300 font-medium">
                                                                    {project.repoUrl.replace('https://github.com/', '')}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    GitHub Repository
                                                                </span>
                                                            </div>
                                                        </motion.a>
                                                    </TableCell>
                                                    <TableCell className="px-4">
                                                        <motion.div whileHover={{ scale: 1.1 }}>
                                                            <Badge
                                                                variant={
                                                                    project.status === 'active' ? 'verified' :
                                                                    project.status === 'maintenance' ? 'pending' :
                                                                    'outline'
                                                                }
                                                                className={`
                                                                    ${project.status === 'active' ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400 border-emerald-500/20' :
                                                                    project.status === 'maintenance' ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/20' :
                                                                    'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-400 border-gray-500/20'}
                                                                    backdrop-blur-sm whitespace-nowrap px-4 py-1.5
                                                                `}
                                                            >
                                                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                            </Badge>
                                                        </motion.div>
                                                    </TableCell>
                                                    <TableCell className="px-4 whitespace-nowrap">
                                                        <motion.div 
                                                            className="flex items-center gap-3 text-gray-300"
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <div className="p-1.5 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/20">
                                                                <Calendar size={16} className="text-cyan-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-medium">{project.createdAt}</span>
                                                                <span className="text-xs text-gray-400">Date Added</span>
                                                            </div>
                                                        </motion.div>
                                                    </TableCell>
                                                </motion.tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Create Project Modal */}
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    if (!open) resetForm();
                    setIsCreateOpen(open);
                }}>
                    <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-[#1F141E] border border-white/10 backdrop-blur-xl text-white overflow-hidden">
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <DialogTitle className="text-white">Create Project</DialogTitle>
                            </div>
                            <DialogDescription className="text-gray-400">
                                Add a new project to track and analyze.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-300">Project Name <span className="text-red-400">*</span></Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. My Awesome App"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className={`bg-white/5 border-white/10 text-white ${nameError ? "border-red-400" : ""}`}
                                />
                                {nameError && <span className="text-xs text-red-400">{nameError}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="repo" className="text-gray-300">GitHub Repository URL <span className="text-red-400">*</span></Label>
                                <Input
                                    id="repo"
                                    placeholder="https://github.com/username/repo"
                                    value={newProjectRepo}
                                    onChange={(e) => setNewProjectRepo(e.target.value)}
                                    className={`bg-white/5 border-white/10 text-white ${repoError ? "border-red-400" : ""}`}
                                />
                                {repoError && <span className="text-xs text-red-400">{repoError}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc" className="text-gray-300">Description</Label>
                                <Textarea
                                    id="desc"
                                    placeholder="Brief description of the project..."
                                    value={newProjectDesc}
                                    onChange={(e) => setNewProjectDesc(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsCreateOpen(false)}
                                className="border-white/10 text-gray-300 hover:bg-white/10"
                            >
                                Cancel
                            </Button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    onClick={handleCreateProject}
                                    disabled={creating}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-purple-500/30 text-white"
                                >
                                    {creating ? "Creating..." : "Create Project"}
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent className="bg-gradient-to-br from-gray-900 to-[#1F141E] border border-white/10 backdrop-blur-xl text-white overflow-hidden">
                        <AlertDialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg">
                                    <Trash2 className="w-5 h-5" />
                                </div>
                                <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. This will permanently delete {selectedProjects.length} selected project{selectedProjects.length > 1 ? 's' : ''} and remove the data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-gray-300 hover:bg-white/10" disabled={deleting}>
                                Cancel
                            </AlertDialogCancel>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm} 
                                    disabled={deleting}
                                    className="bg-gradient-to-r from-red-600 to-rose-600 border-none hover:shadow-lg hover:shadow-red-500/30 text-white"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </motion.div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}