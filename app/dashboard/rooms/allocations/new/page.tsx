import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AllocationForm } from "@/components/rooms/allocation-form"

export default async function NewAllocationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch available rooms and patients
  const [{ data: rooms }, { data: patients }] = await Promise.all([
    supabase.from("rooms").select("*").eq("status", "available").order("room_number"),
    supabase.from("patients").select("id, patient_id, full_name").order("full_name"),
  ])

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Room Allocation</h1>
        <p className="text-muted-foreground">Assign a patient to a room</p>
      </div>

      <AllocationForm rooms={rooms || []} patients={patients || []} />
    </div>
  )
}
