import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BillingForm } from "@/components/billing/billing-form"

export default async function NewBillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch patients
  const { data: patients } = await supabase.from("patients").select("id, patient_id, full_name").order("full_name")

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
        <p className="text-muted-foreground">Generate a new bill for patient services</p>
      </div>

      <BillingForm patients={patients || []} />
    </div>
  )
}
