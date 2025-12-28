import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Mail, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

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
  const [editFormData, setEditFormData] = useState(formData)

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get("/users/profile")
        if (res.data.success) {
          const data = res.data.data
          setFormData({
            displayName: data.displayName || "",
            email: data.email || "",
            organization: data.organization || "",
            role: data.role || "",
            bio: data.bio || "",
          })
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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

      {loading ? (
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border">
              {/* Avatar Skeleton */}
              <div className="flex-shrink-0">
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>

              {/* Profile Info Skeleton */}
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>

              {/* Edit Button Skeleton */}
              <div className="flex items-start">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Profile Card */
        <Card className="bg-card border-border overflow-hidden">
          <div className="p-8">
            {/* Header with Avatar and Info */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">{formData.displayName.substring(0, 2).toUpperCase()}</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{formData.displayName}</h2>
                <p className="text-muted-foreground mb-4 flex items-center gap-2">
                  <Mail size={16} />
                  {formData.email}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {formData.role}
                  </span>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    {formData.organization}
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

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <option>Student</option>
                    <option>Developer</option>
                    <option>Reviewer</option>
                    <option>Admin</option>
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
                  <p className="text-foreground">{formData.bio}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  )
}
