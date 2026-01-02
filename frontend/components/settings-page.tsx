"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Bell, Lock, Users, Database, Shield, Key, Eye, EyeOff, Sparkles, Zap, Moon, Globe, Save, RefreshCw, AlertTriangle, Check, X } from "lucide-react"
import ParticleBackground from "./ParticleBackground"

interface SettingItem {
  label: string
  enabled?: boolean
  value?: string
  count?: string
  description?: string
  badge?: "success" | "warning" | "error" | "info"
}

interface SettingSection {
  icon: any
  title: string
  description: string
  items: SettingItem[]
}

const initialSettingsSections: SettingSection[] = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage email and push notifications",
    items: [
      { 
        label: "Email Alerts", 
        enabled: true,
        description: "Receive email notifications for important updates"
      },
      { 
        label: "Report Completion", 
        enabled: true,
        description: "Get notified when reports are ready"
      },
      { 
        label: "Critical Issues", 
        enabled: true,
        description: "Immediate alerts for critical security issues"
      },
      { 
        label: "Weekly Digest", 
        enabled: false,
        description: "Weekly summary of all activities"
      },
    ],
  },
  {
    icon: Lock,
    title: "Security",
    description: "Password and authentication settings",
    items: [
      { 
        label: "Two-Factor Authentication", 
        enabled: false,
        description: "Add an extra layer of security to your account",
        badge: "warning"
      },
      { 
        label: "API Keys", 
        enabled: false,
        description: "Manage your API access tokens"
      },
      { 
        label: "Session Management", 
        enabled: true,
        description: "Active sessions and timeout settings"
      },
      { 
        label: "Password Strength", 
        enabled: true,
        description: "Enforce strong password requirements"
      },
    ],
  },
  {
    icon: Users,
    title: "Team & Access",
    description: "Manage team members and permissions",
    items: [
      { 
        label: "Team Members", 
        count: "3 active",
        description: "Manage team members and their roles",
        badge: "success"
      },
      { 
        label: "Invite Link", 
        count: "Expires in 7 days",
        description: "Generate or revoke invitation links",
        badge: "info"
      },
      { 
        label: "Permissions", 
        count: "Admin",
        description: "Role-based access control settings"
      },
      { 
        label: "Audit Log", 
        count: "View logs",
        description: "Review team activity and access history"
      },
    ],
  },
  {
    icon: Database,
    title: "Data & Storage",
    description: "Manage data retention and storage",
    items: [
      { 
        label: "Report Retention", 
        value: "90 days",
        description: "Automatic deletion of old reports"
      },
      { 
        label: "Storage Usage", 
        value: "2.3 GB of 5 GB",
        description: "Storage allocation and usage",
        badge: "warning"
      },
      { 
        label: "Auto-Delete", 
        enabled: true,
        description: "Automatically delete old data"
      },
      { 
        label: "Data Backup", 
        enabled: false,
        description: "Automatic backup to cloud storage"
      },
    ],
  },
]

// Additional sections for enhanced UI
const advancedSections: SettingSection[] = [
  {
    icon: Globe,
    title: "Preferences",
    description: "Customize your experience",
    items: [
      { 
        label: "Language", 
        value: "English (US)",
        description: "Interface language"
      },
      { 
        label: "Time Zone", 
        value: "UTC-05:00",
        description: "Your local time zone"
      },
      { 
        label: "Theme", 
        value: "Dark",
        description: "Interface color scheme"
      },
      { 
        label: "Default View", 
        value: "Dashboard",
        description: "Default page on login"
      },
    ],
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimize application performance",
    items: [
      { 
        label: "Cache Duration", 
        value: "24 hours",
        description: "How long data is cached"
      },
      { 
        label: "Auto-Refresh", 
        enabled: true,
        description: "Automatically refresh data"
      },
      { 
        label: "Data Prefetch", 
        enabled: false,
        description: "Load data in advance"
      },
      { 
        label: "Animation Effects", 
        enabled: true,
        description: "Enable interface animations"
      },
    ],
  },
]

export function SettingsPage() {
  const [sections, setSections] = useState<SettingSection[]>([...initialSettingsSections, ...advancedSections])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userName, setUserName] = useState<string>("User")
  const [userEmail, setUserEmail] = useState<string>("user@example.com")

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    setSections(prevSections => {
      const newSections = [...prevSections]
      const section = { ...newSections[sectionIndex] }
      const items = [...section.items]
      const item = { ...items[itemIndex] }

      if (item.enabled !== undefined) {
        item.enabled = !item.enabled
        items[itemIndex] = item
        section.items = items
        newSections[sectionIndex] = section
      }

      return newSections
    })
  }

  const handleSaveChanges = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      // Show success animation
    }, 1500)
  }

  const handleResetSettings = () => {
    setShowConfirmation(true)
  }

  const confirmReset = () => {
    setSections([...initialSettingsSections, ...advancedSections])
    setShowConfirmation(false)
  }

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case "success": return "bg-gradient-to-r from-emerald-600 to-teal-500"
      case "warning": return "bg-gradient-to-r from-amber-600 to-orange-500"
      case "error": return "bg-gradient-to-r from-red-600 to-rose-500"
      case "info": return "bg-gradient-to-r from-cyan-600 to-blue-500"
      default: return "bg-gradient-to-r from-gray-600 to-gray-500"
    }
  }

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent"
                >
                  Settings & Preferences
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 text-sm sm:text-base"
                >
                  Customize your experience and manage account settings
                </motion.p>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
            </div>

            {/* User Profile Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-sm text-gray-300 mb-1">User</p>
                <p className="text-lg font-semibold text-white">{userName}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-sm text-gray-300 mb-1">Email</p>
                <p className="text-lg font-semibold text-white">{userEmail}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-sm text-gray-300 mb-1">Account Type</p>
                <p className="text-lg font-semibold text-purple-400">Premium</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <Button
            onClick={handleSaveChanges}
            disabled={saving}
            className="relative overflow-hidden group/btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            onClick={handleResetSettings}
            variant="outline"
            className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnimatePresence>
            {sections.map((section, sectionIndex) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className={`overflow-hidden border border-white/20 backdrop-blur-xl
                      bg-gradient-to-br from-white/10 to-white/5 relative group
                      ${activeSection === section.title ? 'ring-2 ring-purple-500/50' : ''}`}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      {/* Section Header */}
                      <div 
                        onClick={() => setActiveSection(activeSection === section.title ? null : section.title)}
                        className="p-6 border-b border-white/10 flex items-start justify-between cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${
                            sectionIndex % 4 === 0 ? "from-purple-600/20 to-pink-600/20" :
                            sectionIndex % 4 === 1 ? "from-cyan-600/20 to-blue-600/20" :
                            sectionIndex % 4 === 2 ? "from-emerald-600/20 to-teal-600/20" :
                            "from-amber-600/20 to-orange-600/20"
                          } backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                            <p className="text-sm text-gray-400">{section.description}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: activeSection === section.title ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </motion.div>
                      </div>

                      {/* Section Items */}
                      <div className="divide-y divide-white/10">
                        {section.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group/item"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-white font-medium">{item.label}</span>
                                {item.badge && (
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${getBadgeColor(item.badge)} text-white`}>
                                    {item.badge === "success" && "✓"}
                                    {item.badge === "warning" && "!"}
                                    {item.badge === "error" && "✗"}
                                    {item.badge === "info" && "i"}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {item.enabled !== undefined ? (
                                <motion.button
                                  onClick={() => handleToggle(sectionIndex, itemIndex)}
                                  className={`relative w-14 h-7 rounded-full transition-all duration-300 border ${
                                    item.enabled
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 shadow-lg shadow-emerald-500/30"
                                      : "bg-gradient-to-r from-gray-600 to-gray-500 border-gray-500"
                                  }`}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <motion.div
                                    className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                                      item.enabled ? "translate-x-7" : "translate-x-1"
                                    }`}
                                    layout
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30
                                    }}
                                  >
                                    {item.enabled ? (
                                      <Check className="w-4 h-4 mx-auto mt-0.5 text-emerald-600" />
                                    ) : (
                                      <X className="w-4 h-4 mx-auto mt-0.5 text-gray-600" />
                                    )}
                                  </motion.div>
                                </motion.button>
                              ) : (
                                <div className="text-right">
                                  <span className="text-sm text-white font-medium">
                                    {item.count || item.value}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 bg-gradient-to-br from-red-600/20 to-rose-600/20 backdrop-blur-xl border border-red-500/30 relative overflow-hidden group">
            {/* Danger Zone Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-rose-600">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
                  <p className="text-sm text-red-300/80">Irreversible actions - proceed with caution</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowConfirmation(true)}
                  variant="outline"
                  className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-white hover:border-red-500 backdrop-blur-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset All Settings
                </Button>
                
                <Button
                  className="bg-gradient-to-r from-red-700 to-rose-700 border-0 text-white shadow-lg hover:shadow-red-500/30 hover:from-red-800 hover:to-rose-800 transition-all group/delete"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/delete:translate-x-full transition-transform duration-1000" />
                  <AlertTriangle className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Delete Account</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirmation(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Reset All Settings?</h3>
                </div>
                
                <p className="text-gray-400 mb-6">
                  This will reset all your settings to their default values. This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    variant="outline"
                    className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmReset}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                  >
                    Reset Settings
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Confirmation */}
        <AnimatePresence>
          {saving && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <span className="text-white font-medium">Saving changes...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}