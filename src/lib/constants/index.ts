// ─── Event Types ─────────────────────────────────────────────────────────────

export const EVENT_TYPES = {
  WEDDING: "wedding",
  SANGJIT: "sangjit",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

// ─── Event Sessions ───────────────────────────────────────────────────────────

export const EVENT_SESSIONS = {
  HOLY_MATRIMONY: "holy_matrimony",
  RECEPTION_DINNER: "reception_dinner",
  SANGJIT_CEREMONY: "sangjit_ceremony",
} as const;

export type EventSession = (typeof EVENT_SESSIONS)[keyof typeof EVENT_SESSIONS];

export const EVENT_SESSION_LABELS: Record<EventSession, string> = {
  holy_matrimony: "Holy Matrimony",
  reception_dinner: "Reception Dinner",
  sangjit_ceremony: "Sangjit Ceremony",
};

// ─── RSVP Status ─────────────────────────────────────────────────────────────

export const RSVP_STATUS = {
  PENDING: "pending",
  ATTENDING: "attending",
  NOT_ATTENDING: "not_attending",
} as const;

export type RsvpStatus = (typeof RSVP_STATUS)[keyof typeof RSVP_STATUS];

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  pending: "Pending",
  attending: "Attending",
  not_attending: "Not Attending",
};

// ─── Seating ─────────────────────────────────────────────────────────────────

export const SEATING_TYPES = {
  TABLE: "table",
  SEAT: "seat",
} as const;

export type SeatingType = (typeof SEATING_TYPES)[keyof typeof SEATING_TYPES];

// ─── App Config ───────────────────────────────────────────────────────────────

export const APP_NAME = "Wedding Platform";

export const INVITE_CODE_LENGTH = 8;

export const MAX_GUESTS_PER_INVITATION = 10;

// ─── Admin Nav ────────────────────────────────────────────────────────────────

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Guests", href: "/admin/guests", icon: "Users" },
  { label: "Invitations", href: "/admin/invitations", icon: "Mail" },
  { label: "RSVP", href: "/admin/rsvp", icon: "CheckSquare" },
  { label: "Seating", href: "/admin/seating", icon: "Grid3X3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const WEDDING_INVITATION_ASSETS = {
  heroOpeningTitle: "/images/wedding/hero-opening-title.webp",
  heroBackground: "/images/wedding/hero-bg-v2.png",
  heroCouplePhoto: "/images/wedding/hero-couple-v2.png",
  heroGrassForeground: "/images/wedding/hero-grass-foreground.webp",
  meadowFlowerDivider: "/images/wedding/meadow-flower-divider.webp",
  countdownCardDecor: "/images/wedding/countdown-card-decor.png",
  tallGrassDivider: "/images/wedding/tall-grass-divider.webp",
  envelopeBackPanel: "/images/wedding/envelope-back-panel.png",
  envelopeMeadowFlap: "/images/wedding/envelope-meadow-flap.png",
  envelopeFrontPanel: "/images/wedding/envelope-front-panel.png",
  floralBouquetLeft: "/images/wedding/floral-bouquet-left.png",
  envelopeGreenHillTransition: "/images/wedding/envelope-green-hill-transition.webp",
  waxSealGold: "/images/wedding/wax-seal-gold.png",
  envelopePaperCard: "/images/wedding/envelope-paper-card.png",
  groomPhotoWilliam: "/images/wedding/groom-photo-william.webp",
  stampFrame: "/images/wedding/stamp-frame.webp",
  bridePhotoAziel: "/images/wedding/bride-photo-aziel.webp",
  floralBouquetRight: "/images/wedding/floral-bouquet-right.png",
  saveDateGoldBadge: "/images/wedding/save-date-gold-badge.png",
  tornDatePaper: "/images/wedding/torn-date-paper.png",
  holyMatrimonyIllustration: "/images/wedding/holy-matrimony-illustration.png",
  receptionDinnerIllustration: "/images/wedding/reception-dinner-illustration.png",
  daisyGardenDivider: "/images/wedding/daisy-garden-divider.png",
  galleryPlaceholder: "/images/gallery-placeholder.png",
  textareaResizeGrab: "/images/wedding/textarea-resize-grab.svg",
} as const;

export * from "./sangjitInvitationAssets";
export * from "./sangjitScreenReferences";
