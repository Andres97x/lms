import { UserRoles } from "@/drizzle/schema"

// export {}

declare global {
  interface CustomJwtSessionClaims {
    dbId?: string
    role?: UserRoles
  }

  interface UserPublicMetadata {
    dbId?: string
    role?: UserRoles
  }
}
