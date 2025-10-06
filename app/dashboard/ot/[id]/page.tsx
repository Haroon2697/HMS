import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Stethoscope, Calendar, Clock, MapPin, FileText } from "lucide-react"
import Link from "next/link"

export default async function OTScheduleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { id } = await params

  const { data: schedule } = await supabase
    .from("ot_schedules")
    .select(
      `
      *,
      patients (full_name, patient_id, blood_group),
      doctors (profile_id, specialization, profiles (full_name))
    `,
    )
    .eq("id", id)
    .single()

  if (!schedule) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "in-progress":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/ot">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surgery Details</h1>
          <p className="text-muted-foreground">View complete surgery schedule information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{schedule.surgery_type}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">OT Room: {schedule.ot_room}</p>
              </div>
              <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Patient</p>
                  <p className="text-sm text-muted-foreground">{schedule.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{schedule.patients.patient_id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Surgeon</p>
                  <p className="text-sm text-muted-foreground">{schedule.doctors.profiles.full_name}</p>
                  <p className="text-xs text-muted-foreground">{schedule.doctors.specialization}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(schedule.scheduled_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {schedule.scheduled_time_start} - {schedule.scheduled_time_end}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Anesthesia Type</p>
                  <p className="text-sm text-muted-foreground">{schedule.anesthesia_type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{schedule.estimated_duration} minutes</p>
                </div>
              </div>
            </div>

            {schedule.pre_op_notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Pre-Operative Notes</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{schedule.pre_op_notes}</p>
                </div>
              </div>
            )}

            {schedule.post_op_notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Post-Operative Notes</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{schedule.post_op_notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{schedule.patients.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Patient ID</p>
              <p className="text-sm text-muted-foreground">{schedule.patients.patient_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Blood Group</p>
              <p className="text-sm text-muted-foreground">{schedule.patients.blood_group || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
