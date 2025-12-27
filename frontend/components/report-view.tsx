
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, Filter, ChevronDown } from "lucide-react"
import { getReport } from "@/services/reportService"
import { getGithubToken } from "@/services/authService"

interface Report {
  name: string;
  confidence: number;
  status: string;
  authenticityMetrics: any[];
  timelineData: any[];
  detailedAnalysis: { name: string; value: number }[];
  flaggedIssues: {
    id: string;
    severity: "high" | "medium" | "low";
    title: string;
    description: string;
    timestamp: string;
  }[];
  recommendations: { title: string; description: string }[];
}

export function ReportView() {
  const [report, setReport] = useState<Report | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const token = getGithubToken();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (token && id) {
      getReport(token, id)
        .then((data) => {
          setReport(data);
        })
        .catch((error) => {
          console.error("Failed to get report", error);
        });
    }
  }, []);

  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Project Analysis Reports</h1>

        {/* Project Selector */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
              <span>{report.name}</span>
              <ChevronDown size={16} />
            </button>
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
            <p className="text-5xl font-bold text-foreground">{report.confidence}%</p>
            <p className={`text-sm mt-2 ${report.status === 'verified' ? 'text-chart-1' : 'text-destructive'}`}>
              {report.status === 'verified' ? 'Verified as Authentic' : 'Flagged for Review'}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${report.status === 'verified' ? 'border-chart-1' : 'border-destructive'} relative`}>
              <span className="text-4xl font-bold text-foreground">{report.confidence}</span>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${report.status === 'verified' ? 'bg-chart-1' : 'bg-destructive'} rounded-full flex items-center justify-center`}>
                <span className="text-sm font-bold text-primary-foreground">{report.status === 'verified' ? '✓' : '!'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Radar Chart - Authenticity Metrics */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Authenticity Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={report.authenticityMetrics}>
              <PolarGrid stroke="hsl(var(--color-border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--color-muted-foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--color-border))" />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--color-chart-1))"
                fill="hsl(var(--color-chart-1))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Timeline Chart */}
        <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Development Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="phase" stroke="hsl(var(--color-muted-foreground))" />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Legend />
              <Bar dataKey="commits" fill="hsl(var(--color-chart-1))" />
              <Bar dataKey="days" fill="hsl(var(--color-chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Analysis and Flagged Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Analysis Details */}
        <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Detailed Analysis Scores</h2>
          <div className="space-y-4">
            {report.detailedAnalysis.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm font-bold text-foreground">{item.value}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-chart-1 to-chart-2 h-2 rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Flagged Issues */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Flagged Issues</h2>
          <div className="space-y-4">
            {report.flaggedIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-lg border-l-4 ${issue.severity === "high"
                    ? "border-l-destructive bg-destructive/10"
                    : issue.severity === "medium"
                      ? "border-l-chart-2 bg-chart-2/10"
                      : "border-l-chart-4 bg-chart-4/10"
                  }`}
              >
                <p className="font-medium text-foreground text-sm">{issue.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(issue.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendations.map((rec, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted">
              <p className="font-medium text-foreground text-sm mb-2">{rec.title}</p>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
