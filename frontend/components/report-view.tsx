"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  GitCommit, 
  TrendingUp, 
  Sparkles,
  FileText,
  Shield,
  Activity,
  Folder
} from "lucide-react"
import { getReport } from "@/services/reportService"
import ParticleBackground from "./ParticleBackground"

interface TimelineEntry {
  date: string
  commits: number
  additions?: number
  deletions?: number
}

interface Report {
  id: string
  aiSummary: string
  confidenceScore: number
  flags: string[]
  timeline: TimelineEntry[]
  project?: {
    id: string
    repoName: string
    repoUrl: string
    status: string
  }
  createdAt?: string
  status?: "verified" | "flagged" | "pending"
  note?: string
}

interface ReportViewProps {
  reportId?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-[#1F141E] border border-white/10 backdrop-blur-xl rounded-lg p-4 shadow-2xl">
        <p className="text-sm font-medium text-white mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs text-purple-400">
            Commits: <span className="text-white font-medium">{payload[0].value}</span>
          </p>
          {payload[0].payload.additions && (
            <p className="text-xs text-emerald-400">
              Additions: <span className="text-white font-medium">+{payload[0].payload.additions}</span>
            </p>
          )}
          {payload[0].payload.deletions && (
            <p className="text-xs text-red-400">
              Deletions: <span className="text-white font-medium">-{payload[0].payload.deletions}</span>
            </p>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function ReportView({ reportId }: ReportViewProps) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeBar, setActiveBar] = useState<number | null>(null)

  useEffect(() => {
    if (!reportId) return

    setLoading(true)
    getReport(reportId)
      .then((res) => {
        if (res && res.success && res.data) {
          setReport(res.data)
        } else {
          console.error("Invalid report data", res)
          setReport(null)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch report", err)
        setReport(null)
      })
      .finally(() => setLoading(false))
  }, [reportId])

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-400"
    if (score >= 60) return "from-amber-500 to-orange-400"
    return "from-red-500 to-rose-400"
  }

  const getStatusBadge = (score: number, status?: string) => {
    if (status === 'verified') return { label: "Verified", color: "bg-gradient-to-r from-emerald-600 to-teal-500" }
    if (status === 'flagged') return { label: "Flagged", color: "bg-gradient-to-r from-red-600 to-rose-500" }
    if (status === 'pending') return { label: "Pending Review", color: "bg-gradient-to-r from-amber-600 to-orange-500" }
    
    // Fallback to confidence score if status is not provided
    if (score >= 80) return { label: "Verified", color: "bg-gradient-to-r from-emerald-600 to-teal-500" }
    if (score >= 60) return { label: "Pending Review", color: "bg-gradient-to-r from-amber-600 to-orange-500" }
    return { label: "Flagged", color: "bg-gradient-to-r from-red-600 to-rose-500" }
  }

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString)
        return null
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return null
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 p-8">
          <Skeleton className="h-10 w-64 mb-8 bg-white/20 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Skeleton className="h-48 bg-white/20 rounded-2xl" />
            <Skeleton className="h-48 bg-white/20 rounded-2xl" />
          </div>
          <Skeleton className="h-96 bg-white/20 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Report Not Found</h1>
            <p className="text-gray-400">The requested report could not be loaded.</p>
          </div>
        </div>
      </div>
    )
  }

  const { aiSummary, confidenceScore, flags, timeline, project, createdAt, status, note } = report
  const confidenceColor = getConfidenceColor(confidenceScore)
  const statusBadge = getStatusBadge(confidenceScore, status)
  const projectName = project?.repoName || "Project Report"
  const formattedDate = formatDate(createdAt)
  
  // Calculate total commits
  const totalCommits = timeline.reduce((sum, entry) => sum + entry.commits, 0)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-[#1F141E] to-[#51344D] overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative z-10 p-4 sm:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 text-white shadow-2xl backdrop-blur-xl border border-white/10 relative overflow-hidden group"
        >
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
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                      {projectName}
                    </h1>
                    <p className="text-gray-300">Code Authenticity Analysis Report</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {formattedDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                    <Calendar size={16} className="text-purple-400" />
                    <span className="text-white">{formattedDate}</span>
                  </div>
                )}
                <Badge className={`px-4 py-2 ${statusBadge.color} border-0 text-white font-medium`}>
                  {statusBadge.label}
                </Badge>
              </div>
            </div>

            {/* Project Info, Total Commits, and Confidence Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Project Info */}
              {project && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                  <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg">
                    <Folder className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{project.repoName}</p>
                    {project.repoUrl && (
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-cyan-400 transition-colors truncate block"
                      >
                        {project.repoUrl.replace('https://github.com/', '')}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Total Commits */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-600/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <div className="p-3 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg">
                  <GitCommit className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">Total Commits</p>
                  <p className="text-2xl font-bold text-white">{totalCommits}</p>
                </div>
              </div>

              {/* Confidence Score */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${confidenceColor} bg-opacity-20 backdrop-blur-sm border border-white/10 hover:bg-opacity-30 transition-all`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-r ${confidenceColor} rounded-lg`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Confidence Score</p>
                      <p className="text-xs text-gray-300">Authenticity verification</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {confidenceScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Note */}
            {note && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/20">
                <p className="text-sm text-gray-300">
                  <span className="text-cyan-400 font-medium">Note: </span>
                  {note}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary and Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
            <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/20">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">AI Summary</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{aiSummary}</p>
            </Card>
          </motion.div>

          {/* Flags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 via-rose-600/20 to-orange-600/20 rounded-3xl blur-xl" />
            <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-red-600/20 to-rose-600/20 rounded-lg border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Detected Flags</h2>
              </div>
              {flags.length > 0 ? (
                <div className="space-y-3">
                  {flags.map((flag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-red-600/10 to-rose-600/10 border border-red-500/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-rose-400 mt-1.5" />
                      <span className="text-sm text-gray-300 flex-1">{flag}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-emerald-500/20">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Flags Detected</h3>
                  <p className="text-gray-400">Great! No suspicious patterns were found.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

                {/* Commit Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-8"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-emerald-600/20 rounded-3xl blur-xl" />
          <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/20">
                  <GitCommit className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Commit Timeline</h2>
                  <p className="text-sm text-gray-400">Development activity over time for {projectName}</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>

            {timeline.length > 0 ? (
              <>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeline}
                      onMouseMove={(state) => {
                        if (state.activeTooltipIndex !== undefined) {
                          setActiveBar(state.activeTooltipIndex)
                        }
                      }}
                      onMouseLeave={() => setActiveBar(null)}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#989788"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#989788"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      {/* Removed the Legend component from here */}
                      <Bar
                        dataKey="commits"
                        name="Commits"
                        radius={[4, 4, 0, 0]}
                      >
                        {timeline.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === activeBar ? 
                              "url(#barGradient)" : 
                              index % 2 === 0 ? "#7c3aed" : "#a78bfa"
                            }
                            stroke={index === activeBar ? "#ffffff" : "transparent"}
                            strokeWidth={index === activeBar ? 2 : 0}
                            className="transition-all duration-300"
                          />
                        ))}
                      </Bar>
                      {/* Gradient definition for active bar */}
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Enhanced Chart Legend - Now includes Commit Count */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20">
                    <div className="w-3 h-3 rounded bg-[#7c3aed]" />
                    <span className="text-gray-300 font-medium">Commit Count</span>
                  </div>
                  
                  {/* Only show additions legend if there are additions in the data */}
                  {timeline.some(t => t.additions && t.additions > 0) && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20">
                      <div className="w-3 h-3 rounded bg-emerald-500" />
                      <span className="text-gray-300 font-medium">Code Additions</span>
                    </div>
                  )}
                  
                  {/* Only show deletions legend if there are deletions in the data */}
                  {timeline.some(t => t.deletions && t.deletions > 0) && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600/10 to-rose-600/10 border border-red-500/20">
                      <div className="w-3 h-3 rounded bg-red-500" />
                      <span className="text-gray-300 font-medium">Code Deletions</span>
                    </div>
                  )}
                  
                  {/* Activity indicator legend */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/20">
                    <div className="relative w-3 h-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-ping opacity-75" />
                      <div className="absolute inset-0.5 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full" />
                    </div>
                    <span className="text-gray-300 font-medium">Active Date</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-gray-500/20">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Timeline Data</h3>
                <p className="text-gray-400 max-w-md">
                  Commit timeline data is not available for {projectName}.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}