"use client"

import type React from "react"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Mail, Loader2 } from "lucide-react"

interface ProfileFormProps {
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

export function ProfileForm({ isEditing, setIsEditing }: ProfileFormProps) {
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    organization: "",
    role: "",
    bio: "",
  })

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get("/users/profile")
        if (res.data.success) {
          setFormData({
            displayName: res.data.data.displayName || "",
            email: res.data.data.email || "",
            organization: res.data.data.organization || "",
            role: res.data.data.role || "",
            bio: res.data.data.bio || "",
          })
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        // Keep defaults or show error
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const [editFormData, setEditFormData] = useState(formData)

  // Sync edit form data when formData loads
  useEffect(() => {
    setEditFormData(formData)
  }, [formData])

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveMessage])

  const handleSave = async () => {
    try {
      const res = await api.put("/users/profile", editFormData)
      if (res.data.success) {
        setFormData(res.data.data)
        setIsEditing(false)
        setSaveMessage({ type: "success", text: "Profile updated successfully!" })
      }
    } catch (err) {
      console.error("Update error:", err)
      setSaveMessage({ type: "error", text: "Failed to update profile." })
    }
  }

  const handleCancel = () => {
    setEditFormData(formData)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }

  if (loading) {
    return (
      <Card className="bg-card border-border p-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    )
  }

  return (
    <>
      {/* Toast Messages */}
      {saveMessage && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-sm font-medium animate-in fade-in-50 duration-300 ${saveMessage.type === "success"
              ? "bg-chart-1 text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
            }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Profile Card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-8">
          {/* Header with Avatar and Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">
                  {formData.displayName ? formData.displayName.substring(0, 2).toUpperCase() : "U"}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">{formData.displayName || "User"}</h2>
              <p className="text-muted-foreground mb-4 flex items-center gap-2">
                <Mail size={16} />
                {formData.email}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {formData.role || "Role"}
                </span>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {formData.organization || "Organization"}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex items-start">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Edit Profile
                </button>
              ) : null}
            </div>
          </div>

          {/* Editable Fields */}
          {isEditing ? (
            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={editFormData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email (Read only mostly, but editable here if allowed) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  disabled
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization / College</label>
                <input
                  type="text"
                  name="organization"
                  value={editFormData.organization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Developer">Developer</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Short Bio</label>
                <textarea
                  name="bio"
                  value={editFormData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Bio</p>
                <p className="text-foreground">{formData.bio || "No bio yet."}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
