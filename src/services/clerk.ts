import { UserRoles } from "@/drizzle/schema"
import { auth, clerkClient } from "@clerk/nextjs/server"

const client = await clerkClient()

export async function getCurrentUser() {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    redirectToSignIn,
  }
}

export function syncClerkUserMetadata(user: {
  clerkUserId: string
  dbId?: string
  role?: UserRoles
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.dbId,
      role: user.role,
    },
  })
}
