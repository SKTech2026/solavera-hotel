export type ReservationStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show";
export type PaymentStatus = "pending" | "partially_paid" | "paid" | "refunded" | "failed";
export type PaymentMethod = "pay_at_hotel" | "bank_online";
export type ExtraPricingType = "per_stay" | "per_night" | "per_person";

export type Guest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
};

export type ReservationExtra = {
  id: string;
  name: string;
  pricingType: ExtraPricingType;
  unitPrice: number;
  quantity: number;
  total: number;
};

export type Reservation = {
  id: string;
  reservationNumber: string;
  guest: Guest;
  roomId: string;
  roomSlug: string;
  roomName: string;
  assignedRoomIds: string[];
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  roomRate: number;
  roomSubtotal: number;
  extras: ReservationExtra[];
  extrasSubtotal: number;
  grandTotal: number;
  specialRequests: string;
  arrivalTime: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  receiptTokenHash: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicReservation = Omit<Reservation, "id" | "assignedRoomIds" | "receiptTokenHash" | "guest"> & { guest: Pick<Guest, "firstName" | "lastName" | "email"> };

export type CreateReservationInput = {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  guest: Guest;
  arrivalTime: string;
  specialRequests: string;
  acceptedTerms: boolean;
  extraIds: string[];
  paymentMethod: PaymentMethod;
};
