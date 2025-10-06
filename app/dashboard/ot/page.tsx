import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { OTScheduleTable } from "@/components/ot/ot-schedule-table"
import { OTFilters } from "@/components/ot/ot-filters"

export default async function OTPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const statusFilter = params.status
  const dateFilter = params.date

  let query = supabase
    .from("ot_schedules")
    .select(
      `
      *,
      patients (full_name, patient_id),
      doctors (profile_id, profiles (full_name))
    `,
    )
    .order("scheduled_date", { ascending: true })

  if (statusFilter) {
    query = query.eq("status", statusFilter)
  }

  if (dateFilter) {
    query = query.eq("scheduled_date", dateFilter)
  }

  const { data: schedules } = await query

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OT Schedule</h1>
          <p className="text-muted-foreground">Manage operating theater schedules and surgeries</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Link href="/dashboard/ot/new">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Surgery
          </Link>
        </Button>
      </div>

      <OTFilters initialStatus={statusFilter} initialDate={dateFilter} />

      <OTScheduleTable schedules={schedules || []} />
    </div>
  )
}
