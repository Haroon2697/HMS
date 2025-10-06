import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

type Doctor = {
  id: string
  doctor_id: string
  profile_id: string
  specialization: string
  qualification: string
  phone: string
  consultation_fee: number
  available_days: string[]
  available_time_start: string
  available_time_end: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

export function DoctorsTable({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No doctors found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Consultation Fee</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell className="font-medium">{doctor.doctor_id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{doctor.profiles.full_name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.profiles.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {doctor.specialization}
                </Badge>
              </TableCell>
              <TableCell>{doctor.phone}</TableCell>
              <TableCell>Rs. {doctor.consultation_fee}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="text-muted-foreground">{doctor.available_days.join(", ")}</p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.available_time_start} - {doctor.available_time_end}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/doctors/${doctor.id}`}>
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
