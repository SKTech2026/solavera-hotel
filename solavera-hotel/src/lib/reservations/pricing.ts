import type { Extra } from "@/data/extras";
import type { ReservationExtra } from "@/types/reservation";

export function priceExtra(extra: Extra, nights: number, guests: number): ReservationExtra {
  const quantity = extra.pricingType === "per_stay" ? 1 : extra.pricingType === "per_night" ? nights : nights * guests;
  return { id: extra.id, name: extra.name, pricingType: extra.pricingType, unitPrice: extra.price, quantity, total: extra.price * quantity };
}

export function priceExtras(selected: Extra[], nights: number, guests: number): { lines: ReservationExtra[]; subtotal: number } {
  const lines = selected.map((extra) => priceExtra(extra, nights, guests));
  return { lines, subtotal: lines.reduce((sum, line) => sum + line.total, 0) };
}
