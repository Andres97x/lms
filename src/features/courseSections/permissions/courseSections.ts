import { userRoles, UserRoles } from "@/drizzle/schema"

export function canCreateSection({ role }: { role: UserRoles | undefined }) {
  return role === "admin"
}

export function canUpdateSection({ role }: { role: UserRoles | undefined }) {
  return role === "admin"
}

export function canDeleteSection({ role }: { role: UserRoles | undefined }) {
  return role === "admin"
}
