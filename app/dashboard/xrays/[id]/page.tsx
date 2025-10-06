import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Stethoscope, Calendar, FileImage, FileText } from "lucide-react"
import Link from "next/link"

export default async function XRayDetailPage({
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

  const { data: xray } = await supabase
    .from("xrays")
    .select(
      `
      *,
      patients (full_name, patient_id, date_of_birth),
      doctors (profile_id, specialization, profiles (full_name))
    `,
    )
    .eq("id", id)
    .single()

  if (!xray) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "reported":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/xrays">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Radiology Test Details</h1>
          <p className="text-muted-foreground">View complete test information and report</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {xray.test_type} - {xray.body_part}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Test Date: {new Date(xray.test_date).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getStatusColor(xray.status)}>{xray.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Patient</p>
                  <p className="text-sm text-muted-foreground">{xray.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{xray.patients.patient_id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Ordered By</p>
                  <p className="text-sm text-muted-foreground">{xray.doctors.profiles.full_name}</p>
                  <p className="text-xs text-muted-foreground">{xray.doctors.specialization}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileImage className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Test Type</p>
                  <p className="text-sm text-muted-foreground">{xray.test_type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Body Part</p>
                  <p className="text-sm text-muted-foreground">{xray.body_part}</p>
                </div>
              </div>
            </div>

            {xray.clinical_notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Clinical Notes</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{xray.clinical_notes}</p>
                </div>
              </div>
            )}

            {xray.findings && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Findings</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{xray.findings}</p>
                </div>
              </div>
            )}

            {xray.report && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Radiologist Report</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{xray.report}</p>
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
              <p className="text-sm text-muted-foreground">{xray.patients.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Patient ID</p>
              <p className="text-sm text-muted-foreground">{xray.patients.patient_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date of Birth</p>
              <p className="text-sm text-muted-foreground">
                {new Date(xray.patients.date_of_birth).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
