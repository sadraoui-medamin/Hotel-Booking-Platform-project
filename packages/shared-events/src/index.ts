// Redis event channel names — import these everywhere, never hardcode strings

export const EVENTS = {
  // Auth
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',

  // Bookings
  BOOKING_CREATED: 'booking.created',
  BOOKING_CONFIRMED: 'booking.confirmed',
  BOOKING_CANCELLED: 'booking.cancelled',
  BOOKING_CHECKED_IN: 'booking.checked_in',
  BOOKING_COMPLETED: 'booking.completed',

  // Payments
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  REFUND_PROCESSED: 'refund.processed',

  // Housekeeping
  ROOM_STATUS_CHANGED: 'room.status_changed',
  TASK_ASSIGNED: 'task.assigned',
  TASK_COMPLETED: 'task.completed',

  // Maintenance
  TICKET_CREATED: 'ticket.created',
  TICKET_RESOLVED: 'ticket.resolved',

  // Reviews
  REVIEW_SUBMITTED: 'review.submitted',

  // Notifications
  SEND_EMAIL: 'notification.send_email',
  SEND_PUSH: 'notification.send_push',
  SEND_SMS: 'notification.send_sms',
} as const;

// BullMQ queue names
export const QUEUES = {
  EMAIL: 'email-queue',
  PUSH: 'push-queue',
  REPORT: 'report-queue',
  INVOICE: 'invoice-queue',
  FX_RATE_SYNC: 'fx-rate-sync',
  ANALYTICS_AGGREGATE: 'analytics-aggregate',
  BOOKING_EXPIRE: 'booking-expire',
  SEARCH_INDEX: 'search-index-queue',
} as const;
