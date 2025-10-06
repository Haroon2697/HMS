"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createDoctor(formData: FormData) {
  const supabase = await createClient()

  // Generate doctor ID
  const doctorId = `DOC${Date.now().toString().slice(-8)}`

  // Create user account for the doctor
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "doctor",
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create doctor account" }
  }

  // Parse available days from form
  const availableDays: string[] = []
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  days.forEach((day) => {
    if (formData.get(`day_${day}`) === "on") {
      availableDays.push(day)
    }
  })

  // Create doctor record
  const doctorData = {
    doctor_id: doctorId,
    profile_id: authData.user.id,
    specialization: formData.get("specialization") as string,
    qualification: formData.get("qualification") as string,
    experience_years: Number.parseInt(formData.get("experience_years") as string),
    consultation_fee: Number.parseFloat(formData.get("consultation_fee") as string),
    available_days: availableDays,
    available_time_start: formData.get("available_time_start") as string,
    available_time_end: formData.get("available_time_end") as string,
  }

  const { error: insertError } = await supabase.from("doctors").insert(doctorData)

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath("/dashboard/doctors")
  redirect("/dashboard/doctors")
}
