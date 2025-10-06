import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

type Bill = {
  id: string
  bill_number: string
  patient_id: string
  bill_date: string
  total_amount: number
  paid_amount: number
  payment_status: string
  patients: {
    full_name: string
    patient_id: string
  }
}

export function BillingTable({ bills }: { bills: Bill[] }) {
  if (bills.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No bills found</p>
      </div>
    )
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

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill Number</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Bill Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Paid Amount</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell className="font-medium">{bill.bill_number}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{bill.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{bill.patients.patient_id}</p>
                </div>
              </TableCell>
              <TableCell>{new Date(bill.bill_date).toLocaleDateString()}</TableCell>
              <TableCell>Rs. {bill.total_amount.toLocaleString()}</TableCell>
              <TableCell>Rs. {bill.paid_amount.toLocaleString()}</TableCell>
              <TableCell>Rs. {(bill.total_amount - bill.paid_amount).toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(bill.payment_status)}>{bill.payment_status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/billing/${bill.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
