'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { TrendingUp, AlertCircle, CheckCircle, Clock, FileText, Plus, ArrowRight, Activity, Folder } from "lucide-react";
import { getReports } from "@/services/reportService";

import { useState, useEffect } from "react";
import { Report } from "@/types";
import { auth } from "@/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const router = useRouter();

  useEffect(() => {
    // Auth Listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || "User");
      }
    });

    getReports()
      .then((response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          const mappedReports: Report[] = response.data.map((item: any) => ({
            id: item._id,
            name: item.projectId?.repoName || 'Unknown Project',
            repoUrl: item.projectId?.repoUrl || '',
            status: (item.projectId?.status || 'pending') as Report['status'],
            confidence: item.confidenceScore || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            action: 'Report Generated'
          }));
          // Sort by date desc
          mappedReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReports(mappedReports);
        }
      })
      .catch((error) => {
        console.error("Failed to get reports", error);
      })
      .finally(() => setLoading(false));

    return () => unsubscribe();
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
  }, []).slice(-7); // Last 7 days/entries

  const confidenceData = [
    { name: "High (>90%)", value: reports.filter(r => r.confidence > 90).length, color: "#51344D" },
    { name: "Medium (70-90%)", value: reports.filter(r => r.confidence >= 70 && r.confidence <= 90).length, color: "#6F5060" },
    { name: "Low (<70%)", value: reports.filter(r => r.confidence < 70).length, color: "#989788" },
  ];

  // Derived Data for "My Activity"
  // Recent Projects: Unique by name/repoUrl
  const uniqueProjectsMap = new Map();
  reports.forEach(r => {
    if (!uniqueProjectsMap.has(r.name)) {
      uniqueProjectsMap.set(r.name, r);
    }
  });
  const recentProjects = Array.from(uniqueProjectsMap.values()).slice(0, 5);

  const recentReports = reports.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge className="bg-secondary-custom hover:bg-secondary-custom/80">Verified</Badge>;
      case 'flagged': return <Badge variant="destructive">Flagged</Badge>;
      case 'pending': return <Badge variant="secondary" className="text-muted-foreground">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultBadge = (status: string, confidence: number) => {
    if (status === 'verified') return <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-0">Passed ({confidence}%)</Badge>;
    if (status === 'flagged') return <Badge className="bg-red-500/15 text-red-700 hover:bg-red-500/25 border-0">Failed ({confidence}%)</Badge>;
    return <Badge className="bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-0">Suspicious</Badge>;
  };

  return (
    <div className="p-4 sm:p-8 bg-background min-h-screen space-y-8">
      {/* Header */}
      <div className="p-8 rounded-xl bg-linear-to-br from-[#51344D] to-[#6F5060] text-white shadow-md animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-white/80 text-sm sm:text-base">Here's your project authenticity overview.</p>
      </div>

      {/* My Activity Card */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary-custom" />
          <h2 className="text-xl font-bold text-foreground">My Activity</h2>
        </div>

        <Card className="border-white/20 bg-white/50 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/50">

            {/* Recent Projects Column */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-muted-custom" />
                  <h3 className="font-semibold text-foreground">Recent Projects</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-custom hover:text-primary-custom" onClick={() => router.push('/projects')}>
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full bg-muted-custom/10" />)}
                </div>
              ) : recentProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-muted-custom/20">
                      <TableHead className="w-[40%]">Project Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted-custom/5 border-b-muted-custom/10">
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/reports/${project.id}`)}>
                            <ArrowRight className="w-4 h-4 text-muted-custom" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <div className="w-12 h-12 bg-muted-custom/10 rounded-full flex items-center justify-center mb-3">
                    <Folder className="w-6 h-6 text-muted-custom" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No recent projects</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Your processed projects will appear here.</p>
                  <Button size="sm" onClick={() => router.push('/reports')}>Start Project</Button>
                </div>
              )}
            </div>

            {/* Recent Reports Column */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-custom" />
                  <h3 className="font-semibold text-foreground">Recent Reports</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-custom hover:text-primary-custom" onClick={() => router.push('/reports')}>
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full bg-muted-custom/10" />)}
                </div>
              ) : recentReports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-muted-custom/20">
                      <TableHead className="w-[30%]">Report ID</TableHead>
                      <TableHead className="w-[30%]">Project</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-muted-custom/5 border-b-muted-custom/10">
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {report.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium text-sm truncate max-w-[100px]" title={report.name}>
                          {report.name}
                        </TableCell>
                        <TableCell>{getResultBadge(report.status, report.confidence)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/reports/${report.id}`)}>
                            <ArrowRight className="w-4 h-4 text-muted-custom" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <div className="w-12 h-12 bg-muted-custom/10 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-muted-custom" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No recent reports</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Create a new report to see activity.</p>
                  <Button size="sm" variant="outline" onClick={() => router.push('/reports')}>Create Report</Button>
                </div>
              )}
            </div>

          </div>
        </Card>
      </div>

      {/* Key Metrics - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4 bg-card border-border">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="p-4 bg-white/50 backdrop-blur-md border-white/20 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-xs text-muted-custom font-medium uppercase tracking-wider">Total Projects</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalProjects}</p>
              </div>
              <div className="p-2 bg-primary-custom/10 rounded-lg group-hover:bg-primary-custom/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-primary-custom" />
              </div>
            </Card>

            <Card className="p-4 bg-white/50 backdrop-blur-md border-white/20 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-xs text-muted-custom font-medium uppercase tracking-wider">Verified</p>
                <p className="text-2xl font-bold text-foreground mt-1">{verifiedProjects}</p>
              </div>
              <div className="p-2 bg-secondary-custom/10 rounded-lg group-hover:bg-secondary-custom/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-secondary-custom" />
              </div>
            </Card>

            <Card className="p-4 bg-white/50 backdrop-blur-md border-white/20 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-xs text-muted-custom font-medium uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingReviews}</p>
              </div>
              <div className="p-2 bg-[#989788]/20 rounded-lg group-hover:bg-[#989788]/30 transition-colors">
                <Clock className="w-5 h-5 text-[#989788]" />
              </div>
            </Card>

            <Card className="p-4 bg-white/50 backdrop-blur-md border-white/20 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-xs text-muted-custom font-medium uppercase tracking-wider">Flagged</p>
                <p className="text-2xl font-bold text-foreground mt-1">{flaggedIssues}</p>
              </div>
              <div className="p-2 bg-destructive/10 rounded-lg group-hover:bg-destructive/20 transition-colors">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      {reports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {/* Activity Chart */}
          <Card className="col-span-1 lg:col-span-2 p-6 bg-card border-border h-[400px] flex flex-col">
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
          <Card className="p-6 bg-card border-border h-[400px] flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-6">Confidence Levels</h2>
            {loading ? (
              <div className="w-full flex-1 flex items-center justify-center">
                <Skeleton className="w-50 h-50 rounded-full bg-muted-custom/20" />
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
      )}
    </div>
  );
}
