import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPatients } from "@/components/dashboard/recent-patients"
import { UpcomingSchedules } from "@/components/dashboard/upcoming-schedules"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
          </div>
        </div>

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2">
          <RecentPatients />
          <UpcomingSchedules />
        </div>
      </div>
    </div>
  )
}
