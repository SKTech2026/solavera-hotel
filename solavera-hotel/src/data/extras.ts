import type { ExtraPricingType } from "@/types/reservation";

export type Extra = { id: string; name: string; description: string; price: number; pricingType: ExtraPricingType };

export const extras: Extra[] = [
  { id: "airport-transfer", name: "Airport Transfer", description: "A seamless private arrival or departure transfer.", price: 1500, pricingType: "per_stay" },
  { id: "breakfast", name: "Breakfast Package", description: "A leisurely breakfast for each guest, each morning.", price: 900, pricingType: "per_person" },
  { id: "romantic-setup", name: "Romantic Room Setup", description: "A thoughtful welcome arranged before your arrival.", price: 2200, pricingType: "per_stay" },
  { id: "extra-bed", name: "Extra Bed", description: "An additional bed for a more comfortable stay where space allows.", price: 1800, pricingType: "per_night" },
];
