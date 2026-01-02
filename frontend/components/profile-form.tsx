import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Mail, Loader2, Camera, Github, Calendar, MapPin, Briefcase, User, GraduationCap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"
import { auth } from "@/firebase"

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
    avatarUrl: "",
    githubUsername: "",
    joinedDate: "",
  })
  const [editFormData, setEditFormData] = useState(formData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get("/users/me")
        if (res.data.success) {
          const data = res.data.user || res.data.data // Support both formats
          setFormData({
            displayName: data.displayName || "",
            email: data.email || "",
            organization: data.organization || "",
            role: data.role || "",
            bio: data.bio || "",
            avatarUrl: data.avatarUrl || "",
            githubUsername: data.githubUsername || "",
            joinedDate: data.createdAt || new Date().toISOString(),
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
      const res = await api.put("/users/me", editFormData)
      if (res.data.success) {
        const updatedData = res.data.user || res.data.data // Support both formats
        setFormData({
          displayName: updatedData.displayName || "",
          email: updatedData.email || "",
          organization: updatedData.organization || "",
          role: updatedData.role || "",
          bio: updatedData.bio || "",
          avatarUrl: updatedData.avatarUrl || "",
          githubUsername: updatedData.githubUsername || "",
          joinedDate: updatedData.createdAt || formData.joinedDate,
        })
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

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditFormData({ ...editFormData, avatarUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const getProviderName = () => {
    const providerId = auth.currentUser?.providerData[0]?.providerId
    if (providerId === "github.com") return "GitHub"
    if (providerId === "google.com") return "Google"
    return "Email"
  }

  return (
    <>
      {/* Toast Messages */}
      {saveMessage && (
        <div
          className={`fixed top-24 right-8 px-6 py-3 rounded-lg text-sm font-medium animate-in slide-in-from-right-4 fade-in duration-300 z-50 shadow-lg border ${saveMessage.type === "success"
            ? "bg-[#6F5060] text-white border-[#6F5060]"
            : "bg-destructive text-destructive-foreground border-destructive"
            }`}
        >
          {saveMessage.text}
        </div>
      )}

      {loading ? (
        <div className="text-black bg-white/50 backdrop-blur-md border border-white/20 rounded-xl shadow-sm overflow-hidden p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-white/10">
            <div className="shrink-0">
              <Skeleton className="w-32 h-32 rounded-full bg-[#989788]/20" />
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64 bg-[#989788]/20" />
              <Skeleton className="h-4 w-48 bg-[#989788]/20" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full bg-[#989788]/20" />
                <Skeleton className="h-6 w-32 rounded-full bg-[#989788]/20" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Profile Card */
        <div className="text-black bg-white/50 backdrop-blur-md border border-white/20 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8">
            {/* Header with Avatar and Info */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-black/5">
              {/* Avatar */}
              <div className="shrink-0 relative group">
                <div
                  onClick={handleAvatarClick}
                  className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md transition-all ${isEditing ? 'cursor-pointer hover:opacity-90 ring-4 ring-[#51344D]/20' : ''}`}
                  style={{
                    background: editFormData.avatarUrl ? `url(${editFormData.avatarUrl}) center/cover` : 'linear-gradient(135deg, #51344D 0%, #6F5060 100%)'
                  }}
                >
                  {!editFormData.avatarUrl && (
                    <span className="text-4xl font-bold text-black shadow-sm">
                      {formData.displayName.substring(0, 2).toUpperCase()}
                    </span>
                  )}

                  {isEditing && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div>
                    <h2 className="text-3xl font-bold text-[#51344D] mb-1">{formData.displayName}</h2>
                    <div className="flex items-center gap-4 text-[#2d2c2a] text-sm">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} />
                        {formData.email}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#989788]/40" />
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        Joined {new Date(formData.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-[#51344D] text-white rounded-lg hover:bg-[#51344D]/90 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {formData.bio && !isEditing && (
                  <p className="text-gray-600 mt-4 max-w-2xl leading-relaxed italic border-l-2 border-[#6F5060]/30 pl-4 py-1">
                    "{formData.bio}"
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  {formData.role && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#51344D]/10 text-[#51344D] rounded-full text-sm font-medium border border-[#51344D]/10">
                      <User size={14} />
                      {formData.role}
                    </span>
                  )}
                  {formData.organization && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6F5060]/10 text-[#6F5060] rounded-full text-sm font-medium border border-[#6F5060]/10">
                      <GraduationCap size={14} />
                      {formData.organization}
                    </span>
                  )}
                  {formData.githubUsername && (
                    <a href={`https://github.com/${formData.githubUsername}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 text-gray-700 rounded-full text-sm font-medium border border-black/5 hover:bg-black/10 transition-colors">
                      <Github size={14} />
                      {formData.githubUsername}
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100">
                    Via {getProviderName()}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            {isEditing && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        name="displayName"
                        value={editFormData.displayName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51344D] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">Organization / College</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        name="organization"
                        value={editFormData.organization}
                        onChange={handleInputChange}
                        placeholder="University or Company"
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51344D] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">Role</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                      <select
                        name="role"
                        value={editFormData.role}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51344D] focus:border-transparent transition-all appearance-none"
                      >
                        <option>Student</option>
                        <option>Developer</option>
                        <option>Reviewer</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* GitHub Username */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">GitHub Username</label>
                    <div className="relative">
                      <Github className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        name="githubUsername"
                        value={editFormData.githubUsername}
                        onChange={handleInputChange}
                        placeholder="github-username"
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51344D] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 ml-1">Short Bio</label>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51344D] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-black/5 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-transparent text-gray-600 rounded-lg border border-gray-600 hover:bg-gray-600 hover:text-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#51344D] text-white rounded-lg hover:bg-[#51344D]/90 transition-all shadow hover:shadow-lg active:scale-95 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
