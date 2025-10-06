import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DoctorsTable } from "@/components/doctors/doctors-table"
import { DoctorSearch } from "@/components/doctors/doctor-search"

export default async function DoctorsPage({
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

  let query = supabase
    .from("doctors")
    .select(
      `
      *,
      profiles (full_name, email)
    `,
    )
    .order("created_at", { ascending: false })

  if (searchQuery) {
    query = query.or(
      `doctor_id.ilike.%${searchQuery}%,specialization.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`,
    )
  }

  const { data: doctors } = await query

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">Manage doctor profiles and schedules</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Link href="/dashboard/doctors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Link>
        </Button>
      </div>

      <DoctorSearch initialSearch={searchQuery} />

      <DoctorsTable doctors={doctors || []} />
    </div>
  )
}
