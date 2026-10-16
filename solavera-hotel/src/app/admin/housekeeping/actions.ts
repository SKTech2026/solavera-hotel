"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setHousekeepingStatus, type HousekeepingStatus } from "@/lib/housekeeping";

export async function updateHousekeepingAction(formData: FormData) {
  const roomId = String(formData.get("roomId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (roomId && status) {
    await setHousekeepingStatus(roomId, status as HousekeepingStatus);
  }

  revalidatePath("/admin/housekeeping");
  redirect("/admin/housekeeping");
}
