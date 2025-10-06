import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Stethoscope, Phone, Mail, Calendar, Clock, Award, DollarSign, MapPin } from "lucide-react"
import Link from "next/link"

export default async function DoctorDetailPage({
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

  const { data: doctor } = await supabase
    .from("doctors")
    .select(
      `
      *,
      profiles (full_name, email)
    `,
    )
    .eq("id", id)
    .single()

  if (!doctor) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/doctors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Profile</h1>
          <p className="text-muted-foreground">View complete doctor information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{doctor.profiles.full_name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{doctor.doctor_id}</p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600">{doctor.specialization}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Qualification</p>
                  <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">{doctor.experience_years} years</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{doctor.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{doctor.profiles.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Consultation Fee</p>
                  <p className="text-sm text-muted-foreground">Rs. {doctor.consultation_fee}</p>
                </div>
              </div>

              {doctor.room_number && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Room Number</p>
                    <p className="text-sm text-muted-foreground">{doctor.room_number}</p>
                  </div>
                </div>
              )}
            </div>

            {doctor.bio && (
              <div>
                <p className="text-sm font-medium mb-2">About</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{doctor.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {doctor.available_days.map((day: string) => (
                  <Badge key={day} variant="outline">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Timing</p>
                <p className="text-sm text-muted-foreground">
                  {doctor.available_time_start} - {doctor.available_time_end}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
