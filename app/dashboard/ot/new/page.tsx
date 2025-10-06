import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OTScheduleForm } from "@/components/ot/ot-schedule-form"

export default async function NewOTSchedulePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch patients, doctors, and the single operation theater
  const [{ data: patients }, { data: doctors }, { data: operationTheater, error: otError }] = await Promise.all([
    supabase.from("patients").select("id, patient_id, full_name").order("full_name"),
    supabase
      .from("doctors")
      .select(
        `
      id,
      doctor_id,
      specialization,
      profiles (full_name)
    `,
      )
      .order("profiles(full_name)"),
    supabase.from("operation_theaters").select("id, ot_number, ot_name, status").single(),
  ])

  // Auto-create a default OT if none exists
  if (otError || !operationTheater) {
    const { data: createdOT, error: createError } = await supabase
      .from("operation_theaters")
      .insert({
        ot_number: "OT-1",
        ot_name: "Main Operating Theater",
        status: "available",
        equipment_details: "Full surgical suite with advanced monitoring",
      })
      .select("id, ot_number, ot_name, status")
      .single()

    if (createError || !createdOT) {
      return (
        <div className="flex-1 space-y-6 p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule Surgery</h1>
            <p className="text-muted-foreground">Create a new OT schedule</p>
          </div>
          <div className="rounded-lg bg-red-50 p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to create Operation Theater</h3>
            <p className="text-red-600 mb-4">Please ensure your database is accessible and try again.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Surgery</h1>
          <p className="text-muted-foreground">Create a new OT schedule</p>
        </div>

        <OTScheduleForm 
          patients={patients || []} 
          doctors={doctors || []} 
          operationTheater={createdOT} 
        />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Surgery</h1>
        <p className="text-muted-foreground">Create a new OT schedule</p>
      </div>

      <OTScheduleForm 
        patients={patients || []} 
        doctors={doctors || []} 
        operationTheater={operationTheater || { id: '', ot_number: '', ot_name: '', status: '' }} 
      />
    </div>
  )
}

