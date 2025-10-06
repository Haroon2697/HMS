"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

const TEST_TYPES = ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Mammography", "Fluoroscopy"]

export function XRayFilters({ initialStatus, initialType }: { initialStatus?: string; initialType?: string }) {
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
      router.push(`/dashboard/xrays?${params.toString()}`)
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="reported">Reported</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Select
          value={initialType || "all"}
          onValueChange={(value) => handleFilterChange("type", value)}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TEST_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
