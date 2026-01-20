"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, FileText, Calendar, GitBranch, Plus, Trash2, Search, ArrowRight, Sparkles, Zap, Shield, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getReports, createReport, deleteReports } from "@/services/reportService"
import { getAllProjects } from "@/services/projectService"
import { useToast } from "@/components/ui/use-toast"
import { Report } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import ParticleBackground from "./ParticleBackground"

export function ReportsList() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedReports, setSelectedReports] = useState<string[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [activeStat, setActiveStat] = useState(0)
    const { toast } = useToast()

    // Create Report State
    const [projects, setProjects] = useState<any[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState("")
    const [note, setNote] = useState("")
    const [createLoading, setCreateLoading] = useState(false)

    const stats = [
        { icon: FileText, title: "Total Reports", value: reports.length, color: "from-purple-500 to-pink-500" },
        { icon: Shield, title: "High Confidence", value: reports.filter(r => r.confidence > 80).length, color: "from-emerald-500 to-teal-400" },
        { icon: Activity, title: "Pending Analysis", value: reports.filter(r => r.status === 'pending' || r.status === 'processing').length, color: "from-amber-500 to-orange-500" },
        { icon: Zap, title: "Flagged Issues", value: reports.filter(r => r.status === 'flagged').length, color: "from-red-500 to-rose-500" },
    ]

    useEffect(() => {
        // Cycle through stats for animation
        const interval = setInterval(() => {
            setActiveStat((prev) => (prev + 1) % stats.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [reports])

    const fetchReports = async () => {
        try {
            setLoading(true)
            const response: any = await getReports()
            if (response?.success && response?.data && Array.isArray(response.data)) {
                const mappedReports: Report[] = response.data.map((item: any) => {
                    // Handle date parsing safely
                    let createdAt = new Date().toISOString();
                    
                    if (item.createdAt) {
                        if (typeof item.createdAt === 'object' && item.createdAt.toDate) {
                            // Firestore timestamp
                            createdAt = item.createdAt.toDate().toISOString();
                        } else if (typeof item.createdAt === 'string') {
                            // ISO string
                            const date = new Date(item.createdAt);
                            if (!isNaN(date.getTime())) {
                                createdAt = item.createdAt;
                            }
                        }
                    }
                    
                    return {
                        id: item.id,
                        name: item.project?.repoName || 'Unknown Project',
                        repoUrl: item.project?.repoUrl || '',
                        status: (item.project?.status || 'pending') as Report['status'],
                        confidence: item.confidenceScore || 0,
                        createdAt: createdAt,
                        action: 'Report Generated'
                    }
                })
                setReports(mappedReports)
            }
        } catch (error) {
            console.error("Failed to fetch reports", error)
            toast({
                title: "Error",
                description: "Failed to load reports",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchProjects = async () => {
        try {
            const response: any = await getAllProjects()
            if (response?.success && response?.projects) {
                setProjects(response.projects)
            }
        } catch (error) {
            console.error("Failed to fetch projects", error)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    useEffect(() => {
        if (isCreateOpen) {
            fetchProjects()
        }
    }, [isCreateOpen])

    // Format date safely
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    }

    // Selection Logic
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReports(reports.map(r => r.id))
        } else {
            setSelectedReports([])
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedReports([...selectedReports, id])
        } else {
            setSelectedReports(selectedReports.filter(rid => rid !== id))
        }
    }

    // Create Logic
    const handleCreateReport = async () => {
        if (!selectedProjectId) return

        try {
            setCreateLoading(true)
            await createReport({ projectId: selectedProjectId, note })
            toast({
                title: "Report Generated",
                description: "New analysis report has been created successfully.",
                className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none"
            })
            setIsCreateOpen(false)
            setSelectedProjectId("")
            setNote("")
            fetchReports()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create report",
                variant: "destructive"
            })
        } finally {
            setCreateLoading(false)
        }
    }

    // Delete Logic
    const handleDeleteConfirm = async () => {
        try {
            await deleteReports(selectedReports)
            toast({
                title: "Reports Deleted",
                description: `Successfully deleted ${selectedReports.length} reports.`,
                className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none"
            })
            setReports(reports.filter(r => !selectedReports.includes(r.id)))
            setSelectedReports([])
            setIsDeleteOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete reports",
                variant: "destructive"
            })
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified': 
                return (
                    <Badge className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400 border-emerald-500/20 backdrop-blur-sm px-3 py-1">
                        Verified
                    </Badge>
                );
            case 'flagged': 
                return (
                    <Badge className="bg-gradient-to-r from-red-600/20 to-rose-600/20 text-red-400 border-red-500/20 backdrop-blur-sm px-3 py-1">
                        Flagged
                    </Badge>
                );
            case 'pending': 
                return (
                    <Badge className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/20 backdrop-blur-sm px-3 py-1">
                        Pending
                    </Badge>
                );
            case 'processing': 
                return (
                    <Badge className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border-blue-500/20 backdrop-blur-sm px-3 py-1">
                        Processing
                    </Badge>
                );
            default: 
                return (
                    <Badge className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-400 border-gray-500/20 backdrop-blur-sm px-3 py-1">
                        {status}
                    </Badge>
                );
        }
    };

    const StatIcon = stats[activeStat].icon

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D] overflow-x-hidden">
            {/* Particle Background */}
            <div className="fixed inset-0 z-0">
                <ParticleBackground />
            </div>

            {/* Animated gradient orbs */}
            <div className="fixed top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="fixed top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500" />

            <div className="relative z-10 p-4 sm:p-8 min-h-screen">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 text-white shadow-2xl backdrop-blur-xl border border-white/10 relative overflow-hidden group"
                >
                    {/* Header Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-indigo-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-6 h-6 text-purple-400" />
                                    </motion.div>
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                                        Reports
                                    </h1>
                                </div>
                                <p className="text-gray-300">View and manage your code authenticity analysis reports.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="destructive"
                                        disabled={selectedReports.length === 0}
                                        onClick={() => setIsDeleteOpen(true)}
                                        className="bg-gradient-to-r from-red-600 to-rose-600 border-none hover:shadow-lg hover:shadow-red-500/30 text-white hover:text-white"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete ({selectedReports.length})
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
                                        Generate Report
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        {/* Animated Stats Showcase */}
                        <div className="mt-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStat}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block"
                                >
                                    <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${stats[activeStat].color} bg-opacity-20 border border-white/10 backdrop-blur-sm`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg bg-gradient-to-r ${stats[activeStat].color}`}>
                                                <StatIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-white">
                                                {stats[activeStat].title}: {stats[activeStat].value}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <Card key={i} className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
                                <div className="flex items-start justify-between">
                                    <div className="w-full">
                                        <div className="h-4 w-24 mb-2 bg-white/20 rounded animate-pulse" />
                                        <div className="h-8 w-16 bg-white/20 rounded animate-pulse" />
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
                                </div>
                            </Card>
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="group relative"
                            >
                                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-gray-300 font-medium mb-1">{stat.title}</p>
                                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                                        </div>
                                        <div className={`p-3 bg-gradient-to-br ${stat.color} bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Reports Table */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
                    
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10 overflow-hidden">
                        <CardHeader className="border-b border-white/10">
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                Recent Reports
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                A list of all your generated reports and their status.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="w-[60px] pl-6 pr-2 text-gray-300">
                                                <Checkbox
                                                    checked={reports.length > 0 && selectedReports.length === reports.length}
                                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                    className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                />
                                            </TableHead>
                                            <TableHead className="text-gray-300 min-w-[200px] px-4">Project Name</TableHead>
                                            <TableHead className="text-gray-300 min-w-[200px] px-4">Repository</TableHead>
                                            <TableHead className="text-gray-300 min-w-[140px] px-4">Submission Date</TableHead>
                                            <TableHead className="text-gray-300 min-w-[120px] px-4">Status</TableHead>
                                            <TableHead className="text-gray-300 min-w-[150px] px-4">Confidence</TableHead>
                                            <TableHead className="text-right text-gray-300 min-w-[120px] px-4">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow className="border-white/10">
                                                <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                                                    Loading reports...
                                                </TableCell>
                                            </TableRow>
                                        ) : reports.length === 0 ? (
                                            <TableRow className="border-white/10">
                                                <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                                                    <div className="flex flex-col items-center justify-center p-8 text-center">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-indigo-600/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                                                            <FileText className="w-8 h-8 text-purple-400" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-white mb-2">No reports found</h3>
                                                        <p className="text-gray-400 mb-6 max-w-sm">Generate your first report to see analysis results</p>
                                                        <Button
                                                            onClick={() => setIsCreateOpen(true)}
                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-purple-500/30 text-white"
                                                        >
                                                            <Plus size={16} className="mr-2" />
                                                            Generate Report
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            reports.map((report, index) => (
                                                <motion.tr 
                                                    key={report.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                                    className="border-white/10 group"
                                                >
                                                    <TableCell className="pl-6 pr-2">
                                                        <Checkbox
                                                            checked={selectedReports.includes(report.id)}
                                                            onCheckedChange={(checked) => handleSelectOne(report.id, checked as boolean)}
                                                            className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium px-4">
                                                        <motion.div 
                                                            className="flex items-center gap-3"
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                                                <FileText size={16} className="text-purple-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white whitespace-nowrap font-medium">{report.name}</span>
                                                                <span className="text-xs text-gray-400">Project Analysis</span>
                                                            </div>
                                                        </motion.div>
                                                    </TableCell>
                                                    <TableCell className="px-4 min-w-[200px]">
                                                        <motion.a 
                                                            href={report.repoUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors group/repo"
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            <div className="p-1.5 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/20">
                                                                <GitBranch size={16} className="text-cyan-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="truncate max-w-[180px] group-hover/repo:text-purple-300 font-medium">
                                                                    {report.repoUrl ? report.repoUrl.replace('https://github.com/', '') : 'N/A'}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    GitHub Repository
                                                                </span>
                                                            </div>
                                                        </motion.a>
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
                                                                <span className="text-white font-medium">{formatDate(report.createdAt)}</span>
                                                                <span className="text-xs text-gray-400">Date Submitted</span>
                                                            </div>
                                                        </motion.div>
                                                    </TableCell>
                                                    <TableCell className="px-4">
                                                        {getStatusBadge(report.status)}
                                                    </TableCell>
                                                    <TableCell className="px-4 min-w-[150px]">
                                                        {report.status !== "pending" ? (
                                                            <motion.div 
                                                                className="flex items-center gap-3"
                                                                whileHover={{ x: 5 }}
                                                            >
                                                                <span className="text-sm font-medium w-10 text-white">{report.confidence}%</span>
                                                                <div className="flex-1 min-w-[80px]">
                                                                    <Progress
                                                                        value={report.confidence}
                                                                        className="h-2 bg-white/10"
                                                                        indicatorClassName={
                                                                            report.confidence > 80 
                                                                                ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                                                                                : report.confidence > 60 
                                                                                ? "bg-gradient-to-r from-amber-500 to-orange-400"
                                                                                : "bg-gradient-to-r from-red-500 to-rose-400"
                                                                        }
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            <span className="text-xs text-amber-400 italic whitespace-nowrap">Analysis in progress</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-4 text-right">
                                                        <motion.div whileHover={{ scale: 1.05 }}>
                                                            <Link 
                                                                href={`/reports/${report.id}`}
                                                                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                                            >
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
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Generate Report Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-[#1F141E] border border-white/10 backdrop-blur-xl text-white overflow-hidden">
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <DialogTitle className="text-white">Generate New Report</DialogTitle>
                            </div>
                            <DialogDescription className="text-gray-400">
                                Select a project to analyze its authenticity.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="project" className="text-gray-300">Project</Label>
                                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Select a project..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-white/10 text-white">
                                        {projects.length === 0 ? (
                                            <SelectItem value="none" disabled>No projects found</SelectItem>
                                        ) : (
                                            projects.map((project: any) => (
                                                <SelectItem key={project.id} value={project.id} className="hover:bg-white/10">
                                                    {project.repoName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="note" className="text-gray-300">Optional Note</Label>
                                <Textarea
                                    id="note"
                                    placeholder="Add any specific context for this report..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
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
                                    onClick={handleCreateReport}
                                    disabled={createLoading || !selectedProjectId}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 text-white"
                                >
                                    {createLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Generating...
                                        </span>
                                    ) : "Generate Report"}
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
                                This action cannot be undone. This will permanently delete {selectedReports.length} selected report{selectedReports.length > 1 ? 's' : ''} and remove the data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-gray-300 hover:bg-white/10">
                                Cancel
                            </AlertDialogCancel>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm} 
                                    className="bg-gradient-to-r from-red-600 to-rose-600 border-none hover:shadow-lg hover:shadow-red-500/30 text-white"
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