"use client"

import { useState } from "react"
import { ProfileForm } from "./profile-form"
import { PreferencesSection } from "./preferences-section"

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <ProfileForm isEditing={isEditing} setIsEditing={setIsEditing} />
        <PreferencesSection />
      </div>
    </div>
  )
}
