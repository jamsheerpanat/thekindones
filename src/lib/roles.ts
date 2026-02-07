const parseAdminEmails = (value?: string) =>
  (value || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  const adminEmails = parseAdminEmails(process.env.ADMIN_EMAILS);
  return adminEmails.includes(email.toLowerCase());
};
