import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Users, DollarSign, Eye } from "lucide-react"
import Link from "next/link"
import type { Room } from "@/lib/types"

export function RoomsGrid({ rooms }: { rooms: Room[] }) {
  if (rooms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No rooms found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
      case "occupied":
        return "bg-red-100 text-red-700 hover:bg-red-200"
      case "maintenance":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">Room {room.room_number}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {room.ward} Ward • Floor {room.floor}
                </p>
              </div>
              <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{room.room_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Occupancy</p>
                  <p className="text-sm font-medium">
                    {room.current_occupancy}/{room.capacity}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Daily Rate</p>
                <p className="text-sm font-medium">Rs. {room.daily_rate}</p>
              </div>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {room.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{room.amenities.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <Link href={`/dashboard/rooms/${room.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
