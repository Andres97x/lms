import { UserRoles } from "@/drizzle/schema"

export function canCreateCourse({ role }: { role: UserRoles | undefined }) {
  return role === "admin"
}

export function canDeleteCourse({ role }: { role: UserRoles | undefined }) {
  return role === "admin"
}
