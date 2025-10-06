"use client"

import type React from "react"

import { useState } from "react"
import { createOTSchedule } from "@/app/dashboard/ot/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type Patient = {
  id: string
  patient_id: string
  full_name: string
}

type Doctor = {
  id: string
  doctor_id: string
  specialization: string
  profiles: {
    full_name: string
  }
}

type OperationTheater = {
  id: string
  ot_number: string
  ot_name: string
  status: string
}

const SURGERY_TYPES = [
  "Appendectomy",
  "Cesarean Section",
  "Hernia Repair",
  "Gallbladder Removal",
  "Knee Replacement",
  "Hip Replacement",
  "Cataract Surgery",
  "Cardiac Surgery",
  "Neurosurgery",
  "Orthopedic Surgery",
  "General Surgery",
  "Other",
]

export function OTScheduleForm({ 
  patients, 
  doctors, 
  operationTheater 
}: { 
  patients: Patient[]; 
  doctors: Doctor[]; 
  operationTheater: OperationTheater 
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Check if operation theater is available
    if (!operationTheater?.id) {
      setError("Operation theater not available. Please contact administrator.")
      setIsLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    // Automatically set the OT ID to the single OT room
    formData.set('ot_id', operationTheater.id)
    
    const result = await createOTSchedule(formData)

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
            <CardTitle>Surgery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient *</Label>
                <Select name="patient_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name} ({patient.patient_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_id">Surgeon *</Label>
                <Select name="doctor_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select surgeon" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.profiles.full_name} ({doctor.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="surgery_type">Surgery Type *</Label>
                <Select name="surgery_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select surgery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SURGERY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>OT Room</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md border">
                  <div className="flex-1">
                    <p className="font-medium">
                      {operationTheater?.ot_number || 'N/A'} - {operationTheater?.ot_name || 'No OT Available'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {operationTheater?.status || 'Unknown'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    operationTheater?.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Date *</Label>
                <Input id="scheduled_date" name="scheduled_date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_time_start">Start Time *</Label>
                <Input id="scheduled_time_start" name="scheduled_time_start" type="time" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_time_end">End Time *</Label>
                <Input id="scheduled_time_end" name="scheduled_time_end" type="time" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Any special instructions or notes..." rows={4} />
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isLoading ? "Scheduling..." : "Schedule Surgery"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
