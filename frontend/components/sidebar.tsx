"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { BarChart3, FileText, Settings, Moon, Sun, LogOut, User, ChevronLeft, ChevronRight, Menu, FolderKanban } from "lucide-react"
import { useState, useEffect } from "react"
import { logout } from "@/services/authService"

import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/projects", label: "Projects", icon: FolderKanban },

  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true)
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

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
      <div className={`p-6 border-b border-sidebar-border ${!mobile && isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-10 h-10 bg-linear-to-br from-[#51344D] to-[#6F5060] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className={`transition-opacity duration-300 ${!mobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <h1 className="text-sm font-bold text-sidebar-foreground whitespace-nowrap">ProofFlow</h1>
            <p className="text-xs text-sidebar-accent-foreground whitespace-nowrap">AI Authenticity</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                ? "bg-[#51344D] text-white shadow-md mx-1"
                : "text-sidebar-foreground hover:bg-[#989788]/20 hover:translate-x-1"
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 rounded-r-full" />
              )}

              <div className={`min-w-5 flex justify-center ${!mobile && isCollapsed ? 'w-full' : ''}`}>
                <Icon size={20} className={`transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
              </div>

              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${!mobile && isCollapsed ? 'opacity-0 w-0 translate-x-4' : 'opacity-100 translate-x-0'
                }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        {user && (
          <div className={`flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-sidebar-accent/50 ${!mobile && isCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback className="bg-[#51344D] text-white">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className={`flex flex-col overflow-hidden transition-all duration-300 ${!mobile && isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 flex-1'}`}>
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {user.displayName || "User"}
              </span>
              <span className="text-xs text-sidebar-accent-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 ${!mobile && isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="relative">
            {resolvedTheme === "light" ? <Moon size={20} className="group-hover:rotate-12 transition-transform" /> : <Sun size={20} className="group-hover:rotate-90 transition-transform" />}
          </div>
          <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${!mobile && isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ${!mobile && isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${!mobile && isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            Logout
          </span>
        </button>
      </div>
    </>
  )

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border w-full sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-[#51344D] to-[#6F5060] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-foreground">ProofFlow</span>
        </div>
        <Sheet>
          <SheetTrigger>
            <Menu className="w-6 h-6 text-foreground" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[80%] bg-sidebar border-r border-sidebar-border">
            <div className="h-full flex flex-col">
              <NavContent mobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-sidebar border-r border-sidebar-border flex-col transition-all duration-300 ease-in-out relative`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-9 bg-background border border-border rounded-full p-1 shadow-md hover:bg-muted transition-colors z-20"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <NavContent />
      </aside>
    </>
  )
}
