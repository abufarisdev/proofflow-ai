"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { BarChart3, FileText, Settings, Moon, Sun, LogOut, User, ChevronLeft, ChevronRight, Menu, FolderKanban } from "lucide-react"
import { useState, useEffect, useCallback, memo } from "react"
import { logout } from "@/services/authService"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { 
    href: "/", 
    label: "Dashboard", 
    icon: BarChart3,
    description: "Overview & analytics"
  },
  { 
    href: "/projects", 
    label: "Projects", 
    icon: FolderKanban,
    description: "Manage your projects",
  },
  { 
    href: "/reports", 
    label: "Reports", 
    icon: FileText,
    description: "View all reports"
  },
  { 
    href: "/profile", 
    label: "Profile", 
    icon: User,
    description: "Your account"
  },
  { 
    href: "/settings", 
    label: "Settings", 
    icon: Settings,
    description: "Preferences & security"
  },
]

// Memoized NavItem to prevent unnecessary re-renders
const NavItem = memo(({ 
  item, 
  isActive, 
  isCollapsed, 
  mobile 
}: { 
  item: any; 
  isActive: boolean; 
  isCollapsed: boolean; 
  mobile: boolean 
}) => {
  const Icon = item.icon
  const showContent = !mobile && !isCollapsed

  return (
    <Link
      href={item.href}
      className={`
        group flex items-center transition-all duration-200 relative overflow-hidden
        ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}
        ${isActive
          ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white shadow-lg"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
        }
      `}
      style={{
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        marginLeft: isCollapsed ? '0' : '0.25rem',
        marginRight: isCollapsed ? '0' : '0.25rem',
        borderRadius: '0.75rem'
      }}
    >
      {/* Active indicator for expanded state */}
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full" />
      )}

      {/* Icon Container */}
      <div className="relative">
        <div className={`
          rounded-lg backdrop-blur-sm border flex items-center justify-center
          ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
          ${isActive 
            ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500/50' 
            : 'bg-white/5 border-white/10 group-hover:border-purple-500/30'
          }
        `}>
          <Icon 
            size={20} 
            className={`
              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-300'}
              ${isCollapsed ? 'mx-auto' : ''}
            `} 
          />
        </div>
        
        {/* Badge for collapsed state */}
        {item.badge && isCollapsed && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 bg-gradient-to-r from-pink-600 to-rose-600 border-0 text-xs">
            {item.badge}
          </Badge>
        )}
        
        {/* Active dot for collapsed state */}
        {isActive && isCollapsed && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
        )}
      </div>

      {/* Text content - only show when not collapsed */}
      {showContent && (
        <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{item.label}</span>
            {item.badge && (
              <Badge className="ml-2 px-1.5 py-0.5 min-w-5 h-5 bg-gradient-to-r from-pink-600 to-rose-600 border-0 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{item.description}</p>
        </div>
      )}
    </Link>
  )
})

NavItem.displayName = 'NavItem'

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      className: "bg-[#51344D] text-white border-none",
    })
    window.location.href = "/"
  }

  if (!mounted) return null

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Header - Fixed alignment */}
      <div className={`
        border-b border-white/10
        ${isCollapsed && !mobile ? 'py-6' : 'p-6'}
        ${!mobile && isCollapsed ? 'flex justify-center' : ''}
      `}>
        <div className={`
          flex items-center
          ${isCollapsed && !mobile ? 'justify-center' : 'gap-3'}
          overflow-hidden
        `}>
          <div className="relative flex-shrink-0">
            <div className={`
              rounded-xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600
              ${isCollapsed && !mobile ? 'w-12 h-12' : 'min-w-12 h-12'}
            `}>
              <span className="text-white font-bold text-xl">PF</span>
            </div>
            {/* Active pulse effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-purple-400/30 animate-ping" />
          </div>
          
          {/* Logo text - only show when expanded */}
          {(!mobile && !isCollapsed) && (
            <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">ProofFlow</h1>
              <p className="text-xs text-gray-400 whitespace-nowrap">AI Authenticity Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Fixed spacing */}
      <nav className={`
        flex-1 overflow-y-auto
        ${isCollapsed && !mobile ? 'px-2 py-4 space-y-2' : 'p-4 space-y-1 mt-2'}
      `}>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed && !mobile}
            mobile={mobile}
          />
        ))}
      </nav>

      {/* User & Actions - Fixed alignment */}
      <div className={`
        border-t border-white/10
        ${isCollapsed && !mobile ? 'px-2 py-4 space-y-3' : 'p-4 space-y-3'}
      `}>
        {/* User Profile */}
        {user && (
          <div className={`
            rounded-xl bg-white/5 backdrop-blur-sm border border-white/10
            ${isCollapsed && !mobile ? 'flex justify-center p-3' : 'flex items-center gap-3 px-3 py-3'}
          `}>
            <Avatar className={`
              border border-purple-500/30 flex-shrink-0
              ${isCollapsed && !mobile ? 'h-10 w-10' : 'h-10 w-10'}
            `}>
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User info - only show when expanded */}
            {(!mobile && !isCollapsed) && (
              <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">
                    {user.displayName || "User"}
                  </span>
                  <Badge className="ml-2 px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 border-0 text-xs">
                    Pro
                  </Badge>
                </div>
                <span className="text-xs text-gray-400 truncate">
                  {user.email}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle - Fixed alignment */}
        <button
          onClick={toggleTheme}
          className={`
            w-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 
            text-gray-300 hover:text-white hover:border-purple-500/30 
            transition-all duration-200 flex items-center
            ${isCollapsed && !mobile ? 'justify-center p-3' : 'px-3 py-3 gap-3'}
          `}
        >
          <div className="flex-shrink-0">
            {resolvedTheme === "light" ? (
              <Moon size={20} className="text-amber-400" />
            ) : (
              <Sun size={20} className="text-amber-300" />
            )}
          </div>
          
          {/* Theme text - only show when expanded */}
          {(!mobile && !isCollapsed) && (
            <div className="flex-1 min-w-0 text-left transition-all duration-300 ease-in-out">
              <span className="text-sm font-medium">
                {resolvedTheme === "light" ? "Light Mode" : "Dark Mode"}
              </span>
              <p className="text-xs text-gray-400">Switch theme</p>
            </div>
          )}
        </button>

        {/* Logout - Fixed alignment */}
        <button
          onClick={handleLogout}
          className={`
            w-full rounded-xl bg-red-600/10 backdrop-blur-sm border border-red-500/30 
            text-red-300 hover:text-white hover:bg-red-600/20 
            transition-all duration-200 flex items-center
            ${isCollapsed && !mobile ? 'justify-center p-3' : 'px-3 py-3 gap-3'}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          
          {/* Logout text - only show when expanded */}
          {(!mobile && !isCollapsed) && (
            <div className="flex-1 min-w-0 text-left transition-all duration-300 ease-in-out">
              <span className="text-sm font-medium">Logout</span>
              <p className="text-xs text-red-400/70">Sign out of your account</p>
            </div>
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-[#1F141E] border-b border-white/10 w-full sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">PF</span>
          </div>
          <div>
            <span className="font-bold text-white">ProofFlow</span>
            <p className="text-xs text-gray-400">Authenticity Platform</p>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-72 bg-gradient-to-b from-gray-900 via-[#1F141E] to-[#51344D] border-r border-white/10 backdrop-blur-xl"
          >
            <div className="h-full flex flex-col">
              <NavContent mobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex h-screen bg-gradient-to-b from-gray-900 via-[#1F141E] to-[#51344D] 
          border-r border-white/10 backdrop-blur-xl flex-col fixed left-0 top-0 z-40 
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
        `}
        style={{ 
          transform: 'translateZ(0)', // Hardware acceleration
          willChange: 'width' // Optimize width transitions
        }}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-500/50 rounded-full p-1.5 shadow-lg hover:shadow-purple-500/30 transition-all z-20"
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-white" />
          ) : (
            <ChevronLeft size={14} className="text-white" />
          )}
        </button>

        <NavContent />
      </aside>

      {/* Add spacing for desktop sidebar */}
      <div 
        className={`
          hidden md:block transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}
        `}
      />
    </>
  )
}