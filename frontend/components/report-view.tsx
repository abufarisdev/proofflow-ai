"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Loader2, Download, Filter, ChevronDown } from "lucide-react"

// Define types (Interfaces remain the same)
interface Project {
  repoName: string
  repoUrl: string
  status: string
}

interface Report {
  _id: string
  projectId: Project
  confidenceScore: number
  timeline: any[]
  flags: any[]
  createdAt: string
}

export function ReportView() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await api.get("/reports")
      if (res.data.success) {
        setReports(res.data.data)
        if (res.data.data.length > 0) {
          setSelectedReport(res.data.data[0])
        }
      }
    } catch (err) {
      console.error("Error fetching reports:", err)
      setError("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  // ... (render logic unchanged until return)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <button onClick={fetchReports} className="px-4 py-2 bg-primary text-primary-foreground rounded">Retry</button>
      </div>
    )
  }

  if (!selectedReport) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">No reports found.</p>
      </div>
    )
  }

  const projectList = reports.map(r => ({
    id: r._id,
    name: r.projectId?.repoName || "Unknown Project",
    lastAnalyzed: new Date(r.createdAt).toLocaleDateString()
  }))

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Project Analysis Reports</h1>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
              <span>{selectedReport.projectId?.repoName || "Select Project"}</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-10 hidden group-hover:block">
              {projectList.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    const report = reports.find(r => r._id === project.id)
                    setSelectedReport(report || null)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <p className="font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.lastAnalyzed}</p>
                </button>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
            <Filter size={16} />
            <span>Filters</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity ml-auto">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="p-8 bg-card border-border mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Overall Authenticity Score</p>
            <p className="text-5xl font-bold text-foreground">{selectedReport.confidenceScore || 0}%</p>
            <p className="text-sm text-chart-1 mt-2">
              {selectedReport.confidenceScore > 75 ? "Verified as Authentic" : "Needs Review"}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-chart-1 relative">
              <span className="text-4xl font-bold text-foreground">{selectedReport.confidenceScore || 0}</span>
              {selectedReport.confidenceScore > 75 && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-chart-1 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">✓</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Placeholder functionality for unimplemented charts */}
      <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Detailed metrics and charts visualization will be implemented when backend provides granular data.
      </div>
    </div>
  )
}
