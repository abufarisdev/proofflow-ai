"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getReport } from "@/services/reportService"

interface TimelineEntry {
  date: string
  commits: number
}

interface Report {
  aiSummary: string
  confidenceScore: number
  flags: string[]
  timeline: TimelineEntry[]
}

interface ReportViewProps {
  reportId?: string
}

export function ReportView({ reportId }: ReportViewProps) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading || !report) {
    return (
      <div className="p-8 min-h-screen">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-6 w-48 mb-2" />
      </div>
    )
  }

  const { aiSummary, confidenceScore, flags, timeline } = report

  return (
    <div className="p-8 min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-4">Project Report</h1>

      {/* AI Summary */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
        <p>{aiSummary}</p>
      </Card>

      <div className="w-full flex gap-5">
              {/* Confidence Score */}
      <Card className="w-1/2 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Confidence Score</h2>
        <p className="text-2xl font-bold">{confidenceScore}%</p>
      </Card>

      {/* Flags */}
      <Card className="w-1/2 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Flags</h2>
        {flags.length ? (
          <ul className="list-disc pl-5">
            {flags.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <p>No flags detected</p>
        )}
      </Card>
</div>

      {/* Timeline Chart */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Commit Timeline</h2>
        {timeline.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="commits" fill="hsl(var(--color-chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No timeline data available</p>
        )}
      </Card>
    </div>
  )
}
