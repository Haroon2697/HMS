"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export function OTFilters({ initialStatus, initialDate }: { initialStatus?: string; initialDate?: string }) {
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
      router.push(`/dashboard/ot?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-4">
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Input
          type="date"
          value={initialDate || ""}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          disabled={isPending}
        />
      </div>
    </div>
  )
}
