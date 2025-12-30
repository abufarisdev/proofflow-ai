"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Palette, Bell } from "lucide-react"
import { useTheme } from "next-themes"

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

  return (
    <div className="space-y-6">
      {/* Theme Preferences */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-8">
          <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border">
            <div className="p-3 bg-muted rounded-lg">
              <Palette className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">Theme Preference</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose your preferred color scheme</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.value === "system" ? "Follow device settings" : `Always use ${option.label.toLowerCase()}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-8">
          <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border">
            <div className="p-3 bg-muted rounded-lg">
              <Bell className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage how you receive updates</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "emailAlerts",
                label: "Email Alerts",
                description: "Receive email notifications for important updates",
              },
              {
                id: "projectReview",
                label: "Project Review Alerts",
                description: "Get notified when your projects are reviewed",
              },
              {
                id: "flaggedActivity",
                label: "Flagged Activity Alerts",
                description: "Receive alerts when suspicious activity is detected",
              },
            ].map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{notification.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(notification.id as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border border-gray-300 ${
                    notifications[notification.id as keyof typeof notifications] ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      notifications[notification.id as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
