"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronRight, Bell, Lock, Users, Database } from "lucide-react"

interface SettingItem {
  label: string
  enabled?: boolean
  value?: string
  count?: string
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
      { label: "Email Alerts", enabled: true },
      { label: "Report Completion", enabled: true },
      { label: "Critical Issues", enabled: true },
    ],
  },
  {
    icon: Lock,
    title: "Security",
    description: "Password and two-factor authentication",
    items: [
      { label: "Two-Factor Authentication", enabled: false },
      { label: "API Keys", enabled: false },
      { label: "Session Management", enabled: true },
    ],
  },
  {
    icon: Users,
    title: "Team & Access",
    description: "Manage team members and permissions",
    items: [
      { label: "Team Members", count: "3 active" },
      { label: "Invite Link", count: "Expires in 7 days" },
      { label: "Permissions", count: "Admin" },
    ],
  },
  {
    icon: Database,
    title: "Data & Storage",
    description: "Manage data retention and storage",
    items: [
      { label: "Report Retention", value: "90 days" },
      { label: "Storage Usage", value: "2.3 GB of 5 GB" },
      { label: "Auto-Delete", enabled: true },
    ],
  },
]

export function SettingsPage() {
  const [sections, setSections] = useState<SettingSection[]>(initialSettingsSections)

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

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and team settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <Card key={sectionIndex} className="bg-card border-border overflow-hidden">
              {/* Section Header */}
              <div className="p-6 border-b border-border flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Section Items */}
              <div className="divide-y divide-border">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-foreground font-medium">{item.label}</span>
                    <div>
                      {item.enabled !== undefined ? (
                        <button
                          onClick={() => handleToggle(sectionIndex, itemIndex)}
                          className={`w-12 h-6 rounded-full transition-colors border border-gray-500 ${item.enabled ? "bg-chart-1" : "bg-border"}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full  bg-white transition-transform ${item.enabled ? "translate-x-6" : "translate-x-0.5"}`}
                          />
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground">{item.count || item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Danger Zone */}
      <Card className="mt-8 p-6 bg-destructive/5 border border-destructive/30">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
        <button className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-medium bg-red-800">
          Delete Account
        </button>
      </Card>
    </div>
  )
}
