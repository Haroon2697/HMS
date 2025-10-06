import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

type XRay = {
  id: string
  patient_id: string
  doctor_id: string
  test_type: string
  test_date: string
  body_part: string
  status: string
  patients: {
    full_name: string
    patient_id: string
  }
  doctors: {
    profiles: {
      full_name: string
    }
  }
}

export function XRayTable({ xrays }: { xrays: XRay[] }) {
  if (xrays.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No radiology tests found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "reported":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>Body Part</TableHead>
            <TableHead>Ordered By</TableHead>
            <TableHead>Test Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {xrays.map((xray) => (
            <TableRow key={xray.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{xray.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{xray.patients.patient_id}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{xray.test_type}</TableCell>
              <TableCell>{xray.body_part}</TableCell>
              <TableCell>{xray.doctors.profiles.full_name}</TableCell>
              <TableCell>{new Date(xray.test_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(xray.status)}>{xray.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/xrays/${xray.id}`}>
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
