"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createRoom(formData: FormData) {
  const supabase = await createClient()

  const roomData = {
    room_number: formData.get("room_number") as string,
    room_type: formData.get("room_type") as string,
    floor: Number.parseInt(formData.get("floor") as string),
    bed_capacity: Number.parseInt(formData.get("bed_capacity") as string),
    occupied_beds: 0,
    rate_per_day: Number.parseFloat(formData.get("rate_per_day") as string),
    status: "available",
  }

  const { error } = await supabase.from("rooms").insert(roomData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/rooms")
  redirect("/dashboard/rooms")
}

export async function createRoomAllocation(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const roomId = formData.get("room_id") as string
  const patientId = formData.get("patient_id") as string

  const allocationData = {
    room_id: roomId,
    patient_id: patientId,
    admission_date: formData.get("admission_date") as string,
    notes: formData.get("notes") as string,
    status: "active",
    created_by: user.id,
  }

  const { error } = await supabase.from("room_allocations").insert(allocationData)

  if (error) {
    return { error: error.message }
  }

  // Update room occupied beds
  const { data: room } = await supabase.from("rooms").select("occupied_beds, bed_capacity").eq("id", roomId).single()

  if (room) {
    const newOccupiedBeds = (room.occupied_beds || 0) + 1
    const newStatus = newOccupiedBeds >= room.bed_capacity ? "occupied" : "available"

    await supabase.from("rooms").update({ occupied_beds: newOccupiedBeds, status: newStatus }).eq("id", roomId)
  }

  revalidatePath("/dashboard/rooms")
  redirect("/dashboard/rooms/allocations")
}
