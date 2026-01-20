'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Palette, Bell, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function PreferencesSection() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    projectReview: true,
    flaggedActivity: true,
  })

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const themes = [
    { value: "system", label: "System", icon: Monitor, color: "from-blue-500 to-cyan-500" },
    { value: "light", label: "Light", icon: Sun, color: "from-amber-500 to-orange-500" },
    { value: "dark", label: "Dark", icon: Moon, color: "from-purple-500 to-pink-500" },
  ]

  const ThemeIcon = themes.find(t => t.value === theme)?.icon || Monitor

  return (
    <div className="space-y-6">
      {/* Theme Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
        <Card className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 z-10 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-white/10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Palette className="w-6 h-6 text-purple-400" />
                </motion.div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">Theme Preference</h2>
                <p className="text-sm text-gray-300 mt-1">Choose your preferred color scheme</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden group/theme ${
                    theme === option.value 
                      ? "border-purple-500 bg-gradient-to-br from-white/10 to-white/5" 
                      : "border-white/10 hover:border-purple-500/50"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover/theme:opacity-10 transition-opacity`} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} ${theme === option.value ? 'ring-2 ring-white/30' : ''}`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-white">{option.label}</p>
                    <p className="text-xs text-gray-300 text-center">
                      {option.value === "system" ? "Follow device settings" : `Always use ${option.label.toLowerCase()}`}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-emerald-600/20 rounded-3xl blur-xl" />
        <Card className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 z-10 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="p-3 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-white/10">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
                <p className="text-sm text-gray-300 mt-1">Manage how you receive updates</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "emailAlerts",
                  label: "Email Alerts",
                  description: "Receive email notifications for important updates",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  id: "projectReview",
                  label: "Project Review Alerts",
                  description: "Get notified when your projects are reviewed",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  id: "flaggedActivity",
                  label: "Flagged Activity Alerts",
                  description: "Receive alerts when suspicious activity is detected",
                  color: "from-emerald-500 to-teal-500",
                },
              ].map((notification) => (
                <motion.div
                  key={notification.id}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-all group/notif"
                >
                  <div>
                    <p className="font-medium text-white">{notification.label}</p>
                    <p className="text-sm text-gray-300 mt-1">{notification.description}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNotificationChange(notification.id as keyof typeof notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all border-2 ${
                      notifications[notification.id as keyof typeof notifications] 
                        ? `bg-gradient-to-r ${notification.color} border-transparent` 
                        : "bg-white/10 border-white/20"
                    }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                        notifications[notification.id as keyof typeof notifications] 
                          ? "translate-x-6" 
                          : "translate-x-1"
                      }`}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}