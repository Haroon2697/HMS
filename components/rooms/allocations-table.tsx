import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Allocation = {
  id: string
  patient_id: string
  room_id: string
  admission_date: string
  discharge_date: string | null
  status: string
  patients: {
    full_name: string
    patient_id: string
  }
  rooms: {
    room_number: string
    ward: string
    room_type: string
  }
}

export function AllocationsTable({ allocations }: { allocations: Allocation[] }) {
  if (allocations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No allocations found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700"
      case "discharged":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Ward</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Discharge Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((allocation) => (
            <TableRow key={allocation.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{allocation.patients.full_name}</p>
                  <p className="text-xs text-muted-foreground">{allocation.patients.patient_id}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{allocation.rooms.room_number}</TableCell>
              <TableCell>{allocation.rooms.ward}</TableCell>
              <TableCell>{allocation.rooms.room_type}</TableCell>
              <TableCell>{new Date(allocation.admission_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {allocation.discharge_date ? new Date(allocation.discharge_date).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(allocation.status)}>{allocation.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
