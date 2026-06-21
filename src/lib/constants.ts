// ─── Event Types ─────────────────────────────────────────────────────────────

export const EVENT_TYPES = {
  WEDDING: "wedding",
  SANGJIT: "sangjit",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

// ─── Event Sessions ───────────────────────────────────────────────────────────

export const EVENT_SESSIONS = {
  HOLY_MATRIMONY:    "holy_matrimony",
  RECEPTION_DINNER:  "reception_dinner",
  SANGJIT_CEREMONY:  "sangjit_ceremony",
} as const;

export type EventSession = (typeof EVENT_SESSIONS)[keyof typeof EVENT_SESSIONS];

export const EVENT_SESSION_LABELS: Record<EventSession, string> = {
  holy_matrimony:   "Holy Matrimony",
  reception_dinner: "Reception Dinner",
  sangjit_ceremony: "Sangjit Ceremony",
};

// ─── RSVP Status ─────────────────────────────────────────────────────────────

export const RSVP_STATUS = {
  PENDING:       "pending",
  ATTENDING:     "attending",
  NOT_ATTENDING: "not_attending",
} as const;

export type RsvpStatus = (typeof RSVP_STATUS)[keyof typeof RSVP_STATUS];

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  pending:       "Pending",
  attending:     "Attending",
  not_attending: "Not Attending",
};

// ─── Seating ─────────────────────────────────────────────────────────────────

export const SEATING_TYPES = {
  TABLE:  "table",
  SEAT:   "seat",
} as const;

export type SeatingType = (typeof SEATING_TYPES)[keyof typeof SEATING_TYPES];

// ─── App Config ───────────────────────────────────────────────────────────────

export const APP_NAME = "Wedding Platform";

export const INVITE_CODE_LENGTH = 8;

export const MAX_GUESTS_PER_INVITATION = 10;

// ─── Admin Nav ────────────────────────────────────────────────────────────────

export const ADMIN_NAV_ITEMS = [
  { label: "Overview",     href: "/admin",            icon: "LayoutDashboard" },
  { label: "Guests",       href: "/admin/guests",     icon: "Users" },
  { label: "Invitations",  href: "/admin/invitations",icon: "Mail" },
  { label: "RSVP",         href: "/admin/rsvp",       icon: "CheckSquare" },
  { label: "Seating",      href: "/admin/seating",    icon: "Grid3X3" },
  { label: "Settings",     href: "/admin/settings",   icon: "Settings" },
] as const;
