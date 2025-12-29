
'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, Clock, FileText, Plus } from "lucide-react";
import { getReports } from "@/services/reportService";

import { useState, useEffect } from "react";
import { Report } from "@/types";

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          const mappedReports = response.data.map((item: any) => ({
            id: item._id,
            name: item.projectId?.repoName || 'Unknown Project',
            repoUrl: item.projectId?.repoUrl || '',
            status: item.projectId?.status || 'pending',
            confidence: item.confidenceScore || 0,
            createdAt: item.createdAt,
            action: 'Report Generated'
          }));
          setReports(mappedReports);
        }
      })
      .catch((error) => {
        console.error("Failed to get reports", error);
      })
      .finally(() => setLoading(false));
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
    { name: "High (>90%)", value: reports.filter(r => r.confidence > 90).length, color: "#51344D" },
    { name: "Medium (70-90%)", value: reports.filter(r => r.confidence >= 70 && r.confidence <= 90).length, color: "#6F5060" },
    { name: "Low (<70%)", value: reports.filter(r => r.confidence < 70).length, color: "#989788" },
  ];

  return (
    <div className="p-4 sm:p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8 welcome-banner animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back!</h1>
        <p className="text-white/80 text-sm sm:text-base">Here's your project authenticity overview.</p>
      </div>

      {!loading && reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl shadow-sm text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-muted-custom/20 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-primary-custom" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No projects yet</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Start by generating your first report to analyze code authenticity and get detailed insights.
          </p>
          <a
            href="/reports"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-custom text-white rounded-lg hover:bg-primary-custom/90 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Generate first report
          </a>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-6 bg-card border-border">
                    <div className="flex items-start justify-between">
                      <div className="w-full">
                        <Skeleton className="h-4 w-24 mb-2 bg-muted-custom/20" />
                        <Skeleton className="h-8 w-16 bg-muted-custom/20" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full bg-muted-custom/20" />
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-0 fill-mode-backwards">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-custom font-medium mb-1">Total Projects</p>
                      <p className="text-3xl font-bold text-foreground">{totalProjects}</p>
                    </div>
                    <div className="p-2 bg-primary-custom/10 rounded-full">
                      <TrendingUp className="w-5 h-5 text-primary-custom" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-100 fill-mode-backwards">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-custom font-medium mb-1">Verified Projects</p>
                      <p className="text-3xl font-bold text-foreground">{verifiedProjects}</p>
                    </div>
                    <div className="p-2 bg-secondary-custom/10 rounded-full">
                      <CheckCircle className="w-5 h-5 text-secondary-custom" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">{totalProjects > 0 ? ((verifiedProjects / totalProjects) * 100).toFixed(1) : 0}% success rate</p>
                </Card>

                <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-200 fill-mode-backwards">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-custom font-medium mb-1">Pending Reviews</p>
                      <p className="text-3xl font-bold text-foreground">{pendingReviews}</p>
                    </div>
                    <div className="p-2 bg-[#989788]/20 rounded-full">
                      <Clock className="w-5 h-5 text-[#989788]" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-300 fill-mode-backwards">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-custom font-medium mb-1">Flagged Issues</p>
                      <p className="text-3xl font-bold text-foreground">{flaggedIssues}</p>
                    </div>
                    <div className="p-2 bg-destructive/10 rounded-full">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Requires attention</p>
                </Card>
              </>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Activity Chart */}
            <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border h-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Activity</h2>
              {loading ? (
                <div className="w-full flex-1 flex items-end gap-4 justify-between px-4 pb-4">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="w-full rounded-t-lg bg-muted-custom/20" style={{ height: `${Math.random() * 60 + 20}%` }} />
                  ))}
                </div>
              ) : (
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                      <XAxis dataKey="date" stroke="#989788" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#989788" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: '#f3f4f6' }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="submissions" fill="#51344D" radius={[4, 4, 0, 0]} name="Total Reports" />
                      <Bar dataKey="verified" fill="#6F5060" radius={[4, 4, 0, 0]} name="Verified" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Confidence Distribution */}
            <Card className="p-6 bg-card border-border h-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-6">Confidence Levels</h2>
              {loading ? (
                <div className="w-full flex-1 flex items-center justify-center">
                  <Skeleton className="w-[200px] h-[200px] rounded-full bg-muted-custom/20" />
                </div>
              ) : (
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {confidenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Projects and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <h2 className="text-lg font-semibold text-foreground mb-6">Recent Projects</h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="w-full">
                        <Skeleton className="h-5 w-40 mb-2 bg-muted-custom/20" />
                        <Skeleton className="h-4 w-24 bg-muted-custom/20" />
                      </div>
                    </div>
                  ))
                ) : (
                  reports.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted-custom/10 transition-all duration-200 hover:border-muted-custom/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-primary-custom transition-colors">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${project.confidence > 80 ? "text-primary-custom" : "text-muted-foreground"}`}>{project.confidence}%</p>
                          <p className={`text-xs ${project.status === "verified" ? "text-secondary-custom" : "text-muted-custom"}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${project.status === "verified" ? "bg-secondary-custom" : "bg-muted-custom"}`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Activity Timeline */}
            <Card className="p-6 bg-card border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-2 h-2 rounded-full mt-2 bg-muted-custom/20" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-1 bg-muted-custom/20" />
                        <Skeleton className="h-3 w-1/2 bg-muted-custom/20" />
                      </div>
                    </div>
                  ))
                ) : (
                  reports.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary-custom mt-2 ring-2 ring-background group-hover:scale-125 transition-transform" />
                        <div className="w-0.5 h-12 bg-border group-last:hidden" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-foreground">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                        <p className="text-xs text-muted-custom mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
