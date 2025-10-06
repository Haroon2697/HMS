import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Calendar, CreditCard, FileText, Printer } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function BillingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { id } = await params

  const { data: bill } = await supabase
    .from("billing")
    .select(
      `
      *,
      patients (full_name, patient_id, phone, address)
    `,
    )
    .eq("id", id)
    .single()

  if (!bill) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "partially-paid":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const balance = bill.total_amount - bill.paid_amount

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/billing">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice Details</h1>
            <p className="text-muted-foreground">View complete billing information</p>
          </div>
        </div>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Invoice {bill.bill_number}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Date: {new Date(bill.bill_date).toLocaleDateString()}
              </p>
            </div>
            <Badge className={getStatusColor(bill.payment_status)}>{bill.payment_status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Patient Information</p>
                  <p className="text-sm text-muted-foreground">{bill.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{bill.patients.patient_id}</p>
                  <p className="text-xs text-muted-foreground">{bill.patients.phone}</p>
                  {bill.patients.address && <p className="text-xs text-muted-foreground">{bill.patients.address}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Bill Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(bill.bill_date).toLocaleDateString()}</p>
                </div>
              </div>

              {bill.payment_method && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">{bill.payment_method}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Bill Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bill.items.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">Rs. {item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">Rs. {item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="text-sm">Rs. {bill.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Paid Amount:</span>
                  <span className="text-sm text-emerald-600">Rs. {bill.paid_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-base font-bold">Balance Due:</span>
                  <span className="text-base font-bold text-red-600">Rs. {balance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {bill.notes && (
            <div className="flex items-start gap-3 border-t pt-6">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bill.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
