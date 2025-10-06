import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BillingTable } from "@/components/billing/billing-table"
import { BillingFilters } from "@/components/billing/billing-filters"

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
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

  let query = supabase
    .from("billing")
    .select(
      `
      *,
      patients (full_name, patient_id)
    `,
    )
    .order("bill_date", { ascending: false })

  if (statusFilter) {
    query = query.eq("payment_status", statusFilter)
  }

  const { data: bills } = await query

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground">Manage patient bills and payments</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Link href="/dashboard/billing/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <BillingFilters initialStatus={statusFilter} />

      <BillingTable bills={bills || []} />
    </div>
  )
}
