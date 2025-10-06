"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBill(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Generate bill number
  const billNumber = `INV${Date.now().toString().slice(-8)}`

  // Parse items from form data
  const itemsJson = formData.get("items") as string
  const items = JSON.parse(itemsJson)

  // Calculate total
  const totalAmount = items.reduce((sum: number, item: any) => sum + item.amount, 0)
  const paidAmount = Number.parseFloat(formData.get("paid_amount") as string) || 0

  const billData = {
    bill_number: billNumber,
    patient_id: formData.get("patient_id") as string,
    bill_date: formData.get("bill_date") as string,
    total_amount: totalAmount,
    paid_amount: paidAmount,
    payment_method: formData.get("payment_method") as string,
    payment_status: paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partially-paid" : "pending",
    consultation_charges: 0,
    room_charges: 0,
    medicine_charges: 0,
    xray_charges: 0,
    surgery_charges: 0,
    other_charges: totalAmount,
    created_by: user.id,
  }

  const { error } = await supabase.from("bills").insert(billData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/billing")
  redirect("/dashboard/billing")
}
