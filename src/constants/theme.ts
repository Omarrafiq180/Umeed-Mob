export const colors = {
  primary: "#16A34A",      // green
  primaryDark: "#15803D",
  primarySoft: "#DCFCE7",
  secondary: "#FACC15",    // yellow
  secondarySoft: "#FEF9C3",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  ink: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  red: "#DC2626",
  teal: "#0D9488",
  amber: "#F59E0B",
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 24 };

export const shadow = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const statusColor: Record<string, string> = {
  Pending: colors.amber,
  "In Progress": colors.teal,
  Resolved: colors.primary,
  Rejected: colors.red,
  Submitted: colors.amber,
  "Under Review": colors.teal,
  Approved: colors.primary,
};

export const CATEGORIES = ["Facilities", "Cleanliness", "Hostel", "Safety", "Academic", "Other"];
export const PRIORITIES = ["Low", "Medium", "High"];
export const WELFARE_TYPES = ["Fee Aid", "Medical", "Counseling", "Emergency", "Other"];
