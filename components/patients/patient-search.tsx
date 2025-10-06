"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

export function PatientSearch({ initialSearch }: { initialSearch: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)

  const handleSearch = (value: string) => {
    setSearch(value)
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      router.push(`/dashboard/patients?${params.toString()}`)
    })
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by name, patient ID, or phone..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
        disabled={isPending}
      />
    </div>
  )
}
