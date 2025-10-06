"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPatient(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Generate patient ID
  const patientId = `PAT${Date.now().toString().slice(-8)}`

  const patientData = {
    patient_id: patientId,
    full_name: formData.get("full_name") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    gender: formData.get("gender") as string,
    blood_group: formData.get("blood_group") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    emergency_contact_name: formData.get("emergency_contact_name") as string,
    emergency_contact_phone: formData.get("emergency_contact_phone") as string,
    medical_history: formData.get("medical_history") as string,
    allergies: formData.get("allergies") as string,
    created_by: user.id,
  }

  const { error } = await supabase.from("patients").insert(patientData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/patients")
  redirect("/dashboard/patients")
}
