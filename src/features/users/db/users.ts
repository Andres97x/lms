import { db } from "@/drizzle/db"
import { Users, usersTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function insertUser(data: Users) {
  const [newUser] = await db
    .insert(usersTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [usersTable.clerkUserId],
      set: data,
    })

  if (newUser === null) throw new Error("Could not create user")

  return newUser
}

export async function updateUser(
  { clerkUserId }: { clerkUserId: string },
  data: Partial<Users>,
) {
  const [updatedUser] = await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.clerkUserId, clerkUserId))
    .returning()

  if (updateUser === null) throw new Error("Could not update user")

  return updatedUser
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
  const [deletedUser] = await db
    .update(usersTable)
    .set({
      deletedAt: new Date(),
      clerkUserId: "deleted",
      name: "Deleted User",
      email: "redacted@deleted.com",
      imageUrl: null,
    })
    .where(eq(usersTable.clerkUserId, clerkUserId))
    .returning()

  if (deletedUser === null) throw new Error("Could not delete user")

  return deleteUser
}
