import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export async function UpcomingSchedules() {
  const supabase = await createClient()

  const { data: schedules } = await supabase
    .from("ot_schedules")
    .select(
      `
      *,
      patients (full_name),
      doctors (profile_id, profiles (full_name))
    `,
    )
    .eq("status", "scheduled")
    .order("scheduled_date", { ascending: true })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming OT Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        {schedules && schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule: any) => (
              <div key={schedule.id} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{schedule.surgery_type}</p>
                  <p className="text-xs text-muted-foreground">Patient: {schedule.patients?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(schedule.scheduled_date).toLocaleDateString()} at {schedule.scheduled_time_start}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{schedule.status}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming schedules</p>
        )}
      </CardContent>
    </Card>
  )
}
