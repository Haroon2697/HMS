import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AllocationsTable } from "@/components/rooms/allocations-table"

export default async function AllocationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: allocations } = await supabase
    .from("room_allocations")
    .select(
      `
      *,
      patients (full_name, patient_id),
      rooms (room_number, ward, room_type)
    `,
    )
    .order("admission_date", { ascending: false })

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Allocations</h1>
          <p className="text-muted-foreground">Manage patient room assignments</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Link href="/dashboard/rooms/allocations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Allocation
          </Link>
        </Button>
      </div>

      <AllocationsTable allocations={allocations || []} />
    </div>
  )
}
