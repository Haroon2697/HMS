"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export function BillingFilters({ initialStatus }: { initialStatus?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleFilterChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value && value !== "all") {
        params.set("status", value)
      } else {
        params.delete("status")
      }
      router.push(`/dashboard/billing?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-4">
      <div className="w-48">
        <Select value={initialStatus || "all"} onValueChange={handleFilterChange} disabled={isPending}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partially-paid">Partially Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
