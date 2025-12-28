
"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { getReports } from "@/services/reportService"
import { useState, useEffect } from "react"

interface Report {
  id: string;
  name: string;
  status: string;
  confidence: number;
  createdAt: string;
  action?: string;
}

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    getReports()
      .then((data) => {
        setReports(data);
      })
      .catch((error) => {
        console.error("Failed to get reports", error);
      });
  }, []);

  const totalProjects = reports.length;
  const verifiedProjects = reports.filter(report => report.status === 'verified').length;
  const pendingReviews = reports.filter(report => report.status === 'pending').length;
  const flaggedIssues = reports.filter(report => report.status === 'flagged').length;

  interface ActivityItem {
    date: string;
    submissions: number;
    verified: number;
  }

  const activityData = reports.reduce<ActivityItem[]>((acc, report) => {
    const date = new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.submissions++;
      if (report.status === 'verified') {
        existing.verified++;
      }
    } else {
      acc.push({ date, submissions: 1, verified: report.status === 'verified' ? 1 : 0 });
    }
    return acc;
  }, []);

  const confidenceData = [
    { name: "High (>90%)", value: reports.filter(r => r.confidence > 90).length, color: "hsl(var(--color-chart-1))" },
    { name: "Medium (70-90%)", value: reports.filter(r => r.confidence >= 70 && r.confidence <= 90).length, color: "hsl(var(--color-chart-2))" },
    { name: "Low (<70%)", value: reports.filter(r => r.confidence < 70).length, color: "hsl(var(--color-chart-3))" },
  ]

  return (
    <div className="p-8 bg-background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your project authenticity overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-foreground">{totalProjects}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-chart-1" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Verified Projects</p>
              <p className="text-3xl font-bold text-foreground">{verifiedProjects}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-chart-1" />
          </div>
          <p className="text-xs text-muted-foreground mt-4">{((verifiedProjects / totalProjects) * 100).toFixed(1)}% success rate</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
              <p className="text-3xl font-bold text-foreground">{pendingReviews}</p>
            </div>
            <Clock className="w-5 h-5 text-chart-2" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Flagged Issues</p>
              <p className="text-3xl font-bold text-foreground">{flaggedIssues}</p>
            </div>
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-xs text-muted-foreground mt-4">Requires attention</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                }}
              />
              <Legend />
              <Bar dataKey="submissions" fill="hsl(var(--color-chart-1))" />
              <Bar dataKey="verified" fill="hsl(var(--color-chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Confidence Distribution */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Confidence Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Projects</h2>
          <div className="space-y-4">
            {reports.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{project.confidence}%</p>
                    <p className={`text-xs ${project.status === "verified" ? "text-chart-1" : "text-chart-2"}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${project.status === "verified" ? "bg-chart-1" : "bg-chart-2"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {reports.slice(0, 4).map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-chart-1 mt-2" />
                  <div className="w-0.5 h-12 bg-border" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
