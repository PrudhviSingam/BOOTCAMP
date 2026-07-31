/**
 * lib/isAdmin.ts
 * Utility to check if a user's email address is listed in the
 * NEXT_PUBLIC_ADMIN_EMAILS environment variable (comma-separated list).
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return false;

  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
  if (!adminEmailsEnv.trim()) return false;

  const adminList = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminList.includes(normalizedEmail);
}
