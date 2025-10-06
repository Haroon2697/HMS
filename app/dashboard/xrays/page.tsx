import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { XRayTable } from "@/components/xrays/xray-table"
import { XRayFilters } from "@/components/xrays/xray-filters"

export default async function XRaysPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>
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
  const typeFilter = params.type

  let query = supabase
    .from("xrays")
    .select(
      `
      *,
      patients (full_name, patient_id),
      doctors (profile_id, profiles (full_name))
    `,
    )
    .order("test_date", { ascending: false })

  if (statusFilter) {
    query = query.eq("status", statusFilter)
  }

  if (typeFilter) {
    query = query.eq("test_type", typeFilter)
  }

  const { data: xrays } = await query

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Radiology & X-Rays</h1>
          <p className="text-muted-foreground">Manage imaging tests and reports</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Link href="/dashboard/xrays/new">
            <Plus className="mr-2 h-4 w-4" />
            New Test
          </Link>
        </Button>
      </div>

      <XRayFilters initialStatus={statusFilter} initialType={typeFilter} />

      <XRayTable xrays={xrays || []} />
    </div>
  )
}
