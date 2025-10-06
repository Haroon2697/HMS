import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

type Schedule = {
  id: string
  patient_id: string
  doctor_id: string
  surgery_type: string
  scheduled_date: string
  scheduled_time_start: string
  scheduled_time_end: string
  ot_room: string
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

export function OTScheduleTable({ schedules }: { schedules: Schedule[] }) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No OT schedules found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "in-progress":
        return "bg-amber-100 text-amber-700"
      case "completed":
        return "bg-emerald-100 text-emerald-700"
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
            <TableHead>Patient</TableHead>
            <TableHead>Surgery Type</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>OT Room</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{schedule.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{schedule.patients.patient_id}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{schedule.surgery_type}</TableCell>
              <TableCell>{schedule.doctors.profiles.full_name}</TableCell>
              <TableCell>{new Date(schedule.scheduled_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {schedule.scheduled_time_start} - {schedule.scheduled_time_end}
              </TableCell>
              <TableCell>{schedule.ot_room}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/ot/${schedule.id}`}>
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
