"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createOTSchedule(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const scheduleData = {
    ot_id: formData.get("ot_id") as string,
    patient_id: formData.get("patient_id") as string,
    doctor_id: formData.get("doctor_id") as string,
    surgery_type: formData.get("surgery_type") as string,
    scheduled_date: formData.get("scheduled_date") as string,
    scheduled_time_start: formData.get("scheduled_time_start") as string,
    scheduled_time_end: formData.get("scheduled_time_end") as string,
    notes: formData.get("notes") as string,
    status: "scheduled",
    created_by: user.id,
  }

  const { error } = await supabase.from("ot_schedules").insert(scheduleData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/ot")
  redirect("/dashboard/ot")
}
