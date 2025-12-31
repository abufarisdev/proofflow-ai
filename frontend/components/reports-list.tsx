"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, FileText, Calendar, GitBranch, Plus, Trash2, Search, ArrowRight } from "lucide-react"
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

export function ReportsList() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedReports, setSelectedReports] = useState<string[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const { toast } = useToast()

    // Create Report State
    const [projects, setProjects] = useState<any[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState("")
    const [note, setNote] = useState("")
    const [createLoading, setCreateLoading] = useState(false)

    const fetchReports = async () => {
        try {
            setLoading(true)
            const response: any = await getReports()
            if (response?.data && Array.isArray(response.data)) {
                const mappedReports: Report[] = response.data.map((item: any) => ({
                    id: item._id,
                    name: item.projectId?.repoName || 'Unknown Project',
                    repoUrl: item.projectId?.repoUrl || '',
                    status: (item.projectId?.status || 'pending') as Report['status'],
                    confidence: item.confidenceScore || 0,
                    createdAt: item.createdAt || new Date().toISOString(),
                    action: 'Report Generated'
                }))
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
            // Only fetch if we haven't already or if we need to refresh
            const response: any = await getAllProjects()
            if (response?.data) {
                setProjects(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch projects", error)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    // Fetch projects when opening the create modal
    useEffect(() => {
        if (isCreateOpen) {
            fetchProjects()
        }
    }, [isCreateOpen])


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
                className: "bg-[#51344D] text-white border-none"
            })
            setIsCreateOpen(false)
            setSelectedProjectId("")
            setNote("")
            fetchReports() // Refresh list
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
                className: "bg-[#51344D] text-white border-none"
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
            case 'verified': return <Badge className="bg-[#6F5060] hover:bg-[#6F5060]/90">Verified</Badge>;
            case 'flagged': return <Badge variant="destructive">Flagged</Badge>;
            case 'pending': return <Badge variant="secondary" className="text-muted-foreground">Pending</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="p-8 bg-background min-h-screen animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
                    <p className="text-muted-foreground">View and manage your code authenticity analysis reports.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        disabled={selectedReports.length === 0}
                        onClick={() => setIsDeleteOpen(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete Selected ({selectedReports.length})
                    </Button>
                    <Button
                        className="bg-[#51344D] hover:bg-[#6F5060] text-white"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus size={16} className="mr-2" />
                        Generate Report
                    </Button>
                </div>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>A list of all your generated reports and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] pl-4">
                                        <Checkbox
                                            checked={reports.length > 0 && selectedReports.length === reports.length}
                                            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                        />
                                    </TableHead>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Repository</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Confidence</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Loading reports...
                                        </TableCell>
                                    </TableRow>
                                ) : reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            No reports found. Generate one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map((report) => (
                                        <TableRow key={report.id} className="group hover:bg-muted/30 transition-colors">
                                            <TableCell className="pl-4">
                                                <Checkbox
                                                    checked={selectedReports.includes(report.id)}
                                                    onCheckedChange={(checked) => handleSelectOne(report.id, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-muted/20 rounded-md group-hover:bg-[#51344D]/10 transition-colors">
                                                        <FileText size={16} className="text-[#51344D]" />
                                                    </div>
                                                    <span className="whitespace-nowrap">{report.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                                                    <GitBranch size={14} />
                                                    {report.repoUrl ? report.repoUrl.replace('https://github.com/', '') : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                                                    <Calendar size={14} />
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(report.status)}
                                            </TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">
                                                {report.status !== "pending" ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium w-8">{report.confidence}%</span>
                                                        <Progress
                                                            value={report.confidence}
                                                            className="h-2 bg-muted/50"
                                                            indicatorClassName={
                                                                report.confidence > 70 ? "bg-[#51344D]" :
                                                                    report.confidence > 40 ? "bg-[#989788]" : "bg-destructive"
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic whitespace-nowrap">Analysis in progress</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/reports/${report.id}`}>
                                                    <Button variant="ghost" size="sm" className="hover:bg-[#51344D]/10 hover:text-[#51344D]">
                                                        <Eye size={16} className="mr-2" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Generate Report Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Generate New Report</DialogTitle>
                        <DialogDescription>
                            Select a project to analyze its authenticity.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="project">Project</Label>
                            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.length === 0 ? (
                                        <SelectItem value="none" disabled>No projects found</SelectItem>
                                    ) : (
                                        projects.map((project: any) => (
                                            <SelectItem key={project._id} value={project._id}>
                                                {project.repoName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Optional Note</Label>
                            <Textarea
                                id="note"
                                placeholder="Add any specific context for this report..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleCreateReport}
                            className="bg-[#51344D] hover:bg-[#6F5060] text-white"
                            disabled={createLoading || !selectedProjectId}
                        >
                            {createLoading ? "Generating..." : "Generate Report"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {selectedReports.length} selected report{selectedReports.length > 1 ? 's' : ''} and remove the data from our servers.
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
