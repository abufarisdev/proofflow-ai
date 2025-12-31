"use client"

import { useState } from "react"
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
        <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D]">
            {/* Particle Background - Adjusted to not cover sidebar */}
            <div className="absolute inset-0 z-0">
                <ParticleBackground />
            </div>

            {/* Animated gradient orbs - Adjusted positions */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500" />

            <div className="relative z-10 p-4 sm:p-8">
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
                                        className="bg-gradient-to-r from-red-600 to-rose-600 border-none hover:shadow-lg hover:shadow-red-500/30"
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
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-purple-500/30"
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
                    className="relative"
                >
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
                    
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="w-[50px] pl-4 text-gray-300">
                                            <Checkbox
                                                checked={projects.length > 0 && selectedProjects.length === projects.length}
                                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                            />
                                        </TableHead>
                                        <TableHead className="text-gray-300">Project Name</TableHead>
                                        <TableHead className="text-gray-300">Repository</TableHead>
                                        <TableHead className="text-gray-300">Status</TableHead>
                                        <TableHead className="text-gray-300">Created At</TableHead>
                                        <TableHead className="text-right text-gray-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.length === 0 ? (
                                        <TableRow className="border-white/10 hover:bg-white/5">
                                            <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                                                No projects found. Create one to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : projects.map((project, index) => (
                                        <motion.tr 
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.005, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            className="border-white/10 group"
                                        >
                                            <TableCell className="pl-4">
                                                <Checkbox
                                                    checked={selectedProjects.includes(project.id)}
                                                    onCheckedChange={(checked) => handleSelectOne(project.id, checked as boolean)}
                                                    className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <motion.div 
                                                    className="flex items-center gap-2"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                                        <Folder size={16} className="text-purple-400" />
                                                    </div>
                                                    <span className="text-white whitespace-nowrap">{project.name}</span>
                                                </motion.div>
                                            </TableCell>
                                            <TableCell>
                                                <motion.a 
                                                    href={project.repoUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap group/repo"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <GitBranch size={14} />
                                                    <span className="group-hover/repo:text-purple-300">
                                                        {project.repoUrl.replace('https://github.com/', '')}
                                                    </span>
                                                </motion.a>
                                            </TableCell>
                                            <TableCell>
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
                                                            backdrop-blur-sm
                                                        `}
                                                    >
                                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                    </Badge>
                                                </motion.div>
                                            </TableCell>
                                            <TableCell>
                                                <motion.div 
                                                    className="flex items-center gap-2 text-gray-300 whitespace-nowrap"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <Calendar size={14} className="text-cyan-400" />
                                                    {project.createdAt}
                                                </motion.div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <motion.div whileHover={{ scale: 1.05 }}>
                                                    <Link href={`#`}>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/40"
                                                        >
                                                            <Eye size={16} className="mr-2" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                </motion.div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Create Project Modal */}
                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    if (!open) resetForm();
                    setIsCreateOpen(open);
                }}>
                    <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-[#1F141E] border border-white/10 backdrop-blur-xl text-white">
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
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-purple-500/30"
                                >
                                    Create Project
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent className="bg-gradient-to-br from-gray-900 to-[#1F141E] border border-white/10 backdrop-blur-xl text-white">
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
                            <AlertDialogCancel className="border-white/10 text-gray-300 hover:bg-white/10">
                                Cancel
                            </AlertDialogCancel>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm} 
                                    className="bg-gradient-to-r from-red-600 to-rose-600 border-none hover:shadow-lg hover:shadow-red-500/30"
                                >
                                    Delete
                                </AlertDialogAction>
                            </motion.div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}