"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createXRay(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Generate xray ID
  const xrayId = `XR${Date.now().toString().slice(-8)}`

  const xrayData = {
    xray_id: xrayId,
    patient_id: formData.get("patient_id") as string,
    doctor_id: formData.get("doctor_id") as string,
    xray_type: formData.get("xray_type") as string,
    body_part: formData.get("body_part") as string,
    requested_date: formData.get("requested_date") as string,
    status: "pending",
    created_by: user.id,
  }

  const { error } = await supabase.from("xrays").insert(xrayData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/xrays")
  redirect("/dashboard/xrays")
}
