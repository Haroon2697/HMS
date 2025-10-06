import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { XRayForm } from "@/components/xrays/xray-form"

export default async function NewXRayPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch patients and doctors
  const [{ data: patients }, { data: doctors }] = await Promise.all([
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
  ])

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Radiology Test</h1>
        <p className="text-muted-foreground">Create a new imaging test order</p>
      </div>

      <XRayForm patients={patients || []} doctors={doctors || []} />
    </div>
  )
}
