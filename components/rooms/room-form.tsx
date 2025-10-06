"use client"

import type React from "react"

import { useState } from "react"
import { createRoom } from "@/app/dashboard/rooms/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const WARDS = ["General", "ICU", "Emergency", "Pediatric", "Maternity", "Surgery"]

const ROOM_TYPES = ["general", "private", "icu", "emergency"]

const AMENITIES = ["AC", "TV", "WiFi", "Attached Bathroom", "Refrigerator", "Oxygen", "Ventilator", "Monitor"]

export function RoomForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createRoom(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="room_number">Room Number *</Label>
              <Input id="room_number" name="room_number" placeholder="101" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_type">Room Type *</Label>
              <Select name="room_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward">Ward *</Label>
              <Select name="ward" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {WARDS.map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input id="floor" name="floor" type="number" min="0" placeholder="1" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bed_capacity">Bed Capacity *</Label>
              <Input id="bed_capacity" name="bed_capacity" type="number" min="1" placeholder="2" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate_per_day">Daily Rate (Rs.) *</Label>
              <Input
                id="rate_per_day"
                name="rate_per_day"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                required
              />
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isLoading ? "Adding..." : "Add Room"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
