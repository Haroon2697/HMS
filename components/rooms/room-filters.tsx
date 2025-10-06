"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

const WARDS = ["General", "ICU", "Emergency", "Pediatric", "Maternity", "Surgery"]

export function RoomFilters({
  initialWard,
  initialStatus,
}: {
  initialWard?: string
  initialStatus?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/dashboard/rooms?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-4">
      <div className="w-48">
        <Select
          value={initialWard || "all"}
          onValueChange={(value) => handleFilterChange("ward", value)}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Wards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {WARDS.map((ward) => (
              <SelectItem key={ward} value={ward}>
                {ward}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Select
          value={initialStatus || "all"}
          onValueChange={(value) => handleFilterChange("status", value)}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
