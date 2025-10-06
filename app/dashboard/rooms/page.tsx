import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RoomsGrid } from "@/components/rooms/rooms-grid"
import { RoomFilters } from "@/components/rooms/room-filters"

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ ward?: string; status?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const wardFilter = params.ward
  const statusFilter = params.status

  let query = supabase.from("rooms").select("*").order("room_number", { ascending: true })

  if (wardFilter) {
    query = query.eq("ward", wardFilter)
  }

  if (statusFilter) {
    query = query.eq("status", statusFilter)
  }

  const { data: rooms } = await query

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms & Wards</h1>
          <p className="text-muted-foreground">Manage hospital rooms and patient allocations</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/rooms/allocations">View Allocations</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Link href="/dashboard/rooms/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Link>
          </Button>
        </div>
      </div>

      <RoomFilters initialWard={wardFilter} initialStatus={statusFilter} />

      <RoomsGrid rooms={rooms || []} />
    </div>
  )
}
