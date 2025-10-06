"use client"

import type React from "react"

import { useState } from "react"
import { createDoctor } from "@/app/dashboard/doctors/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Dermatologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Psychiatrist",
  "Radiologist",
  "Anesthesiologist",
  "Surgeon",
]

export function DoctorForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Add selected days to form data
    selectedDays.forEach((day) => {
      formData.append(`day_${day}`, "on")
    })

    const result = await createDoctor(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" name="full_name" placeholder="Dr. Ahmed Khan" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" placeholder="doctor@alshifa.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+92 300 1234567" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select name="specialization" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <Input id="qualification" name="qualification" placeholder="MBBS, FCPS" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience *</Label>
                <Input id="experience_years" name="experience_years" type="number" min="0" placeholder="5" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation_fee">Consultation Fee (Rs.) *</Label>
                <Input
                  id="consultation_fee"
                  name="consultation_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input id="room_number" name="room_number" placeholder="101" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" placeholder="Brief professional bio..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Available Days *</Label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <label
                      htmlFor={day}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="available_time_start">Start Time *</Label>
                <Input id="available_time_start" name="available_time_start" type="time" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="available_time_end">End Time *</Label>
                <Input id="available_time_end" name="available_time_end" type="time" required />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || selectedDays.length === 0}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isLoading ? "Registering..." : "Register Doctor"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
