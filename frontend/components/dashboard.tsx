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
import { TrendingUp, AlertCircle, CheckCircle, Clock, FileText, Plus, ArrowRight, Sparkles, Zap, Shield, BarChart3, Activity } from "lucide-react";
import { getReports } from "@/services/reportService";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Report } from "@/types";
import { auth } from "@/firebase";
import Link from "next/link";
import ParticleBackground from "./ParticleBackground";

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { icon: TrendingUp, title: "Total Projects", color: "from-purple-500 to-pink-500" },
    { icon: CheckCircle, title: "Verified Projects", color: "from-emerald-500 to-teal-400" },
    { icon: Clock, title: "Pending Reviews", color: "from-amber-500 to-orange-500" },
    { icon: AlertCircle, title: "Flagged Issues", color: "from-red-500 to-rose-500" },
  ];

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
          const mappedReports: Report[] = response.data.map((item: any) => {
            const id = item.id || item._id || '';
            const project = item.project || item.projectId || {};

            const name = project.repoName || project.name || 'Unknown Project';
            const repoUrl = project.repoUrl || '';
            const status = (project.status || 'pending') as Report['status'];
            const confidence = item.confidenceScore ?? item.confidence ?? 0;

            // Normalize Firestore timestamps (supports .toDate(), seconds) or ISO strings
            const createdAt = item.createdAt?.toDate
              ? item.createdAt.toDate().toISOString()
              : item.createdAt?.seconds
                ? new Date(item.createdAt.seconds * 1000).toISOString()
                : typeof item.createdAt === 'string'
                  ? item.createdAt
                  : new Date().toISOString();

            return {
              id,
              name,
              repoUrl,
              status,
              confidence,
              createdAt,
              action: item.action || 'Report Generated',
            };
          });

          // Sort by date desc - ensure valid dates
          mappedReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReports(mappedReports);
        }
      })
      .catch((error) => {
        console.error("Failed to get reports", error);
      })
      .finally(() => setLoading(false));

    // Cycle through metrics for animation
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
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
  }, []).slice(-7);

  const confidenceData = [
    { name: "High (>90%)", value: reports.filter(r => r.confidence > 90).length, color: "#7c3aed" },
    { name: "Medium (70-90%)", value: reports.filter(r => r.confidence >= 70 && r.confidence <= 90).length, color: "#a78bfa" },
    { name: "Low (<70%)", value: reports.filter(r => r.confidence < 70).length, color: "#94a3b8" },
  ];

  const MetricIcon = metrics[activeMetric].icon;

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
          {/* Header Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-indigo-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent"
                >
                  Welcome back, {userName}!
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 text-sm sm:text-base"
                >
                  Your project authenticity overview at a glance
                </motion.p>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
            </div>

            {/* Animated Metric Showcase */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMetric}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block"
                >
                  <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${metrics[activeMetric].color} bg-opacity-20 border border-white/10 backdrop-blur-sm`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${metrics[activeMetric].color}`}>
                        <MetricIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {metrics[activeMetric].title}: {
                          activeMetric === 0 ? totalProjects :
                          activeMetric === 1 ? verifiedProjects :
                          activeMetric === 2 ? pendingReviews :
                          flaggedIssues
                        }
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* REMOVED THE EMPTY STATE CONDITION - Always show the dashboard sections */}
        {/* Key Metrics */}
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
                    <Skeleton className="h-4 w-24 mb-2 bg-white/20 rounded" />
                    <Skeleton className="h-8 w-16 bg-white/20 rounded" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
                </div>
              </Card>
            ))
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium mb-1">Total Projects</p>
                      <p className="text-3xl font-bold text-white">{totalProjects}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium mb-1">Verified Projects</p>
                      <p className="text-3xl font-bold text-white">{verifiedProjects}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    {totalProjects > 0 ? ((verifiedProjects / totalProjects) * 100).toFixed(1) : 0}% success rate
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/30 to-orange-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium mb-1">Pending Reviews</p>
                      <p className="text-3xl font-bold text-white">{pendingReviews}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-amber-500/20">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-full bg-gradient-to-r from-amber-600 to-orange-600 rounded-full" />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-medium mb-1">Flagged Issues</p>
                      <p className="text-3xl font-bold text-white">{flaggedIssues}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-red-600/20 to-rose-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <p className="text-xs text-red-400 mt-4">Requires attention</p>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart - WEEKLY ACTIVITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1 lg:col-span-2 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
            <Card className="p-6 h-[400px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Weekly Activity
                </h2>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="w-5 h-5 text-gray-400" />
                </motion.div>
              </div>
              {loading ? (
                <div className="w-full flex-1 flex items-end gap-4 justify-between px-4 pb-4">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="w-full rounded-t-lg bg-white/20" style={{ height: `${Math.random() * 60 + 20}%` }} />
                  ))}
                </div>
              ) : (
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="date" stroke="#989788" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#989788" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                          backgroundColor: "rgba(31, 20, 30, 0.9)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                          color: "white",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px', color: 'white' }} />
                      <Bar dataKey="submissions" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Total Reports" />
                      <Bar dataKey="verified" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Verified" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Confidence Distribution - CONFIDENCE LEVELS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-emerald-600/20 rounded-3xl blur-xl" />
            <Card className="p-6 h-[400px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-cyan-400" />
                Confidence Levels
              </h2>
              {loading ? (
                <div className="w-full flex-1 flex items-center justify-center">
                  <Skeleton className="w-50 h-50 rounded-full bg-white/20" />
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
                          backgroundColor: "rgba(31, 20, 30, 0.9)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          backdropFilter: "blur(10px)",
                          color: "white",
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'white' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Recent Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects - RECENT PROJECTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="col-span-1 lg:col-span-2 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
            <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-pink-400" />
                Recent Projects
              </h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                      <div className="w-full">
                        <Skeleton className="h-5 w-40 mb-2 bg-white/20 rounded" />
                        <Skeleton className="h-4 w-24 bg-white/20 rounded" />
                      </div>
                    </div>
                  ))
                ) : reports.length > 0 ? (
                  reports.slice(0, 5).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="group flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 hover:border-purple-500/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white group-hover:text-purple-300 transition-colors">{project.name}</p>
                        <p className="text-sm text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${project.confidence > 80 ? "text-purple-400" : "text-gray-400"}`}>
                            {project.confidence}%
                          </p>
                          <p className={`text-xs ${project.status === "verified" ? "text-emerald-400" : "text-amber-400"}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.5 }}
                          className={`w-2 h-2 rounded-full ${project.status === "verified" ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Empty state for Recent Projects section
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-indigo-600/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                      <FileText className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
                    <p className="text-gray-400 mb-6 max-w-sm">Start by generating your first report to see projects here</p>
                    <Link
                      href="/reports"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Generate first report
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Activity Timeline - RECENT ACTIVITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-emerald-600/20 rounded-3xl blur-xl" />
            <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 relative z-10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-cyan-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-2 h-2 rounded-full mt-2 bg-white/20" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-1 bg-white/20 rounded" />
                        <Skeleton className="h-3 w-1/2 bg-white/20 rounded" />
                      </div>
                    </div>
                  ))
                ) : reports.length > 0 ? (
                  reports.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mt-2 ring-2 ring-gray-900 group-hover:scale-150 transition-transform duration-300" />
                        <div className="w-0.5 h-12 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 group-last:hidden" />
                      </div>
                      <div className="flex-1 pb-4 group-hover:translate-x-2 transition-transform duration-300">
                        <p className="text-sm font-medium text-white">{item.action}</p>
                        <p className="text-xs text-gray-400">{item.name}</p>
                        <p className="text-xs text-cyan-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Empty state for Recent Activity section
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-600/20 via-blue-600/20 to-emerald-600/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                      <Activity className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No recent activity</h3>
                    <p className="text-gray-400 mb-6 max-w-sm">Activity will appear here once you generate reports</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}