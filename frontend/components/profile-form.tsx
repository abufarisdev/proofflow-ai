'use client';

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Mail, Loader2, Camera, Github, Calendar, MapPin, Briefcase, User, GraduationCap, Sparkles, Shield } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"
import { auth } from "@/firebase"
import { motion, AnimatePresence } from "framer-motion"

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
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            className={`fixed top-24 right-8 px-6 py-3 rounded-lg text-sm font-medium z-50 shadow-2xl backdrop-blur-xl border ${
              saveMessage.type === "success"
                ? "bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white border-emerald-500/30"
                : "bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {saveMessage.type === "success" ? (
                <Shield className="w-4 h-4" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              {saveMessage.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="relative">
          <div className="absolute -inset-4 bg-linear-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
          <Card className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 z-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-white/10">
              <div className="shrink-0">
                <Skeleton className="w-32 h-32 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64 bg-white/20" />
                <Skeleton className="h-4 w-48 bg-white/20" />
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
                  <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Profile Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          {/* Card Glow Effect */}
          <div className="absolute -inset-4 bg-linear-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Card className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 z-10 overflow-hidden">
            <div className="p-8">
              {/* Header with Avatar and Info */}
              <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-white/10">
                {/* Avatar */}
                <motion.div 
                  className="shrink-0 relative"
                  whileHover={isEditing ? { scale: 1.05 } : {}}
                >
                  <div
                    onClick={handleAvatarClick}
                    className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-2xl transition-all ${isEditing ? 'cursor-pointer hover:opacity-90 ring-4 ring-purple-500/30' : ''}`}
                    style={{
                      background: editFormData.avatarUrl 
                        ? `url(${editFormData.avatarUrl}) center/cover` 
                        : 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'
                    }}
                  >
                    {!editFormData.avatarUrl && (
                      <span className="text-4xl font-bold text-white drop-shadow-lg">
                        {formData.displayName.substring(0, 2).toUpperCase()}
                      </span>
                    )}

                    {isEditing && (
                      <motion.div 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm"
                        whileHover={{ opacity: 1 }}
                      >
                        <Camera className="text-white w-8 h-8" />
                      </motion.div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                      <motion.div className="flex items-center gap-2 mb-1">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-linear-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                          {formData.displayName}
                        </h2>
                      </motion.div>
                      <div className="flex items-center gap-4 text-gray-300 text-sm">
                        <motion.span 
                          className="flex items-center gap-1.5"
                          whileHover={{ x: 5 }}
                        >
                          <Mail size={14} className="text-cyan-400" />
                          {formData.email}
                        </motion.span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <motion.span 
                          className="flex items-center gap-1.5"
                          whileHover={{ x: 5 }}
                        >
                          <Calendar size={14} className="text-amber-400" />
                          Joined {new Date(formData.joinedDate).toLocaleDateString()}
                        </motion.span>
                      </div>
                    </div>

                    {!isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all shadow-md font-medium"
                      >
                        Edit Profile
                      </motion.button>
                    )}
                  </div>

                  {formData.bio && !isEditing && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-300 mt-4 max-w-2xl leading-relaxed italic border-l-2 border-purple-500/30 pl-4 py-1 bg-white/5 rounded-r-lg"
                    >
                      "{formData.bio}"
                    </motion.p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-6">
                    {formData.role && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 backdrop-blur-sm"
                      >
                        <User size={14} />
                        {formData.role}
                      </motion.span>
                    )}
                    {formData.organization && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm font-medium border border-pink-500/30 backdrop-blur-sm"
                      >
                        <GraduationCap size={14} />
                        {formData.organization}
                      </motion.span>
                    )}
                    {formData.githubUsername && (
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        href={`https://github.com/${formData.githubUsername}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors"
                      >
                        <Github size={14} className="text-white" />
                        {formData.githubUsername}
                      </motion.a>
                    )}
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30 backdrop-blur-sm"
                    >
                      Via {getProviderName()}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Display Name</label>
                      <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                        <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="displayName"
                          value={editFormData.displayName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                        />
                      </motion.div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleInputChange}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-gray-400 cursor-not-allowed backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Organization / College</label>
                      <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                        <Briefcase className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="organization"
                          value={editFormData.organization}
                          onChange={handleInputChange}
                          placeholder="University or Company"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                        />
                      </motion.div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Role</label>
                      <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                        <GraduationCap className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm appearance-none"
                        >
                          <option className="bg-gray-900">Student</option>
                          <option className="bg-gray-900">Developer</option>
                          <option className="bg-gray-900">Reviewer</option>
                          <option className="bg-gray-900">Admin</option>
                        </select>
                      </motion.div>
                    </div>

                    {/* GitHub Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">GitHub Username</label>
                      <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                        <Github className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          name="githubUsername"
                          value={editFormData.githubUsername}
                          onChange={handleInputChange}
                          placeholder="github-username"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Short Bio</label>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <textarea
                        name="bio"
                        value={editFormData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us a bit about yourself..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none backdrop-blur-sm"
                      />
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-white/10 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-transparent text-gray-300 rounded-lg border border-white/20 hover:bg-white/10 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all shadow-md font-medium"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </>
  )
}