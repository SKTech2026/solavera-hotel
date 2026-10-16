export type PhysicalRoomStatus = "available" | "maintenance" | "out_of_service";
export type PhysicalRoom = { id: string; roomNumber: string; roomTypeId: string; status: PhysicalRoomStatus };
