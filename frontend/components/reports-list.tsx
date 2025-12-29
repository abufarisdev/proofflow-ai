"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, FileText, Calendar, GitBranch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Placeholder data
const reports = [
    {
        id: "1",
        name: "ProofFlow AI Core",
        repo: "abufarisdev/proofflow-ai",
        date: "2025-12-28",
        status: "verified",
        confidence: 94,
    },
    {
        id: "2",
        name: "E-Commerce Platform",
        repo: "client-a/shop-v2",
        date: "2025-12-27",
        status: "pending",
        confidence: 0,
    },
    {
        id: "3",
        name: "Legacy CRM Migration",
        repo: "internal/crm-legacy",
        date: "2025-12-25",
        status: "flagged",
        confidence: 45,
    },
    {
        id: "4",
        name: "User Auth Service",
        repo: "abufarisdev/auth-service",
        date: "2025-12-20",
        status: "verified",
        confidence: 88,
    },
    {
        id: "5",
        name: "Payment Gateway Integration",
        repo: "fintech/payment-gateway",
        date: "2025-12-18",
        status: "verified",
        confidence: 92,
    },
]

export function ReportsList() {
    return (
        <div className="p-8 bg-background min-h-screen animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">My Reports</h1>
                <p className="text-muted-foreground">View and manage your code authenticity analysis reports.</p>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>A list of all your generated reports and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Repository</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-muted/20 rounded-md group-hover:bg-[#51344D]/10 transition-colors">
                                                <FileText size={16} className="text-[#51344D]" />
                                            </div>
                                            {report.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <GitBranch size={14} />
                                            {report.repo}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar size={14} />
                                            {new Date(report.date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`
                        ${report.status === "verified" ? "bg-[#6F5060] hover:bg-[#6F5060]/90" : ""}
                        ${report.status === "pending" ? "bg-[#989788] hover:bg-[#989788]/90" : ""}
                        ${report.status === "flagged" ? "bg-destructive hover:bg-destructive/90" : ""}
                        uppercase text-[10px] tracking-wider
                      `}
                                        >
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-[150px]">
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
                                            <span className="text-xs text-muted-foreground italic">Analysis in progress</span>
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
