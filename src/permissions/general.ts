import { UserRoles } from "@/drizzle/schema"

export function canAccessAdminPages({ role }: { role: UserRoles | undefined }) {
  return role === "admin"
}
