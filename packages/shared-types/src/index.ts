// Roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  REVENUE_MANAGER = 'revenue_manager',
  RECEPTIONIST = 'receptionist',
  GUEST_RELATIONS = 'guest_relations',
  HOUSEKEEPING_SUPERVISOR = 'housekeeping_supervisor',
  ROOM_ATTENDANT = 'room_attendant',
  MAINTENANCE = 'maintenance',
  FB_MANAGER = 'fb_manager',
  ACCOUNTANT = 'accountant',
  SECURITY = 'security',
}

// Booking status
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Room status
export enum RoomStatus {
  CLEAN = 'clean',
  DIRTY = 'dirty',
  INSPECTED = 'inspected',
  OUT_OF_ORDER = 'out_of_order',
  OCCUPIED = 'occupied',
}

// Payment
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}
