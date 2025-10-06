"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Activity, Users, Stethoscope, Bed, Scissors, FileImage, Receipt, LogOut, LayoutDashboard } from "lucide-react"
import { signOut } from "@/app/auth/actions"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
  },
  {
    title: "Doctors",
    href: "/dashboard/doctors",
    icon: Stethoscope,
  },
  {
    title: "Rooms",
    href: "/dashboard/rooms",
    icon: Bed,
  },
  {
    title: "OT Schedule",
    href: "/dashboard/ot",
    icon: Scissors,
  },
  {
    title: "X-Rays",
    href: "/dashboard/xrays",
    icon: FileImage,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: Receipt,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-blue-50 to-white">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">Al Shifa</span>
          <span className="text-xs text-muted-foreground">Medical Center</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
