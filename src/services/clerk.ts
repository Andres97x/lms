import { db } from "@/drizzle/db"
import { UserRoles, usersTable } from "@/drizzle/schema"
import { getUserIdTag } from "@/features/users/db/cache/users"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/cache"

const client = await clerkClient()

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user:
      sessionClaims?.dbId && allData
        ? await getUser(sessionClaims.dbId)
        : undefined,
    redirectToSignIn,
  }
}

async function getUser(userId: string) {
  "use cache"
  cacheTag(getUserIdTag(userId))

  return db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  })
}

export function syncClerkUserMetadata(user: {
  clerkUserId: string
  dbId: string
  role: UserRoles
}) {
  try {
    return client.users.updateUserMetadata(user.clerkUserId, {
      publicMetadata: {
        dbId: user.dbId,
        role: user.role,
      },
    })
  } catch (err: any) {
    if (err.status === 404) {
      console.warn(
        `Tried to sync metadata for deleted Clerk user ${user.clerkUserId}. Skipping.`,
      )
    } else {
      throw err // Re-throw if it's a real problem (like network being down)
    }
  }
}
