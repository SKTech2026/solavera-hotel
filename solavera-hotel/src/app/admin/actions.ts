"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { demoReservationRepository } from "@/lib/reservations/demo-repository";
import { updateReservationStatus } from "@/lib/reservations/service";

export async function updateReservationAction(formData: FormData) {
  const reservationNumber = String(formData.get("reservationNumber") ?? "");
  const action = String(formData.get("action") ?? "");
  if (!reservationNumber || !action) {
    redirect("/admin/reservations");
  }

  const reservation = await demoReservationRepository.findByNumber(reservationNumber);
  if (!reservation) {
    redirect("/admin/reservations");
  }

  switch (action) {
    case "confirm":
      await updateReservationStatus(reservationNumber, { reservationStatus: "confirmed" });
      break;
    case "cancel":
      await updateReservationStatus(reservationNumber, { reservationStatus: "cancelled" });
      break;
    case "check-in":
      await updateReservationStatus(reservationNumber, { reservationStatus: "checked_in" });
      break;
    case "check-out":
      await updateReservationStatus(reservationNumber, { reservationStatus: "checked_out" });
      break;
    default:
      break;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/reservations");
  revalidatePath(`/admin/reservations/${reservationNumber}`);
  redirect(`/admin/reservations/${reservationNumber}`);
}
