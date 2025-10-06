import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Bed, Activity } from "lucide-react"

export async function DashboardStats() {
  const supabase = await createClient()

  const [{ count: patientsCount }, { count: doctorsCount }, { count: roomsCount }, { count: activeAllocations }] =
    await Promise.all([
      supabase.from("patients").select("*", { count: "exact", head: true }),
      supabase.from("doctors").select("*", { count: "exact", head: true }),
      supabase.from("rooms").select("*", { count: "exact", head: true }),
      supabase.from("room_allocations").select("*", { count: "exact", head: true }).eq("status", "active"),
    ])

  const stats = [
    {
      title: "Total Patients",
      value: patientsCount || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Doctors",
      value: doctorsCount || 0,
      icon: Stethoscope,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      title: "Total Rooms",
      value: roomsCount || 0,
      icon: Bed,
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Active Admissions",
      value: activeAllocations || 0,
      icon: Activity,
      color: "from-emerald-500 to-emerald-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div
                className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br", stat.color)}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
