import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PatientsTable } from "@/components/patients/patients-table"
import { PatientSearch } from "@/components/patients/patient-search"

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const searchQuery = params.search || ""

  let query = supabase.from("patients").select("*").order("created_at", { ascending: false })

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,patient_id.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
  }

  const { data: patients } = await query

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Link href="/dashboard/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Link>
        </Button>
      </div>

      <PatientSearch initialSearch={searchQuery} />

      <PatientsTable patients={patients || []} />
    </div>
  )
}
