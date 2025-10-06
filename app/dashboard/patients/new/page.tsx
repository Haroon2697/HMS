import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientForm } from "@/components/patients/patient-form"

export default async function NewPatientPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Patient</h1>
        <p className="text-muted-foreground">Register a new patient in the system</p>
      </div>

      <PatientForm />
    </div>
  )
}
