import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
};

export const requireUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session;
};
